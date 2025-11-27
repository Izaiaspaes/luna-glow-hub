import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported');
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const permission = await Notification.permission;
    setState(prev => ({ ...prev, permission }));

    // Check if already subscribed
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    setState(prev => ({ ...prev, isSubscribed: !!subscription }));
  };

  const requestPermission = async () => {
    if (!state.isSupported) {
      toast.error('Notificações push não são suportadas neste navegador');
      return false;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        await subscribe();
        return true;
      } else {
        toast.error('Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Erro ao solicitar permissão para notificações');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    if (!state.isSupported) return;

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Simple subscription without VAPID for now
      // In production, you would configure VAPID keys
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true
      });

      // Store subscription in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          subscription_data: subscription.toJSON() as any
        });

      if (error) throw error;

      setState(prev => ({ ...prev, isSubscribed: true }));
      toast.success('Notificações push ativadas com sucesso!');
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast.error('Erro ao ativar notificações push');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);
      }

      setState(prev => ({ ...prev, isSubscribed: false }));
      toast.success('Notificações push desativadas');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Erro ao desativar notificações push');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...state,
    loading,
    requestPermission,
    subscribe,
    unsubscribe
  };
};