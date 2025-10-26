import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Plus, Target, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

const WaterIntake = () => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [weight, setWeight] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [history, setHistory] = useState<Array<{ label: string; percentage: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  useEffect(() => {
    if (profile.peso && weight === 0) {
      setWeight(profile.peso);
    }
  }, [profile.peso]);

  useEffect(() => {
    fetchTodayIntake();
  }, []);

  useEffect(() => {
    if (weight > 0) {
      fetchHistory(parseInt(period));
    }
  }, [weight, period]);

  useEffect(() => {
    const channel = supabase
      .channel('water-intake-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consumo_agua'
        },
        () => {
          fetchTodayIntake();
          if (weight > 0) {
            fetchHistory(parseInt(period));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weight, period]);

  useEffect(() => {
    if (weight > 0) {
      // Calcula meta baseada no peso (35ml por kg) - resultado em litros
      const calculatedGoal = (weight * 0.035).toFixed(2);
      setDailyGoal(parseFloat(calculatedGoal));
    }
  }, [weight]);

  const fetchTodayIntake = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('consumo_agua')
        .select('quantidade_ml')
        .eq('usuario_id', user.id)
        .gte('registrado_em', today.toISOString());

      if (error) throw error;

      const totalMl = data?.reduce((sum, record) => sum + record.quantidade_ml, 0) || 0;
      setCurrentIntake(totalMl / 1000); // Converter para litros
    } catch (error) {
      console.error('Erro ao buscar consumo de hoje:', error);
    }
  };

  const fetchHistory = async (days: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('consumo_agua')
        .select('quantidade_ml, registrado_em')
        .eq('usuario_id', user.id)
        .gte('registrado_em', startDate.toISOString());

      if (error) throw error;

      const dailyGoalMl = weight * 35;
      
      // Para períodos de 7 dias, mostrar dias da semana
      if (days === 7) {
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const historyData = Array(7).fill(0).map((_, index) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - index));
          return {
            label: dayNames[date.getDay()],
            date: date.toISOString().split('T')[0],
            total: 0
          };
        });

        data?.forEach(record => {
          const recordDate = new Date(record.registrado_em).toISOString().split('T')[0];
          const dayRecord = historyData.find(h => h.date === recordDate);
          if (dayRecord) {
            dayRecord.total += record.quantidade_ml;
          }
        });

        setHistory(historyData.map(h => ({
          label: h.label,
          percentage: dailyGoalMl > 0 ? Math.round((h.total / dailyGoalMl) * 100) : 0
        })));
      } 
      // Para períodos de 30 dias, agrupar em semanas
      else if (days === 30) {
        const weeks = 4;
        const historyData = Array(weeks).fill(0).map((_, index) => {
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - (weeks - index) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          return {
            label: `Sem ${index + 1}`,
            startDate: weekStart.toISOString().split('T')[0],
            endDate: weekEnd.toISOString().split('T')[0],
            total: 0,
            days: 7
          };
        });

        data?.forEach(record => {
          const recordDate = new Date(record.registrado_em).toISOString().split('T')[0];
          const weekRecord = historyData.find(h => recordDate >= h.startDate && recordDate <= h.endDate);
          if (weekRecord) {
            weekRecord.total += record.quantidade_ml;
          }
        });

        setHistory(historyData.map(h => ({
          label: h.label,
          percentage: dailyGoalMl > 0 ? Math.round((h.total / (dailyGoalMl * h.days)) * 100) : 0
        })));
      }
      // Para 90 dias (3 meses), agrupar por mês
      else if (days === 90) {
        const months = 3;
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const historyData = Array(months).fill(0).map((_, index) => {
          const date = new Date(today);
          date.setMonth(date.getMonth() - (months - index - 1));
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          return {
            label: monthNames[date.getMonth()],
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0],
            total: 0,
            days: lastDay.getDate()
          };
        });

        data?.forEach(record => {
          const recordDate = new Date(record.registrado_em).toISOString().split('T')[0];
          const monthRecord = historyData.find(h => recordDate >= h.startDate && recordDate <= h.endDate);
          if (monthRecord) {
            monthRecord.total += record.quantidade_ml;
          }
        });

        setHistory(historyData.map(h => ({
          label: h.label,
          percentage: dailyGoalMl > 0 ? Math.round((h.total / (dailyGoalMl * h.days)) * 100) : 0
        })));
      }
      // Para 180 dias (6 meses) e 365 dias (1 ano), agrupar por mês
      else {
        const months = days === 180 ? 6 : 12;
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const historyData = Array(months).fill(0).map((_, index) => {
          const date = new Date(today);
          date.setMonth(date.getMonth() - (months - index - 1));
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          return {
            label: monthNames[date.getMonth()],
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0],
            total: 0,
            days: lastDay.getDate()
          };
        });

        data?.forEach(record => {
          const recordDate = new Date(record.registrado_em).toISOString().split('T')[0];
          const monthRecord = historyData.find(h => recordDate >= h.startDate && recordDate <= h.endDate);
          if (monthRecord) {
            monthRecord.total += record.quantidade_ml;
          }
        });

        setHistory(historyData.map(h => ({
          label: h.label,
          percentage: dailyGoalMl > 0 ? Math.round((h.total / (dailyGoalMl * h.days)) * 100) : 0
        })));
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const progress = (currentIntake / dailyGoal) * 100;

  const addWater = async (amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para registrar consumo de água",
          variant: "destructive"
        });
        return;
      }

      // Buscar o nome do usuário do perfil
      const { data: profile } = await supabase
        .from('perfis')
        .select('nome_completo')
        .eq('id', user.id)
        .single();

      const quantidadeMl = Math.round(amount * 1000); // Converter litros para ml

      const { error } = await supabase
        .from('consumo_agua')
        .insert({
          usuario_id: user.id,
          quantidade_ml: quantidadeMl,
          nome_usuario: profile?.nome_completo || null,
          registrado_em: new Date().toISOString()
        });

      if (error) throw error;

      const newIntake = currentIntake + amount;
      setCurrentIntake(newIntake);
      
      if (newIntake >= dailyGoal && currentIntake < dailyGoal) {
        toast({
          title: "🎉 Meta atingida!",
          description: "Parabéns! Você alcançou sua meta diária de hidratação!",
        });
      } else {
        toast({
          title: "Água registrada",
          description: `+${amount}L (${quantidadeMl}ml) adicionados`,
        });
      }
    } catch (error) {
      console.error('Erro ao registrar consumo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o consumo de água",
        variant: "destructive"
      });
    }
  };

  const handleCustomAdd = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      addWater(amount / 1000); // Converter ml para L
      setCustomAmount('');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Consumo de Água
          </h1>
          <p className="text-muted-foreground">
            Mantenha-se hidratado e acompanhe seu progresso diário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuração e Meta */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-primary" size={24} />
              Meta Diária
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight || ''}
                  onChange={(e) => setWeight(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div className="bg-water-light rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  O consumo ideal para seu peso é
                </p>
                <p className="text-2xl font-bold text-water">
                  {dailyGoal} Litros por dia
                </p>
              </div>
            </div>
          </Card>

          {/* Progresso Atual */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Droplets className="mr-2 text-water" size={24} />
              Progresso de Hoje
            </h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-water">
                  {currentIntake.toFixed(1)}L
                </p>
                <p className="text-muted-foreground">
                  de {dailyGoal}L
                </p>
              </div>
              
              <Progress value={progress} className="h-3" />
              
              <div className={`text-center p-3 rounded-lg ${
                progress >= 100 ? 'bg-success/20 text-success' : 'bg-water-light text-water'
              }`}>
                {progress >= 100 
                  ? '✅ Meta atingida!' 
                  : `${(100 - progress).toFixed(0)}% restante`
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Adicionar Água */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Plus className="mr-2 text-primary" size={24} />
            Registrar Consumo
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button
              onClick={() => addWater(0.2)}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="text-2xl mb-1">🥤</span>
              <span>200ml</span>
            </Button>
            
            <Button
              onClick={() => addWater(0.3)}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="text-2xl mb-1">☕</span>
              <span>300ml</span>
            </Button>
            
            <Button
              onClick={() => addWater(0.5)}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="text-2xl mb-1">🧊</span>
              <span>500ml</span>
            </Button>
            
            <Button
              onClick={() => addWater(1.0)}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="text-2xl mb-1">💧</span>
              <span>1L</span>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade personalizada (ml)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <Button onClick={handleCustomAdd} className="bg-gradient-water">
              Adicionar
            </Button>
          </div>
        </Card>

        {/* Histórico */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="mr-2 text-primary" size={24} />
              Histórico
            </h2>
            
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground" size={18} />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Última Semana</SelectItem>
                  <SelectItem value="30">Último Mês</SelectItem>
                  <SelectItem value="90">Últimos 3 Meses</SelectItem>
                  <SelectItem value="180">Últimos 6 Meses</SelectItem>
                  <SelectItem value="365">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className={`grid gap-2 ${
            period === '7' ? 'grid-cols-7' : 
            period === '30' ? 'grid-cols-4' : 
            period === '90' ? 'grid-cols-3' : 
            period === '180' ? 'grid-cols-6' : 
            'grid-cols-12'
          }`}>
            {history.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                <div className={`h-24 rounded-lg flex items-end justify-center p-2 ${
                  item.percentage >= 100 ? 'bg-water' : 'bg-muted'
                }`}>
                  <span className={`text-xs font-medium ${
                    item.percentage >= 100 ? 'text-white' : 'text-muted-foreground'
                  }`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WaterIntake;