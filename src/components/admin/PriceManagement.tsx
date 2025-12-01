import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DollarSign, Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PriceSetting {
  id: string;
  plan_type: 'premium' | 'premium_plus';
  currency: 'brl' | 'usd';
  billing_period: 'monthly' | 'yearly';
  price: number;
  stripe_price_id: string;
  is_active: boolean;
  is_promotion: boolean;
  promotion_start_date: string | null;
  promotion_end_date: string | null;
  created_at: string;
}

export const PriceManagement = () => {
  const [prices, setPrices] = useState<PriceSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PriceSetting | null>(null);
  const [formData, setFormData] = useState<{
    plan_type: 'premium' | 'premium_plus';
    currency: 'brl' | 'usd';
    billing_period: 'monthly' | 'yearly';
    price: string;
    stripe_price_id: string;
    is_promotion: boolean;
    promotion_start_date: string;
    promotion_end_date: string;
  }>({
    plan_type: 'premium',
    currency: 'brl',
    billing_period: 'monthly',
    price: '',
    stripe_price_id: '',
    is_promotion: false,
    promotion_start_date: '',
    promotion_end_date: '',
  });

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('price_settings')
        .select('*')
        .order('plan_type', { ascending: true })
        .order('currency', { ascending: true })
        .order('billing_period', { ascending: true });

      if (error) throw error;
      setPrices((data || []) as PriceSetting[]);
    } catch (error) {
      console.error('Error loading prices:', error);
      toast.error('Erro ao carregar preços');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const priceData = {
        ...formData,
        price: parseFloat(formData.price),
        promotion_start_date: formData.is_promotion && formData.promotion_start_date 
          ? new Date(formData.promotion_start_date).toISOString() 
          : null,
        promotion_end_date: formData.is_promotion && formData.promotion_end_date 
          ? new Date(formData.promotion_end_date).toISOString() 
          : null,
      };

      if (editingPrice) {
        const { error } = await supabase
          .from('price_settings')
          .update(priceData)
          .eq('id', editingPrice.id);

        if (error) throw error;
        toast.success('Preço atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('price_settings')
          .insert([priceData]);

        if (error) throw error;
        toast.success('Preço criado com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingPrice(null);
      resetForm();
      loadPrices();
    } catch (error: any) {
      console.error('Error saving price:', error);
      toast.error(error.message || 'Erro ao salvar preço');
    }
  };

  const handleEdit = (price: PriceSetting) => {
    setEditingPrice(price);
    setFormData({
      plan_type: price.plan_type,
      currency: price.currency,
      billing_period: price.billing_period,
      price: price.price.toString(),
      stripe_price_id: price.stripe_price_id,
      is_promotion: price.is_promotion,
      promotion_start_date: price.promotion_start_date 
        ? new Date(price.promotion_start_date).toISOString().split('T')[0] 
        : '',
      promotion_end_date: price.promotion_end_date 
        ? new Date(price.promotion_end_date).toISOString().split('T')[0] 
        : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este preço?')) return;

    try {
      const { error } = await supabase
        .from('price_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Preço excluído com sucesso!');
      loadPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
      toast.error('Erro ao excluir preço');
    }
  };

  const toggleActive = async (price: PriceSetting) => {
    try {
      const { error } = await supabase
        .from('price_settings')
        .update({ is_active: !price.is_active })
        .eq('id', price.id);

      if (error) throw error;
      toast.success(`Preço ${!price.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      loadPrices();
    } catch (error) {
      console.error('Error toggling price:', error);
      toast.error('Erro ao alterar status do preço');
    }
  };

  const resetForm = () => {
    setFormData({
      plan_type: 'premium',
      currency: 'brl',
      billing_period: 'monthly',
      price: '',
      stripe_price_id: '',
      is_promotion: false,
      promotion_start_date: '',
      promotion_end_date: '',
    });
  };

  const getPlanLabel = (type: string) => {
    return type === 'premium' ? 'Premium' : 'Premium Plus';
  };

  const getCurrencyLabel = (currency: string) => {
    return currency === 'brl' ? 'R$' : '$';
  };

  const getBillingLabel = (period: string) => {
    return period === 'monthly' ? 'Mensal' : 'Anual';
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Gerenciamento de Preços
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure os preços dos planos e crie promoções temporárias
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPrice(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Preço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPrice ? 'Editar Preço' : 'Novo Preço'}
              </DialogTitle>
              <DialogDescription>
                {editingPrice 
                  ? 'Atualize as informações do preço' 
                  : 'Configure um novo preço para os planos'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select
                    value={formData.plan_type}
                    onValueChange={(value: any) => setFormData({ ...formData, plan_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="premium_plus">Premium Plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: any) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brl">BRL (R$)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select
                    value={formData.billing_period}
                    onValueChange={(value: any) => setFormData({ ...formData, billing_period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stripe Price ID</Label>
                <Input
                  required
                  value={formData.stripe_price_id}
                  onChange={(e) => setFormData({ ...formData, stripe_price_id: e.target.value })}
                  placeholder="price_xxxxxxxxxxxxx"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_promotion}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_promotion: checked })}
                />
                <Label>É uma promoção temporária</Label>
              </div>
              {formData.is_promotion && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início</Label>
                    <Input
                      type="date"
                      value={formData.promotion_start_date}
                      onChange={(e) => setFormData({ ...formData, promotion_start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Término</Label>
                    <Input
                      type="date"
                      value={formData.promotion_end_date}
                      onChange={(e) => setFormData({ ...formData, promotion_end_date: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPrice ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preços Configurados</CardTitle>
          <CardDescription>
            Lista de todos os preços cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Promoção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell className="font-medium">{getPlanLabel(price.plan_type)}</TableCell>
                  <TableCell>{price.currency.toUpperCase()}</TableCell>
                  <TableCell>{getBillingLabel(price.billing_period)}</TableCell>
                  <TableCell>
                    {getCurrencyLabel(price.currency)} {price.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{price.stripe_price_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={price.is_active}
                        onCheckedChange={() => toggleActive(price)}
                      />
                      <Badge variant={price.is_active ? "default" : "secondary"}>
                        {price.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {price.is_promotion ? (
                      <Badge variant="destructive">Promoção</Badge>
                    ) : (
                      <Badge variant="outline">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(price)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(price.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};