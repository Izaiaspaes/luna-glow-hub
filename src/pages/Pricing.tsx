import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardColorful, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Check,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { MobileNav } from "@/components/MobileNav";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoLuna from "@/assets/logo-luna.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";

const STRIPE_PRICES = {
  brl: {
    premium: {
      monthly: "price_1SX6CVIEVFZTiFWxkPKHuWRw",
      yearly: "price_1SX6CjIEVFZTiFWxlX10yitN",
    },
    premiumPlus: {
      monthly: "price_1SYebkIEVFZTiFWxFUKducJE",
      yearly: "price_1SYghcIEVFZTiFWxxqiCmWth",
    }
  },
  usd: {
    premium: {
      monthly: "price_1SXPuTIEVFZTiFWxVohXH8xe",
      yearly: "price_1SXPucIEVFZTiFWxAaZO1YyI",
    },
    premiumPlus: {
      monthly: "price_1SYeblIEVFZTiFWxuoxqWS4o",
      yearly: "price_1SYghdIEVFZTiFWx6jTEbMet",
    }
  }
};

const comparisonFeatures = [
  {
    category: "Planos de Bem-Estar",
    features: [
      { name: "Planos ativos simultâneos", free: "1 por vez", premium: "Ilimitado", premiumPlus: "Ilimitado" },
      { name: "Plano de sono", free: true, premium: true, premiumPlus: true },
      { name: "Plano de meditação", free: true, premium: true, premiumPlus: true },
      { name: "Plano de nutrição", free: true, premium: true, premiumPlus: true },
      { name: "Plano geral de bem-estar", free: true, premium: true, premiumPlus: true },
    ]
  },
  {
    category: "Rastreamento & IA",
    features: [
      { name: "Rastreamento de ciclo", free: true, premium: true, premiumPlus: true },
      { name: "Registro de sintomas", free: true, premium: true, premiumPlus: true },
      { name: "Transcrição por voz", free: false, premium: true, premiumPlus: true },
      { name: "Integração com wearables", free: false, premium: true, premiumPlus: true },
      { name: "Assistente AI 24/7", free: false, premium: true, premiumPlus: true },
      { name: "Programas guiados", free: false, premium: true, premiumPlus: true },
    ]
  },
  {
    category: "Análises & Relatórios",
    features: [
      { name: "Relatórios mensais", free: true, premium: true, premiumPlus: true },
      { name: "Relatórios semanais", free: false, premium: true, premiumPlus: true },
      { name: "Insights avançados", free: false, premium: true, premiumPlus: true },
      { name: "Histórico completo", free: "3 meses", premium: "Ilimitado", premiumPlus: "Ilimitado" },
    ]
  },
  {
    category: "Recursos Avançados de IA",
    features: [
      { name: "🌟 Diário da Mulher com IA", free: false, premium: true, premiumPlus: true },
      { name: "🆘 SOS Feminino", free: false, premium: true, premiumPlus: true },
      { name: "💬 Luna Sense 24/7", free: false, premium: false, premiumPlus: true },
      { name: "📊 Correlações avançadas", free: false, premium: false, premiumPlus: true },
      { name: "🌙 Modo 'Estou mal hoje'", free: false, premium: false, premiumPlus: true },
      { name: "🎯 IA com empatia adaptativa", free: false, premium: false, premiumPlus: true },
    ]
  },
  {
    category: "Estilo & Beleza AI (Premium Plus)",
    features: [
      { name: "✨ Análise de Beleza AI", free: false, premium: false, premiumPlus: true },
      { name: "👗 Meu Closet Virtual", free: false, premium: false, premiumPlus: true },
      { name: "💄 Recomendações personalizadas", free: false, premium: false, premiumPlus: true },
      { name: "👔 Sugestões de looks inteligentes", free: false, premium: false, premiumPlus: true },
    ]
  },
  {
    category: "Comunidade",
    features: [
      { name: "Comunidades públicas", free: true, premium: true, premiumPlus: true },
      { name: "Comunidades privadas", free: false, premium: true, premiumPlus: true },
      { name: "Lives com especialistas", free: "Limitado", premium: true, premiumPlus: true },
      { name: "Eventos exclusivos", free: false, premium: true, premiumPlus: true },
    ]
  },
  {
    category: "Marketplace",
    features: [
      { name: "Acesso ao marketplace", free: true, premium: true, premiumPlus: true },
      { name: "Reviews e avaliações", free: true, premium: true, premiumPlus: true },
      { name: "Ofertas exclusivas", free: false, premium: true, premiumPlus: true },
    ]
  },
];

