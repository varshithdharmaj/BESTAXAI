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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/itr-filing" component={ItrFiling} />
          <Route path="/gst-management" component={GstManagement} />
          <Route path="/tds-services" component={TdsServices} />
          <Route path="/experts" component={Experts} />
          <Route path="/pricing" component={Pricing} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
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
