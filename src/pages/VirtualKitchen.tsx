import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, Plus, Trash2, Calculator, Search, Clock, Flame, Apple, Info } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

interface Refeicao {
  id: string;
  nome: string;
  alimentos: Alimento[];
  horario: string;
  tipo: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}

const VirtualKitchen = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlimentos, setSelectedAlimentos] = useState<Alimento[]>([]);
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [nomeRefeicao, setNomeRefeicao] = useState('');
  const [tipoRefeicao, setTipoRefeicao] = useState<Refeicao['tipo']>('almoco');
  const [horarioRefeicao, setHorarioRefeicao] = useState('12:00');

  // Base de dados de alimentos
  const alimentosDisponiveis: Alimento[] = [
    { id: '1', nome: 'Arroz integral', quantidade: 100, unidade: 'g', calorias: 111, proteinas: 2.6, carboidratos: 23, gorduras: 0.9 },
    { id: '2', nome: 'Feijão preto', quantidade: 100, unidade: 'g', calorias: 77, proteinas: 4.5, carboidratos: 14, gorduras: 0.5 },
    { id: '3', nome: 'Frango grelhado', quantidade: 100, unidade: 'g', calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6 },
    { id: '4', nome: 'Batata doce', quantidade: 100, unidade: 'g', calorias: 86, proteinas: 1.6, carboidratos: 20, gorduras: 0.1 },
    { id: '5', nome: 'Brócolis', quantidade: 100, unidade: 'g', calorias: 34, proteinas: 2.8, carboidratos: 7, gorduras: 0.4 },
    { id: '6', nome: 'Ovo cozido', quantidade: 1, unidade: 'unidade', calorias: 78, proteinas: 6.3, carboidratos: 0.6, gorduras: 5.3 },
    { id: '7', nome: 'Banana', quantidade: 1, unidade: 'unidade', calorias: 105, proteinas: 1.3, carboidratos: 27, gorduras: 0.4 },
    { id: '8', nome: 'Aveia', quantidade: 30, unidade: 'g', calorias: 117, proteinas: 5, carboidratos: 20, gorduras: 2.5 },
    { id: '9', nome: 'Leite desnatado', quantidade: 200, unidade: 'ml', calorias: 70, proteinas: 7, carboidratos: 10, gorduras: 0.2 },
    { id: '10', nome: 'Pão integral', quantidade: 50, unidade: 'g', calorias: 123, proteinas: 4.5, carboidratos: 23, gorduras: 1.5 },
  ];

  const alimentosFiltrados = alimentosDisponiveis.filter(alimento =>
    alimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarAlimento = (alimento: Alimento) => {
    const novoAlimento = { ...alimento, id: `${alimento.id}-${Date.now()}` };
    setSelectedAlimentos([...selectedAlimentos, novoAlimento]);
    toast({
      title: "Alimento adicionado",
      description: `${alimento.nome} foi adicionado à refeição`,
    });
  };

  const removerAlimento = (id: string) => {
    setSelectedAlimentos(selectedAlimentos.filter(a => a.id !== id));
  };

  const ajustarQuantidade = (id: string, novaQuantidade: number) => {
    setSelectedAlimentos(selectedAlimentos.map(alimento => {
      if (alimento.id === id) {
        const fator = novaQuantidade / alimento.quantidade;
        return {
          ...alimento,
          quantidade: novaQuantidade,
          calorias: alimento.calorias * fator,
          proteinas: alimento.proteinas * fator,
          carboidratos: alimento.carboidratos * fator,
          gorduras: alimento.gorduras * fator,
        };
      }
      return alimento;
    }));
  };

  const calcularTotais = () => {
    return selectedAlimentos.reduce((acc, alimento) => ({
      calorias: acc.calorias + alimento.calorias,
      proteinas: acc.proteinas + alimento.proteinas,
      carboidratos: acc.carboidratos + alimento.carboidratos,
      gorduras: acc.gorduras + alimento.gorduras,
    }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  const salvarRefeicao = () => {
    if (!nomeRefeicao || selectedAlimentos.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione um nome e pelo menos um alimento à refeição",
        variant: "destructive",
      });
      return;
    }

    const novaRefeicao: Refeicao = {
      id: Date.now().toString(),
      nome: nomeRefeicao,
      alimentos: selectedAlimentos,
      horario: horarioRefeicao,
      tipo: tipoRefeicao,
    };

    setRefeicoes([...refeicoes, novaRefeicao]);
    setSelectedAlimentos([]);
    setNomeRefeicao('');
    
    toast({
      title: "Refeição salva",
      description: `${nomeRefeicao} foi salva com sucesso`,
    });
  };

  const excluirRefeicao = (id: string) => {
    setRefeicoes(refeicoes.filter(r => r.id !== id));
    toast({
      title: "Refeição excluída",
      description: "A refeição foi removida do seu planejamento",
    });
  };

  const totais = calcularTotais();

  const getTipoRefeicaoIcon = (tipo: Refeicao['tipo']) => {
    const icons = {
      cafe: '☕',
      almoco: '🍽️',
      lanche: '🥪',
      jantar: '🍝',
      ceia: '🥛',
    };
    return icons[tipo];
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ChefHat className="text-primary" />
              Cozinha Virtual
            </h1>
            <p className="text-muted-foreground mt-2">
              Monte suas refeições personalizadas e equilibradas
            </p>
          </div>
        </div>

        <Tabs defaultValue="montar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="montar">Montar Refeição</TabsTrigger>
            <TabsTrigger value="planejamento">Meu Planejamento</TabsTrigger>
          </TabsList>

          <TabsContent value="montar" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seleção de Alimentos */}
              <Card>
                <CardHeader>
                  <CardTitle>Selecionar Alimentos</CardTitle>
                  <CardDescription>
                    Escolha os alimentos para montar sua refeição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Buscar alimentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {alimentosFiltrados.map((alimento) => (
                        <Card key={alimento.id} className="p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{alimento.nome}</h4>
                              <p className="text-sm text-muted-foreground">
                                {alimento.quantidade} {alimento.unidade} • {alimento.calorias} kcal
                              </p>
                              <div className="flex gap-4 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  P: {alimento.proteinas}g
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  C: {alimento.carboidratos}g
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  G: {alimento.gorduras}g
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => adicionarAlimento(alimento)}
                              className="ml-2"
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Refeição Montada */}
              <Card>
                <CardHeader>
                  <CardTitle>Refeição Montada</CardTitle>
                  <CardDescription>
                    Alimentos selecionados para sua refeição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-refeicao">Nome da Refeição</Label>
                    <Input
                      id="nome-refeicao"
                      placeholder="Ex: Almoço saudável"
                      value={nomeRefeicao}
                      onChange={(e) => setNomeRefeicao(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo-refeicao">Tipo</Label>
                      <select
                        id="tipo-refeicao"
                        value={tipoRefeicao}
                        onChange={(e) => setTipoRefeicao(e.target.value as Refeicao['tipo'])}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                      >
                        <option value="cafe">Café da manhã</option>
                        <option value="almoco">Almoço</option>
                        <option value="lanche">Lanche</option>
                        <option value="jantar">Jantar</option>
                        <option value="ceia">Ceia</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horario">Horário</Label>
                      <Input
                        id="horario"
                        type="time"
                        value={horarioRefeicao}
                        onChange={(e) => setHorarioRefeicao(e.target.value)}
                      />
                    </div>
                  </div>

                  <ScrollArea className="h-[250px] pr-4">
                    <div className="space-y-2">
                      {selectedAlimentos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Nenhum alimento selecionado
                        </p>
                      ) : (
                        selectedAlimentos.map((alimento) => (
                          <Card key={alimento.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{alimento.nome}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    type="number"
                                    value={alimento.quantidade}
                                    onChange={(e) => ajustarQuantidade(alimento.id, Number(e.target.value))}
                                    className="w-20 h-8"
                                    min="1"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {alimento.unidade}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removerAlimento(alimento.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {selectedAlimentos.length > 0 && (
                    <Card className="bg-gradient-primary text-primary-foreground p-4">
                      <h3 className="font-semibold mb-3">Valores Nutricionais Totais</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Flame size={16} />
                          <div>
                            <p className="text-sm opacity-90">Calorias</p>
                            <p className="font-bold">{totais.calorias.toFixed(0)} kcal</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Apple size={16} />
                          <div>
                            <p className="text-sm opacity-90">Proteínas</p>
                            <p className="font-bold">{totais.proteinas.toFixed(1)}g</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Apple size={16} />
                          <div>
                            <p className="text-sm opacity-90">Carboidratos</p>
                            <p className="font-bold">{totais.carboidratos.toFixed(1)}g</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Apple size={16} />
                          <div>
                            <p className="text-sm opacity-90">Gorduras</p>
                            <p className="font-bold">{totais.gorduras.toFixed(1)}g</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button
                    onClick={salvarRefeicao}
                    className="w-full"
                    disabled={selectedAlimentos.length === 0 || !nomeRefeicao}
                  >
                    <Calculator className="mr-2" size={20} />
                    Salvar Refeição
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planejamento" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suas Refeições Planejadas</CardTitle>
                <CardDescription>
                  Visualize e gerencie suas refeições montadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {refeicoes.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">
                      Você ainda não tem refeições planejadas
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Vá para a aba "Montar Refeição" para começar
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {refeicoes.map((refeicao) => {
                      const totaisRefeicao = refeicao.alimentos.reduce((acc, alimento) => ({
                        calorias: acc.calorias + alimento.calorias,
                        proteinas: acc.proteinas + alimento.proteinas,
                        carboidratos: acc.carboidratos + alimento.carboidratos,
                        gorduras: acc.gorduras + alimento.gorduras,
                      }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

                      return (
                        <Card key={refeicao.id} className="overflow-hidden">
                          <div className="bg-gradient-primary p-4 text-primary-foreground">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{getTipoRefeicaoIcon(refeicao.tipo)}</span>
                                <div>
                                  <h3 className="font-semibold">{refeicao.nome}</h3>
                                  <div className="flex items-center gap-2 text-sm opacity-90">
                                    <Clock size={14} />
                                    <span>{refeicao.horario}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-white/20 text-white">
                                {totaisRefeicao.calorias.toFixed(0)} kcal
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-2">
                              {refeicao.alimentos.map((alimento, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-foreground">
                                    {alimento.nome} ({alimento.quantidade}{alimento.unidade})
                                  </span>
                                  <span className="text-muted-foreground">
                                    {alimento.calorias.toFixed(0)} kcal
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-3 border-t space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Proteínas</span>
                                <span className="font-medium">{totaisRefeicao.proteinas.toFixed(1)}g</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Carboidratos</span>
                                <span className="font-medium">{totaisRefeicao.carboidratos.toFixed(1)}g</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Gorduras</span>
                                <span className="font-medium">{totaisRefeicao.gorduras.toFixed(1)}g</span>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Info size={16} className="mr-1" />
                                    Detalhes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{refeicao.nome}</DialogTitle>
                                    <DialogDescription>
                                      Informações nutricionais detalhadas
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {refeicao.alimentos.map((alimento, index) => (
                                      <div key={index} className="border rounded-lg p-3">
                                        <h4 className="font-medium mb-2">{alimento.nome}</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div>
                                            <span className="text-muted-foreground">Quantidade: </span>
                                            <span className="font-medium">{alimento.quantidade}{alimento.unidade}</span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Calorias: </span>
                                            <span className="font-medium">{alimento.calorias.toFixed(0)} kcal</span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Proteínas: </span>
                                            <span className="font-medium">{alimento.proteinas.toFixed(1)}g</span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Carboidratos: </span>
                                            <span className="font-medium">{alimento.carboidratos.toFixed(1)}g</span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Gorduras: </span>
                                            <span className="font-medium">{alimento.gorduras.toFixed(1)}g</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                onClick={() => excluirRefeicao(refeicao.id)}
                              >
                                <Trash2 size={16} className="mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {refeicoes.length > 0 && (
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>Resumo Nutricional do Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const totaisDia = refeicoes.reduce((acc, refeicao) => {
                      const totaisRefeicao = refeicao.alimentos.reduce((acc2, alimento) => ({
                        calorias: acc2.calorias + alimento.calorias,
                        proteinas: acc2.proteinas + alimento.proteinas,
                        carboidratos: acc2.carboidratos + alimento.carboidratos,
                        gorduras: acc2.gorduras + alimento.gorduras,
                      }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
                      
                      return {
                        calorias: acc.calorias + totaisRefeicao.calorias,
                        proteinas: acc.proteinas + totaisRefeicao.proteinas,
                        carboidratos: acc.carboidratos + totaisRefeicao.carboidratos,
                        gorduras: acc.gorduras + totaisRefeicao.gorduras,
                      };
                    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm opacity-90">Calorias Totais</p>
                          <p className="text-2xl font-bold">{totaisDia.calorias.toFixed(0)} kcal</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Proteínas</p>
                          <p className="text-2xl font-bold">{totaisDia.proteinas.toFixed(1)}g</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Carboidratos</p>
                          <p className="text-2xl font-bold">{totaisDia.carboidratos.toFixed(1)}g</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Gorduras</p>
                          <p className="text-2xl font-bold">{totaisDia.gorduras.toFixed(1)}g</p>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VirtualKitchen;