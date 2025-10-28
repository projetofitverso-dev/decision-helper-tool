import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Palette, Globe, Volume2, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SettingsData {
  lembrete_agua: boolean;
  atualizacoes_progresso: boolean;
  som_notificacoes: 'enabled' | 'vibrate' | 'disabled';
  tema: 'light' | 'dark' | 'system';
  idioma: string;
  tamanho_fonte: 'small' | 'medium' | 'large';
  animacoes: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    lembrete_agua: true,
    atualizacoes_progresso: true,
    som_notificacoes: 'enabled',
    tema: 'system',
    idioma: 'pt-BR',
    tamanho_fonte: 'medium',
    animacoes: true,
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  // Aplicar configurações de aparência quando carregadas ou alteradas
  useEffect(() => {
    applyAppearanceSettings();
  }, [settings]);

  const applyAppearanceSettings = () => {
    // Aplicar tema
    const root = document.documentElement;
    if (settings.tema === 'dark') {
      root.classList.add('dark');
    } else if (settings.tema === 'light') {
      root.classList.remove('dark');
    } else {
      // Sistema: detectar preferência do sistema
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Aplicar tamanho de fonte
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${settings.tamanho_fonte}`);

    // Aplicar animações
    if (!settings.animacoes) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  };

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          lembrete_agua: data.lembrete_agua,
          atualizacoes_progresso: data.atualizacoes_progresso,
          som_notificacoes: data.som_notificacoes as 'enabled' | 'vibrate' | 'disabled',
          tema: data.tema as 'light' | 'dark' | 'system',
          idioma: data.idioma,
          tamanho_fonte: data.tamanho_fonte as 'small' | 'medium' | 'large',
          animacoes: data.animacoes,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          usuario_id: user.id,
          ...settings,
        }, {
          onConflict: 'usuario_id'
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive",
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Personalize suas preferências do FitVerso</p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
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
                    <Switch 
                      id="water-reminder" 
                      checked={settings.lembrete_agua}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, lembrete_agua: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progress-updates" className="text-base">Atualizações de Progresso</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumos semanais do seu progresso
                      </p>
                    </div>
                    <Switch 
                      id="progress-updates" 
                      checked={settings.atualizacoes_progresso}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, atualizacoes_progresso: checked }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    Som das Notificações
                  </Label>
                  <RadioGroup 
                    value={settings.som_notificacoes}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, som_notificacoes: value as 'enabled' | 'vibrate' | 'disabled' }))}
                  >
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
                  <RadioGroup 
                    value={settings.tema}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, tema: value as 'light' | 'dark' | 'system' }))}
                  >
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
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={settings.idioma}
                    onChange={(e) => setSettings(prev => ({ ...prev, idioma: e.target.value }))}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Tamanho da Fonte</Label>
                  <RadioGroup 
                    value={settings.tamanho_fonte}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, tamanho_fonte: value as 'small' | 'medium' | 'large' }))}
                  >
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
                  <Switch 
                    id="animations" 
                    checked={settings.animacoes}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animacoes: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Todas as Alterações'
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;