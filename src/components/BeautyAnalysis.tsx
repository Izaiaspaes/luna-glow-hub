import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, History, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";

type AnalysisType = 'face' | 'body' | 'product';

interface BeautyAnalysis {
  id: string;
  photo_url: string;
  analysis_type: AnalysisType;
  ai_analysis: any;
  created_at: string;
}

export function BeautyAnalysis() {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('face');
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<BeautyAnalysis[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('analyze');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const hasPremiumPlus = profile?.subscription_plan === 'premium_plus';

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file selection - show preview first
  const handleFilePreview = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const base64Image = await fileToBase64(file);
    setPendingFile(file);
    setPreviewImage(base64Image);
  };

  // Cancel pending analysis
  const handleCancelAnalysis = () => {
    setPendingFile(null);
    setPreviewImage(null);
  };

  // Confirm and run analysis
  const handleConfirmAnalysis = async () => {
    if (!pendingFile) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const base64Image = previewImage!;
      setSelectedImage(base64Image);

      // Upload to Supabase Storage for history
      const fileExt = pendingFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('beauty-analysis')
        .upload(fileName, pendingFile);

      if (uploadError) {
        console.error('Upload error (non-blocking):', uploadError);
      }

      // Get public URL for storage (for history)
      const { data: { publicUrl } } = supabase.storage
        .from('beauty-analysis')
        .getPublicUrl(fileName);

      // Call AI analysis with base64 image and user language
      const { data, error } = await supabase.functions.invoke('analyze-beauty', {
        body: { imageBase64: base64Image, storageUrl: publicUrl, analysisType, language: i18n.language },
      });

      if (error) throw error;

      setCurrentAnalysis(data.analysis.ai_analysis);
      setPendingFile(null);
      setPreviewImage(null);
      toast.success('Análise concluída! 🎨');
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      toast.error('Erro ao analisar imagem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('beauty_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory((data || []) as BeautyAnalysis[]);
    } catch (error: any) {
      console.error('Error loading history:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('beauty_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Análise excluída');
    } catch (error: any) {
      console.error('Error deleting analysis:', error);
      toast.error('Erro ao excluir análise');
    }
  };

  const renderAnalysisResults = () => {
    if (!currentAnalysis) return null;

    if (analysisType === 'face') {
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('beautyAnalysis.results.faceShape')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-primary">{currentAnalysis.face_shape}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('beautyAnalysis.results.skinTone')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{currentAnalysis.skin_tone_detected}</p>
                <Badge variant="secondary" className="mt-2">{currentAnalysis.undertone}</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.colorSeason')}</CardTitle>
              <CardDescription>{t('beautyAnalysis.results.idealPalette')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-3">{currentAnalysis.color_season}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-1">{t('beautyAnalysis.results.useTheseColors')}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentAnalysis.best_colors_to_wear?.map((color: string, i: number) => (
                      <Badge key={i} variant="default">{color}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{t('beautyAnalysis.results.avoidTheseColors')}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentAnalysis.colors_to_avoid?.map((color: string, i: number) => (
                      <Badge key={i} variant="outline">{color}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.makeupRecommendations')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.foundation')}:</p>
                <p className="text-sm text-muted-foreground">{currentAnalysis.makeup_recommendations?.foundation}</p>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.eyes')}:</p>
                <p className="text-sm text-muted-foreground">{currentAnalysis.makeup_recommendations?.eyes}</p>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.lips')}:</p>
                <p className="text-sm text-muted-foreground">{currentAnalysis.makeup_recommendations?.lips}</p>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.blush')}:</p>
                <p className="text-sm text-muted-foreground">{currentAnalysis.makeup_recommendations?.cheeks}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.skincare')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {currentAnalysis.skincare_tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>{currentAnalysis.personalized_message}</AlertDescription>
          </Alert>
        </div>
      );
    } else if (analysisType === 'body') {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.bodyType')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary mb-2">{currentAnalysis.body_type}</p>
              <p className="text-sm text-muted-foreground">{currentAnalysis.proportions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.clothingRecommendations')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.topsAndShirts')}:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {currentAnalysis.clothing_recommendations?.tops?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.pantsAndSkirts')}:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {currentAnalysis.clothing_recommendations?.bottoms?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.dresses')}:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {currentAnalysis.clothing_recommendations?.dresses?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">{t('beautyAnalysis.results.accessories')}:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {currentAnalysis.clothing_recommendations?.accessories?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.patternsAndPrints')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.patterns_and_prints?.map((pattern: string, i: number) => (
                  <Badge key={i} variant="secondary">{pattern}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.bestFits')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.best_fits?.map((fit: string, i: number) => (
                  <Badge key={i} variant="default">{fit}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.stylingTips')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {currentAnalysis.styling_tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>{currentAnalysis.personalized_message}</AlertDescription>
          </Alert>
        </div>
      );
    } else if (analysisType === 'product') {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.productIdentified')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{currentAnalysis.product_identified}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">{t('beautyAnalysis.results.compatibility')}:</span>
                <Badge variant={currentAnalysis.matches_profile ? "default" : "secondary"}>
                  {currentAnalysis.compatibility_score}/10
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.matchesYou')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={currentAnalysis.matches_profile ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                {currentAnalysis.matches_profile ? t('beautyAnalysis.results.yesMatches') : t('beautyAnalysis.results.mayNotBeIdeal')}
              </p>
              <p className="text-sm mt-2 text-muted-foreground">{currentAnalysis.why_matches}</p>
            </CardContent>
          </Card>

          {currentAnalysis.better_alternatives && currentAnalysis.better_alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('beautyAnalysis.results.betterAlternatives')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {currentAnalysis.better_alternatives.map((alt: string, i: number) => (
                    <li key={i} className="text-sm">{alt}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('beautyAnalysis.results.usageTips')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {currentAnalysis.usage_tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>{currentAnalysis.personalized_message}</AlertDescription>
          </Alert>
        </div>
      );
    }
  };

  if (!hasPremiumPlus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('beautyAnalysis.title')}
          </CardTitle>
          <CardDescription>
            {t('beautyAnalysis.premiumPlusOnly')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              {t('beautyAnalysis.upgradeMessage')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t('beautyAnalysis.title')}
        </CardTitle>
        <CardDescription>
          {t('beautyAnalysis.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze">{t('beautyAnalysis.newAnalysis')}</TabsTrigger>
            <TabsTrigger value="history" onClick={loadHistory}>
              <History className="h-4 w-4 mr-2" />
              {t('beautyAnalysis.history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={analysisType === 'face' ? 'default' : 'outline'}
                onClick={() => setAnalysisType('face')}
              >
                {t('beautyAnalysis.face')}
              </Button>
              <Button
                variant={analysisType === 'body' ? 'default' : 'outline'}
                onClick={() => setAnalysisType('body')}
              >
                {t('beautyAnalysis.body')}
              </Button>
              <Button
                variant={analysisType === 'product' ? 'default' : 'outline'}
                onClick={() => setAnalysisType('product')}
              >
                {t('beautyAnalysis.product')}
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                disabled={loading}
                variant="default"
              >
                <Camera className="h-4 w-4 mr-2" />
                {t('beautyAnalysis.takePhoto')}
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                variant="secondary"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('beautyAnalysis.upload')}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFilePreview(e.target.files[0]);
                }
                e.target.value = ''; // Reset para permitir selecionar o mesmo arquivo
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFilePreview(e.target.files[0]);
                }
                e.target.value = ''; // Reset para garantir que onChange dispare novamente
              }}
            />

            {/* Preview with confirmation */}
            {previewImage && !loading && (
              <div className="space-y-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleCancelAnalysis}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleConfirmAnalysis}
                    disabled={loading}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('beautyAnalysis.generateAnalysis')}
                  </Button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">{t('beautyAnalysis.analyzing')}</span>
              </div>
            )}

            {selectedImage && !loading && !previewImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                {renderAnalysisResults()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {t('beautyAnalysis.noHistory')}
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <img
                            src={item.photo_url}
                            alt="Analysis"
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>
                                {item.analysis_type === 'face' ? t('beautyAnalysis.face') : 
                                 item.analysis_type === 'body' ? t('beautyAnalysis.body') : t('beautyAnalysis.product')}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteAnalysis(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString('pt-BR')}
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => {
                                setCurrentAnalysis(item.ai_analysis);
                                setSelectedImage(item.photo_url);
                                setAnalysisType(item.analysis_type);
                                setActiveTab('analyze');
                              }}
                            >
                              {t('beautyAnalysis.viewFullAnalysis')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}