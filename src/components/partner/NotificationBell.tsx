import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  phase: string;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    setupRealtimeSubscription();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get partner relationship
      const { data: relationship } = await supabase
        .from("partner_relationships")
        .select("id")
        .eq("partner_user_id", user.id)
        .eq("status", "accepted")
        .single();

      if (!relationship) return;

      // Get notifications
      const { data: notifs } = await supabase
        .from("partner_notifications")
        .select("*")
        .eq("relationship_id", relationship.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (notifs) {
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("partner-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "partner_notifications",
        },
        (payload) => {
          console.log("New notification:", payload);
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from("partner_notifications")
        .update({ read: true })
        .eq("id", id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: relationship } = await supabase
        .from("partner_relationships")
        .select("id")
        .eq("partner_user_id", user.id)
        .eq("status", "accepted")
        .single();

      if (!relationship) return;

      await supabase
        .from("partner_notifications")
        .update({ read: true })
        .eq("relationship_id", relationship.id)
        .eq("read", false);

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getPhaseEmoji = (phase: string) => {
    const emojis: Record<string, string> = {
      menstrual: "🩸",
      folicular: "🌱",
      ovulatoria: "✨",
      lutea: "🌙",
    };
    return emojis[phase] || "📌";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma notificação ainda
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.read
                        ? "bg-background"
                        : "bg-primary/5 border-primary/20"
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">
                        {getPhaseEmoji(notification.phase)}
                      </span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), "dd/MM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
