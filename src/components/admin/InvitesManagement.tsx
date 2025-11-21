import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Copy, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

interface Invite {
  id: string;
  code: string;
  email: string | null;
  created_by: string;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
  is_active: boolean;
}

export function InvitesManagement() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [maxUses, setMaxUses] = useState("1");
  const [deleteInviteId, setDeleteInviteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error("Error loading invites:", error);
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar os convites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const handleCreateInvite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const code = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));

      const { error } = await supabase.from("invites").insert({
        code,
        email: email || null,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
        max_uses: parseInt(maxUses),
      });

      if (error) throw error;

      toast({
        title: "Convite criado",
        description: "O código de convite foi gerado com sucesso.",
      });

      setEmail("");
      setExpiryDays("7");
      setMaxUses("1");
      loadInvites();
    } catch (error) {
      console.error("Error creating invite:", error);
      toast({
        title: "Erro ao criar convite",
        description: "Não foi possível criar o convite.",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  const handleDeleteInvite = async () => {
    if (!deleteInviteId) return;

    try {
      const { error } = await supabase
        .from("invites")
        .delete()
        .eq("id", deleteInviteId);

      if (error) throw error;

      toast({
        title: "Convite excluído",
        description: "O convite foi removido com sucesso.",
      });

      loadInvites();
    } catch (error) {
      console.error("Error deleting invite:", error);
      toast({
        title: "Erro ao excluir convite",
        description: "Não foi possível excluir o convite.",
        variant: "destructive",
      });
    } finally {
      setDeleteInviteId(null);
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isFullyUsed = (invite: Invite) => {
    return invite.current_uses >= invite.max_uses;
  };

  if (loading) {
    return <div className="text-center p-4">Carregando convites...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Criar Novo Convite</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Email (opcional)
            </label>
            <Input
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Validade (dias)
            </label>
            <Input
              type="number"
              min="1"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Usos máximos
            </label>
            <Input
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreateInvite} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Criar Convite
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Convites Criados</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhum convite criado ainda
                </TableCell>
              </TableRow>
            ) : (
              invites.map((invite) => {
                const expired = isExpired(invite.expires_at);
                const fullyUsed = isFullyUsed(invite);
                const isValid = !expired && !fullyUsed && invite.is_active;

                return (
                  <TableRow key={invite.id}>
                    <TableCell className="font-mono text-sm">
                      {invite.code}
                    </TableCell>
                    <TableCell>
                      {invite.email || (
                        <span className="text-muted-foreground">Qualquer</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isValid ? (
                        <Badge variant="default">Válido</Badge>
                      ) : expired ? (
                        <Badge variant="destructive">Expirado</Badge>
                      ) : fullyUsed ? (
                        <Badge variant="secondary">Esgotado</Badge>
                      ) : (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {invite.current_uses} / {invite.max_uses}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invite.expires_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invite.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(invite.code)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteInviteId(invite.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteInviteId} onOpenChange={() => setDeleteInviteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este convite? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvite}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
