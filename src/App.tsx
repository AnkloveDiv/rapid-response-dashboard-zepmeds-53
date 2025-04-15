
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Emergencies from "./pages/Emergencies";
import EmergencyDetails from "./pages/EmergencyDetails";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/emergencies" element={<RequireAuth><Emergencies /></RequireAuth>} />
            <Route path="/emergencies/:id" element={<RequireAuth><EmergencyDetails /></RequireAuth>} />
            <Route path="/help" element={<RequireAuth><Help /></RequireAuth>} />

            {/* Redirect old Index page to Dashboard */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
