import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AddFood = () => {
  const { toast } = useToast();
  const [foodData, setFoodData] = useState({
    name: '',
    category: '',
    portion: '',
    calories: '',
    carbs: '',
    protein: '',
    fats: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado para adicionar alimentos",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('alimentos')
        .insert({
          nome_do_alimento: foodData.name,
          categoria: foodData.category,
          porcao_padrao: foodData.portion,
          calorias: parseInt(foodData.calories) || null,
          carboidratos: parseFloat(foodData.carbs) || null,
          proteina: parseFloat(foodData.protein) || null,
          gorduras_totais: parseFloat(foodData.fats) || null,
          usuario_id: user.id
        } as any);

      if (error) throw error;

      toast({
        title: "Alimento adicionado!",
        description: `${foodData.name} foi salvo com sucesso`,
      });
      
      // Reset form
      setFoodData({
        name: '',
        category: '',
        portion: '',
        calories: '',
        carbs: '',
        protein: '',
        fats: ''
      });
    } catch (error) {
      console.error('Erro ao salvar alimento:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o alimento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Adicionar Alimento
          </h1>
          <p className="text-muted-foreground">
            Personalize sua lista incluindo novos alimentos
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Alimento</Label>
              <Input
                id="name"
                required
                value={foodData.name}
                onChange={(e) => setFoodData({...foodData, name: e.target.value})}
                placeholder="Ex: Quinoa"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={foodData.category} 
                onValueChange={(value) => setFoodData({...foodData, category: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carbs">Carboidrato</SelectItem>
                  <SelectItem value="protein">Proteína</SelectItem>
                  <SelectItem value="fats">Gordura</SelectItem>
                  <SelectItem value="fruits">Fruta</SelectItem>
                  <SelectItem value="vegetables">Vegetal</SelectItem>
                  <SelectItem value="dairy">Laticínio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="portion">Porção Padrão</Label>
              <Input
                id="portion"
                required
                value={foodData.portion}
                onChange={(e) => setFoodData({...foodData, portion: e.target.value})}
                placeholder="100g, 1 unidade, 1 fatia"
                className="mt-1"
              />
            </div>

            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Informações Nutricionais (por porção)</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="calories">Calorias (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    required
                    value={foodData.calories}
                    onChange={(e) => setFoodData({...foodData, calories: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="carbs">Carboidratos (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    required
                    value={foodData.carbs}
                    onChange={(e) => setFoodData({...foodData, carbs: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="protein">Proteínas (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    required
                    value={foodData.protein}
                    onChange={(e) => setFoodData({...foodData, protein: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fats">Gorduras totais (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    required
                    value={foodData.fats}
                    onChange={(e) => setFoodData({...foodData, fats: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary" size="lg">
              <Save className="mr-2" size={20} />
              Salvar Alimento
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddFood;