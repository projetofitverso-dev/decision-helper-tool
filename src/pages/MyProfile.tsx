import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, Phone, User, Calendar, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const MyProfile = () => {
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [tmb, setTmb] = useState<{ harrisBenedict: number | null; mifflin: number | null }>({
    harrisBenedict: null,
    mifflin: null
  });

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
                <CardTitle className="text-xl">João da Silva</CardTitle>
                <CardDescription>Membro desde Janeiro 2024</CardDescription>
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
                      Nome Completo
                    </Label>
                    <Input id="name" placeholder="Seu nome completo" defaultValue="João da Silva" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Telefone
                    </Label>
                    <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Data de Nascimento
                    </Label>
                    <Input id="birthdate" type="date" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Localização
                    </Label>
                    <Input id="location" placeholder="Cidade, Estado" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                    Salvar Alterações
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
                    <Input 
                      id="health-birthdate" 
                      type="date" 
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                    />
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
                </div>

                {tmb.harrisBenedict !== null && tmb.mifflin !== null && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-semibold text-lg mb-3 text-foreground">Gasto Calórico Diário (TMB)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Fórmula de Harris-Benedict:</span>
                        <span className="font-bold text-foreground text-lg">{tmb.harrisBenedict} kcal/dia</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Fórmula de Mifflin-St Jeor:</span>
                        <span className="font-bold text-foreground text-lg">{tmb.mifflin} kcal/dia</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      * TMB (Taxa Metabólica Basal) representa o gasto calórico em repouso. 
                      Para obter o gasto total, multiplique por seu fator de atividade física.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                    Salvar Informações
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