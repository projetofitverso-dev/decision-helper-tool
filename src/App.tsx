import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WaterIntake from "./pages/WaterIntake";
import FoodSubstitution from "./pages/FoodSubstitution";
import Measurements from "./pages/Measurements";
import AddFood from "./pages/AddFood";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Carregar e aplicar configurações globalmente
  useSettings();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/water" element={<ProtectedRoute><WaterIntake /></ProtectedRoute>} />
        <Route path="/dashboard/substitution" element={<ProtectedRoute><FoodSubstitution /></ProtectedRoute>} />
        <Route path="/dashboard/measurements" element={<ProtectedRoute><Measurements /></ProtectedRoute>} />
        <Route path="/dashboard/add-food" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/dashboard/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
