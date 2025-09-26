import React from 'react';
import logo from '@/assets/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logo} 
            alt="FitVerso Logo" 
            className="w-24 h-24 mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            FitVerso
          </h1>
          <p className="text-muted-foreground font-medium">Sua jornada de saúde começa aqui</p>
        </div>
        
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mb-6">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;