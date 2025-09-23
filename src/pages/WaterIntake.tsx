import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WaterIntake = () => {
  const { toast } = useToast();
  const [weight, setWeight] = useState(63);
  const [dailyGoal, setDailyGoal] = useState(2.21);
  const [currentIntake, setCurrentIntake] = useState(0.9);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    // Calcula meta baseada no peso (35ml por kg)
    const calculatedGoal = (weight * 0.035).toFixed(2);
    setDailyGoal(parseFloat(calculatedGoal));
  }, [weight]);

  const progress = (currentIntake / dailyGoal) * 100;

  const addWater = (amount: number) => {
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
        description: `+${amount}L adicionados`,
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
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
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
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{day}</p>
                <div className={`h-24 rounded-lg flex items-end justify-center p-2 ${
                  index === 3 ? 'bg-water' : 'bg-muted'
                }`}>
                  <span className="text-xs text-white font-medium">
                    {index === 3 ? '90%' : `${60 + Math.random() * 40}%`.slice(0, 3)}
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