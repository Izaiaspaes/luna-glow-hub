import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Check, Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Suggestion {
  id: string;
  email: string;
  suggestion: string;
  category: string | null;
  status: string;
  is_reviewed: boolean;
  admin_notes: string | null;
  created_at: string;
}

export const SuggestionsManagement = () => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchSuggestions();
  }, [filterStatus]);

  const fetchSuggestions = async () => {
    try {
      let query = supabase
        .from('user_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error(t('admin.suggestions.fetchError') || "Erro ao carregar sugestões");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuggestion = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('user_suggestions')
        .update({
          status,
          category,
          admin_notes: adminNotes,
          is_reviewed: true,
        })
        .eq('id', suggestionId);

      if (error) throw error;

      toast.success(t('admin.suggestions.updateSuccess') || "Sugestão atualizada com sucesso!");
      setSelectedSuggestion(null);
      fetchSuggestions();
    } catch (error) {
      console.error('Error updating suggestion:', error);
      toast.error(t('admin.suggestions.updateError') || "Erro ao atualizar sugestão");
    }
  };

  const handleDeleteSuggestion = async (suggestionId: string) => {
    if (!confirm(t('admin.suggestions.deleteConfirm') || "Tem certeza que deseja excluir esta sugestão?")) return;

    try {
      const { error } = await supabase
        .from('user_suggestions')
        .delete()
        .eq('id', suggestionId);

      if (error) throw error;

      toast.success(t('admin.suggestions.deleteSuccess') || "Sugestão excluída com sucesso!");
      fetchSuggestions();
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      toast.error(t('admin.suggestions.deleteError') || "Erro ao excluir sugestão");
    }
  };

  const openSuggestionDialog = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setAdminNotes(suggestion.admin_notes || "");
    setCategory(suggestion.category || "");
    setStatus(suggestion.status);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      reviewed: "secondary",
      implemented: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{t(`admin.suggestions.status.${status}`) || status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('admin.suggestions.title') || "Gerenciar Sugestões"}</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.suggestions.filter.all') || "Todas"}</SelectItem>
              <SelectItem value="pending">{t('admin.suggestions.filter.pending') || "Pendentes"}</SelectItem>
              <SelectItem value="reviewed">{t('admin.suggestions.filter.reviewed') || "Revisadas"}</SelectItem>
              <SelectItem value="implemented">{t('admin.suggestions.filter.implemented') || "Implementadas"}</SelectItem>
              <SelectItem value="rejected">{t('admin.suggestions.filter.rejected') || "Rejeitadas"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.suggestions.table.date') || "Data"}</TableHead>
              <TableHead>{t('admin.suggestions.table.email') || "E-mail"}</TableHead>
              <TableHead>{t('admin.suggestions.table.suggestion') || "Sugestão"}</TableHead>
              <TableHead>{t('admin.suggestions.table.category') || "Categoria"}</TableHead>
              <TableHead>{t('admin.suggestions.table.status') || "Status"}</TableHead>
              <TableHead className="text-right">{t('admin.suggestions.table.actions') || "Ações"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {t('admin.suggestions.noSuggestions') || "Nenhuma sugestão encontrada"}
                </TableCell>
              </TableRow>
            ) : (
              suggestions.map((suggestion) => (
                <TableRow key={suggestion.id}>
                  <TableCell className="text-sm">
                    {format(new Date(suggestion.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-sm">{suggestion.email}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{suggestion.suggestion}</TableCell>
                  <TableCell className="text-sm">
                    {suggestion.category ? (
                      <Badge variant="outline">{suggestion.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(suggestion.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openSuggestionDialog(suggestion)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSuggestion(suggestion.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('admin.suggestions.dialog.title') || "Detalhes da Sugestão"}</DialogTitle>
            <DialogDescription>
              {t('admin.suggestions.dialog.description') || "Revise e gerencie a sugestão do usuário"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.email') || "E-mail"}</label>
                <p className="text-sm text-muted-foreground">{selectedSuggestion.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.date') || "Data"}</label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedSuggestion.created_at), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.suggestion') || "Sugestão"}</label>
                <p className="text-sm bg-muted p-3 rounded-md mt-1">{selectedSuggestion.suggestion}</p>
              </div>

              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.category') || "Categoria"}</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t('admin.suggestions.dialog.categoryPlaceholder') || "Ex: Feature, Bug, Design"}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.status') || "Status"}</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('admin.suggestions.status.pending') || "Pendente"}</SelectItem>
                    <SelectItem value="reviewed">{t('admin.suggestions.status.reviewed') || "Revisada"}</SelectItem>
                    <SelectItem value="implemented">{t('admin.suggestions.status.implemented') || "Implementada"}</SelectItem>
                    <SelectItem value="rejected">{t('admin.suggestions.status.rejected') || "Rejeitada"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('admin.suggestions.dialog.notes') || "Notas do Admin"}</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={t('admin.suggestions.dialog.notesPlaceholder') || "Adicione observações internas..."}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={() => handleUpdateSuggestion(selectedSuggestion.id)}
                className="w-full"
              >
                <Check className="mr-2 h-4 w-4" />
                {t('admin.suggestions.dialog.save') || "Salvar Alterações"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
