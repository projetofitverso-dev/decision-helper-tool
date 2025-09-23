import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-health flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">FitVerso</h1>
          <p className="text-primary-glow font-medium">Troque, ajuste, evolua</p>
        </div>
        
        <div className="bg-card rounded-2xl shadow-xl p-8">
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