import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SettingsData {
  lembrete_agua: boolean;
  atualizacoes_progresso: boolean;
  som_notificacoes: 'enabled' | 'vibrate' | 'disabled';
  tema: 'light' | 'dark' | 'system';
  idioma: string;
  tamanho_fonte: 'small' | 'medium' | 'large';
  animacoes: boolean;
}

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    lembrete_agua: true,
    atualizacoes_progresso: true,
    som_notificacoes: 'enabled',
    tema: 'system',
    idioma: 'pt-BR',
    tamanho_fonte: 'medium',
    animacoes: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [user]);

  useEffect(() => {
    applyAppearanceSettings();
  }, [settings]);

  const applyAppearanceSettings = () => {
    const root = document.documentElement;
    
    // Aplicar tema
    if (settings.tema === 'dark') {
      root.classList.add('dark');
    } else if (settings.tema === 'light') {
      root.classList.remove('dark');
    } else {
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
    if (!user) {
      setLoading(false);
      return;
    }

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
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, applyAppearanceSettings };
};
