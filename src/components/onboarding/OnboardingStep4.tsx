import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "@/hooks/useOnboarding";

const step4Schema = z.object({
  work_routine_type: z.enum(['fixed', 'variable', 'shift']).optional(),
  favorite_color: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  personal_interests: z.string().optional(),
  self_love_notes: z.string().optional(),
  current_care_routines: z.array(z.string()).optional(),
  care_improvement_goals: z.array(z.string()).optional(),
  most_explored_life_area: z.string().optional(),
  life_area_to_improve: z.string().optional(),
  main_app_goal: z.string().optional(),
  content_preferences: z.array(z.string()).optional(),
  notification_frequency: z.string().optional(),
});

type Step4Data = z.infer<typeof step4Schema>;

interface OnboardingStep4Props {
  data: OnboardingData;
  onComplete: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  loading: boolean;
}

const hobbiesOptions = ["Ler", "Séries/Filmes", "Academia", "Dança", "Viagens", "Jogos", "Artes"];
const careRoutines = ["Skincare básico", "Skincare avançado", "Cuidados com cabelo", "Academia/exercícios", "Terapia", "Alimentação saudável", "Meditação", "Unhas"];
const careGoals = ["Cuidar mais da pele", "Cuidar mais do cabelo", "Cuidar mais do corpo", "Cuidar da saúde mental", "Organizar rotina", "Melhorar alimentação"];
const lifeAreas = ["Trabalho/carreira", "Estudos", "Relacionamentos amorosos", "Família", "Amizades", "Saúde física", "Saúde mental", "Finanças", "Autoconhecimento"];
const contentPrefs = ["Textos curtos", "Textos profundos", "Vídeos", "Áudios", "Listas/Checklists"];
const notificationFreqs = ["Quase todo dia", "Algumas vezes na semana", "Raramente", "Não quero notificações"];

export function OnboardingStep4({ data, onComplete, onBack, loading }: OnboardingStep4Props) {
  const { register, handleSubmit, control, watch, setValue } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      work_routine_type: (data.work_routine_type as 'fixed' | 'variable' | 'shift') || undefined,
      favorite_color: data.favorite_color || "",
      hobbies: data.hobbies || [],
      personal_interests: data.personal_interests || "",
      self_love_notes: data.self_love_notes || "",
      current_care_routines: data.current_care_routines || [],
      care_improvement_goals: data.care_improvement_goals || [],
      most_explored_life_area: data.most_explored_life_area || "",
      life_area_to_improve: data.life_area_to_improve || "",
      main_app_goal: data.main_app_goal || "",
      content_preferences: data.content_preferences || [],
      notification_frequency: data.notification_frequency || "",
    },
  });

  const selectedHobbies = watch("hobbies") || [];
  const selectedCareRoutines = watch("current_care_routines") || [];
  const selectedCareGoals = watch("care_improvement_goals") || [];
  const selectedContentPrefs = watch("content_preferences") || [];

  const onSubmit = (formData: Step4Data) => {
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Seus Interesses e Objetivos</h2>
        <p className="text-muted-foreground">
          Conte-nos mais sobre você para personalizar sua experiência
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Tipo de Rotina de Trabalho</Label>
          <Controller
            control={control}
            name="work_routine_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de rotina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Horário Fixo</SelectItem>
                  <SelectItem value="variable">Horários Variáveis</SelectItem>
                  <SelectItem value="shift">Escala de Plantão</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="favorite_color">Cor Favorita</Label>
          <Input
            id="favorite_color"
            {...register("favorite_color")}
            placeholder="Qual sua cor favorita?"
          />
        </div>

        <div className="space-y-2">
          <Label>Hobbies</Label>
          <div className="grid grid-cols-2 gap-2">
            {hobbiesOptions.map((hobby) => (
              <div key={hobby} className="flex items-center space-x-2">
                <Checkbox
                  id={`hobby-${hobby}`}
                  checked={selectedHobbies.includes(hobby)}
                  onCheckedChange={(checked) => {
                    const newHobbies = checked
                      ? [...selectedHobbies, hobby]
                      : selectedHobbies.filter((h) => h !== hobby);
                    setValue("hobbies", newHobbies);
                  }}
                />
                <Label htmlFor={`hobby-${hobby}`} className="font-normal cursor-pointer">
                  {hobby}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personal_interests">Outros Interesses</Label>
          <Textarea
            id="personal_interests"
            {...register("personal_interests")}
            placeholder="Música, livros, filmes, lugares..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="self_love_notes">O que mais gosta em si mesma?</Label>
          <Textarea
            id="self_love_notes"
            {...register("self_love_notes")}
            placeholder="Pode ser algo físico ou emocional..."
          />
        </div>

        <div className="space-y-2">
          <Label>Cuidados que já pratica</Label>
          <div className="grid grid-cols-2 gap-2">
            {careRoutines.map((routine) => (
              <div key={routine} className="flex items-center space-x-2">
                <Checkbox
                  id={`care-${routine}`}
                  checked={selectedCareRoutines.includes(routine)}
                  onCheckedChange={(checked) => {
                    const newRoutines = checked
                      ? [...selectedCareRoutines, routine]
                      : selectedCareRoutines.filter((r) => r !== routine);
                    setValue("current_care_routines", newRoutines);
                  }}
                />
                <Label htmlFor={`care-${routine}`} className="font-normal cursor-pointer text-sm">
                  {routine}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>O que gostaria de melhorar</Label>
          <div className="grid grid-cols-2 gap-2">
            {careGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={selectedCareGoals.includes(goal)}
                  onCheckedChange={(checked) => {
                    const newGoals = checked
                      ? [...selectedCareGoals, goal]
                      : selectedCareGoals.filter((g) => g !== goal);
                    setValue("care_improvement_goals", newGoals);
                  }}
                />
                <Label htmlFor={`goal-${goal}`} className="font-normal cursor-pointer text-sm">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Campo da vida mais explorado hoje</Label>
          <Controller
            control={control}
            name="most_explored_life_area"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {lifeAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Campo da vida que gostaria de melhorar</Label>
          <Controller
            control={control}
            name="life_area_to_improve"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {lifeAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="main_app_goal">Objetivo principal com o app</Label>
          <Textarea
            id="main_app_goal"
            {...register("main_app_goal")}
            placeholder="Ex: Quero me organizar melhor, me cuidar mais..."
          />
        </div>

        <div className="space-y-2">
          <Label>Como prefere receber conteúdo</Label>
          <div className="grid grid-cols-2 gap-2">
            {contentPrefs.map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`content-${pref}`}
                  checked={selectedContentPrefs.includes(pref)}
                  onCheckedChange={(checked) => {
                    const newPrefs = checked
                      ? [...selectedContentPrefs, pref]
                      : selectedContentPrefs.filter((p) => p !== pref);
                    setValue("content_preferences", newPrefs);
                  }}
                />
                <Label htmlFor={`content-${pref}`} className="font-normal cursor-pointer text-sm">
                  {pref}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Frequência de notificações</Label>
          <Controller
            control={control}
            name="notification_frequency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {notificationFreqs.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">
          Voltar
        </Button>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Concluir"}
        </Button>
      </div>
    </form>
  );
}
