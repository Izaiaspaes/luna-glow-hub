import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export const PushNotificationPrompt = () => {
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    requestPermission,
    unsubscribe
  } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  if (permission === 'denied') {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellOff className="h-5 w-5" />
            Notificações Bloqueadas
          </CardTitle>
          <CardDescription>
            Você bloqueou as notificações. Para receber alertas sobre lembretes e mudanças de fase do ciclo, ative as notificações nas configurações do navegador.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isSubscribed) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Notificações Ativadas
          </CardTitle>
          <CardDescription>
            Você receberá alertas sobre lembretes e mudanças de fase do ciclo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={unsubscribe}
            disabled={loading}
          >
            Desativar Notificações
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-luna-pink/10 to-luna-purple/10 border-luna-pink/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-luna-pink" />
          Ative as Notificações
        </CardTitle>
        <CardDescription>
          Receba alertas sobre:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Lembretes personalizados de rastreamento</li>
            <li>Mudanças de fase do ciclo menstrual</li>
            <li>Recomendações importantes da IA</li>
            <li>Atualizações do seu plano de bem-estar</li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={requestPermission}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-luna-pink to-luna-purple hover:opacity-90"
        >
          <Bell className="h-4 w-4 mr-2" />
          Ativar Notificações Push
        </Button>
      </CardContent>
    </Card>
  );
};