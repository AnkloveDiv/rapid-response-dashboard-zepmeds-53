
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
import Ambulances from "./pages/Ambulances";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import LiveMap from "./pages/LiveMap";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import LiveTracking from "./pages/LiveTracking";
import NearestHospitals from "./pages/NearestHospitals";
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
            <Route path="/ambulances" element={<RequireAuth><Ambulances /></RequireAuth>} />
            <Route path="/patients" element={<RequireAuth><Patients /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/map" element={<RequireAuth><LiveMap /></RequireAuth>} />
            <Route path="/help" element={<RequireAuth><Help /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="/live-tracking" element={<RequireAuth><LiveTracking /></RequireAuth>} />
            <Route path="/nearest-hospitals" element={<RequireAuth><NearestHospitals /></RequireAuth>} />

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
