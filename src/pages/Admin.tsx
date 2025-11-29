import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, BarChart3, FileText, Newspaper, MessageSquareQuote, Share2, Megaphone, Lightbulb, Ticket } from "lucide-react";
import { toast } from "sonner";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { Statistics } from "@/components/admin/Statistics";
import { PlansManagement } from "@/components/admin/PlansManagement";
import { NewsletterManagement } from "@/components/admin/NewsletterManagement";
import { TestimonialsManagement } from "@/components/admin/TestimonialsManagement";
import { BannersManagement } from "@/components/admin/BannersManagement";
import { SuggestionsManagement } from "@/components/admin/SuggestionsManagement";
import { CouponsManagement } from "@/components/admin/CouponsManagement";
import { NotificationsBell } from "@/components/admin/NotificationsBell";
import logoLuna from "@/assets/logo-luna.png";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Layout } from "@/components/Layout";

export default function Admin() {
  const { user, loading, isAdmin, adminChecked, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminChecked) return;

    if (!loading && !user) {
      navigate("/auth");
    }
    if (!loading && user && !isAdmin) {
      navigate("/dashboard");
      toast.error("Você não tem permissão para acessar esta área");
    }
  }, [user, loading, isAdmin, adminChecked, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Luna - Bem-estar Feminino',
      text: 'Descubra a Luna, sua plataforma completa de bem-estar, comunidade e lifestyle feminina!',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading || !adminChecked) {
    return (
      <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, visualize estatísticas e configure a plataforma
          </p>
        </div>

        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-[1280px]">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Banners</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4" />
              <span className="hidden sm:inline">Testemunhos</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pacotes</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Cupons</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Sugestões</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="space-y-4">
            <Statistics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <BannersManagement />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <NewsletterManagement />
          </TabsContent>

              <TabsContent value="plans" className="space-y-4">
                <PlansManagement />
              </TabsContent>

              <TabsContent value="coupons" className="space-y-4">
                <CouponsManagement />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <SuggestionsManagement />
              </TabsContent>
        </Tabs>
      </main>
      
      <WhatsAppButton />
    </div>
    </Layout>
  );
}
