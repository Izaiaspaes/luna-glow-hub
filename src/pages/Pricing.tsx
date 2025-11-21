import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Check,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

const freemiumFeatures = [
  "Rastreamento de ciclo menstrual",
  "Registro de sintomas básicos",
  "Feed de conteúdo personalizado",
  "Acesso a comunidades públicas",
  "Previsões de ciclo",
  "Relatórios mensais básicos",
];

const premiumFeatures = [
  "Tudo do plano gratuito",
  "Assistente AI conversacional 24/7",
  "Planos personalizados de bem-estar",
  "Análises avançadas com insights",
  "Relatórios semanais detalhados",
  "Integração com wearables",
  "Acesso a todas as comunidades privadas",
  "Programas guiados (sono, stress, nutrição)",
  "Lives exclusivas com especialistas",
  "Prioridade no suporte",
];

const comparisonFeatures = [
  {
    category: "Saúde & Bem-estar",
    features: [
      { name: "Rastreamento de ciclo", free: true, premium: true },
      { name: "Registro de sintomas", free: true, premium: true },
      { name: "Integração com wearables", free: false, premium: true },
      { name: "Assistente AI 24/7", free: false, premium: true },
      { name: "Planos personalizados", free: false, premium: true },
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
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Luna</span>
            </NavLink>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/features" className="text-sm font-medium hover:text-primary transition-smooth">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                Preços
              </NavLink>
              <NavLink to="/auth">
                <Button variant="hero" size="sm">
                  Entrar
                </Button>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-accent/50 text-accent-foreground rounded-full text-sm font-medium">
              💫 Planos para todas
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Escolha o plano ideal{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              para você
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comece gratuitamente e desbloqueie recursos avançados quando precisar. 
            Sem pegadinhas, sem taxas escondidas.
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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted text-foreground mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle className="text-3xl">Gratuito</CardTitle>
                <CardDescription className="text-lg">
                  Perfeito para começar sua jornada
                </CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground pb-4 border-b border-border">
                  Acesso gratuito para sempre aos recursos essenciais
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
                <Button variant="outline" size="lg" className="w-full">
                  Começar gratuitamente
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-card border-2 border-primary relative shadow-hover animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-hero text-white text-sm font-medium rounded-full">
                ⭐ Mais popular
              </div>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-hero text-white mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="text-3xl">Premium</CardTitle>
                <CardDescription className="text-lg">
                  Experiência completa com IA e recursos avançados
                </CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">R$ 29,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  ou R$ 299,00/ano (economize 17%)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground pb-4 border-b border-border">
                  Potencialize seu bem-estar com tecnologia e suporte personalizado
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
              <CardFooter>
                <Button variant="hero" size="lg" className="w-full group">
                  Começar teste gratuito
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
              Compare os planos
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja todos os recursos detalhados de cada plano
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
                  <CardTitle className="text-lg">Posso mudar de plano depois?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
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
            <Button variant="secondary" size="lg" className="group">
              Começar teste gratuito
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
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
    </div>
  );
}
