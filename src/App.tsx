import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import NewCase from "./pages/NewCase";
import LegalAssistant from "./pages/LegalAssistant";
import Research from "./pages/Research";
import Backlog from "./pages/Backlog";
import CaseDetail from "./pages/CaseDetail";
import RequestRole from "./pages/RequestRole";
import AdminRoles from "./pages/AdminRoles";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
          <Route path="/cases/new" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
          <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
          <Route path="/backlog" element={<ProtectedRoute><Backlog /></ProtectedRoute>} />
          <Route path="/legal-assistant" element={<ProtectedRoute><LegalAssistant /></ProtectedRoute>} />
          <Route path="/research" element={<ProtectedRoute><Research /></ProtectedRoute>} />
          <Route path="/request-role" element={<ProtectedRoute><RequestRole /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute><AdminRoles /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
