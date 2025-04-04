import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SymptomChecker from "@/pages/SymptomChecker";
import Articles from "@/pages/Articles";
import DietPlans from "@/pages/DietPlans";
import HospitalFinder from "@/pages/HospitalFinder";
import GovernmentSchemes from "@/pages/GovernmentSchemes";
import MedicationReminders from "@/pages/MedicationReminders";
import AuthPage from "@/pages/auth-page";
import Layout from "@/components/Layout";
import { OfflineProvider } from "./context/OfflineContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/symptom-checker" component={SymptomChecker} />
      <Route path="/articles" component={Articles} />
      <ProtectedRoute path="/diet-plans" component={DietPlans} />
      <Route path="/hospital-finder" component={HospitalFinder} />
      <Route path="/government-schemes" component={GovernmentSchemes} />
      <ProtectedRoute path="/medication-reminders" component={MedicationReminders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <OfflineProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Layout>
              <Router />
            </Layout>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </OfflineProvider>
  );
}

export default App;
