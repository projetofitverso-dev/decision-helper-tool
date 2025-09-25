import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ruler, Weight, Activity, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Measurements = () => {
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState({
    weight: 70,
    height: 170,
    age: 25,
    waist: 80,
    abdomen: 85,
    hip: 95
  });

  const calculateBMI = () => {
    const heightInMeters = measurements.height / 100;
    return (measurements.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateWaistHipRatio = () => {
    if (measurements.waist && measurements.hip) {
      return (measurements.waist / measurements.hip).toFixed(2);
    }
    return '0.00';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-water', recommendation: 'Você precisa ganhar peso' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-success', recommendation: 'Você está no peso ideal!' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-warning', recommendation: 'Você precisa perder alguns quilos' };
    return { category: 'Obesidade', color: 'text-destructive', recommendation: 'É importante buscar orientação médica' };
  };

  const getIdealWeight = () => {
    const heightInMeters = measurements.height / 100;
    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    return { min: minIdeal, max: maxIdeal };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);
  const idealWeight = getIdealWeight();
  const weightDifference = measurements.weight - parseFloat(idealWeight.max);

  const handleSave = () => {
    toast({
      title: "Medidas salvas!",
      description: "Suas medidas foram registradas com sucesso",
    });
  };

  const handleChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Medidas Antropométricas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução física e monitore seus resultados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Básicos */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Weight className="mr-2 text-primary" size={24} />
              Dados Básicos
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={measurements.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={measurements.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={measurements.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Resultado IMC */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-primary" size={24} />
              Análise do IMC
            </h2>
            
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-health rounded-lg">
                <p className="text-5xl font-bold mb-2 text-primary">{bmi}</p>
                <p className={`text-lg font-semibold ${bmiInfo.color}`}>
                  {bmiInfo.category}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg flex items-start space-x-2 ${
                bmi >= 18.5 && bmi < 25 ? 'bg-success/10' : 'bg-warning/10'
              }`}>
                <AlertCircle className={`mt-0.5 ${bmiInfo.color}`} size={20} />
                <div>
                  <p className={`font-medium ${bmiInfo.color}`}>
                    {bmiInfo.recommendation}
                  </p>
                  {weightDifference > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Meta: Perder {weightDifference.toFixed(1)} kg para o peso ideal
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Peso ideal</p>
                <p className="font-semibold">
                  Entre {idealWeight.min} kg e {idealWeight.max} kg
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Medidas Corporais */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Ruler className="mr-2 text-primary" size={24} />
            Medidas Corporais (cm)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="waist">Cintura</Label>
              <Input
                id="waist"
                type="number"
                value={measurements.waist}
                onChange={(e) => handleChange('waist', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="abdomen">Abdômen</Label>
              <Input
                id="abdomen"
                type="number"
                value={measurements.abdomen}
                onChange={(e) => handleChange('abdomen', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="hip">Quadril</Label>
              <Input
                id="hip"
                type="number"
                value={measurements.hip}
                onChange={(e) => handleChange('hip', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-gradient-health p-4 rounded-lg mt-2">
                <Label className="text-primary font-semibold">Relação Cintura/Quadril (RCQ)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-2xl font-bold text-primary">{calculateWaistHipRatio()}</p>
                  <p className="text-sm text-muted-foreground">
                    {parseFloat(calculateWaistHipRatio()) <= 0.85 ? '✅ Ideal' : 
                     parseFloat(calculateWaistHipRatio()) <= 0.90 ? '⚠️ Atenção' : '⚠️ Risco aumentado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full mt-6 bg-gradient-primary"
            size="lg"
          >
            Salvar Medidas
          </Button>
        </Card>

        {/* Gráfico de Evolução */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-primary" size={24} />
            Evolução do Peso (últimos 7 dias)
          </h2>
          
          <div className="h-48 flex items-end justify-between gap-2">
            {[68, 69, 69.5, 70, 69.8, 70.2, 70].map((weight, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(weight / 75) * 100}%` }}
                />
                <p className="text-xs mt-2 text-muted-foreground">
                  {weight}kg
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Measurements;