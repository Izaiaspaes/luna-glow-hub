import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, BarChart3, FileText, Newspaper, MessageSquareQuote, Share2, Megaphone, Lightbulb, Ticket, DollarSign, UserPlus, Bell, Gift, Wallet, Percent } from "lucide-react";
import { toast } from "sonner";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { Statistics } from "@/components/admin/Statistics";
import { PlansManagement } from "@/components/admin/PlansManagement";
import { NewsletterManagement } from "@/components/admin/NewsletterManagement";
import { TestimonialsManagement } from "@/components/admin/TestimonialsManagement";
import { BannersManagement } from "@/components/admin/BannersManagement";
import { SuggestionsManagement } from "@/components/admin/SuggestionsManagement";
import { CouponsManagement } from "@/components/admin/CouponsManagement";
import { PriceManagement } from "@/components/admin/PriceManagement";
import { ReferralsManagement } from "@/components/admin/ReferralsManagement";
import { NotificationsBell } from "@/components/admin/NotificationsBell";
import { NotificationsLogsManagement } from "@/components/admin/NotificationsLogsManagement";
import { TrialManagement } from "@/components/admin/TrialManagement";
import { WithdrawalsManagement } from "@/components/admin/WithdrawalsManagement";
import { CommissionSettingsManagement } from "@/components/admin/CommissionSettingsManagement";
import logoLuna from "@/assets/logo-luna.png";

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
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-10 items-center justify-start gap-1 p-1 min-w-max">
              <TabsTrigger value="statistics" className="flex items-center gap-2 whitespace-nowrap px-3">
                <BarChart3 className="w-4 h-4" />
                <span>Estatísticas</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Users className="w-4 h-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Bell className="w-4 h-4" />
                <span>Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2 whitespace-nowrap px-3">
                <UserPlus className="w-4 h-4" />
                <span>Indicações</span>
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Wallet className="w-4 h-4" />
                <span>Saques</span>
              </TabsTrigger>
              <TabsTrigger value="trials" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Gift className="w-4 h-4" />
                <span>Trials</span>
              </TabsTrigger>
              <TabsTrigger value="banners" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Megaphone className="w-4 h-4" />
                <span>Banners</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2 whitespace-nowrap px-3">
                <MessageSquareQuote className="w-4 h-4" />
                <span>Testemunhos</span>
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Newspaper className="w-4 h-4" />
                <span>Newsletter</span>
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2 whitespace-nowrap px-3">
                <FileText className="w-4 h-4" />
                <span>Pacotes</span>
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Ticket className="w-4 h-4" />
                <span>Cupons</span>
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Lightbulb className="w-4 h-4" />
                <span>Sugestões</span>
              </TabsTrigger>
              <TabsTrigger value="prices" className="flex items-center gap-2 whitespace-nowrap px-3">
                <DollarSign className="w-4 h-4" />
                <span>Preços</span>
              </TabsTrigger>
              <TabsTrigger value="commission" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Percent className="w-4 h-4" />
                <span>Comissão</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="statistics" className="space-y-4">
            <Statistics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationsLogsManagement />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <ReferralsManagement />
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <WithdrawalsManagement />
          </TabsContent>

          <TabsContent value="trials" className="space-y-4">
            <TrialManagement />
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

              <TabsContent value="prices" className="space-y-4">
                <PriceManagement />
              </TabsContent>

              <TabsContent value="commission" className="space-y-4">
                <CommissionSettingsManagement />
              </TabsContent>
        </Tabs>
      </main>
    </div>
    </Layout>
  );
}
