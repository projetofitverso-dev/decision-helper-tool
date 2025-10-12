import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Shield, Palette, Globe, Smartphone, Lock, Eye, Volume2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Personalize suas preferências do FitVerso</p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Escolha como você deseja receber atualizações e lembretes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="water-reminder" className="text-base">Lembrete de Hidratação</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba lembretes para beber água ao longo do dia
                      </p>
                    </div>
                    <Switch id="water-reminder" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progress-updates" className="text-base">Atualizações de Progresso</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumos semanais do seu progresso
                      </p>
                    </div>
                    <Switch id="progress-updates" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    Som das Notificações
                  </Label>
                  <RadioGroup defaultValue="enabled">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enabled" id="sound-enabled" />
                      <Label htmlFor="sound-enabled">Ativado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vibrate" id="sound-vibrate" />
                      <Label htmlFor="sound-vibrate">Apenas Vibração</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled" id="sound-disabled" />
                      <Label htmlFor="sound-disabled">Silencioso</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Aparência do Aplicativo
                </CardTitle>
                <CardDescription>
                  Personalize a aparência do FitVerso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Tema</Label>
                  <RadioGroup defaultValue="system">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Claro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Escuro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">Automático (Sistema)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Idioma
                  </Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Tamanho da Fonte</Label>
                  <RadioGroup defaultValue="medium">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="font-small" />
                      <Label htmlFor="font-small">Pequena</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="font-medium" />
                      <Label htmlFor="font-medium">Média</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="font-large" />
                      <Label htmlFor="font-large">Grande</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations" className="text-base">Animações</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar animações e transições suaves
                    </p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 mt-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacidade e Segurança
                </CardTitle>
                <CardDescription>
                  Gerencie suas configurações de privacidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-public" className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      Perfil Público
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários vejam seu perfil
                    </p>
                  </div>
                  <Switch id="profile-public" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-progress" className="text-base">Compartilhar Progresso</Label>
                    <p className="text-sm text-muted-foreground">
                      Compartilhar suas conquistas com amigos
                    </p>
                  </div>
                  <Switch id="share-progress" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection" className="text-base">Coleta de Dados</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir coleta anônima para melhorias
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      Autenticação em Duas Etapas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="w-full">
                    Baixar Meus Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Gerenciamento da Conta</CardTitle>
                <CardDescription>
                  Configurações avançadas da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Plano Atual</Label>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold">Plano Gratuito</span>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                        Fazer Upgrade
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acesso a recursos básicos do FitVerso
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Conexões</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Conectar com Google Fit
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Conectar com Apple Health
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Conectar com Strava
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Exportar Dados</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Exportar como CSV
                    </Button>
                    <Button variant="outline" className="w-full">
                      Exportar como PDF
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label className="text-destructive">Zona de Perigo</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                      Desativar Conta Temporariamente
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                      Excluir Conta Permanentemente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
            Salvar Todas as Alterações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;