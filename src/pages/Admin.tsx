import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, User, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  roles: { role: string }[];
}

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    if (!loading && user && !isAdmin) {
      navigate("/dashboard");
      toast.error("Você não tem permissão para acessar esta área");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    
    // Get all users with their roles
    const { data: usersData, error: usersError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (usersError) {
      toast.error("Erro ao carregar usuários");
      setLoadingUsers(false);
      return;
    }

    // Get auth users (we need to use a different approach since we can't query auth.users directly)
    // We'll use the admin API through an edge function or display only user_roles data
    
    // For now, let's group roles by user_id
    const userMap = new Map<string, { roles: { role: string }[] }>();
    
    usersData.forEach(item => {
      if (!userMap.has(item.user_id)) {
        userMap.set(item.user_id, { roles: [] });
      }
      userMap.get(item.user_id)?.roles.push({ role: item.role });
    });

    // Convert to array with user IDs
    const usersArray: UserWithRole[] = Array.from(userMap.entries()).map(([id, data]) => ({
      id,
      email: id.substring(0, 8) + "...", // We'll show partial ID since we can't access auth.users
      created_at: new Date().toISOString(),
      roles: data.roles,
    }));

    setUsers(usersArray);
    setLoadingUsers(false);
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast.error("Erro ao deletar usuário");
    } else {
      toast.success("Usuário deletado com sucesso");
      loadUsers();
    }
    setDeleteUserId(null);
  };

  const handleToggleRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const userRoles = users.find(u => u.id === userId)?.roles || [];
    const hasRole = userRoles.some(r => r.role === role);

    if (hasRole) {
      // Remove role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        toast.error("Erro ao remover role");
      } else {
        toast.success(`Role ${role} removida com sucesso`);
        loadUsers();
      }
    } else {
      // Add role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        toast.error("Erro ao adicionar role");
      } else {
        toast.success(`Role ${role} adicionada com sucesso`);
        loadUsers();
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Luna Admin</span>
            </NavLink>
            <nav className="flex items-center gap-4">
              <NavLink to="/dashboard" className="text-sm font-medium hover:text-primary transition-smooth">
                Dashboard
              </NavLink>
              <NavLink to="/admin" className="text-sm font-medium text-primary transition-smooth" activeClassName="text-primary">
                Admin
              </NavLink>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Painel de Administração
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie usuários e permissões da plataforma
          </p>
        </div>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>
              Visualize e gerencie as permissões de todos os usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Usuário</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell className="font-mono text-xs">
                        {userData.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {userData.roles.map((roleData, idx) => (
                            <Badge
                              key={idx}
                              variant={
                                roleData.role === "admin"
                                  ? "default"
                                  : roleData.role === "moderator"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {roleData.role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={
                              userData.roles.some(r => r.role === "admin")
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleToggleRole(userData.id, "admin")}
                          >
                            Admin
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              userData.roles.some(r => r.role === "moderator")
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleToggleRole(userData.id, "moderator")}
                          >
                            Moderador
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteUserId(userData.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
