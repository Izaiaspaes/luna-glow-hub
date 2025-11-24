import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Star, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Testimonial {
  id: string;
  user_name: string;
  user_age: number | null;
  user_avatar_url: string | null;
  testimonial_text: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_age: "",
    user_avatar_url: "",
    testimonial_text: "",
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar testemunhos");
      console.error(error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const testimonialData = {
      user_name: formData.user_name,
      user_age: formData.user_age ? parseInt(formData.user_age) : null,
      user_avatar_url: formData.user_avatar_url || null,
      testimonial_text: formData.testimonial_text,
      is_featured: formData.is_featured,
      display_order: formData.display_order,
    };

    if (editingId) {
      const { error } = await supabase
        .from("testimonials")
        .update(testimonialData)
        .eq("id", editingId);

      if (error) {
        toast.error("Erro ao atualizar testemunho");
        console.error(error);
      } else {
        toast.success("Testemunho atualizado com sucesso!");
        setDialogOpen(false);
        resetForm();
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase
        .from("testimonials")
        .insert([testimonialData]);

      if (error) {
        toast.error("Erro ao criar testemunho");
        console.error(error);
      } else {
        toast.success("Testemunho criado com sucesso!");
        setDialogOpen(false);
        resetForm();
        fetchTestimonials();
      }
    }
    setLoading(false);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      user_name: testimonial.user_name,
      user_age: testimonial.user_age?.toString() || "",
      user_avatar_url: testimonial.user_avatar_url || "",
      testimonial_text: testimonial.testimonial_text,
      is_featured: testimonial.is_featured,
      display_order: testimonial.display_order,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este testemunho?")) return;

    setLoading(true);
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir testemunho");
      console.error(error);
    } else {
      toast.success("Testemunho excluído com sucesso!");
      fetchTestimonials();
    }
    setLoading(false);
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_featured: !currentValue })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar testemunho");
      console.error(error);
    } else {
      toast.success(
        `Testemunho ${!currentValue ? "exibido" : "ocultado"} na home`
      );
      fetchTestimonials();
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = testimonials.findIndex((t) => t.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === testimonials.length - 1)
    )
      return;

    const newTestimonials = [...testimonials];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    
    [newTestimonials[index], newTestimonials[swapIndex]] = [
      newTestimonials[swapIndex],
      newTestimonials[index],
    ];

    // Update display_order for both items
    const updates = newTestimonials.map((t, i) => ({
      id: t.id,
      display_order: i,
    }));

    for (const update of updates) {
      await supabase
        .from("testimonials")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    fetchTestimonials();
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      user_age: "",
      user_avatar_url: "",
      testimonial_text: "",
      is_featured: false,
      display_order: 0,
    });
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gerenciar Testemunhos</CardTitle>
            <CardDescription>
              Adicione e gerencie os testemunhos exibidos na página inicial
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="colorful">
                <Plus className="w-4 h-4 mr-2" />
                Novo Testemunho
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Testemunho" : "Novo Testemunho"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do testemunho
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">Nome *</Label>
                    <Input
                      id="user_name"
                      value={formData.user_name}
                      onChange={(e) =>
                        setFormData({ ...formData, user_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_age">Idade</Label>
                    <Input
                      id="user_age"
                      type="number"
                      value={formData.user_age}
                      onChange={(e) =>
                        setFormData({ ...formData, user_age: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_avatar_url">URL da Foto</Label>
                  <Input
                    id="user_avatar_url"
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={formData.user_avatar_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user_avatar_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonial_text">Testemunho *</Label>
                  <Textarea
                    id="testimonial_text"
                    rows={5}
                    value={formData.testimonial_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        testimonial_text: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                  <Label htmlFor="is_featured">Exibir na página inicial</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem de exibição</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="colorful" disabled={loading}>
                    {loading ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum testemunho cadastrado ainda
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Testemunho</TableHead>
                <TableHead className="text-center">Destaque</TableHead>
                <TableHead className="text-center">Ordem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial, index) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {testimonial.user_avatar_url && (
                        <img
                          src={testimonial.user_avatar_url}
                          alt={testimonial.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{testimonial.user_name}</p>
                        {testimonial.user_age && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.user_age} anos
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{testimonial.testimonial_text}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleToggleFeatured(
                          testimonial.id,
                          testimonial.is_featured
                        )
                      }
                    >
                      <Star
                        className={`w-4 h-4 ${
                          testimonial.is_featured
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(testimonial.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(testimonial.id, "down")}
                        disabled={index === testimonials.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
  );
};