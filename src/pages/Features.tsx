import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Brain, 
  Users, 
  ShoppingBag, 
  Moon,
  Sun,
  Activity,
  Zap,
  MessageCircle,
  Shield,
  TrendingUp,
  Sparkles,
  Lock,
  UserCheck,
  Package,
  Video,
  Star,
  Leaf,
  ArrowRight,
  BookHeart,
  Shirt,
  Camera,
  AlertTriangle,
  Crown
} from "lucide-react";

import { MobileNav } from "@/components/MobileNav";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoLuna from "@/assets/logo-luna.png";
import { Layout } from "@/components/Layout";

export default function Features() {
  const { t, i18n } = useTranslation();
  return (
    <Layout>
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {t('features.badge')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('features.heroTitle')}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t('features.heroTitleHighlight')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.heroDescription')}
          </p>
        </div>
      </section>

      {/* Cycle Tracking Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('features.cycleTracking.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('features.cycleTracking.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.cycleTracking.completeTracking')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.cycleTracking.completeTrackingDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.cycleTracking.wearableIntegration')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.cycleTracking.wearableIntegrationDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.cycleTracking.patternsAndPredictions')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.cycleTracking.patternsAndPredictionsDesc')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Moon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{t('features.cycleTracking.lutealPhase')}</CardTitle>
                  <CardDescription>{t('features.cycleTracking.cycleDay', { day: 22 })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('features.cycleTracking.lutealAdvice')}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Sun className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{t('features.cycleTracking.follicularPhase')}</CardTitle>
                  <CardDescription>{t('features.cycleTracking.nextPhase')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('features.cycleTracking.follicularAdvice', { days: 6 })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Activity className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.cycleTracking.physicalSymptoms')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.cycleTracking.physicalSymptomsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Brain className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.cycleTracking.moodAndEnergy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.cycleTracking.moodAndEnergyDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Moon className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.cycleTracking.sleepQuality')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.cycleTracking.sleepQualityDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Leaf className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.cycleTracking.consciousNutrition')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.cycleTracking.consciousNutritionDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="bg-card p-8 rounded-3xl shadow-hover border-2">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{t('features.aiAssistant.you')}</p>
                    <p className="text-muted-foreground">
                      {t('features.aiAssistant.sampleQuestion')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{t('features.aiAssistant.lunaAI')}</p>
                    <p className="text-muted-foreground">
                      {t('features.aiAssistant.sampleAnswer')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    {t('features.aiAssistant.helpful')}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    {t('features.aiAssistant.moreTips')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('features.aiAssistant.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('features.aiAssistant.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.aiAssistant.personalizedPlans')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.aiAssistant.personalizedPlansDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.aiAssistant.naturalConversation')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.aiAssistant.naturalConversationDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.aiAssistant.private')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.aiAssistant.privateDesc')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.aiAssistant.dailyMicroActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.aiAssistant.dailyMicroActionsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.aiAssistant.weeklyReports')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.aiAssistant.weeklyReportsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Heart className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.aiAssistant.emotionalSupport')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.aiAssistant.emotionalSupportDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section key={`premium-${i18n.language}`} className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-hero text-white rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              {t('features.premiumFeatures.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.premiumFeatures.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('features.premiumFeatures.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
            {/* Luna Sense Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium Plus
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.lunaSense.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.lunaSense.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.lunaSense.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.lunaSense.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.lunaSense.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Virtual Closet Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <Shirt className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium Plus
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.virtualCloset.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.virtualCloset.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.virtualCloset.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.virtualCloset.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.virtualCloset.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Beauty Analysis Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium Plus
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.beautyAnalysis.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.beautyAnalysis.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.beautyAnalysis.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.beautyAnalysis.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.beautyAnalysis.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Journal Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <BookHeart className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.aiJournal.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.aiJournal.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.aiJournal.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.aiJournal.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.aiJournal.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* SOS Feminino Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive text-white shadow-soft">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.sosFeminino.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.sosFeminino.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.sosFeminino.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.sosFeminino.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.sosFeminino.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Symptom Predictions Card */}
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <CardTitle className="text-xl">{t('features.premiumFeatures.symptomPredictions.title')}</CardTitle>
                <CardDescription>
                  {t('features.premiumFeatures.symptomPredictions.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.symptomPredictions.benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.symptomPredictions.benefit2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{t('features.premiumFeatures.symptomPredictions.benefit3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <NavLink to="/pricing">
              <Button size="lg" className="group">
                {t('features.premiumFeatures.viewPlans')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.communities.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('features.communities.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    2.4k {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.careerTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.careerDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://growthpwr.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Growth PWR - Rede de empreendedoras</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    1.8k {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.motherhoodTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.motherhoodDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://brasil.babycenter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>BabyCenter Brasil - Rede de apoio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.b2mamy.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>B2Mamy - Comunidade de mães</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Moon className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    3.1k {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.menopauseTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.menopauseDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://menopausacomciencia.igorpadovesi.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Menopausa com Ciência</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Brain className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    1.5k {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.mentalHealthTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.mentalHealthDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://mapasaudemental.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Mapa da Saúde Mental</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://acolheretransformar.com.br/psicologas/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Acolher & Transformar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    2.2k {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.fitnessTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.fitnessDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://flo.health/pt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Flo Health - App de saúde feminina</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://helloclue.com/pt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Clue - Calendário menstrual</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    900 {t('features.communities.members')}
                  </span>
                </div>
                <CardTitle>{t('features.communities.relationshipsTitle')}</CardTitle>
                <CardDescription>
                  {t('features.communities.relationshipsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">{t('features.communities.recommendedResources')}</p>
                <a 
                  href="https://guiadaalma.com.br/terapias-para-casal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-primary hover:underline"
                >
                  <span>Guia da Alma - Terapias para casal</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.communities.humanModeration')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.communities.humanModerationDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <UserCheck className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.communities.verifiedContent')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.communities.verifiedContentDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Lock className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.communities.anonymityOption')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.communities.anonymityOptionDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('features.marketplace.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('features.marketplace.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.marketplace.sustainableBrands')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.marketplace.sustainableBrandsDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.marketplace.liveSales')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.marketplace.liveSalesDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('features.marketplace.communityReviews')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('features.marketplace.communityReviewsDesc')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Package className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{t('features.marketplace.naturalSkincare')}</CardTitle>
                  <CardDescription>{t('features.marketplace.specialCuration')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('features.marketplace.naturalSkincareDesc')}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-xs text-muted-foreground">(342 {t('features.marketplace.reviews')})</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Leaf className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{t('features.marketplace.wellnessBox')}</CardTitle>
                  <CardDescription>{t('features.marketplace.monthlySubscription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('features.marketplace.wellnessBoxDesc')}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-xs text-muted-foreground">(218 {t('features.marketplace.reviews')})</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Package className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.marketplace.curatedProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.marketplace.curatedProductsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.marketplace.supportEntrepreneurs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.marketplace.supportEntrepreneursDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('features.marketplace.premiumCashback')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('features.marketplace.premiumCashbackDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.cta.title')}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('features.cta.description')}
          </p>
          <NavLink to="/onboarding">
            <Button variant="secondary" size="lg" className="group">
              {t('features.cta.createAccount')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Luna</span>
            </NavLink>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <NavLink to="/" className="hover:text-primary transition-smooth">
                {t('features.footer.home')}
              </NavLink>
              <NavLink to="/features" className="hover:text-primary transition-smooth" activeClassName="text-primary">
                {t('features.footer.features')}
              </NavLink>
              <NavLink to="/pricing" className="hover:text-primary transition-smooth">
                {t('features.footer.pricing')}
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </Layout>
  );
}
