import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Beef, Wheat, Fish, Milk, Egg, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AlimentoReferencia {
  id: string;
  tipo_alimento: string;
  alimento: string;
  proteinas: number | null;
  carboidratos: number | null;
  lipideos: number | null;
  calorias: number | null;
  quantidade: number | null;
}

const FoodSubstitution = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [originalFood, setOriginalFood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [substituteFood, setSubstituteFood] = useState('');
  const [result, setResult] = useState<any>(null);
  const [alimentos, setAlimentos] = useState<AlimentoReferencia[]>([]);
  const [loading, setLoading] = useState(false);

  const foodCategories = [
    { icon: Wheat, label: 'Carboidratos', value: 'Carboidratos', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200', emoji: '🌾' },
    { icon: Beef, label: 'Proteínas', value: 'Proteínas', color: 'bg-red-100 text-red-700 hover:bg-red-200', emoji: '🥩' },
    { icon: Fish, label: 'Gorduras', value: 'Gorduras', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', emoji: '🐟' },
    { icon: Apple, label: 'Frutas', value: 'Frutas', color: 'bg-green-100 text-green-700 hover:bg-green-200', emoji: '🍎' },
    { icon: Egg, label: 'Leguminosas', value: 'Leguminosas', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', emoji: '🫘' },
    { icon: Milk, label: 'Laticínios', value: 'Laticínios', color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200', emoji: '🥛' }
  ];

  // Buscar alimentos do banco de dados
  useEffect(() => {
    const fetchAlimentos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('alimentos_referencia')
        .select('*')
        .order('alimento');

      if (error) {
        console.error('Erro ao buscar alimentos:', error);
        toast({
          title: "Erro ao carregar alimentos",
          description: "Não foi possível carregar a lista de alimentos",
          variant: "destructive"
        });
      } else {
        setAlimentos(data || []);
      }
      setLoading(false);
    };

    fetchAlimentos();
  }, [toast]);

  // Filtrar alimentos pela categoria selecionada
  const alimentosFiltrados = alimentos.filter(
    a => a.tipo_alimento === selectedCategory
  );

  const handleCalculate = () => {
    if (!originalFood || !quantity || !substituteFood) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para calcular",
        variant: "destructive"
      });
      return;
    }

    // Buscar dados do alimento original
    const alimentoOriginal = alimentos.find(a => a.alimento === originalFood);
    const alimentoSubstituto = alimentos.find(a => a.alimento === substituteFood);

    if (!alimentoOriginal || !alimentoSubstituto) {
      toast({
        title: "Erro no cálculo",
        description: "Alimento não encontrado no banco de dados",
        variant: "destructive"
      });
      return;
    }

    // Validar dados necessários
    if (!alimentoOriginal.calorias || !alimentoOriginal.quantidade || 
        !alimentoSubstituto.calorias || !alimentoSubstituto.quantidade) {
      toast({
        title: "Dados incompletos",
        description: "Alguns alimentos não possuem informações nutricionais completas",
        variant: "destructive"
      });
      return;
    }

    const quantidadeDesejada = parseFloat(quantity);

    // Cálculo conforme solicitado:
    // 1. Calorias por grama do alimento original
    const caloriasPorGramaOriginal = alimentoOriginal.calorias / alimentoOriginal.quantidade;
    
    // 2. Calorias totais da quantidade desejada
    const caloriasTotais = caloriasPorGramaOriginal * quantidadeDesejada;
    
    // 3. Calorias por grama do alimento substituto
    const caloriasPorGramaSubstituto = alimentoSubstituto.calorias / alimentoSubstituto.quantidade;
    
    // 4. Quantidade equivalente do substituto (mesmas calorias)
    const quantidadeEquivalente = caloriasTotais / caloriasPorGramaSubstituto;

    // Calcular macros proporcionais
    const proteinasPorGramaOriginal = (alimentoOriginal.proteinas || 0) / alimentoOriginal.quantidade;
    const carboidratosPorGramaOriginal = (alimentoOriginal.carboidratos || 0) / alimentoOriginal.quantidade;
    const lipideosPorGramaOriginal = (alimentoOriginal.lipideos || 0) / alimentoOriginal.quantidade;

    const proteinasPorGramaSubstituto = (alimentoSubstituto.proteinas || 0) / alimentoSubstituto.quantidade;
    const carboidratosPorGramaSubstituto = (alimentoSubstituto.carboidratos || 0) / alimentoSubstituto.quantidade;
    const lipideosPorGramaSubstituto = (alimentoSubstituto.lipideos || 0) / alimentoSubstituto.quantidade;

    setResult({
      original: {
        nome: alimentoOriginal.alimento,
        quantidade: quantidadeDesejada,
        calorias: caloriasTotais.toFixed(1),
        proteinas: (proteinasPorGramaOriginal * quantidadeDesejada).toFixed(1),
        carboidratos: (carboidratosPorGramaOriginal * quantidadeDesejada).toFixed(1),
        lipideos: (lipideosPorGramaOriginal * quantidadeDesejada).toFixed(1)
      },
      substituto: {
        nome: alimentoSubstituto.alimento,
        quantidade: quantidadeEquivalente.toFixed(1),
        calorias: caloriasTotais.toFixed(1),
        proteinas: (proteinasPorGramaSubstituto * quantidadeEquivalente).toFixed(1),
        carboidratos: (carboidratosPorGramaSubstituto * quantidadeEquivalente).toFixed(1),
        lipideos: (lipideosPorGramaSubstituto * quantidadeEquivalente).toFixed(1)
      }
    });

    toast({
      title: "Cálculo realizado!",
      description: "Veja abaixo a equivalência nutricional",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lista de Substituição
          </h1>
          <p className="text-muted-foreground">
            Encontre alternativas saudáveis mantendo o valor nutricional
          </p>
        </div>

        {/* Seleção de Categoria */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Selecione a categoria do alimento
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {foodCategories.map(({ icon: Icon, label, value, color, emoji }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg transform hover:scale-105 ${
                  selectedCategory === value 
                    ? `${color} ring-2 ring-primary shadow-md` 
                    : `${color}`
                }`}
              >
                <div className="text-3xl mb-1">{emoji}</div>
                <Icon className="mx-auto mb-2" size={20} />
                <p className="text-xs font-semibold">{label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Formulário de Substituição */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="originalFood">Substituir este alimento:</Label>
              <Select 
                value={originalFood} 
                onValueChange={setOriginalFood}
                disabled={!selectedCategory || loading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    loading ? "Carregando..." : 
                    !selectedCategory ? "Selecione uma categoria primeiro" : 
                    "Selecione o alimento"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {alimentosFiltrados.map(food => (
                    <SelectItem key={food.id} value={food.alimento}>
                      {food.alimento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade (g/unidades):</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: 100"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="substituteFood">Substituir por este alimento:</Label>
              <Select 
                value={substituteFood} 
                onValueChange={setSubstituteFood}
                disabled={!selectedCategory || loading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    loading ? "Carregando..." : 
                    !selectedCategory ? "Selecione uma categoria primeiro" : 
                    "Selecione o substituto"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {alimentosFiltrados
                    .filter(food => food.alimento !== originalFood)
                    .map(food => (
                      <SelectItem key={food.id} value={food.alimento}>
                        {food.alimento}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full bg-gradient-primary"
              size="lg"
            >
              <Calculator className="mr-2" size={20} />
              Calcular
            </Button>
          </div>
        </Card>

        {/* Resultado */}
        {result && (
          <Card className="p-6 bg-gradient-health">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Resultado da Substituição
            </h2>
            
            {/* Alimento Original */}
            <div className="bg-card rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2 font-semibold">Alimento Original</p>
              <p className="text-lg font-bold mb-3">
                {result.original.quantidade}g de {result.original.nome}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-accent/10 rounded">
                  <p className="text-xl font-bold text-accent">{result.original.calorias}</p>
                  <p className="text-xs text-muted-foreground">Calorias</p>
                </div>
                <div className="text-center p-2 bg-primary/10 rounded">
                  <p className="text-xl font-bold text-primary">{result.original.proteinas}g</p>
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                </div>
                <div className="text-center p-2 bg-water/10 rounded">
                  <p className="text-xl font-bold text-water">{result.original.carboidratos}g</p>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                </div>
                <div className="text-center p-2 bg-warning/10 rounded">
                  <p className="text-xl font-bold text-warning">{result.original.lipideos}g</p>
                  <p className="text-xs text-muted-foreground">Lipídeos</p>
                </div>
              </div>
            </div>

            {/* Alimento Substituto */}
            <div className="bg-card rounded-lg p-4 border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2 font-semibold">Equivale a</p>
              <p className="text-lg font-bold mb-3 text-primary">
                {result.substituto.quantidade}g de {result.substituto.nome}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-accent/10 rounded">
                  <p className="text-xl font-bold text-accent">{result.substituto.calorias}</p>
                  <p className="text-xs text-muted-foreground">Calorias</p>
                </div>
                <div className="text-center p-2 bg-primary/10 rounded">
                  <p className="text-xl font-bold text-primary">{result.substituto.proteinas}g</p>
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                </div>
                <div className="text-center p-2 bg-water/10 rounded">
                  <p className="text-xl font-bold text-water">{result.substituto.carboidratos}g</p>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                </div>
                <div className="text-center p-2 bg-warning/10 rounded">
                  <p className="text-xl font-bold text-warning">{result.substituto.lipideos}g</p>
                  <p className="text-xs text-muted-foreground">Lipídeos</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FoodSubstitution;