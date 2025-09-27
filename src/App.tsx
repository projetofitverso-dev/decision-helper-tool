import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/water" element={<WaterIntake />} />
          <Route path="/dashboard/substitution" element={<FoodSubstitution />} />
          
          <Route path="/dashboard/measurements" element={<Measurements />} />
          <Route path="/dashboard/add-food" element={<AddFood />} />
          <Route path="/dashboard/profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/help" element={<Help />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
