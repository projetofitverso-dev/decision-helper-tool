import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProfileData {
  peso: number | null;
  altura: number | null;
  idade: number | null;
  genero: string | null;
  dataNascimento: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    peso: null,
    altura: null,
    idade: null,
    genero: null,
    dataNascimento: null,
  });
  const [loading, setLoading] = useState(true);

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const messDiff = hoje.getMonth() - nascimento.getMonth();
    
    if (messDiff < 0 || (messDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('peso_atual, altura, data_nascimento, genero')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const idade = data.data_nascimento ? calcularIdade(data.data_nascimento) : null;
        
        setProfile({
          peso: data.peso_atual || null,
          altura: data.altura || null,
          idade,
          genero: data.genero || null,
          dataNascimento: data.data_nascimento || null,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return { profile, loading, refetch: loadProfile };
};
