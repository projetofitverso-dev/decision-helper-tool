import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    // Por enquanto, apenas simula o cadastro
    localStorage.setItem('user', JSON.stringify({ name: formData.name, email: formData.email }));
    toast({
      title: "Sucesso!",
      description: "Conta criada com sucesso",
    });
    navigate('/dashboard');
  };

  return (
    <AuthLayout 
      title="Cadastro" 
      subtitle="Crie sua conta em poucos minutos"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="João Silva"
          />
        </div>

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
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            type="text"
            required
            value={formData.cpf}
            onChange={handleChange}
            className="mt-1"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1"
            placeholder="Rua, número, cidade"
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
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1"
            placeholder="Digite a senha novamente"
          />
        </div>

        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
          Cadastrar
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
            Faça login aqui
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;