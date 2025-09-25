import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Settings, HelpCircle, LogOut, Droplets, Utensils, Ruler, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuário"}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Até logo!",
      description: "Logout realizado com sucesso",
    });
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: Droplets, label: 'Consumo de Água', path: '/dashboard/water' },
    { icon: Utensils, label: 'Lista de Substituição', path: '/dashboard/substitution' },
    { icon: Ruler, label: 'Medidas', path: '/dashboard/measurements' },
    { icon: Plus, label: 'Adicionar Alimento', path: '/dashboard/add-food' },
    { icon: User, label: 'Meu Perfil', path: '/dashboard/profile' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Ajuda', path: '/dashboard/help' },
  ];

  return (
    <div className="min-h-screen bg-gradient-health">
      {/* Mobile header */}
      <div className="lg:hidden bg-card shadow-md p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-foreground"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-primary">FitVerso</h1>
        <div className="w-6" />
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-2">FitVerso</h1>
          <p className="text-sm text-muted-foreground">Troque, ajuste, evolua</p>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-gradient-primary text-primary-foreground rounded-lg p-4">
            <p className="text-sm opacity-90">Bem-vindo</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-muted ${
                location.pathname === path ? 'bg-primary text-primary-foreground' : 'text-foreground'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut size={20} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;