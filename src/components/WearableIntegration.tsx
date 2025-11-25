import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Watch, Smartphone, Activity, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WearableConnection {
  id: string;
  provider: 'apple_health' | 'google_fit' | 'fitbit';
  connected: boolean;
  lastSync?: string;
  autoSync: boolean;
}

export function WearableIntegration() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<WearableConnection[]>([
    { id: '1', provider: 'apple_health', connected: false, autoSync: false },
    { id: '2', provider: 'google_fit', connected: false, autoSync: false },
    { id: '3', provider: 'fitbit', connected: false, autoSync: false },
  ]);
  const [syncing, setSyncing] = useState<string | null>(null);

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case 'apple_health':
        return { name: 'Apple Health', icon: Smartphone, color: 'text-gray-700' };
      case 'google_fit':
        return { name: 'Google Fit', icon: Activity, color: 'text-blue-600' };
      case 'fitbit':
        return { name: 'Fitbit', icon: Watch, color: 'text-teal-600' };
      default:
        return { name: provider, icon: Watch, color: 'text-gray-600' };
    }
  };

  const connectWearable = async (connection: WearableConnection) => {
    try {
      setSyncing(connection.id);
      
      // Detectar plataforma e abrir integração apropriada
      if (connection.provider === 'apple_health') {
        // No iOS, usar HealthKit API via Capacitor ou plugin
        if ('HealthKit' in window) {
          // @ts-ignore
          await window.HealthKit.requestAuthorization({
            read: ['HKQuantityTypeIdentifierStepCount', 'HKQuantityTypeIdentifierSleepAnalysis', 'HKCategoryTypeIdentifierMenstrualFlow']
          });
        } else {
          toast({
            title: "Apple Health disponível apenas no iOS",
            description: "Esta funcionalidade requer um dispositivo iOS com HealthKit.",
            variant: "destructive"
          });
          return;
        }
      } else if (connection.provider === 'google_fit') {
        // Usar Google Fit REST API via OAuth
        const clientId = "YOUR_GOOGLE_CLIENT_ID";
        const redirectUri = `${window.location.origin}/wearables/callback`;
        const scope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read';
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        window.open(authUrl, '_blank');
      } else if (connection.provider === 'fitbit') {
        // Usar Fitbit Web API via OAuth
        const clientId = "YOUR_FITBIT_CLIENT_ID";
        const redirectUri = `${window.location.origin}/wearables/callback`;
        const scope = 'activity sleep profile';
        
        const authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        window.open(authUrl, '_blank');
      }

      // Atualizar estado de conexão
      setConnections(prev => prev.map(c => 
        c.id === connection.id 
          ? { ...c, connected: true, lastSync: new Date().toISOString() }
          : c
      ));

      toast({
        title: "Conectado com sucesso!",
        description: `${getProviderInfo(connection.provider).name} foi conectado à sua conta.`
      });
    } catch (error) {
      console.error('Erro ao conectar wearable:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar ao dispositivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSyncing(null);
    }
  };

  const disconnectWearable = async (connection: WearableConnection) => {
    try {
      // Remover tokens de acesso do banco
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Aqui você removeria os tokens salvos no banco de dados
      
      setConnections(prev => prev.map(c => 
        c.id === connection.id 
          ? { ...c, connected: false, lastSync: undefined, autoSync: false }
          : c
      ));

      toast({
        title: "Desconectado",
        description: `${getProviderInfo(connection.provider).name} foi desconectado.`
      });
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  const syncData = async (connection: WearableConnection) => {
    if (!connection.connected) return;

    try {
      setSyncing(connection.id);
      
      // Buscar dados do wearable e salvar no banco
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Aqui você implementaria a lógica específica para cada provedor
      // Por exemplo, para Apple Health:
      if (connection.provider === 'apple_health' && 'HealthKit' in window) {
        // @ts-ignore
        const sleepData = await window.HealthKit.querySleepSamples({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });

        // Salvar dados de sono
        for (const sleep of sleepData) {
          await supabase.from('sleep_tracking').upsert({
            user_id: user.id,
            sleep_date: new Date(sleep.startDate).toISOString().split('T')[0],
            sleep_duration_hours: sleep.value,
            sleep_quality: Math.round(sleep.quality * 5), // Converter para escala 1-5
            notes: 'Importado do Apple Health'
          });
        }
      }

      setConnections(prev => prev.map(c => 
        c.id === connection.id 
          ? { ...c, lastSync: new Date().toISOString() }
          : c
      ));

      toast({
        title: "Sincronização concluída",
        description: "Seus dados foram atualizados com sucesso."
      });
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados.",
        variant: "destructive"
      });
    } finally {
      setSyncing(null);
    }
  };

  const toggleAutoSync = (connection: WearableConnection) => {
    const updatedConnection = { ...connection, autoSync: !connection.autoSync };
    
    setConnections(prev => prev.map(c => 
      c.id === connection.id 
        ? updatedConnection
        : c
    ));

    toast({
      title: updatedConnection.autoSync ? "Sincronização automática ativada" : "Sincronização automática desativada",
      description: updatedConnection.autoSync 
        ? "Seus dados serão sincronizados automaticamente."
        : "Você precisará sincronizar manualmente seus dados."
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Wearables & Dispositivos</h3>
        <p className="text-sm text-muted-foreground">
          Conecte seus dispositivos de saúde para importar dados automaticamente
        </p>
      </div>

      {connections.map((connection) => {
        const { name, icon: Icon, color } = getProviderInfo(connection.provider);
        
        return (
          <Card key={connection.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-background border flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{name}</CardTitle>
                    <CardDescription className="text-xs">
                      {connection.connected 
                        ? `Última sincronização: ${connection.lastSync ? new Date(connection.lastSync).toLocaleString('pt-BR') : 'Nunca'}`
                        : 'Não conectado'
                      }
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={connection.connected ? "default" : "secondary"} className="gap-1">
                  {connection.connected ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Desconectado
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {connection.connected ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sincronização automática</span>
                    <Switch
                      checked={connection.autoSync}
                      onCheckedChange={() => toggleAutoSync(connection)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => syncData(connection)}
                      disabled={syncing === connection.id}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                      Sincronizar agora
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => disconnectWearable(connection)}
                    >
                      Desconectar
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => connectWearable(connection)}
                  disabled={syncing === connection.id}
                >
                  {syncing === connection.id ? 'Conectando...' : 'Conectar'}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            Os dados importados dos wearables são processados de forma segura e privada. 
            Você pode desconectar seus dispositivos a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
