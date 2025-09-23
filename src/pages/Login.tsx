import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Por enquanto, apenas simula o login
    localStorage.setItem('user', JSON.stringify({ name: 'João Silva', email: formData.email }));
    toast({
      title: "Bem-vindo!",
      description: "Login realizado com sucesso",
    });
    navigate('/dashboard');
  };

  return (
    <AuthLayout 
      title="Entrar" 
      subtitle="Acesse sua conta FitVerso"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
            placeholder="Digite sua senha"
          />
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-hover">
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
          Entrar
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
            Cadastre-se aqui
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;