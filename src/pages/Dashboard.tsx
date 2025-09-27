import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import dashboardIcons from '@/assets/dashboard-icons.png';

const Dashboard = () => {
  const features = [
    {
      title: 'Consumo de Água',
      description: 'Registre e acompanhe sua hidratação diária',
      path: '/dashboard/water',
      color: 'bg-water text-water-foreground',
      gradient: 'bg-gradient-water',
      iconStyle: {
        backgroundImage: `url(${dashboardIcons})`,
        backgroundPosition: '0% 0%',
        backgroundSize: '200%',
        width: '60px',
        height: '60px'
      }
    },
    {
      title: 'Lista de Substituição',
      description: 'Troque alimentos mantendo o valor nutricional',
      path: '/dashboard/substitution',
      color: 'bg-primary text-primary-foreground',
      gradient: 'bg-gradient-primary',
      iconStyle: {
        backgroundImage: `url(${dashboardIcons})`,
        backgroundPosition: '100% 0%',
        backgroundSize: '200%',
        width: '60px',
        height: '60px'
      }
    },
    {
      title: 'Medidas Antropométricas',
      description: 'Acompanhe sua evolução física',
      path: '/dashboard/measurements',
      color: 'bg-secondary text-secondary-foreground',
      gradient: 'bg-gradient-primary',
      iconStyle: {
        backgroundImage: `url(${dashboardIcons})`,
        backgroundPosition: '100% 50%',
        backgroundSize: '200%',
        width: '60px',
        height: '60px'
      }
    },
    {
      title: 'Adicionar Alimentos',
      description: 'Personalize sua lista de alimentos',
      path: '/dashboard/add-food',
      color: 'bg-success text-success-foreground',
      gradient: 'bg-gradient-primary',
      iconStyle: {
        backgroundImage: `url(${dashboardIcons})`,
        backgroundPosition: '50% 100%',
        backgroundSize: '200%',
        width: '60px',
        height: '60px'
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo ao FitVerso!
          </h1>
          <p className="text-muted-foreground">
            Escolha uma funcionalidade para começar sua jornada de saúde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ title, description, path, gradient, iconStyle }) => (
            <Link key={path} to={path}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group h-full">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-background to-muted flex items-center justify-center">
                  <div 
                    style={iconStyle}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 ${gradient} opacity-20 group-hover:opacity-10 transition-opacity`} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">Dica do Dia</h2>
          <p className="text-lg opacity-90">
            Mantenha-se hidratado! A água é essencial para o bom funcionamento do organismo. 
            Tente beber pelo menos 2 litros por dia.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;