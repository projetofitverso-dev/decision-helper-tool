import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, Phone, User, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados do formulário - Dados Pessoais
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  
  // Estados - Informações de Saúde
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityFactor, setActivityFactor] = useState('');
  
  // Estados calculados
  const [age, setAge] = useState<number | null>(null);
  const [tmb, setTmb] = useState<{ harrisBenedict: number | null; mifflin: number | null }>({
    harrisBenedict: null,
    mifflin: null
  });
  const [get, setGet] = useState<number | null>(null);
  
  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega dados do perfil ao montar o componente
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setNomeCompleto(data.nome_completo || '');
        setTelefone(data.telefone || '');
        setBirthdate(data.data_nascimento || '');
        setLocalizacao(data.localizacao || '');
        setHeight(data.altura?.toString() || '');
        setWeight(data.peso_atual?.toString() || '');
        setGender(data.genero || '');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcula idade automaticamente
  useEffect(() => {
    if (birthdate) {
      const today = new Date();
      const birth = new Date(birthdate);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [birthdate]);

  // Calcula TMB usando as fórmulas
  useEffect(() => {
    if (age && height && weight && gender) {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      
      // Fórmula de Harris-Benedict
      let harrisBenedict: number;
      if (gender === 'male') {
        harrisBenedict = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age);
      } else {
        harrisBenedict = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * age);
      }
      
      // Fórmula de Mifflin-St Jeor
      let mifflin: number;
      if (gender === 'male') {
        mifflin = (10 * w) + (6.25 * h) - (5 * age) + 5;
      } else {
        mifflin = (10 * w) + (6.25 * h) - (5 * age) - 161;
      }
      
      setTmb({
        harrisBenedict: Math.round(harrisBenedict),
        mifflin: Math.round(mifflin)
      });
    } else {
      setTmb({ harrisBenedict: null, mifflin: null });
    }
  }, [age, height, weight, gender]);

  // Calcula GET (Gasto Energético Total) baseado no fator de atividade
  useEffect(() => {
    if (tmb.mifflin && activityFactor) {
      const factor = parseFloat(activityFactor);
      setGet(Math.round(tmb.mifflin * factor));
    } else {
      setGet(null);
    }
  }, [tmb.mifflin, activityFactor]);

  // Função para salvar dados pessoais
  const handleSavePersonalData = async () => {
    if (!user) return;
    
    // Validação
    if (!nomeCompleto || nomeCompleto.trim().length < 2) {
      toast({
        title: 'Nome inválido',
        description: 'O nome completo deve ter pelo menos 2 caracteres.',
        variant: 'destructive',
      });
      return;
    }
    
    if (birthdate) {
      const birth = new Date(birthdate);
      if (birth > new Date()) {
        toast({
          title: 'Data inválida',
          description: 'A data de nascimento não pode ser no futuro.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('perfis')
        .upsert({
          id: user.id,
          nome_completo: nomeCompleto.trim(),
          telefone: telefone.trim(),
          data_nascimento: birthdate || null,
          localizacao: localizacao.trim().replace(/\s+/g, ' '),
          atualizado_em: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso!',
        description: 'Dados pessoais salvos com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Função para salvar informações de saúde
  const handleSaveHealthInfo = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updateData: any = {
        id: user.id,
        atualizado_em: new Date().toISOString(),
      };
      
      if (gender) updateData.genero = gender;
      if (height) updateData.altura = parseFloat(height);
      if (weight) updateData.peso_atual = parseFloat(weight);
      
      const { error } = await supabase
        .from('perfis')
        .upsert(updateData, {
          onConflict: 'id'
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso!',
        description: 'Informações de saúde salvas com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full shadow-md"
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div>
                <CardTitle className="text-xl">{nomeCompleto || 'Seu Nome'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="health">Informações de Saúde</TabsTrigger>
                <TabsTrigger value="goals">Metas e Objetivos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Nome Completo *
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo" 
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Telefone
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Data de Nascimento
                    </Label>
                    <Input 
                      id="birthdate" 
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Localização
                    </Label>
                    <Input 
                      id="location" 
                      placeholder="Cidade, Estado"
                      value={localizacao}
                      onChange={(e) => setLocalizacao(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePersonalData}
                    disabled={saving}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="health" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="health-birthdate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Data de Nascimento
                    </Label>
                    <div className="h-10 px-3 rounded-md border border-input bg-muted/50 flex items-center">
                      <span className="text-muted-foreground text-sm">
                        {birthdate ? (() => {
                          const [year, month, day] = birthdate.split('-');
                          return `${day}/${month}/${year}`;
                        })() : 'Preencha em Dados Pessoais'}
                      </span>
                    </div>
                  </div>

                  {age !== null && (
                    <div className="space-y-2">
                      <Label>Idade</Label>
                      <div className="h-10 px-3 rounded-md border border-input bg-muted/50 flex items-center">
                        <span className="text-foreground font-medium">{age} anos</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexo</Label>
                    <select 
                      id="gender" 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="activity">Nível de Atividade Física</Label>
                    <select 
                      id="activity" 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={activityFactor}
                      onChange={(e) => setActivityFactor(e.target.value)}
                    >
                      <option value="">Selecione seu nível de atividade...</option>
                      <option value="1.2">Sedentário (pouco ou nenhum exercício)</option>
                      <option value="1.375">Levemente ativo (exercício leve 1-3 dias/semana)</option>
                      <option value="1.55">Moderadamente ativo (exercício moderado 3-5 dias/semana)</option>
                      <option value="1.725">Muito ativo (exercício intenso 6-7 dias/semana)</option>
                      <option value="1.9">Extremamente ativo (exercício intenso diário + trabalho físico)</option>
                    </select>
                  </div>
                </div>

                {get !== null && (
                  <div className="mt-6 p-5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
                    <h3 className="font-semibold text-xl mb-4 text-foreground text-center">Quantas Calorias Consumir por Dia</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500/30">
                        <div className="text-center">
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Para Perder Peso</span>
                          <span className="font-bold text-3xl text-foreground block">{get - 500}</span>
                          <span className="text-sm text-muted-foreground">calorias por dia</span>
                          <p className="text-xs text-muted-foreground mt-2">Perda de aproximadamente 0,5 kg por semana</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/30">
                        <div className="text-center">
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Para Manter o Peso</span>
                          <span className="font-bold text-3xl text-foreground block">{get}</span>
                          <span className="text-sm text-muted-foreground">calorias por dia</span>
                          <p className="text-xs text-muted-foreground mt-2">Mantém seu peso atual</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/30">
                        <div className="text-center">
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Para Ganhar Peso</span>
                          <span className="font-bold text-3xl text-foreground block">{get + 500}</span>
                          <span className="text-sm text-muted-foreground">calorias por dia</span>
                          <p className="text-xs text-muted-foreground mt-2">Ganho de aproximadamente 0,5 kg por semana</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4 text-center italic">
                      * Estes valores são estimativas baseadas em fórmulas científicas. Consulte um nutricionista para um plano personalizado.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveHealthInfo}
                    disabled={saving}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Informações'
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="main-goal">Objetivo Principal</Label>
                    <select id="main-goal" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Selecione seu objetivo...</option>
                      <option value="lose-weight">Perder Peso</option>
                      <option value="gain-muscle">Ganhar Massa Muscular</option>
                      <option value="maintain">Manter Peso Atual</option>
                      <option value="health">Melhorar Saúde Geral</option>
                      <option value="performance">Aumentar Performance</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target-weight">Peso Desejado (kg)</Label>
                      <Input id="target-weight" type="number" placeholder="65" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target-date">Data Alvo</Label>
                      <Input id="target-date" type="date" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="water-goal">Meta de Água Diária (ml)</Label>
                    <Input id="water-goal" type="number" placeholder="2000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calorie-goal">Meta de Calorias Diárias</Label>
                    <Input id="calorie-goal" type="number" placeholder="2000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivação</Label>
                    <Textarea 
                      id="motivation" 
                      placeholder="O que te motiva a alcançar seus objetivos?"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                    Salvar Metas
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyProfile;