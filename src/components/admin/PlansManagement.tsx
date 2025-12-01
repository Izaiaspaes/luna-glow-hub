import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sparkles, Plus, Trash2, Edit, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type DbTemplate = Database['public']['Tables']['wellness_plan_templates']['Row'];

interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  base_recommendations: any[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export const PlansManagement = () => {
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_type: "wellness",
    base_recommendations: [] as any[],
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wellness_plan_templates')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Cast base_recommendations from Json to any[]
      const mappedData = (data || []).map(item => ({
        ...item,
        base_recommendations: Array.isArray(item.base_recommendations) 
          ? item.base_recommendations 
          : []
      }));
      
      setTemplates(mappedData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('wellness_plan_templates')
          .update({
            name: formData.name,
            description: formData.description,
            template_type: formData.template_type,
            base_recommendations: formData.base_recommendations,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Template atualizado com sucesso");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('wellness_plan_templates')
          .insert({
            name: formData.name,
            description: formData.description,
            template_type: formData.template_type,
            base_recommendations: formData.base_recommendations,
            display_order: templates.length,
          });

        if (error) throw error;
        toast.success("Template criado com sucesso");
      }

      setFormData({
        name: "",
        description: "",
        template_type: "wellness",
        base_recommendations: [],
      });
      setIsCreating(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar template');
    }
  };

  const handleEdit = (template: PlanTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      template_type: template.template_type,
      base_recommendations: template.base_recommendations,
    });
    setEditingId(template.id);
    setIsCreating(true);
  };

  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      const { error } = await supabase
        .from('wellness_plan_templates')
        .delete()
        .eq('id', templateToDelete);

      if (error) throw error;
      toast.success("Template deletado com sucesso");
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erro ao deletar template');
    } finally {
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('wellness_plan_templates')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentState ? "Template desativado" : "Template ativado");
      loadTemplates();
    } catch (error) {
      console.error('Error toggling active state:', error);
      toast.error('Erro ao alterar status');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cycle: "bg-[hsl(var(--luna-pink))] text-white",
      sleep: "bg-[hsl(var(--luna-blue))] text-white",
      mood: "bg-[hsl(var(--luna-orange))] text-white",
      energy: "bg-[hsl(var(--luna-green))] text-white",
      wellness: "bg-[hsl(var(--luna-purple))] text-white",
      nutrition: "bg-[hsl(var(--luna-orange))] text-white",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return <div className="text-center py-8">Carregando templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Templates de Pacotes</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie templates que a IA usa como base para gerar planos personalizados
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancelar" : <><Plus className="w-4 h-4 mr-2" />Novo Template</>}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Criar"} Template</CardTitle>
            <CardDescription>
              {editingId ? "Atualize" : "Defina"} as informações do template que a IA usará
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pacote</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Pacote Holístico Menstrual"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o objetivo deste pacote"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.template_type}
                  onChange={(e) => setFormData({ ...formData, template_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  required
                >
                  <option value="wellness">Bem-estar Geral</option>
                  <option value="cycle">Ciclo Menstrual</option>
                  <option value="sleep">Sono</option>
                  <option value="mood">Humor</option>
                  <option value="energy">Energia</option>
                  <option value="nutrition">Nutrição</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Recomendações Base (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.base_recommendations, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData({ ...formData, base_recommendations: parsed });
                    } catch (err) {
                      // Invalid JSON, just update the text
                    }
                  }}
                  placeholder='[{"category": "Categoria", "title": "Título", "description": "Descrição", "priority": "alta"}]'
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Array JSON com recomendações base que a IA irá personalizar
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                {editingId ? "Atualizar" : "Criar"} Template
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className={!template.is_active ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getTypeColor(template.template_type)}>
                      {template.template_type}
                    </Badge>
                    {!template.is_active && (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(template.id, template.is_active)}
                    title={template.is_active ? "Desativar" : "Ativar"}
                  >
                    {template.is_active ? (
                      <Power className="w-4 h-4 text-green-600" />
                    ) : (
                      <PowerOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(template.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="space-y-2">
                <Label className="text-xs">Recomendações Base:</Label>
                <div className="text-xs text-muted-foreground space-y-1">
                  {template.base_recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary/30 pl-2">
                      <span className="font-medium">{rec.category}:</span> {rec.title}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};