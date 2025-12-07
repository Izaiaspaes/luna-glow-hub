import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Sparkles, Trash2, Shirt, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClosetItem {
  id: string;
  photo_url: string;
  item_type: string;
  category: string;
  colors: string[];
  season: string[];
  occasion: string[];
  ai_description: string;
  ai_tags: string[];
  created_at: string;
}

interface OutfitSuggestion {
  id: string;
  item_ids: string[];
  outfit_name: string;
  occasion: string;
  season: string;
  ai_description: string;
  ai_styling_tips: string;
  created_at: string;
}

export default function VirtualCloset() {
  const { profile } = useProfile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [outfitSuggestions, setOutfitSuggestions] = useState<OutfitSuggestion[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("casual");
  const [selectedSeason, setSelectedSeason] = useState<string>("qualquer");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isPremiumPlus = profile?.subscription_plan === "premium_plus";

  const loadClosetItems = async () => {
    try {
      const { data, error } = await supabase
        .from('closet_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClosetItems(data || []);
    } catch (error) {
      console.error('Error loading closet items:', error);
    }
  };

  const loadOutfitSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('outfit_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOutfitSuggestions(data || []);
    } catch (error) {
      console.error('Error loading outfit suggestions:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!isPremiumPlus) {
      toast.error("Recurso exclusivo Premium Plus");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('closet-items')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('closet-items')
        .getPublicUrl(fileName);

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'analyze-clothing-item',
        {
          body: { imageUrl: publicUrl }
        }
      );

      if (functionError) throw functionError;

      toast.success("Peça adicionada ao closet!", {
        description: functionData.styling_tips
      });

      loadClosetItems();
    } catch (error: any) {
      console.error('Error analyzing clothing item:', error);
      toast.error("Erro ao analisar peça", {
        description: error.message
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateOutfits = async () => {
    if (!isPremiumPlus) {
      toast.error("Recurso exclusivo Premium Plus");
      return;
    }

    if (closetItems.length === 0) {
      toast.error("Adicione peças ao seu closet primeiro!");
      return;
    }

    setIsGenerating(true);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-outfit-suggestions',
        {
          body: { 
            occasion: selectedOccasion,
            season: selectedSeason === "qualquer" ? null : selectedSeason
          }
        }
      );

      if (functionError) throw functionError;

      toast.success("Looks gerados com sucesso!", {
        description: `${functionData.outfits.length} combinações criadas`
      });

      loadOutfitSuggestions();
    } catch (error: any) {
      console.error('Error generating outfits:', error);
      toast.error("Erro ao gerar looks", {
        description: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteItem = async (itemId: string, photoUrl: string) => {
    try {
      const fileName = photoUrl.split('/closet-items/')[1];
      
      await supabase.storage.from('closet-items').remove([fileName]);
      
      const { error } = await supabase
        .from('closet_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success("Peça removida do closet");
      loadClosetItems();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error("Erro ao remover peça");
    }
  };

  const getItemsForOutfit = (itemIds: string[]) => {
    return closetItems.filter(item => itemIds.includes(item.id));
  };

  if (!isPremiumPlus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Meu Closet Virtual
          </CardTitle>
          <CardDescription>
            Recurso exclusivo Premium Plus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Faça upgrade para Premium Plus para fotografar suas roupas e receber sugestões de looks personalizadas com IA!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
          <Shirt className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Meu Closet Virtual</span>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Fotografe suas peças e receba sugestões de looks com IA
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Tabs defaultValue="closet" onValueChange={(tab) => {
          if (tab === "closet") loadClosetItems();
          if (tab === "outfits") loadOutfitSuggestions();
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="closet">Meu Closet</TabsTrigger>
            <TabsTrigger value="outfits">Sugestões de Looks</TabsTrigger>
          </TabsList>

          <TabsContent value="closet" className="space-y-4 overflow-hidden">
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                  e.target.value = '';
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                  e.target.value = '';
                }}
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                variant="outline"
                className="flex-1 min-w-[120px]"
              >
                <Upload className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Adicionar Foto</span>
              </Button>
              
              <Button
                onClick={() => cameraInputRef.current?.click()}
                disabled={isAnalyzing}
                variant="outline"
                className="flex-1 min-w-[120px]"
              >
                <Camera className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Tirar Foto</span>
              </Button>
            </div>

            {isAnalyzing && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse text-luna-purple" />
                <p className="text-muted-foreground">Analisando peça com IA...</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {closetItems.map((item) => (
                <div key={item.id} className="relative group">
                  <img
                    src={item.photo_url}
                    alt={item.ai_description}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteItem(item.id, item.photo_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium capitalize">{item.item_type}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.colors.slice(0, 3).map((color, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {closetItems.length === 0 && !isAnalyzing && (
              <div className="text-center py-8 text-muted-foreground overflow-hidden">
                <Shirt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="break-words px-4">Seu closet está vazio. Adicione suas primeiras peças!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="outfits" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                <SelectTrigger>
                  <SelectValue placeholder="Ocasião" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="festa">Festa</SelectItem>
                  <SelectItem value="esporte">Esporte</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Estação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualquer">Qualquer</SelectItem>
                  <SelectItem value="primavera">Primavera</SelectItem>
                  <SelectItem value="verão">Verão</SelectItem>
                  <SelectItem value="outono">Outono</SelectItem>
                  <SelectItem value="inverno">Inverno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateOutfits}
              disabled={isGenerating || closetItems.length === 0}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Combinações de Looks
            </Button>

            {isGenerating && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse text-luna-purple" />
                <p className="text-muted-foreground">Criando looks incríveis para você...</p>
              </div>
            )}

            <div className="space-y-4">
              {outfitSuggestions.map((outfit) => {
                const items = getItemsForOutfit(outfit.item_ids);
                return (
                  <Card key={outfit.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{outfit.outfit_name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge>{outfit.occasion}</Badge>
                        {outfit.season && <Badge variant="secondary">{outfit.season}</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {items.map((item) => (
                          <img
                            key={item.id}
                            src={item.photo_url}
                            alt={item.ai_description}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{outfit.ai_description}</p>
                      {outfit.ai_styling_tips && (
                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {outfit.ai_styling_tips}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {outfitSuggestions.length === 0 && !isGenerating && (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Gere suas primeiras sugestões de looks!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
