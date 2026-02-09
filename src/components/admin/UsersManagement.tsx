import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Trash2, CheckCircle, Search, X, Ban, UserCheck, Calendar, Link2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Globe, HeartHandshake } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface RegistrationSource {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referral_code?: string;
}

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  roles: { role: string }[];
  subscription_plan?: string | null;
  is_active?: boolean;
  registration_source?: RegistrationSource | null;
  last_accessed_at?: string | null;
  country?: string | null;
  isPartner?: boolean;
  partnerOwnerEmail?: string | null;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

type SortField = 'full_name' | 'email' | 'created_at' | 'last_accessed_at' | 'subscription_plan' | 'is_active';
type SortDirection = 'asc' | 'desc';

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [partnerFilter, setPartnerFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [partnerUserIds, setPartnerUserIds] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    loadUsers();
    loadPartnerRelationships();
  }, []);

  const loadPartnerRelationships = async () => {
    // Load all partner relationships to identify which users are partners
    const { data: relationships, error } = await supabase
      .from('partner_relationships')
      .select('partner_user_id, owner_user_id, partner_email, status')
      .eq('status', 'accepted')
      .not('partner_user_id', 'is', null);

    if (error) {
      console.error('Error loading partner relationships:', error);
      return;
    }

    // Create a map of partner_user_id -> owner email (we'll need to fetch owner emails)
    const partnerMap = new Map<string, string>();
    
    if (relationships && relationships.length > 0) {
      // Get owner user IDs
      const ownerIds = [...new Set(relationships.map(r => r.owner_user_id))];
      
      // Fetch owner profiles to get their emails/names
      const { data: ownerProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', ownerIds);
      
      const ownerNameMap = new Map(ownerProfiles?.map(p => [p.user_id, p.full_name || 'Usuária']) || []);
      
      relationships.forEach(rel => {
        if (rel.partner_user_id) {
          partnerMap.set(rel.partner_user_id, ownerNameMap.get(rel.owner_user_id) || 'Usuária');
        }
      });
    }

    setPartnerUserIds(partnerMap);
  };

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
      user_id: user.id,
      email: user.email || 'N/A',
      full_name: user.full_name,
      phone: user.phone,
      created_at: user.created_at,
      roles: (user.roles || []).map((r: string) => ({ role: r })),
      subscription_plan: user.subscription_plan || 'free',
      is_active: user.is_active ?? true,
      registration_source: user.registration_source || null,
      last_accessed_at: user.last_accessed_at || null,
      country: user.nationality || null,
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

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !roleFilter || user.roles.some(r => r.role === roleFilter);
      
      const matchesStatus = statusFilter === null || (user.is_active ?? true) === statusFilter;
      
      const isPartner = partnerUserIds.has(user.user_id);
      const matchesPartner = partnerFilter === null || isPartner === partnerFilter;
      
      return matchesSearch && matchesRole && matchesStatus && matchesPartner;
    });

    // Sort the filtered users
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'full_name':
          aValue = a.full_name?.toLowerCase() || '';
          bValue = b.full_name?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_accessed_at':
          aValue = a.last_accessed_at ? new Date(a.last_accessed_at).getTime() : 0;
          bValue = b.last_accessed_at ? new Date(b.last_accessed_at).getTime() : 0;
          break;
        case 'subscription_plan':
          aValue = a.subscription_plan || '';
          bValue = b.subscription_plan || '';
          break;
        case 'is_active':
          aValue = a.is_active ?? true ? 1 : 0;
          bValue = b.is_active ?? true ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, roleFilter, statusFilter, partnerFilter, partnerUserIds, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, startIndex, endIndex]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1" /> 
      : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, partnerFilter, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter(null);
    setStatusFilter(null);
    setPartnerFilter(null);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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
            
            <div className="flex gap-2 flex-wrap">
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
            
            {/* Partner filter - Luna a Dois */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={partnerFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setPartnerFilter(null)}
              >
                Todos Tipos
              </Button>
              <Button
                variant={partnerFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => setPartnerFilter(true)}
                className="gap-1"
              >
                <HeartHandshake className="w-3 h-3" />
                Parceiros Luna a Dois ({partnerUserIds.size})
              </Button>
              <Button
                variant={partnerFilter === false ? "default" : "outline"}
                size="sm"
                onClick={() => setPartnerFilter(false)}
              >
                Usuárias Regulares
              </Button>
            </div>
          </div>

          {loadingUsers ? (
            <p className="text-muted-foreground">Carregando usuários...</p>
          ) : filteredAndSortedUsers.length === 0 ? (
            <p className="text-muted-foreground">
              {users.length === 0 ? "Nenhum usuário encontrado" : "Nenhum usuário corresponde aos filtros"}
            </p>
          ) : (
            <>
              {/* Pagination Info & Items Per Page */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 text-sm">
                <p className="text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedUsers.length)} de {filteredAndSortedUsers.length} usuários
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Itens por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Desktop Table - hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('full_name')}
                      >
                        <span className="flex items-center">
                          Nome
                          <SortIcon field="full_name" />
                        </span>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('email')}
                      >
                        <span className="flex items-center">
                          E-mail
                          <SortIcon field="email" />
                        </span>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('created_at')}
                      >
                        <span className="flex items-center">
                          Cadastro
                          <SortIcon field="created_at" />
                        </span>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('last_accessed_at')}
                      >
                        <span className="flex items-center">
                          Última Atividade
                          <SortIcon field="last_accessed_at" />
                        </span>
                      </TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('subscription_plan')}
                      >
                        <span className="flex items-center">
                          Pacote
                          <SortIcon field="subscription_plan" />
                        </span>
                      </TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('is_active')}
                      >
                        <span className="flex items-center">
                          Status
                          <SortIcon field="is_active" />
                        </span>
                      </TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {paginatedUsers.map((user) => {
                      const isAdmin = user.roles.some(r => r.role === 'admin');
                      const isModerator = user.roles.some(r => r.role === 'moderator');
                      const isUser = user.roles.some(r => r.role === 'user');
                      const isActive = user.is_active ?? true;
                      const isPartner = partnerUserIds.has(user.user_id);
                      const partnerOwnerName = partnerUserIds.get(user.user_id);
                      
                        return (
                          <TableRow key={user.user_id} className={!isActive ? "opacity-60" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {user.full_name || 'Não informado'}
                                {isPartner && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="secondary" className="text-xs gap-1 bg-primary/10 text-primary">
                                          <HeartHandshake className="w-3 h-3" />
                                          Parceiro
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Parceiro Luna a Dois de: {partnerOwnerName}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center gap-1 text-sm">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {format(new Date(user.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {user.last_accessed_at ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1 text-sm">
                                      <Calendar className="w-3 h-3 text-muted-foreground" />
                                      {format(new Date(user.last_accessed_at), "dd/MM/yyyy", { locale: ptBR })}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {format(new Date(user.last_accessed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-muted-foreground text-sm">Nunca</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.registration_source ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Link2 className="w-3 h-3" />
                                        {user.registration_source.utm_source || 
                                         user.registration_source.referral_code || 
                                         'Direto'}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="text-xs space-y-1">
                                        {user.registration_source.utm_source && (
                                          <p><strong>Source:</strong> {user.registration_source.utm_source}</p>
                                        )}
                                        {user.registration_source.utm_medium && (
                                          <p><strong>Medium:</strong> {user.registration_source.utm_medium}</p>
                                        )}
                                        {user.registration_source.utm_campaign && (
                                          <p><strong>Campaign:</strong> {user.registration_source.utm_campaign}</p>
                                        )}
                                        {user.registration_source.referral_code && (
                                          <p><strong>Referral:</strong> {user.registration_source.referral_code}</p>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-muted-foreground text-sm">Direto</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.country ? (
                                <span className="flex items-center gap-1 text-sm">
                                  <Globe className="w-3 h-3 text-muted-foreground" />
                                  {user.country}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
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
              </div>

              {/* Mobile Cards - visible only on mobile/tablet */}
              <div className="lg:hidden space-y-4">
                {paginatedUsers.map((user) => {
                  const isAdmin = user.roles.some(r => r.role === 'admin');
                  const isModerator = user.roles.some(r => r.role === 'moderator');
                  const isUser = user.roles.some(r => r.role === 'user');
                  const isActive = user.is_active ?? true;
                  const isPartner = partnerUserIds.has(user.user_id);
                  const partnerOwnerName = partnerUserIds.get(user.user_id);

                  return (
                    <Card key={user.user_id} className={`${!isActive ? "opacity-60" : ""}`}>
                      <CardContent className="p-4 space-y-3">
                        {/* Header: Name, Status and Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-base truncate">{user.full_name || 'Não informado'}</p>
                              {isPartner && (
                                <Badge variant="secondary" className="text-xs gap-1 bg-primary/10 text-primary">
                                  <HeartHandshake className="w-3 h-3" />
                                  Parceiro
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            {isPartner && partnerOwnerName && (
                              <p className="text-xs text-muted-foreground">Luna a Dois de: {partnerOwnerName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isActive ? (
                              <Badge variant="default" className="bg-green-600 dark:bg-green-500 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />Ativo
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                <Ban className="w-3 h-3 mr-1" />Inativo
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Cadastro:</span>
                            <p className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {format(new Date(user.created_at), "dd/MM/yy", { locale: ptBR })}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Última atividade:</span>
                            <p className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {user.last_accessed_at 
                                ? format(new Date(user.last_accessed_at), "dd/MM/yy", { locale: ptBR })
                                : 'Nunca'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">País:</span>
                            <p className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-muted-foreground" />
                              {user.country || '-'}
                            </p>
                          </div>
                        </div>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-1">
                          {isAdmin && <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                          {isModerator && <Badge variant="secondary" className="text-xs"><User className="w-3 h-3 mr-1" />Mod</Badge>}
                          {isUser && <Badge variant="outline" className="text-xs"><User className="w-3 h-3 mr-1" />User</Badge>}
                          {user.registration_source && (
                            <Badge variant="outline" className="text-xs">
                              <Link2 className="w-3 h-3 mr-1" />
                              {user.registration_source.utm_source || user.registration_source.referral_code || 'Direto'}
                            </Badge>
                          )}
                        </div>

                        {/* Plan Selector */}
                        <div>
                          <span className="text-sm text-muted-foreground mb-1 block">Pacote:</span>
                          <Select
                            value={user.subscription_plan || 'free'}
                            onValueChange={(value) => handleChangePlan(user.user_id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="premium">✨ Premium</SelectItem>
                              <SelectItem value="premium_plus">💎 Premium Plus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant={isAdmin ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.user_id, 'admin')}
                            className="flex-1 min-w-[100px] text-xs"
                          >
                            {isAdmin ? 'Rem.' : '+'} Admin
                          </Button>
                          <Button
                            size="sm"
                            variant={isModerator ? "destructive" : "outline"}
                            onClick={() => handleToggleRole(user.user_id, 'moderator')}
                            className="flex-1 min-w-[100px] text-xs"
                          >
                            {isModerator ? 'Rem.' : '+'} Mod
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Anterior</span>
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                          <Button
                            key={index}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ) : (
                          <span key={index} className="px-2 text-muted-foreground">
                            {page}
                          </span>
                        )
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Próximo</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
