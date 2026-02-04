import { useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Users, Bell, UserPlus, Wallet, Gift, Megaphone, 
  MessageSquareQuote, Newspaper, FileText, Ticket, Lightbulb, 
  DollarSign, Percent, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TabCategory {
  name: string;
  tabs: {
    value: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const tabCategories: TabCategory[] = [
  {
    name: "📊 Visão Geral",
    tabs: [
      { value: "statistics", label: "Estatísticas", icon: <BarChart3 className="w-4 h-4" /> },
      { value: "users", label: "Usuários", icon: <Users className="w-4 h-4" /> },
      { value: "notifications", label: "Notificações", icon: <Bell className="w-4 h-4" /> },
    ],
  },
  {
    name: "💰 Financeiro",
    tabs: [
      { value: "referrals", label: "Indicações", icon: <UserPlus className="w-4 h-4" /> },
      { value: "withdrawals", label: "Saques", icon: <Wallet className="w-4 h-4" /> },
      { value: "commission", label: "Comissão", icon: <Percent className="w-4 h-4" /> },
      { value: "prices", label: "Preços", icon: <DollarSign className="w-4 h-4" /> },
      { value: "coupons", label: "Cupons", icon: <Ticket className="w-4 h-4" /> },
    ],
  },
  {
    name: "📝 Conteúdo",
    tabs: [
      { value: "banners", label: "Banners", icon: <Megaphone className="w-4 h-4" /> },
      { value: "testimonials", label: "Testemunhos", icon: <MessageSquareQuote className="w-4 h-4" /> },
      { value: "newsletter", label: "Newsletter", icon: <Newspaper className="w-4 h-4" /> },
      { value: "suggestions", label: "Sugestões", icon: <Lightbulb className="w-4 h-4" /> },
    ],
  },
  {
    name: "⚙️ Configurações",
    tabs: [
      { value: "plans", label: "Pacotes", icon: <FileText className="w-4 h-4" /> },
      { value: "trials", label: "Trials", icon: <Gift className="w-4 h-4" /> },
    ],
  },
];

export const AdminTabsNavigation = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(
    tabCategories.map(c => c.name)
  );

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="space-y-2">
      {/* Mobile: Collapsible categories */}
      <div className="md:hidden space-y-2">
        {tabCategories.map((category) => (
          <Collapsible
            key={category.name}
            open={openCategories.includes(category.name)}
            onOpenChange={() => toggleCategory(category.name)}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-sm font-medium bg-muted/50 hover:bg-muted"
              >
                {category.name}
                {openCategories.includes(category.name) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent">
                {category.tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="flex items-center gap-2 px-3 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Desktop: Grid layout with categories */}
      <div className="hidden md:block space-y-4">
        {tabCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              {category.name}
            </h3>
            <TabsList className="inline-flex h-auto flex-wrap gap-1 bg-muted/30 p-1">
              {category.tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        ))}
      </div>
    </div>
  );
};
