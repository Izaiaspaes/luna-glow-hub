import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  MapPin, 
  Ruler, 
  Palette as PaletteIcon, 
  Heart, 
  Sparkles,
  Edit,
  Loader2
} from "lucide-react";

export function OnboardingDataView() {
  const { onboardingData, loading } = useOnboarding();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!onboardingData || !onboardingData.completed_at) {
    return (
      <div className="text-center py-12 space-y-4">
        <Sparkles className="h-16 w-16 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Onboarding não completado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete seu cadastro inicial para personalizar sua experiência
          </p>
          <Button onClick={() => navigate('/onboarding')}>
            Iniciar Onboarding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Dados Pessoais</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/onboarding')}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Dados Básicos */}
      {(onboardingData.full_name || onboardingData.social_name || onboardingData.age || onboardingData.profession) && (
        <>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Informações Básicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {onboardingData.full_name && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nome Completo</p>
                  <p className="text-sm font-medium">{onboardingData.full_name}</p>
                </div>
              )}
              {onboardingData.social_name && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nome Social</p>
                  <p className="text-sm font-medium">{onboardingData.social_name}</p>
                </div>
              )}
              {onboardingData.age && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Idade</p>
                  <p className="text-sm font-medium">{onboardingData.age} anos</p>
                </div>
              )}
              {onboardingData.profession && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Profissão</p>
                  <p className="text-sm font-medium">{onboardingData.profession}</p>
                </div>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Dados de Nascimento */}
      {(onboardingData.birth_date || onboardingData.birth_city) && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-muted-foreground">Dados de Nascimento</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {onboardingData.birth_date && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Data de Nascimento</p>
                  <p className="text-sm font-medium">
                    {new Date(onboardingData.birth_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              {onboardingData.birth_time && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Horário</p>
                  <p className="text-sm font-medium">{onboardingData.birth_time}</p>
                </div>
              )}
              {onboardingData.birth_city && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="text-sm font-medium">
                    {onboardingData.birth_city}, {onboardingData.birth_country}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Localização Atual */}
      {(onboardingData.current_city || onboardingData.current_country) && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-muted-foreground">Localização Atual</h4>
            </div>
            <p className="text-sm">
              {onboardingData.current_city}, {onboardingData.current_country}
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* Aparência Física */}
      {(onboardingData.weight || onboardingData.height || onboardingData.body_shapes) && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-muted-foreground">Aparência Física</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {onboardingData.weight && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Peso</p>
                  <p className="text-sm font-medium">{onboardingData.weight} kg</p>
                </div>
              )}
              {onboardingData.height && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Altura</p>
                  <p className="text-sm font-medium">{onboardingData.height} cm</p>
                </div>
              )}
              {onboardingData.skin_tone && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tom de Pele</p>
                  <p className="text-sm font-medium">{onboardingData.skin_tone}</p>
                </div>
              )}
              {onboardingData.eye_color && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cor dos Olhos</p>
                  <p className="text-sm font-medium">{onboardingData.eye_color}</p>
                </div>
              )}
              {onboardingData.hair_color && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cabelo</p>
                  <p className="text-sm font-medium">
                    {onboardingData.hair_color} - {onboardingData.hair_type}
                  </p>
                </div>
              )}
            </div>
            {onboardingData.body_shapes && onboardingData.body_shapes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Formato do Corpo</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.body_shapes.map((shape) => (
                    <Badge key={shape} variant="secondary">{shape}</Badge>
                  ))}
                </div>
              </div>
            )}
            {onboardingData.skin_types && onboardingData.skin_types.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Tipo de Pele</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.skin_types.map((type) => (
                    <Badge key={type} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Gostos Pessoais */}
      {(onboardingData.favorite_color || onboardingData.hobbies) && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-muted-foreground">Gostos Pessoais</h4>
            </div>
            {onboardingData.favorite_color && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cor Favorita</p>
                <div className="flex items-center gap-2">
                  <PaletteIcon className="h-4 w-4" />
                  <p className="text-sm font-medium">{onboardingData.favorite_color}</p>
                </div>
              </div>
            )}
            {onboardingData.hobbies && onboardingData.hobbies.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Hobbies</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.hobbies.map((hobby) => (
                    <Badge key={hobby} variant="outline">{hobby}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Rotina de Trabalho */}
      {onboardingData.work_routine_type && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-muted-foreground">Rotina de Trabalho</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tipo de Rotina</p>
              <Badge variant="default">
                {onboardingData.work_routine_type === 'fixed' && 'Horário Fixo'}
                {onboardingData.work_routine_type === 'variable' && 'Horários Variáveis'}
                {onboardingData.work_routine_type === 'shift' && 'Escala de Plantão'}
              </Badge>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Cuidados Pessoais */}
      {(onboardingData.current_care_routines || onboardingData.care_improvement_goals) && (
        <>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Cuidados Pessoais</h4>
            {onboardingData.current_care_routines && onboardingData.current_care_routines.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Rotinas Atuais</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.current_care_routines.map((routine) => (
                    <Badge key={routine} variant="secondary">{routine}</Badge>
                  ))}
                </div>
              </div>
            )}
            {onboardingData.care_improvement_goals && onboardingData.care_improvement_goals.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Objetivos de Melhoria</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.care_improvement_goals.map((goal) => (
                    <Badge key={goal} variant="outline">{goal}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Campos da Vida */}
      {(onboardingData.most_explored_life_area || onboardingData.life_area_to_improve) && (
        <>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Campos da Vida</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {onboardingData.most_explored_life_area && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mais Explorado</p>
                  <Badge variant="default">{onboardingData.most_explored_life_area}</Badge>
                </div>
              )}
              {onboardingData.life_area_to_improve && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Quer Melhorar</p>
                  <Badge variant="secondary">{onboardingData.life_area_to_improve}</Badge>
                </div>
              )}
            </div>
            {onboardingData.main_app_goal && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Objetivo Principal</p>
                <p className="text-sm">{onboardingData.main_app_goal}</p>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Preferências */}
      {(onboardingData.content_preferences || onboardingData.notification_frequency) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Preferências</h4>
          {onboardingData.content_preferences && onboardingData.content_preferences.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Tipo de Conteúdo</p>
              <div className="flex flex-wrap gap-2">
                {onboardingData.content_preferences.map((pref) => (
                  <Badge key={pref} variant="outline">{pref}</Badge>
                ))}
              </div>
            </div>
          )}
          {onboardingData.notification_frequency && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Notificações</p>
              <p className="text-sm font-medium">{onboardingData.notification_frequency}</p>
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Completado em {new Date(onboardingData.completed_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
