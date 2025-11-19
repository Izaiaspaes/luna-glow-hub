import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  recommendations: string;
}

export const PlansManagement = () => {
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "wellness",
    recommendations: "",
  });

  // Load mock templates (in the future, this would come from a database table)
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    // Mock data - in production, load from database
    const mockTemplates: PlanTemplate[] = [
      {
        id: "1",
        name: "Plano Holístico Menstrual",
        description: "Plano focado em bem-estar durante o ciclo menstrual",
        type: "cycle",
        recommendations: "Melhorar sono, gerenciar energia, praticar meditação",
      },
      {
        id: "2",
        name: "Rotina de Sono Saudável",
        description: "Plano para melhorar qualidade do sono",
        type: "sleep",
        recommendations: "Estabelecer horários regulares, reduzir cafeína, criar ambiente relaxante",
      },
      {
        id: "3",
        name: "Equilíbrio Emocional",
        description: "Plano para gerenciamento de humor e emoções",
        type: "mood",
        recommendations: "Práticas de mindfulness, journaling, conexão social",
      },
    ];
    setTemplates(mockTemplates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      ));
      toast.success("Template atualizado com sucesso");
      setEditingId(null);
    } else {
      // Create new template
      const newTemplate: PlanTemplate = {
        ...formData,
        id: Date.now().toString(),
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Template criado com sucesso");
    }

    setFormData({
      name: "",
      description: "",
      type: "wellness",
      recommendations: "",
    });
    setIsCreating(false);
  };

  const handleEdit = (template: PlanTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      recommendations: template.recommendations,
    });
    setEditingId(template.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deletado com sucesso");
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cycle: "bg-pink-500",
      sleep: "bg-blue-500",
      mood: "bg-yellow-500",
      energy: "bg-green-500",
      wellness: "bg-purple-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Templates de Planos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie templates de planos de bem-estar que podem ser oferecidos aos usuários
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
              {editingId ? "Atualize" : "Defina"} as informações do template de plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Plano Holístico Menstrual"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o objetivo deste plano"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="wellness">Bem-estar Geral</option>
                  <option value="cycle">Ciclo Menstrual</option>
                  <option value="sleep">Sono</option>
                  <option value="mood">Humor</option>
                  <option value="energy">Energia</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">Recomendações Padrão</Label>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Liste as recomendações principais deste plano"
                  required
                  rows={4}
                />
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
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge className={`mt-2 ${getTypeColor(template.type)}`}>
                    {template.type}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="space-y-2">
                <Label className="text-xs">Recomendações:</Label>
                <p className="text-xs text-muted-foreground">{template.recommendations}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