export default function Pricing() {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'brl' | 'usd'>('brl');
  const [countryCode, setCountryCode] = useState<string>('BR');
  const { t } = useTranslation();
  
  const freemiumFeatures = [
    t('pricing.freemiumFeatures.cycle'),
    t('pricing.freemiumFeatures.symptoms'),
    t('pricing.freemiumFeatures.feed'),
    t('pricing.freemiumFeatures.publicCommunities'),
    t('pricing.freemiumFeatures.predictions'),
    t('pricing.freemiumFeatures.reports'),
    t('pricing.freemiumFeatures.onePlan'),
  ];

  const premiumFeatures = [
    t('pricing.premiumFeatures.everythingFree'),
    t('pricing.premiumFeatures.unlimitedPlans'),
    t('pricing.premiumFeatures.voiceTranscription'),
    t('pricing.premiumFeatures.aiAssistant'),
    "🌟 Diário da Mulher com IA — Registro e análise inteligente do seu dia",
    "🆘 SOS Feminino — Suporte imediato em momentos difíceis",
    t('pricing.premiumFeatures.personalizedPlans'),
    t('pricing.premiumFeatures.advancedAnalysis'),
    t('pricing.premiumFeatures.weeklyReports'),
    t('pricing.premiumFeatures.wearablesIntegration'),
    t('pricing.premiumFeatures.privateCommunities'),
    t('pricing.premiumFeatures.guidedPrograms'),
    t('pricing.premiumFeatures.exclusiveLives'),
    t('pricing.premiumFeatures.prioritySupport'),
  ];

  const premiumPlusFeatures = [
    "Tudo do Premium +",
    "💬 Luna Sense — Assistente Inteligente 24/7 com empatia adaptativa",
    "✨ Análise de Beleza AI — Recomendações personalizadas de maquiagem e skincare",
    "👗 Meu Closet Virtual — Sugestões inteligentes de looks do seu guarda-roupa",
    "📊 Insights avançados com correlação humor ↔ sintomas ↔ ciclo",
    "🎯 Sugestões práticas e personalizadas em tempo real",
    "🌙 Modo 'Estou mal hoje' com respostas humanizadas e empáticas",
    "🔥 Técnicas de relaxamento instantâneas personalizadas",
    "💄 Análise facial e corporal com recomendações de beleza",
    "👔 Closet virtual com combinações de looks inteligentes",
    "💜 IA com personalidade adaptativa baseada no seu ciclo",
  ];

  // Detect user's country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code || 'BR';
        setCountryCode(country);
        setCurrency(country === 'BR' ? 'brl' : 'usd');
      } catch (error) {
        console.error('Error detecting country:', error);
        // Default to BRL if detection fails
        setCurrency('brl');
      }
    };
    
    detectCountry();
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!user || !session) {
      toast({
        title: t('pricing.loginRequired') || "Login necessário",
        description: t('pricing.loginRequiredDescription') || "Você precisa fazer login para assinar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting checkout process with priceId:', priceId);
      console.log('User session:', session?.user?.email);
      console.log('Session access token exists:', !!session?.access_token);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Tente novamente. Verifique os logs do console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {t('pricing.packagesForAll')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Freemium Plan */}
            <Card className="bg-gradient-card border-2 relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted text-foreground">
                    <Heart className="w-6 h-6" />
                  </div>
                  <Badge variant="free">{t('pricing.freePackage')}</Badge>
                </div>
                <CardTitle className="text-3xl">{t('pricing.freeTitle')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('pricing.freeDescription')}
                </CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">{currency === 'brl' ? 'R$' : '$'} 0</span>
                  <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground pb-4 border-b border-border">
                  {t('pricing.freeForever')}
                </p>
                <ul className="space-y-3">
                  {freemiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <NavLink to="/auth" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    {t('pricing.startFree')}
                  </Button>
                </NavLink>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-card border-2 border-primary relative shadow-colorful animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-colorful text-white text-sm font-medium rounded-full shadow-colorful">
                {t('pricing.mostPopular')}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-colorful text-white shadow-colorful">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <Badge variant="premium">{t('pricing.premiumPackage')}</Badge>
                </div>
                <CardTitle className="text-3xl">{t('pricing.premiumTitle')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('pricing.premiumDescription2')}
                </CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">
                    {currency === 'brl' ? t('pricing.monthlyPrice') : t('pricing.monthlyPriceUSD')}
                  </span>
                  <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  {currency === 'brl' 
                    ? t('pricing.yearlyPrice') 
                    : t('pricing.yearlyPriceUSD')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground pb-4 border-b border-border">
                  {t('pricing.premiumPower')}
                </p>
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button 
                  variant="colorful" 
                  size="lg" 
                  className="w-full group"
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].premium.monthly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeMonthly' + (currency === 'usd' ? 'USD' : ''))} (${currency === 'brl' ? 'R$ 29,90' : '$9.90'})`}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover:bg-primary/10"
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].premium.yearly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeYearly' + (currency === 'usd' ? 'USD' : ''))} (${currency === 'brl' ? 'R$ 299,00' : '$99.00'})`}
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plus Plan */}
            <Card className="bg-gradient-card border-2 border-luna-purple relative shadow-lg animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange text-white text-sm font-medium rounded-full shadow-lg">
                ✨ Completo
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-luna-purple to-luna-pink text-white shadow-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <Badge className="bg-gradient-to-r from-luna-purple to-luna-pink text-white">Premium Plus</Badge>
                </div>
                <CardTitle className="text-3xl">{t('pricing.premiumPlusTitle')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('pricing.premiumPlusDescription')}
                </CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">
                    {currency === 'brl' ? t('pricing.premiumPlusPrice') : t('pricing.premiumPlusPriceUSD')}
                  </span>
                  <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  {currency === 'brl' 
                    ? t('pricing.premiumPlusYearlyPrice') 
                    : t('pricing.premiumPlusYearlyPriceUSD')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground pb-4 border-b border-border">
                  {t('pricing.allAdvancedFeatures')}
                </p>
                <ul className="space-y-3">
                  {premiumPlusFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-luna-purple flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button 
                  className="w-full group bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange hover:opacity-90 text-white"
                  size="lg"
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].premiumPlus.monthly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeMonthlyPremiumPlus')} (${currency === 'brl' ? t('pricing.premiumPlusPrice') : t('pricing.premiumPlusPriceUSD')})`}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover:bg-luna-purple/10 border-luna-purple"
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].premiumPlus.yearly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeYearlyPremiumPlus')} (${currency === 'brl' ? 'R$ 450,00' : '$199.00'})`}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {t('pricing.whyPremium')}
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('pricing.freeTrial')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('pricing.cancelAnytime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('pricing.prioritySupport')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pricing.compareTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('pricing.compareSubtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-card rounded-2xl border-2 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border bg-muted/20">
              <div className="font-semibold">{t('pricing.resources')}</div>
              <div className="text-center font-semibold">{t('pricing.freeColumn')}</div>
              <div className="text-center font-semibold text-primary">{t('pricing.premiumColumn')}</div>
              <div className="text-center font-semibold text-luna-purple">{t('pricing.premiumPlusColumn')}</div>
            </div>

            {/* Table Body */}
            {comparisonFeatures.map((section, sectionIndex) => (
              <div 
                key={sectionIndex}
                className="animate-fade-in"
                style={{ animationDelay: `${0.3 + sectionIndex * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="px-6 py-4 bg-muted/10">
                  <h3 className="font-bold text-lg">{section.category}</h3>
                </div>
                {section.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="grid grid-cols-4 gap-4 p-6 border-b border-border last:border-0 hover:bg-muted/5 transition-smooth"
                  >
                    <div className="text-sm">{feature.name}</div>
                    <div className="flex justify-center">
                      {feature.free === true ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : feature.free === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-xs text-center text-muted-foreground">{feature.free}</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.premium === true ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : feature.premium === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-xs text-center font-medium text-primary">{feature.premium}</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.premiumPlus === true ? (
                        <Check className="w-5 h-5 text-luna-purple" />
                      ) : feature.premiumPlus === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-xs text-center font-medium text-luna-purple">{feature.premiumPlus}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {t('pricing.faqTitle')}
            </h2>
            <div className="space-y-6">
              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pricing.faqQ1')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('pricing.faqA1')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pricing.faqQ2')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('pricing.faqA2')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pricing.faqQ3')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('pricing.faqA3')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pricing.faqQ4')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('pricing.faqA4')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('pricing.ctaReady')}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('pricing.ctaJoin')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                variant="secondary" 
                size="lg" 
                className="group"
                onClick={() => handleCheckout(STRIPE_PRICES[currency].premium.monthly)}
                disabled={loading}
              >
                {loading ? t('pricing.processing') : t('pricing.ctaStartNow')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <NavLink to="/auth">
                <Button variant="secondary" size="lg" className="group">
                  {t('pricing.ctaStartFreeTrial')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
            )}
            <NavLink to="/features">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/20">
                {t('pricing.ctaViewFeatures')}
              </Button>
            </NavLink>
          </div>
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
                {t('nav.home')}
              </NavLink>
              <NavLink to="/features" className="hover:text-primary transition-smooth">
                {t('nav.features')}
              </NavLink>
              <NavLink to="/pricing" className="hover:text-primary transition-smooth" activeClassName="text-primary">
                {t('nav.pricing')}
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </Layout>
  );
}
