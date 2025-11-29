import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface Banner {
  id: string;
  title: string;
  message: string;
  banner_type: string;
  is_active: boolean;
  link_url?: string;
  link_text?: string;
  start_date: string;
  end_date?: string;
  display_order: number;
}

export const BannersManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    banner_type: "info",
    is_active: true,
    link_url: "",
    link_text: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcement_banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: t("admin.banners.fetchError"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bannerData = {
      ...formData,
      end_date: formData.end_date || null,
      link_url: formData.link_url || null,
      link_text: formData.link_text || null,
    };

    if (editingBanner) {
      const { error } = await supabase
        .from("announcement_banners")
        .update(bannerData)
        .eq("id", editingBanner.id);

      if (error) {
        toast({
          title: t("admin.banners.updateError"),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("admin.banners.updateSuccess"),
        });
        resetForm();
        fetchBanners();
      }
    } else {
      const { error } = await supabase
        .from("announcement_banners")
        .insert(bannerData);

      if (error) {
        toast({
          title: t("admin.banners.createError"),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("admin.banners.createSuccess"),
        });
        resetForm();
        fetchBanners();
      }
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      message: banner.message,
      banner_type: banner.banner_type,
      is_active: banner.is_active,
      link_url: banner.link_url || "",
      link_text: banner.link_text || "",
      start_date: banner.start_date.split("T")[0],
      end_date: banner.end_date ? banner.end_date.split("T")[0] : "",
      display_order: banner.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.banners.deleteConfirm"))) return;

    const { error } = await supabase
      .from("announcement_banners")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: t("admin.banners.deleteError"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("admin.banners.deleteSuccess"),
      });
      fetchBanners();
    }
  };

  const toggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from("announcement_banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);

    if (error) {
      toast({
        title: t("admin.banners.toggleError"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchBanners();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      banner_type: "info",
      is_active: true,
      link_url: "",
      link_text: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      display_order: 0,
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "bg-amber-500";
      case "success": return "bg-luna-green";
      case "promo": return "bg-gradient-colorful";
      default: return "bg-primary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("admin.banners.title")}</CardTitle>
            <CardDescription>{t("admin.banners.description")}</CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("admin.banners.addNew")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("admin.banners.form.title")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner_type">{t("admin.banners.form.type")}</Label>
                <Select
                  value={formData.banner_type}
                  onValueChange={(value) => setFormData({ ...formData, banner_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">{t("admin.banners.types.info")}</SelectItem>
                    <SelectItem value="warning">{t("admin.banners.types.warning")}</SelectItem>
                    <SelectItem value="success">{t("admin.banners.types.success")}</SelectItem>
                    <SelectItem value="promo">{t("admin.banners.types.promo")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("admin.banners.form.message")}</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_url">{t("admin.banners.form.linkUrl")}</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_text">{t("admin.banners.form.linkText")}</Label>
                <Input
                  id="link_text"
                  value={formData.link_text}
                  onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">{t("admin.banners.form.startDate")}</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">{t("admin.banners.form.endDate")}</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">{t("admin.banners.form.order")}</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">{t("admin.banners.form.active")}</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingBanner ? t("common.save") : t("common.create")}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.banners.table.title")}</TableHead>
                <TableHead>{t("admin.banners.table.type")}</TableHead>
                <TableHead>{t("admin.banners.table.status")}</TableHead>
                <TableHead>{t("admin.banners.table.dates")}</TableHead>
                <TableHead className="text-right">{t("admin.banners.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("admin.banners.noBanners")}
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>
                      <Badge className={getBannerTypeColor(banner.banner_type)}>
                        {t(`admin.banners.types.${banner.banner_type}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? t("admin.banners.active") : t("admin.banners.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(banner.start_date), "dd/MM/yyyy")}
                      {banner.end_date && ` - ${format(new Date(banner.end_date), "dd/MM/yyyy")}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(banner)}
                          title={banner.is_active ? t("admin.banners.deactivate") : t("admin.banners.activate")}
                        >
                          {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
