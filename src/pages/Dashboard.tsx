import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Calendar, Moon, Smile, Zap, Sparkles, TrendingUp, Archive, CheckCircle, MoreVertical, Settings, Menu, Apple } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ProfileSettings } from "@/components/ProfileSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CycleForm } from "@/components/tracking/CycleForm";
import { SleepForm } from "@/components/tracking/SleepForm";
import { MoodForm } from "@/components/tracking/MoodForm";
import { EnergyForm } from "@/components/tracking/EnergyForm";
import { WellnessPlanCard } from "@/components/WellnessPlanCard";
import { CalendarView } from "@/components/CalendarView";
import { SymptomPredictions } from "@/components/SymptomPredictions";
import { PrivacyModeIndicator } from "@/components/PrivacyModeIndicator";
import { WorkForm } from "@/components/tracking/WorkForm";
import { NutritionForm } from "@/components/tracking/NutritionForm";
import { PlanLimitModal } from "@/components/PlanLimitModal";
import { WeeklySummary } from "@/components/WeeklySummary";
import { DailyWorkMessage } from "@/components/DailyWorkMessage";
import { AppTour } from "@/components/AppTour";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logoLuna from "@/assets/logo-luna.png";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type TrackingType = 'cycle' | 'sleep' | 'mood' | 'energy' | 'work' | 'nutrition' | null;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cycle' | 'sleep' | 'mood' | 'energy' | 'nutrition' | 'predictions' | 'calendar'>('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackingType, setTrackingType] = useState<TrackingType>(null);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [wellnessPlans, setWellnessPlans] = useState<any[]>([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false);
  const { user, loading, isAdmin, adminChecked, signOut } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Apply theme
  useTheme();

  useEffect(() => {
    if (!adminChecked) return;
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, adminChecked, navigate]);

  useEffect(() => {
    if (user && activeTab !== 'overview') {
      loadRecentData();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && (activeTab === 'overview' || activeTab === 'calendar')) {
      loadWellnessPlans();
    }
  }, [user, activeTab]);

  const loadRecentData = async () => {
    if (!user || activeTab === 'overview') return;

    const tableName = `${activeTab}_tracking` as 'cycle_tracking' | 'sleep_tracking' | 'mood_tracking' | 'energy_tracking' | 'nutrition_tracking';
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentData(data);
    }
  };

  const loadWellnessPlans = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('wellness_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading wellness plans:', error);
      return;
    }
    
    setWellnessPlans(data || []);
  };

  const updatePlanStatus = async (planId: string, status: 'active' | 'completed' | 'archived') => {
    if (!user) return;
    
    const updates: any = { status };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.is_active = false;
    } else if (status === 'archived') {
      updates.archived_at = new Date().toISOString();
      updates.is_active = false;
    } else if (status === 'active') {
      updates.is_active = true;
      updates.completed_at = null;
      updates.archived_at = null;
    }
    
    const { error } = await supabase
      .from('wellness_plans')
      .update(updates)
      .eq('id', planId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating plan status:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Plano de Bem-Estar atualizado!",
      description: 
        status === 'completed' ? "Plano marcado como concluído." :
        status === 'archived' ? "Plano arquivado." :
        "Plano reativado.",
    });
    
    await loadWellnessPlans();
  };

  const generateWellnessPlan = async (planType: string) => {
    if (!user) return;
    
    setGeneratingPlan(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-wellness-plan', {
        body: { 
          planType,
          days: 7
        }
      });
      
      if (error) {
        // Check if it's a plan limit error
        if (error.message?.includes('PLAN_LIMIT_REACHED') || error.message?.includes('apenas 1 plano')) {
          setShowPlanLimitModal(true);
          return;
        }
        throw error;
      }
      
      toast({
        title: "Plano de Bem-Estar gerado com sucesso!",
        description: "Seu plano personalizado está pronto.",
      });
      
      await loadWellnessPlans();
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast({
        title: "Erro ao gerar plano",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const openTrackingDialog = (type: TrackingType) => {
    setTrackingType(type);
    setDialogOpen(true);
  };

  const handleTrackingSuccess = () => {
    setDialogOpen(false);
    setTrackingType(null);
    loadRecentData();
  };

  if (loading || !adminChecked) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PlanLimitModal 
        open={showPlanLimitModal} 
        onOpenChange={setShowPlanLimitModal} 
      />
      <AppTour />
      {/* Header/Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={logoLuna} alt="Luna Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold">Luna</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/dashboard" className="text-sm font-medium text-primary transition-smooth" activeClassName="text-primary">
                Dashboard
              </NavLink>
              <NavLink to="/features" className="text-sm font-medium hover:text-primary transition-smooth">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth">
                Preços
              </NavLink>
              {isAdmin && (
                <Button variant="default" size="sm" asChild>
                  <NavLink to="/admin">
                    Painel de Controle
                  </NavLink>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)} data-tour="settings">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} data-tour="avatar">
                Sair
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <Drawer>
              <DrawerTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                  <DrawerDescription>Navegue pela plataforma Luna</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavLink to="/dashboard">
                      Dashboard
                    </NavLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavLink to="/features">
                      Funcionalidades
                    </NavLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavLink to="/pricing">
                      Preços
                    </NavLink>
                  </Button>
                  {isAdmin && (
                    <Button variant="default" className="w-full" asChild>
                      <NavLink to="/admin">
                        Painel de Controle
                      </NavLink>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {
                    setSettingsOpen(true);
                  }}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </div>
                <DrawerFooter>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Sair
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="ghost">Fechar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Olá{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}, bem-vinda! 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Acompanhe sua jornada de bem-estar e receba insights personalizados
            </p>
          </div>
          <PrivacyModeIndicator />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Ciclo</CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">Dia 14</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Fase folicular</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Sono</CardTitle>
              <Moon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">7.2h</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Média da semana</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Humor</CardTitle>
              <Smile className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">4.2/5</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Hoje você está bem</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Energia</CardTitle>
              <Zap className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">3.8/5</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Nível moderado</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Tracking */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('overview')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
                data-tour="overview"
              >
                <span className="hidden sm:inline">Visão Geral</span>
                <span className="sm:hidden">Geral</span>
              </Button>
              <Button
                variant={activeTab === 'cycle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('cycle')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
                data-tour="tracking"
              >
                <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Ciclo
              </Button>
              <Button
                variant={activeTab === 'sleep' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('sleep')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
              >
                <Moon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Sono
              </Button>
              <Button
                variant={activeTab === 'mood' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('mood')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
              >
                <Smile className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Humor
              </Button>
              <Button
                variant={activeTab === 'energy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('energy')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
              >
                <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Energia
              </Button>
              <Button
                variant={activeTab === 'nutrition' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('nutrition')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
              >
                <Apple className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Alimento
              </Button>
              <Button
                variant={activeTab === 'predictions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('predictions')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Previsões IA</span>
                <span className="sm:hidden">Previsões</span>
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('calendar')}
                className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
                data-tour="calendar"
              >
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Calendário</span>
                <span className="sm:hidden">Cal.</span>
              </Button>
            </div>

            {/* Content Area */}
            {activeTab === 'calendar' ? (
              <CalendarView 
                plans={wellnessPlans} 
                onGeneratePlan={() => generateWellnessPlan('geral')}
                generatingPlan={generatingPlan}
              />
            ) : activeTab === 'predictions' ? (
              <SymptomPredictions userId={user!.id} />
            ) : (
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'overview' && 'Visão Geral'}
                    {activeTab === 'cycle' && 'Rastreamento de Ciclo'}
                    {activeTab === 'sleep' && 'Rastreamento de Sono'}
                    {activeTab === 'mood' && 'Rastreamento de Humor'}
                    {activeTab === 'energy' && 'Rastreamento de Energia'}
                    {activeTab === 'nutrition' && 'Rastreamento de Alimentação'}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'overview' && 'Resumo dos seus dados de bem-estar'}
                    {activeTab === 'cycle' && 'Acompanhe seu ciclo menstrual e sintomas'}
                    {activeTab === 'sleep' && 'Monitore a qualidade e duração do seu sono'}
                    {activeTab === 'mood' && 'Registre como você está se sentindo'}
                    {activeTab === 'energy' && 'Acompanhe seus níveis de energia ao longo do dia'}
                    {activeTab === 'nutrition' && 'Registre suas refeições e receba orientação nutricional'}
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                {activeTab === 'overview' ? (
                  <div className="space-y-6">
                    {/* Daily Work Message */}
                    <DailyWorkMessage />
                    
                    {/* Subscription Status */}
                    <SubscriptionCard />
                    
                    {/* AI Wellness Plans Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Planos de Bem-Estar Personalizados
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Gere planos baseados nos seus dados de rastreamento
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              disabled={generatingPlan}
                              size="sm"
                              data-tour="plans"
                            >
                              {generatingPlan ? "Gerando..." : "Gerar Plano"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => generateWellnessPlan('geral')}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Plano Geral
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generateWellnessPlan('sono')}>
                              <Moon className="w-4 h-4 mr-2" />
                              Plano de Sono
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generateWellnessPlan('meditacao')}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Plano de Meditação
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generateWellnessPlan('alimentacao')}>
                              <Heart className="w-4 h-4 mr-2" />
                              Plano de Alimentação
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {wellnessPlans.length === 0 ? (
                        <div className="text-center py-8 bg-muted/20 rounded-lg">
                          <p className="text-muted-foreground">
                            Nenhum plano gerado ainda. Adicione dados de rastreamento e gere seu primeiro plano!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {wellnessPlans.filter(p => p.status !== 'archived').slice(0, 3).map((plan) => (
                            <WellnessPlanCard 
                              key={plan.id} 
                              plan={plan}
                              onStatusChange={updatePlanStatus}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Start Guide */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        Comece selecionando uma categoria acima para registrar seus dados
                      </p>
                    </div>
                  </div>
                ) : recentData.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Você ainda não tem registros nesta categoria
                    </p>
                    <Button variant="hero" onClick={() => openTrackingDialog(activeTab as TrackingType)}>
                      Adicionar Primeiro Registro
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Registros Recentes</h3>
                      <Button size="sm" onClick={() => openTrackingDialog(activeTab as TrackingType)}>
                        Adicionar Novo
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {recentData.map((record) => (
                        <Card key={record.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                 {new Date(
                                   record.cycle_start_date || record.sleep_date || record.mood_date || record.energy_date || record.nutrition_date
                                 ).toLocaleDateString('pt-BR')}
                              </p>
                              {record.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                              )}
                              {activeTab === 'cycle' && record.flow_intensity && (
                                <p className="text-sm">Intensidade: {record.flow_intensity}</p>
                              )}
                              {activeTab === 'sleep' && record.sleep_quality && (
                                <p className="text-sm">Qualidade: {record.sleep_quality}/5</p>
                              )}
                              {activeTab === 'mood' && record.mood_level && (
                                <p className="text-sm">Nível: {record.mood_level}/5</p>
                              )}
                              {activeTab === 'energy' && record.energy_level && (
                                <p className="text-sm">Energia: {record.energy_level}/5</p>
                              )}
                              {activeTab === 'nutrition' && record.nutrition_quality && (
                                <p className="text-sm">Qualidade: {record.nutrition_quality}/5</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            )}
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistente IA</CardTitle>
                    <CardDescription className="text-xs">Sempre disponível para você</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm mb-3">
                    <strong className="text-primary">💡 Insight do dia:</strong>
                    <br />
                    Você está na fase folicular do seu ciclo - é um ótimo momento para atividades sociais e projetos criativos!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Baseado nos seus últimos 7 dias de dados
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      disabled={generatingPlan}
                    >
                      {generatingPlan ? "Gerando..." : "Gerar Plano de Bem-Estar"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={() => generateWellnessPlan('geral')}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Plano Geral
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => generateWellnessPlan('sono')}>
                      <Moon className="w-4 h-4 mr-2" />
                      Plano de Sono
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => generateWellnessPlan('meditacao')}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Plano de Meditação
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => generateWellnessPlan('alimentacao')}>
                      <Heart className="w-4 h-4 mr-2" />
                      Plano de Alimentação
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Planos de Bem-Estar Ativos</CardTitle>
              </CardHeader>
              <CardContent data-tour="plans">
                {wellnessPlans.filter(plan => plan.status === 'active' || (plan.is_active && !plan.status)).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum plano ativo no momento
                  </p>
                ) : (
                  <div className="space-y-3">
                    {wellnessPlans.filter(plan => plan.status === 'active' || (plan.is_active && !plan.status)).map((plan) => (
                      <div
                        key={plan.id}
                        className="p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {plan.plan_content?.title || `Plano ${plan.plan_type}`}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Válido desde {new Date(plan.valid_from).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge variant="wellness" className="ml-2 text-xs">
                            ✓ Ativo
                          </Badge>
                        </div>
                        {plan.plan_content?.summary && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {plan.plan_content.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Tracking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {trackingType === 'cycle' && 'Registrar Ciclo'}
              {trackingType === 'sleep' && 'Registrar Sono'}
              {trackingType === 'mood' && 'Registrar Humor'}
              {trackingType === 'energy' && 'Registrar Energia'}
              {trackingType === 'work' && 'Registrar Trabalho'}
              {trackingType === 'nutrition' && 'Registrar Alimentação'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para registrar seus dados
            </DialogDescription>
          </DialogHeader>
          {user && trackingType === 'cycle' && (
            <CycleForm userId={user.id} onSuccess={handleTrackingSuccess} />
          )}
          {user && trackingType === 'sleep' && (
            <SleepForm userId={user.id} onSuccess={handleTrackingSuccess} />
          )}
          {user && trackingType === 'mood' && (
            <MoodForm userId={user.id} onSuccess={handleTrackingSuccess} />
          )}
          {user && trackingType === 'energy' && (
            <EnergyForm userId={user.id} onSuccess={handleTrackingSuccess} />
          )}
          {user && trackingType === 'nutrition' && (
            <NutritionForm userId={user.id} onSuccess={handleTrackingSuccess} />
          )}
          {user && trackingType === 'work' && (
            <WorkForm />
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Settings Dialog */}
      <ProfileSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      
      <WhatsAppButton />
    </div>
  );
}