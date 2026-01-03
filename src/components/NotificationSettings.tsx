import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Moon, Heart, Lightbulb, Activity, Sparkles, Shirt, Palette, Brain, Utensils, Briefcase } from 'lucide-react';

interface NotificationPreferences {
  reminders: boolean;
  cycle_phase_changes: boolean;
  partner_updates: boolean;
  wellness_plans: boolean;
  predictions: boolean;
  feature_suggestions: boolean;
  beauty_tips: boolean;
  closet_suggestions: boolean;
  health_insights: boolean;
  nutrition_tips: boolean;
  work_balance: boolean;
}

export const NotificationSettings = () => {
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);

  const defaultPreferences: NotificationPreferences = {
    reminders: true,
    cycle_phase_changes: true,
    partner_updates: true,
    wellness_plans: true,
    predictions: true,
    feature_suggestions: true,
    beauty_tips: true,
    closet_suggestions: true,
    health_insights: true,
    nutrition_tips: true,
    work_balance: true
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

  const coreNotifications = [
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

  const featureSuggestions = [
    {
      key: 'feature_suggestions' as const,
      icon: Sparkles,
      title: 'Sugestões de Recursos',
      description: 'Dicas para explorar todas as funcionalidades do app'
    },
    {
      key: 'closet_suggestions' as const,
      icon: Shirt,
      title: 'Sugestões de Look',
      description: 'Ideias de looks do Armário Virtual nos finais de semana e eventos'
    },
    {
      key: 'beauty_tips' as const,
      icon: Palette,
      title: 'Dicas de Beleza',
      description: 'Lembretes sobre análise de beleza e maquiagem'
    },
    {
      key: 'health_insights' as const,
      icon: Brain,
      title: 'Insights de Saúde',
      description: 'Sugestões sobre análise de saúde e bem-estar'
    },
    {
      key: 'nutrition_tips' as const,
      icon: Utensils,
      title: 'Dicas de Nutrição',
      description: 'Lembretes sobre alimentação saudável para sua fase'
    },
    {
      key: 'work_balance' as const,
      icon: Briefcase,
      title: 'Equilíbrio Trabalho',
      description: 'Alertas sobre impacto do trabalho no seu bem-estar'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações Essenciais</CardTitle>
          <CardDescription>
            Alertas importantes sobre seu ciclo e bem-estar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {coreNotifications.map(({ key, icon: Icon, title, description }) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-luna-pink" />
            Sugestões Inteligentes
          </CardTitle>
          <CardDescription>
            Receba dicas para aproveitar ao máximo todos os recursos do Luna Glow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureSuggestions.map(({ key, icon: Icon, title, description }) => (
            <div key={key} className="flex items-start justify-between space-x-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-2 bg-gradient-to-br from-luna-pink/20 to-luna-purple/20 rounded-lg">
                  <Icon className="h-5 w-5 text-luna-pink" />
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
    </div>
  );
};
