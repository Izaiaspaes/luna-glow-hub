import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Moon, Heart, Lightbulb, Activity } from 'lucide-react';

interface NotificationPreferences {
  reminders: boolean;
  cycle_phase_changes: boolean;
  partner_updates: boolean;
  wellness_plans: boolean;
  predictions: boolean;
}

export const NotificationSettings = () => {
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);

  const defaultPreferences: NotificationPreferences = {
    reminders: true,
    cycle_phase_changes: true,
    partner_updates: true,
    wellness_plans: true,
    predictions: true
  };

  // Type assertion to handle notification_preferences which is not yet in types
  const profileData = profile as any;
  const preferences = (profileData?.notification_preferences as NotificationPreferences) || defaultPreferences;

  const handleToggle = async (key: keyof NotificationPreferences) => {
    if (!profile) return;

    setLoading(true);
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key]
      };

      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: updatedPreferences })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast.success('Preferências atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Erro ao atualizar preferências');
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'reminders' as const,
      icon: Bell,
      title: 'Lembretes de Rastreamento',
      description: 'Notificações para registrar sono, humor, energia e ciclo'
    },
    {
      key: 'cycle_phase_changes' as const,
      icon: Moon,
      title: 'Mudanças de Fase do Ciclo',
      description: 'Alertas quando sua fase do ciclo mudar (TPM, ovulação, etc.)'
    },
    {
      key: 'partner_updates' as const,
      icon: Heart,
      title: 'Atualizações do Parceiro',
      description: 'Notificações relacionadas ao Luna a Dois'
    },
    {
      key: 'wellness_plans' as const,
      icon: Lightbulb,
      title: 'Planos de Bem-Estar',
      description: 'Quando novos planos personalizados forem gerados'
    },
    {
      key: 'predictions' as const,
      icon: Activity,
      title: 'Previsões de Sintomas',
      description: 'Alertas sobre sintomas previstos pela IA'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
        <CardDescription>
          Escolha quais tipos de alertas você deseja receber
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationTypes.map(({ key, icon: Icon, title, description }) => (
          <div key={key} className="flex items-start justify-between space-x-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor={key} className="text-base font-medium cursor-pointer">
                  {title}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            <Switch
              id={key}
              checked={preferences[key]}
              onCheckedChange={() => handleToggle(key)}
              disabled={loading}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
