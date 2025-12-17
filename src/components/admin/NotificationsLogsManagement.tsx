import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Bell, Search, RefreshCw, CheckCircle, XCircle, Clock, Download, Filter, Send, Users, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmailLog {
  id: string;
  user_id: string | null;
  email_to: string;
  email_type: string;
  subject: string;
  status: string;
  error_message: string | null;
  metadata: any;
  created_at: string;
}

interface PushSubscription {
  id: string;
  user_id: string;
  subscription_data: any;
  created_at: string;
  updated_at: string;
}

export function NotificationsLogsManagement() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [pushSubscriptions, setPushSubscriptions] = useState<PushSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [emailStats, setEmailStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    today: 0
  });
  const [pushStats, setPushStats] = useState({
    totalSubscriptions: 0,
    activeUsers: 0
  });

  // Push notification form state
  const [pushDialogOpen, setPushDialogOpen] = useState(false);
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [sendingPush, setSendingPush] = useState(false);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  const [resendingAllFailed, setResendingAllFailed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadEmailLogs(), loadPushSubscriptions()]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailLogs = async () => {
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Error loading email logs:", error);
      toast.error("Erro ao carregar logs de email");
      return;
    }

    setEmailLogs(data || []);
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total: data?.length || 0,
      sent: data?.filter(log => log.status === 'sent').length || 0,
      failed: data?.filter(log => log.status === 'failed').length || 0,
      today: data?.filter(log => log.created_at.startsWith(today)).length || 0
    };
    setEmailStats(stats);
  };

  const loadPushSubscriptions = async () => {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading push subscriptions:", error);
      return;
    }

    setPushSubscriptions(data || []);
    
    // Get unique users
    const uniqueUsers = new Set(data?.map(sub => sub.user_id));
    setPushStats({
      totalSubscriptions: data?.length || 0,
      activeUsers: uniqueUsers.size
    });
  };

  const getEmailTypes = () => {
    const types = [...new Set(emailLogs.map(log => log.email_type))];
    return types;
  };

  const filteredEmailLogs = emailLogs.filter(log => {
    const matchesSearch = 
      log.email_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.email_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Falhou
          </Badge>
        );
      case "no_subscriptions":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Bell className="w-3 h-3 mr-1" />
            Sem Inscritos
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const getEmailTypeBadge = (type: string) => {
    const typeLabels: Record<string, { label: string; color: string }> = {
      subscription_confirmation: { label: "Confirmação de Assinatura", color: "bg-purple-500/20 text-purple-400" },
      reengagement: { label: "Reengajamento", color: "bg-blue-500/20 text-blue-400" },
      inactivity_reminder: { label: "Lembrete de Inatividade", color: "bg-orange-500/20 text-orange-400" },
      upgrade_campaign: { label: "Campanha de Upgrade", color: "bg-pink-500/20 text-pink-400" },
      partner_invite: { label: "Convite de Parceiro", color: "bg-cyan-500/20 text-cyan-400" },
      newsletter_confirmation: { label: "Confirmação Newsletter", color: "bg-green-500/20 text-green-400" },
      push_notification: { label: "Push Notification", color: "bg-violet-500/20 text-violet-400" },
      no_subscriptions: { label: "Sem Inscritos", color: "bg-yellow-500/20 text-yellow-400" },
    };
    
    const config = typeLabels[type] || { label: type, color: "bg-gray-500/20 text-gray-400" };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ["Data", "Email", "Tipo", "Assunto", "Status", "Erro"];
    const rows = filteredEmailLogs.map(log => [
      format(new Date(log.created_at), "dd/MM/yyyy HH:mm"),
      log.email_to,
      log.email_type,
      log.subject,
      log.status,
      log.error_message || ""
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `email-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("CSV exportado com sucesso!");
  };

  const handleSendPushNotification = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      toast.error("Preencha o título e a mensagem da notificação");
      return;
    }

    if (!sendToAll && selectedUserIds.length === 0) {
      toast.error("Selecione pelo menos um usuário para enviar");
      return;
    }

    setSendingPush(true);
    try {
      const payload: any = {
        title: pushTitle,
        body: pushBody,
        icon: '/pwa-192x192.png',
        badge: '/favicon.png',
        data: {
          type: 'admin_broadcast',
          timestamp: new Date().toISOString()
        }
      };

      if (!sendToAll) {
        payload.userIds = selectedUserIds;
      }

      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: payload
      });

      if (error) throw error;

      toast.success(`Push enviado! ${data?.message || ''}`);
      setPushDialogOpen(false);
      setPushTitle("");
      setPushBody("");
      setSelectedUserIds([]);
      setSendToAll(true);
    } catch (error: any) {
      console.error('Error sending push:', error);
      toast.error(`Erro ao enviar push: ${error.message}`);
    } finally {
      setSendingPush(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    const uniqueUserIds = [...new Set(pushSubscriptions.map(sub => sub.user_id))];
    setSelectedUserIds(uniqueUserIds);
  };

  const deselectAllUsers = () => {
    setSelectedUserIds([]);
  };

  const handleResendEmail = async (emailLog: EmailLog) => {
    setResendingEmailId(emailLog.id);
    try {
      const { data, error } = await supabase.functions.invoke('resend-email', {
        body: { emailLogId: emailLog.id }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(data.message || "Email reenviado com sucesso!");
        loadEmailLogs();
      } else {
        const errorMsg = typeof data?.error === 'object' 
          ? JSON.stringify(data.error) 
          : (data?.error || "Erro desconhecido");
        toast.error(`Falha ao reenviar: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('Error resending email:', error);
      const errorMsg = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      toast.error(`Erro ao reenviar email: ${errorMsg}`);
    } finally {
      setResendingEmailId(null);
    }
  };

  const handleResendAllFailed = async () => {
    const failedEmails = filteredEmailLogs.filter(log => log.status === "failed");
    if (failedEmails.length === 0) {
      toast.info("Nenhum email falhado para reenviar");
      return;
    }

    setResendingAllFailed(true);
    let successCount = 0;
    let failCount = 0;

    for (const emailLog of failedEmails) {
      try {
        const { data, error } = await supabase.functions.invoke('resend-email', {
          body: { emailLogId: emailLog.id }
        });

        if (error || !data?.success) {
          failCount++;
        } else {
          successCount++;
        }
      } catch {
        failCount++;
      }
    }

    setResendingAllFailed(false);
    loadEmailLogs();

    if (successCount > 0 && failCount === 0) {
      toast.success(`${successCount} email(s) reenviado(s) com sucesso!`);
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(`${successCount} sucesso(s), ${failCount} falha(s)`);
    } else {
      toast.error(`Todos os ${failCount} reenvios falharam`);
    }
  };

  const uniqueSubscribedUsers = [...new Set(pushSubscriptions.map(sub => sub.user_id))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emailStats.total}</p>
                <p className="text-xs text-muted-foreground">Total de Emails</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emailStats.sent}</p>
                <p className="text-xs text-muted-foreground">Enviados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emailStats.failed}</p>
                <p className="text-xs text-muted-foreground">Falharam</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pushStats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Push Inscritos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emails" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Logs de Email
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Push Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Histórico de Emails
                  </CardTitle>
                  <CardDescription>
                    Visualize todos os emails enviados pelo sistema
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                  {emailStats.failed > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResendAllFailed} 
                      disabled={resendingAllFailed}
                      className="text-orange-400 border-orange-400/50 hover:bg-orange-400/10"
                    >
                      <RotateCcw className={`w-4 h-4 mr-2 ${resendingAllFailed ? 'animate-spin' : ''}`} />
                      {resendingAllFailed ? 'Reenviando...' : `Reenviar ${emailStats.failed} Falhados`}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por email, assunto ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="sent">Enviados</SelectItem>
                    <SelectItem value="failed">Falharam</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {getEmailTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border border-border/50 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Destinatário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Erro</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmailLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum log de email encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmailLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={log.email_to}>
                            {log.email_to}
                          </TableCell>
                          <TableCell>{getEmailTypeBadge(log.email_type)}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={log.subject}>
                            {log.subject}
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="max-w-[150px] truncate text-red-400" title={log.error_message || ""}>
                            {log.error_message || "-"}
                          </TableCell>
                          <TableCell>
                            {log.status === "failed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResendEmail(log)}
                                disabled={resendingEmailId === log.id || resendingAllFailed}
                                className="h-8 w-8 p-0"
                                title="Reenviar email"
                              >
                                <RotateCcw className={`w-4 h-4 ${resendingEmailId === log.id ? 'animate-spin' : ''}`} />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Mostrando {filteredEmailLogs.length} de {emailLogs.length} registros
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="push" className="space-y-4">
          {/* Warning if no subscriptions */}
          {pushStats.activeUsers === 0 && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Bell className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400">Nenhum usuário inscrito para push</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Para receber push notifications, os usuários precisam ativar as notificações no navegador/PWA. 
                      Quando um usuário acessa o app e permite notificações, a inscrição aparecerá aqui automaticamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Send Push Card */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar Push Notification
              </CardTitle>
              <CardDescription>
                {pushStats.activeUsers > 0 
                  ? `Envie notificações push para ${pushStats.activeUsers} usuário(s) inscrito(s)`
                  : 'Nenhum usuário inscrito ainda'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={pushDialogOpen} onOpenChange={setPushDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={pushStats.activeUsers === 0}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {pushStats.activeUsers === 0 ? 'Aguardando Inscrições' : 'Nova Notificação Push'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Enviar Push Notification
                    </DialogTitle>
                    <DialogDescription>
                      Configure e envie uma notificação push para os usuários
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="push-title">Título da Notificação</Label>
                      <Input
                        id="push-title"
                        placeholder="Ex: Nova funcionalidade disponível!"
                        value={pushTitle}
                        onChange={(e) => setPushTitle(e.target.value)}
                        maxLength={50}
                      />
                      <p className="text-xs text-muted-foreground">{pushTitle.length}/50 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="push-body">Mensagem</Label>
                      <Textarea
                        id="push-body"
                        placeholder="Ex: Confira as novidades que preparamos para você!"
                        value={pushBody}
                        onChange={(e) => setPushBody(e.target.value)}
                        rows={3}
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">{pushBody.length}/200 caracteres</p>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="send-all"
                          checked={sendToAll}
                          onCheckedChange={(checked) => {
                            setSendToAll(!!checked);
                            if (checked) setSelectedUserIds([]);
                          }}
                        />
                        <Label htmlFor="send-all" className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Enviar para todos os {pushStats.activeUsers} usuários inscritos
                        </Label>
                      </div>

                      {!sendToAll && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Selecionar Usuários</Label>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={selectAllUsers}>
                                Selecionar todos
                              </Button>
                              <Button variant="outline" size="sm" onClick={deselectAllUsers}>
                                Limpar
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedUserIds.length} de {uniqueSubscribedUsers.length} usuários selecionados
                          </p>
                          <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-2">
                            {uniqueSubscribedUsers.map((userId) => (
                              <div key={userId} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-${userId}`}
                                  checked={selectedUserIds.includes(userId)}
                                  onCheckedChange={() => toggleUserSelection(userId)}
                                />
                                <Label htmlFor={`user-${userId}`} className="font-mono text-xs cursor-pointer">
                                  {userId.substring(0, 8)}...{userId.substring(userId.length - 4)}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    {pushTitle && pushBody && (
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-2">Prévia da notificação:</p>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{pushTitle}</p>
                            <p className="text-sm text-muted-foreground">{pushBody}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPushDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSendPushNotification} 
                      disabled={sendingPush || !pushTitle.trim() || !pushBody.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {sendingPush ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Notificação
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Subscriptions Card */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Inscrições Push Notifications
                  </CardTitle>
                  <CardDescription>
                    Usuários inscritos para receber notificações push
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{pushStats.totalSubscriptions}</p>
                        <p className="text-sm text-muted-foreground">Total de Inscrições</p>
                      </div>
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{pushStats.activeUsers}</p>
                        <p className="text-sm text-muted-foreground">Usuários Únicos</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border border-border/50 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Data de Inscrição</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead>Endpoint</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pushSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhuma inscrição de push encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      pushSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-mono text-xs">
                            {sub.user_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {format(new Date(sub.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {sub.updated_at ? format(new Date(sub.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate text-xs font-mono">
                            {(sub.subscription_data as any)?.endpoint?.substring(0, 50) || "-"}...
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
