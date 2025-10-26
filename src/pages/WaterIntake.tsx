import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WaterIntake = () => {
  const { toast } = useToast();
  const [weight, setWeight] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [weeklyHistory, setWeeklyHistory] = useState<Array<{ day: string; percentage: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchTodayIntake();
    fetchWeeklyHistory();
  }, []);

  useEffect(() => {
    if (weight > 0) {
      // Calcula meta baseada no peso (35ml por kg) - resultado em litros
      const calculatedGoal = (weight * 0.035).toFixed(2);
      setDailyGoal(parseFloat(calculatedGoal));
    }
  }, [weight]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('perfis')
        .select('peso_atual')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (profile?.peso_atual) {
        setWeight(profile.peso_atual);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchWeeklyHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('consumo_agua')
        .select('quantidade_ml, registrado_em')
        .eq('usuario_id', user.id)
        .gte('registrado_em', weekAgo.toISOString());

      if (error) throw error;

      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const history = Array(7).fill(0).map((_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        return {
          day: days[date.getDay()],
          date: date.toISOString().split('T')[0],
          total: 0
        };
      });

      data?.forEach(record => {
        const recordDate = new Date(record.registrado_em).toISOString().split('T')[0];
        const dayRecord = history.find(h => h.date === recordDate);
        if (dayRecord) {
          dayRecord.total += record.quantidade_ml;
        }
      });

      const dailyGoalMl = weight * 35;
      setWeeklyHistory(history.map(h => ({
        day: h.day,
        percentage: dailyGoalMl > 0 ? Math.round((h.total / dailyGoalMl) * 100) : 0
      })));
    } catch (error) {
      console.error('Erro ao buscar histórico semanal:', error);
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

      // Atualizar histórico semanal
      fetchWeeklyHistory();
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
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-primary" size={24} />
            Histórico Semanal
          </h2>
          
          <div className="grid grid-cols-7 gap-2">
            {weeklyHistory.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{item.day}</p>
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