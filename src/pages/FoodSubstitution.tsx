import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Beef, Wheat, Fish, Milk, Egg, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FoodSubstitution = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [originalFood, setOriginalFood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [substituteFood, setSubstituteFood] = useState('');
  const [result, setResult] = useState<any>(null);

  const foodCategories = [
    { icon: Wheat, label: 'Carboidratos', value: 'carbs' },
    { icon: Beef, label: 'Proteínas', value: 'protein' },
    { icon: Fish, label: 'Gorduras', value: 'fats' },
    { icon: Apple, label: 'Frutas', value: 'fruits' },
    { icon: Egg, label: 'Leguminosas', value: 'legumes' },
    { icon: Milk, label: 'Laticínios', value: 'dairy' }
  ];

  const foodOptions = {
    carbs: ['Arroz branco', 'Arroz integral', 'Macarrão', 'Batata', 'Pão francês', 'Aveia'],
    protein: ['Frango', 'Carne bovina', 'Peixe', 'Ovo', 'Tofu', 'Queijo'],
    fats: ['Azeite', 'Óleo de coco', 'Abacate', 'Castanhas', 'Amendoim'],
    fruits: ['Banana', 'Maçã', 'Laranja', 'Morango', 'Uva', 'Manga'],
    legumes: ['Feijão', 'Lentilha', 'Grão-de-bico', 'Ervilha', 'Soja'],
    dairy: ['Leite', 'Iogurte', 'Queijo', 'Requeijão', 'Manteiga']
  };

  const handleCalculate = () => {
    if (!originalFood || !quantity || !substituteFood) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para calcular",
        variant: "destructive"
      });
      return;
    }

    // Simulação de cálculo
    const equivalentQuantity = (parseFloat(quantity) * 1.2).toFixed(0);
    setResult({
      original: `${quantity}g de ${originalFood}`,
      substitute: `${equivalentQuantity}g de ${substituteFood}`,
      nutritionalInfo: {
        calories: 150,
        protein: 20,
        carbs: 30,
        fats: 5
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
            {foodCategories.map(({ icon: Icon, label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedCategory === value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Icon className={`mx-auto mb-2 ${
                  selectedCategory === value ? 'text-primary' : 'text-muted-foreground'
                }`} size={24} />
                <p className="text-xs font-medium">{label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Formulário de Substituição */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="originalFood">Substituir este alimento:</Label>
              <Select value={originalFood} onValueChange={setOriginalFood}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o alimento" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory && foodOptions[selectedCategory as keyof typeof foodOptions]?.map(food => (
                    <SelectItem key={food} value={food}>{food}</SelectItem>
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
              <Select value={substituteFood} onValueChange={setSubstituteFood}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o substituto" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory && foodOptions[selectedCategory as keyof typeof foodOptions]
                    ?.filter(food => food !== originalFood)
                    .map(food => (
                      <SelectItem key={food} value={food}>{food}</SelectItem>
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
            
            <div className="bg-card rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alimento Original</p>
                  <p className="font-semibold text-lg">{result.original}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Equivale a</p>
                  <p className="font-semibold text-lg text-primary">{result.substitute}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">Informações Nutricionais</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{result.nutritionalInfo.calories}</p>
                  <p className="text-xs text-muted-foreground">Calorias</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{result.nutritionalInfo.protein}g</p>
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-water">{result.nutritionalInfo.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{result.nutritionalInfo.fats}g</p>
                  <p className="text-xs text-muted-foreground">Gorduras</p>
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