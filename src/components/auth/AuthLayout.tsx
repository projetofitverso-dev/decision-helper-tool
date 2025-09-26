import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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