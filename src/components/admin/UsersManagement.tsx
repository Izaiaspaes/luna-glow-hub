import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Trash2, CheckCircle, Search, X, Ban, UserCheck } from "lucide-react";
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
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  roles: { role: string }[];
  subscription_plan?: string | null;
  is_active?: boolean;
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    
    const { data: usersData, error: usersError } = await supabase
      .rpc('get_users_with_profiles');

    if (usersError) {
      toast.error("Erro ao carregar usuários");
      console.error(usersError);
      setLoadingUsers(false);
      return;
    }

    const usersArray: UserWithRole[] = (usersData || []).map((user: any) => ({
      user_id: user.user_id,
      email: user.email || 'N/A',
      full_name: user.full_name,
      phone: user.phone,
      created_at: user.created_at,
      roles: user.roles || [],
      subscription_plan: user.subscription_plan || 'free',
      is_active: user.is_active ?? true,
    }));

    setUsers(usersArray);
    setLoadingUsers(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Call edge function to delete user completely including auth account
      const { data, error } = await supabase.functions.invoke('delete-user-complete', {
        body: { userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast.error(`Erro ao deletar usuário: ${error.message}`);
        setDeleteUserId(null);
        return;
      }

      if (data?.error) {
        console.error('Error from edge function:', data.error);
        toast.error(`Erro ao deletar usuário: ${data.error}`);
        setDeleteUserId(null);
        return;
      }

      toast.success("Usuário deletado completamente com sucesso!");
      loadUsers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Erro ao deletar usuário");
    }
    setDeleteUserId(null);
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    const currentUser = users.find(u => u.user_id === userId);
    const oldPlan = currentUser?.subscription_plan || 'free';

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_plan: newPlan })
      .eq('user_id', userId);

    if (error) {
      toast.error("Erro ao alterar plano");
      console.error(error);
    } else {
      toast.success(`Plano alterado para ${newPlan} com sucesso`);
      
      // Send notification to user
      try {
        const { error: notifyError } = await supabase.functions.invoke('notify-plan-change', {
          body: { userId, newPlan, oldPlan }
        });

        if (notifyError) {
          console.error("Error sending notification:", notifyError);
          toast.error("Plano alterado, mas falha ao enviar notificação");
        } else {
          toast.success("Notificação enviada ao usuário");
        }
      } catch (notifyError) {
        console.error("Error sending notification:", notifyError);
      }
      
      loadUsers();
    }
  };

  const handleToggleRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const userRoles = users.find(u => u.user_id === userId)?.roles || [];
    const hasRole = userRoles.some(r => r.role === role);

    if (hasRole) {
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

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: newStatus })
      .eq('user_id', userId);

    if (error) {
      toast.error(`Erro ao ${newStatus ? 'ativar' : 'desativar'} usuário`);
      console.error(error);
    } else {
      toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso`);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.roles.some(r => r.role === roleFilter);
    
    const matchesStatus = statusFilter === null || (user.is_active ?? true) === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter(null);
    setStatusFilter(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>Gerencie usuários, permissões e assinaturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {(searchTerm || roleFilter || statusFilter !== null) && (
                <Button variant="outline" size="icon" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={roleFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(null)}
              >
                Todos
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("admin")}
              >
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Button>
              <Button
                variant={roleFilter === "moderator" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("moderator")}
              >
                <User className="w-3 h-3 mr-1" />
                Moderador
              </Button>
              <Button
                variant={roleFilter === "user" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("user")}
              >
                <User className="w-3 h-3 mr-1" />
                Usuário
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                Todos Status
              </Button>
              <Button
                variant={statusFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(true)}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Ativos
              </Button>
              <Button
                variant={statusFilter === false ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(false)}
              >
                <Ban className="w-3 h-3 mr-1" />
                Inativos
              </Button>
            </div>
          </div>

          {loadingUsers ? (
            <p className="text-muted-foreground">Carregando usuários...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-muted-foreground">
              {users.length === 0 ? "Nenhum usuário encontrado" : "Nenhum usuário corresponde aos filtros"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredUsers.map((user) => {
                  const isAdmin = user.roles.some(r => r.role === 'admin');
                  const isModerator = user.roles.some(r => r.role === 'moderator');
                  const isUser = user.roles.some(r => r.role === 'user');
                  const isActive = user.is_active ?? true;
                  
                  return (
                    <TableRow key={user.user_id} className={!isActive ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{user.full_name || 'Não informado'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'Não informado'}</TableCell>
                      <TableCell>
                        <Select
                          value={user.subscription_plan || 'free'}
                          onValueChange={(value) => handleChangePlan(user.user_id, value)}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">✨ Premium</SelectItem>
                            <SelectItem value="premium_plus">💎 Premium Plus</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                          {isModerator && <Badge variant="secondary"><User className="w-3 h-3 mr-1" />Moderador</Badge>}
                          {isUser && <Badge variant="outline"><User className="w-3 h-3 mr-1" />Usuário</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isActive ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />Ativo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={isAdmin ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.user_id, 'admin')}
                          >
                            {isAdmin ? 'Remover' : 'Tornar'} Admin
                          </Button>
                          <Button
                            size="sm"
                            variant={isModerator ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.user_id, 'moderator')}
                          >
                            {isModerator ? 'Remover' : 'Tornar'} Moderador
                          </Button>
                          <Button
                            size="sm"
                            variant={isActive ? "secondary" : "default"}
                            onClick={() => handleToggleActive(user.user_id, isActive)}
                            title={isActive ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteUserId(user.user_id)}
                            title="Remover usuário permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá deletar COMPLETAMENTE o usuário, incluindo todos os dados, perfil, rastreamentos e a conta de autenticação. Esta ação é IRREVERSÍVEL.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
