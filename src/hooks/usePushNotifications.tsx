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
      
      // Generate VAPID public key (base64url)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      
      function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Store subscription in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_data: subscription.toJSON() as any
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setState(prev => ({ ...prev, isSubscribed: true }));
      toast.success('Notificações push ativadas! 🔔');
    } catch (error: any) {
      console.error('Error subscribing to push:', error);
      
      // Better error messages
      let errorMessage = 'Erro ao ativar notificações push';
      if (error.name === 'NotSupportedError') {
        errorMessage = 'Seu navegador não suporta notificações push';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Permissão para notificações foi negada';
      } else if (error.message?.includes('not authenticated')) {
        errorMessage = 'Você precisa estar logada para ativar notificações';
      }
      
      toast.error(errorMessage);
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