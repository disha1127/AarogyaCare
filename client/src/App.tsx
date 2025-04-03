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
import Layout from "@/components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/symptom-checker" component={SymptomChecker} />
      <Route path="/articles" component={Articles} />
      <Route path="/diet-plans" component={DietPlans} />
      <Route path="/hospital-finder" component={HospitalFinder} />
      <Route path="/government-schemes" component={GovernmentSchemes} />
      <Route path="/medication-reminders" component={MedicationReminders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
