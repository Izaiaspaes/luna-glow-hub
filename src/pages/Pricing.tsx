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
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
    monthly: "price_1SX6CVIEVFZTiFWxkPKHuWRw",
    yearly: "price_1SX6CjIEVFZTiFWxlX10yitN",
  },
  usd: {
    monthly: "price_1SXPuTIEVFZTiFWxVohXH8xe",
    yearly: "price_1SXPucIEVFZTiFWxAaZO1YyI",
  }
};

const comparisonFeatures = [
  {
    category: "Planos de Bem-Estar",
    features: [
      { name: "Planos ativos simultâneos", free: "1 por vez", premium: "Ilimitado" },
      { name: "Plano de sono", free: true, premium: true },
      { name: "Plano de meditação", free: true, premium: true },
      { name: "Plano de nutrição", free: true, premium: true },
      { name: "Plano geral de bem-estar", free: true, premium: true },
    ]
  },
  {
    category: "Rastreamento & IA",
    features: [
      { name: "Rastreamento de ciclo", free: true, premium: true },
      { name: "Registro de sintomas", free: true, premium: true },
      { name: "Transcrição por voz", free: false, premium: true },
      { name: "Integração com wearables", free: false, premium: true },
      { name: "Assistente AI 24/7", free: false, premium: true },
      { name: "Programas guiados", free: false, premium: true },
    ]
  },
  {
    category: "Análises & Relatórios",
    features: [
      { name: "Relatórios mensais", free: true, premium: true },
      { name: "Relatórios semanais", free: false, premium: true },
      { name: "Insights avançados", free: false, premium: true },
      { name: "Histórico completo", free: "3 meses", premium: "Ilimitado" },
    ]
  },
  {
    category: "Comunidade",
    features: [
      { name: "Comunidades públicas", free: true, premium: true },
      { name: "Comunidades privadas", free: false, premium: true },
      { name: "Lives com especialistas", free: "Limitado", premium: true },
      { name: "Eventos exclusivos", free: false, premium: true },
    ]
  },
  {
    category: "Marketplace",
    features: [
      { name: "Acesso ao marketplace", free: true, premium: true },
      { name: "Reviews e avaliações", free: true, premium: true },
      { name: "Ofertas exclusivas", free: false, premium: true },
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
    t('pricing.premiumFeatures.personalizedPlans'),
    t('pricing.premiumFeatures.advancedAnalysis'),
    t('pricing.premiumFeatures.weeklyReports'),
    t('pricing.premiumFeatures.wearablesIntegration'),
    t('pricing.premiumFeatures.privateCommunities'),
    t('pricing.premiumFeatures.guidedPrograms'),
    t('pricing.premiumFeatures.exclusiveLives'),
    t('pricing.premiumFeatures.prioritySupport'),
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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={logoLuna} alt="Luna Logo" className="h-8 w-auto" />
            </NavLink>
            <div className="flex items-center gap-2">
              <div className="hidden md:block mr-2">
                <LanguageSelector />
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <NavLink to="/features" className="text-sm font-medium hover:text-primary transition-smooth">
                  {t('nav.features')}
                </NavLink>
                <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  {t('nav.pricing')}
                </NavLink>
                <NavLink to="/auth">
                  <Button variant="hero" size="sm">
                    {t('common.login')}
                  </Button>
                </NavLink>
              </nav>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

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
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                  {t('pricing.premiumDescription')}
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
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].monthly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeMonthly' + (currency === 'usd' ? 'USD' : ''))} (${currency === 'brl' ? 'R$ 29,90' : '$9.90'})`}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover:bg-primary/10"
                  onClick={() => handleCheckout(STRIPE_PRICES[currency].yearly)}
                  disabled={loading}
                >
                  {loading ? t('pricing.processing') : `${t('pricing.subscribeYearly' + (currency === 'usd' ? 'USD' : ''))} (${currency === 'brl' ? 'R$ 299,00' : '$99.00'})`}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Por que escolher o Premium?
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">7 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Suporte prioritário</span>
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
              Compare os pacotes
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja todos os recursos detalhados de cada pacote
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-card rounded-2xl border-2 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-border bg-muted/20">
              <div className="font-semibold">Recursos</div>
              <div className="text-center font-semibold">Gratuito</div>
              <div className="text-center font-semibold text-primary">Premium</div>
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
                    className="grid grid-cols-3 gap-4 p-6 border-b border-border last:border-0 hover:bg-muted/5 transition-smooth"
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
              Perguntas frequentes
            </h2>
            <div className="space-y-6">
              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Posso mudar de pacote depois?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! Você pode fazer upgrade ou downgrade do seu pacote a qualquer momento. 
                    Se fizer upgrade, terá acesso imediato aos recursos Premium. Se fizer downgrade, 
                    os recursos Premium permanecerão até o fim do período pago.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Como funciona o teste gratuito?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Você tem 7 dias de acesso completo aos recursos Premium sem custo. 
                    Cancele antes do fim do período de teste e não será cobrado. 
                    Não é necessário cartão de crédito para começar.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">O que acontece se eu cancelar?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Seus dados permanecem salvos e você mantém acesso aos recursos gratuitos. 
                    Você pode reativar o Premium a qualquer momento e retomar de onde parou. 
                    Seus insights e histórico não serão perdidos.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Meus dados estão seguros?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! Seus dados são criptografados e armazenados com segurança. 
                    Você tem controle total sobre suas informações e pode exportar ou 
                    excluir seus dados a qualquer momento. Nunca compartilhamos ou vendemos 
                    suas informações pessoais.
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
            Pronta para transformar seu bem-estar?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de mulheres que já estão cuidando melhor de si mesmas com a Luna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                variant="secondary" 
                size="lg" 
                className="group"
                onClick={() => handleCheckout(STRIPE_PRICES[currency].monthly)}
                disabled={loading}
              >
                {loading ? "Processando..." : "Começar agora"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <NavLink to="/auth">
                <Button variant="secondary" size="lg" className="group">
                  Começar teste gratuito
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
            )}
            <NavLink to="/features">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/20">
                Ver funcionalidades
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
                Home
              </NavLink>
              <NavLink to="/features" className="hover:text-primary transition-smooth">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="hover:text-primary transition-smooth" activeClassName="text-primary">
                Preços
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
      
      <WhatsAppButton />
    </div>
    </Layout>
  );
}
