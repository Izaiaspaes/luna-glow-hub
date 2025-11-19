import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, User, Trash2, CheckCircle, XCircle } from "lucide-react";
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

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    
    const { data: usersData, error: usersError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (usersError) {
      toast.error("Erro ao carregar usuários");
      setLoadingUsers(false);
      return;
    }

    const userMap = new Map<string, { roles: { role: string }[] }>();
    
    usersData.forEach(item => {
      if (!userMap.has(item.user_id)) {
        userMap.set(item.user_id, { roles: [] });
      }
      userMap.get(item.user_id)?.roles.push({ role: item.role });
    });

    const usersArray: UserWithRole[] = Array.from(userMap.entries()).map(([id, data]) => ({
      id,
      email: id.substring(0, 8) + "...",
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>Gerencie usuários, permissões e assinaturas</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <p className="text-muted-foreground">Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isAdmin = user.roles.some(r => r.role === 'admin');
                  const isModerator = user.roles.some(r => r.role === 'moderator');
                  const isUser = user.roles.some(r => r.role === 'user');
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id.substring(0, 16)}...</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                          {isModerator && <Badge variant="secondary"><User className="w-3 h-3 mr-1" />Moderador</Badge>}
                          {isUser && <Badge variant="outline"><User className="w-3 h-3 mr-1" />Usuário</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />Ativo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isAdmin ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.id, 'admin')}
                          >
                            {isAdmin ? 'Remover' : 'Tornar'} Admin
                          </Button>
                          <Button
                            size="sm"
                            variant={isModerator ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.id, 'moderator')}
                          >
                            {isModerator ? 'Remover' : 'Tornar'} Moderador
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteUserId(user.id)}
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
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente as roles deste usuário.
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
