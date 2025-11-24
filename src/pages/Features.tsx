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
  ArrowRight
} from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import logoLuna from "@/assets/logo-luna.png";

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={logoLuna} alt="Luna Logo" className="h-8 w-auto" />
            </NavLink>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/features" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth">
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
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              🌟 Funcionalidades completas
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tudo que você precisa para seu{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              bem-estar integral
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como a Luna combina tecnologia, comunidade e consciência para 
            apoiar todas as dimensões da sua saúde e estilo de vida.
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
                Rastreamento de Ciclo & Sintomas
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Acompanhe seu ciclo menstrual, sintomas físicos e emocionais em um único lugar, 
                com visualizações intuitivas e insights personalizados.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Rastreamento completo</p>
                    <p className="text-sm text-muted-foreground">
                      Período, ovulação, sintomas, humor, energia e sono
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Integração com wearables</p>
                    <p className="text-sm text-muted-foreground">
                      Conecte seus dispositivos de saúde para dados mais precisos
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Padrões e previsões</p>
                    <p className="text-sm text-muted-foreground">
                      Identifique tendências e receba previsões baseadas no seu histórico
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Moon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Fase Lútea</CardTitle>
                  <CardDescription>Dia 22 do ciclo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Energia diminuída, priorize descanso e alimentos nutritivos
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Sun className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Fase Folicular</CardTitle>
                  <CardDescription>Próxima fase</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Em 6 dias, energia renovada para novos projetos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Activity className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Sintomas Físicos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Registre cólicas, dores de cabeça, acne e outros sintomas para entender seu corpo melhor
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Brain className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Humor & Energia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitore seu estado emocional e níveis de energia ao longo do ciclo
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Moon className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Qualidade do Sono</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acompanhe padrões de sono e descubra como eles afetam seu bem-estar
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
                    <p className="font-medium mb-2">Você</p>
                    <p className="text-muted-foreground">
                      Tenho me sentido cansada ultimamente, o que posso fazer?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Luna AI</p>
                    <p className="text-muted-foreground">
                      Observei que você está na fase lútea e seu sono tem sido irregular. 
                      Recomendo: dormir 30min mais cedo hoje, uma caminhada leve de 15min 
                      ao ar livre e chá de camomila à noite. 🌙
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    Útil
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Mais dicas
                  </Button>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Assistente AI Contextual
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Um coach pessoal 24/7 que entende seu ciclo, humor, sono e objetivos 
                para oferecer recomendações personalizadas e acionáveis.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Planos personalizados</p>
                    <p className="text-sm text-muted-foreground">
                      Rotinas de sono, micro-meditações e dicas nutricionais baseadas nos seus dados
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Conversa natural</p>
                    <p className="text-sm text-muted-foreground">
                      Faça perguntas e receba respostas contextualizadas sobre sua saúde
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">100% privado</p>
                    <p className="text-sm text-muted-foreground">
                      Suas conversas são criptografadas e nunca compartilhadas
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Micro-ações diárias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sugestões simples e rápidas adaptadas à sua fase do ciclo e rotina
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Relatórios semanais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Análises automáticas dos seus padrões e progresso ao longo do tempo
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Heart className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Suporte emocional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Orientações para gerenciar stress, ansiedade e desafios emocionais
                </p>
              </CardContent>
            </Card>
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
              Comunidades Moderadas e Seguras
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conecte-se com mulheres que compartilham suas experiências em grupos 
              temáticos moderados por especialistas, onde você pode ser autêntica e acolhida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-card border-2 hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    2.4k membros
                  </span>
                </div>
                <CardTitle>Carreira & Empreendedorismo</CardTitle>
                <CardDescription>
                  Dicas, networking e apoio para sua jornada profissional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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
                    1.8k membros
                  </span>
                </div>
                <CardTitle>Maternidade Real</CardTitle>
                <CardDescription>
                  Compartilhe desafios e conquistas da maternidade sem julgamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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
                    3.1k membros
                  </span>
                </div>
                <CardTitle>Menopausa & Transições</CardTitle>
                <CardDescription>
                  Apoio e informação para todas as fases da vida hormonal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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
                    1.5k membros
                  </span>
                </div>
                <CardTitle>Saúde Mental</CardTitle>
                <CardDescription>
                  Espaço seguro para falar sobre ansiedade, depressão e autocuidado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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
                    2.2k membros
                  </span>
                </div>
                <CardTitle>Fitness & Movimento</CardTitle>
                <CardDescription>
                  Exercícios adaptados ao seu ciclo e nível de energia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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
                    900 membros
                  </span>
                </div>
                <CardTitle>Relacionamentos</CardTitle>
                <CardDescription>
                  Conversas honestas sobre amor, amizade e conexões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recursos recomendados:</p>
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

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Moderação humana</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Equipe dedicada e guidelines claros para manter um ambiente respeitoso
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <UserCheck className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Conteúdo verificado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Informações revisadas por profissionais de saúde e especialistas
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Lock className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Opção de anonimato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compartilhe suas experiências com privacidade total quando desejar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-white shadow-soft mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Curadoria & Social Commerce Ético
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Descubra produtos sustentáveis e marcas que compartilham seus valores, 
                com reviews reais da comunidade e vendas interativas.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Marcas sustentáveis</p>
                    <p className="text-sm text-muted-foreground">
                      Produtos eco-friendly de empresas com práticas éticas e transparentes
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Lives de vendas</p>
                    <p className="text-sm text-muted-foreground">
                      Eventos interativos com demonstrações de produtos e ofertas exclusivas
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Reviews da comunidade</p>
                    <p className="text-sm text-muted-foreground">
                      Avaliações honestas de mulheres reais que testaram os produtos
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Package className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Skincare Natural</CardTitle>
                  <CardDescription>Curadoria especial</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Produtos certificados para cada tipo de pele
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-xs text-muted-foreground">(342 reviews)</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-2">
                <CardHeader>
                  <Leaf className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Wellness Box</CardTitle>
                  <CardDescription>Assinatura mensal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Surpresas selecionadas para seu bem-estar
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-xs text-muted-foreground">(218 reviews)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <Package className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Produtos curados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seleção criteriosa de itens testados e aprovados pela comunidade
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Apoio a empreendedoras</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prioridade para marcas lideradas por mulheres e pequenos negócios
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Cashback Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Assinantes ganham desconto e pontos em cada compra no marketplace
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
            Pronta para começar sua jornada?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Crie sua conta agora e comece a cuidar do seu bem-estar de forma personalizada.
          </p>
          <NavLink to="/auth">
            <Button variant="secondary" size="lg" className="group">
              Criar conta grátis
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
                Home
              </NavLink>
              <NavLink to="/features" className="hover:text-primary transition-smooth" activeClassName="text-primary">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="hover:text-primary transition-smooth">
                Preços
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
      
      <WhatsAppButton />
    </div>
  );
}
