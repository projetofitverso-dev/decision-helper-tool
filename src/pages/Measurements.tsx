import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ruler, Weight, Activity, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Measurements = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState({
    weight: 0,
    height: 0,
    age: 0,
    waist: 0,
    abdomen: 0,
    hip: 0
  });

  useEffect(() => {
    if (user) {
      loadMeasurements();
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('genero')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setGender(data.genero || '');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medidas')
        .select('*')
        .eq('usuario_id', user?.id)
        .order('medido_em', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setMeasurements({
          weight: data.peso || 0,
          height: data.altura || 0,
          age: data.idade || 0,
          waist: data.cintura || 0,
          abdomen: data.abdomen || 0,
          hip: data.quadril || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar medidas:', error);
      toast({
        title: "Erro ao carregar medidas",
        description: "Não foi possível carregar suas medidas anteriores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
    if (bmi < 18.5) return { category: 'Baixo peso', color: 'text-blue-500', recommendation: 'Procure orientação nutricional para ganho de peso saudável' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-500', recommendation: 'Mantenha seus hábitos saudáveis!' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-500', recommendation: 'Considere ajustes na dieta e atividade física' };
    if (bmi < 35) return { category: 'Obesidade grau I', color: 'text-orange-500', recommendation: 'Busque orientação profissional para perda de peso' };
    if (bmi < 40) return { category: 'Obesidade grau II', color: 'text-red-500', recommendation: 'É importante buscar acompanhamento médico' };
    return { category: 'Obesidade grau III (grave)', color: 'text-red-700', recommendation: 'Busque acompanhamento médico urgente' };
  };

  const getWaistHipRatioCategory = (ratio: number) => {
    if (!gender) return { risk: 'Indefinido', color: 'text-muted-foreground' };
    
    if (gender.toLowerCase() === 'feminino' || gender.toLowerCase() === 'f') {
      if (ratio <= 0.80) return { risk: 'Baixo', color: 'text-green-500' };
      if (ratio <= 0.85) return { risk: 'Moderado', color: 'text-yellow-500' };
      return { risk: 'Alto', color: 'text-red-500' };
    } else {
      if (ratio <= 0.95) return { risk: 'Baixo', color: 'text-green-500' };
      if (ratio <= 1.00) return { risk: 'Moderado', color: 'text-yellow-500' };
      return { risk: 'Alto', color: 'text-red-500' };
    }
  };

  const getIdealWeight = () => {
    const heightInMeters = measurements.height / 100;
    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    return { min: minIdeal, max: maxIdeal };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);
  const waistHipRatio = parseFloat(calculateWaistHipRatio());
  const waistHipInfo = getWaistHipRatioCategory(waistHipRatio);
  const idealWeight = getIdealWeight();
  const weightDifference = measurements.weight - parseFloat(idealWeight.max);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar medidas",
        variant: "destructive"
      });
      return;
    }

    if (!measurements.weight || !measurements.height) {
      toast({
        title: "Campos obrigatórios",
        description: "Peso e altura são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('medidas')
        .insert({
          usuario_id: user.id,
          peso: measurements.weight,
          altura: measurements.height,
          idade: measurements.age || null,
          cintura: measurements.waist || null,
          abdomen: measurements.abdomen || null,
          quadril: measurements.hip || null,
          medido_em: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Medidas salvas!",
        description: `IMC: ${bmi} (${bmiInfo.category}) | RCQ: ${waistHipRatio} (Risco ${waistHipInfo.risk})`,
      });

      loadMeasurements();
    } catch (error) {
      console.error('Erro ao salvar medidas:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas medidas",
        variant: "destructive"
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando medidas...</p>
        </div>
      </DashboardLayout>
    );
  }

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
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-primary">{calculateWaistHipRatio()}</p>
                    <p className={`text-sm font-semibold ${waistHipInfo.color}`}>
                      Risco {waistHipInfo.risk}
                    </p>
                  </div>
                  {!gender && (
                    <p className="text-xs text-muted-foreground">
                      * Configure seu gênero no perfil para classificação precisa
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {gender.toLowerCase() === 'feminino' || gender.toLowerCase() === 'f' 
                      ? 'Mulheres: ≤0.80 (baixo) | 0.81-0.85 (moderado) | >0.85 (alto)'
                      : 'Homens: ≤0.95 (baixo) | 0.96-1.00 (moderado) | >1.00 (alto)'}
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