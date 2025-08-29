import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ItrFiling from "@/pages/itr-filing";
import GstManagement from "@/pages/gst-management";
import TdsServices from "@/pages/tds-services";
import Experts from "@/pages/experts";
import Pricing from "@/pages/pricing";
import Dashboard from "@/pages/dashboard";

// Simple test component to ensure something renders
function TestComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">BETTERTAXAI</h1>
        <p className="text-xl text-gray-600 mb-8">Professional Tax Filing Platform</p>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600">Your tax filing platform is loading...</p>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <TestComponent />;
  }

  // For debugging, let's try to render the Landing page directly first
  try {
    return (
      <Switch>
        <Route path="/" component={isAuthenticated ? Home : Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/itr-filing" component={ItrFiling} />
        <Route path="/gst-management" component={GstManagement} />
        <Route path="/tds-services" component={TdsServices} />
        <Route path="/experts" component={Experts} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/landing" component={Landing} />
        <Route path="/test" component={TestComponent} />
        <Route component={NotFound} />
      </Switch>
    );
  } catch (error) {
    console.error('Router error:', error);
    return <TestComponent />;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
