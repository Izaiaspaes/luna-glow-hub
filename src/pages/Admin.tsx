import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, BarChart3, FileText, Mail, Newspaper, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { Statistics } from "@/components/admin/Statistics";
import { PlansManagement } from "@/components/admin/PlansManagement";
import { InvitesManagement } from "@/components/admin/InvitesManagement";
import { NewsletterManagement } from "@/components/admin/NewsletterManagement";
import { TestimonialsManagement } from "@/components/admin/TestimonialsManagement";
import { NotificationsBell } from "@/components/admin/NotificationsBell";
import logoLuna from "@/assets/logo-luna.png";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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

  if (loading || !adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img src={logoLuna} alt="Luna Logo" className="h-8 w-auto" />
                <span className="text-xl font-semibold">Luna Admin</span>
              </div>
              <nav className="hidden md:flex gap-6">
                <NavLink to="/">Início</NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsBell />
              <Button onClick={handleSignOut} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, visualize estatísticas e configure a plataforma
          </p>
        </div>

        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[1100px]">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4" />
              <span className="hidden sm:inline">Testemunhos</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="invites" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Convites</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pacotes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="space-y-4">
            <Statistics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <NewsletterManagement />
          </TabsContent>

          <TabsContent value="invites" className="space-y-4">
            <InvitesManagement />
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <PlansManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <WhatsAppButton />
    </div>
  );
}
