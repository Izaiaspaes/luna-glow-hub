-- Create wellness plan templates table
CREATE TABLE IF NOT EXISTS public.wellness_plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  template_type TEXT NOT NULL,
  base_recommendations JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_plan_templates ENABLE ROW LEVEL SECURITY;

-- Admins can manage all templates
CREATE POLICY "Admins can view all templates"
  ON public.wellness_plan_templates
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert templates"
  ON public.wellness_plan_templates
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update templates"
  ON public.wellness_plan_templates
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete templates"
  ON public.wellness_plan_templates
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Anyone can view active templates (for AI generation)
CREATE POLICY "Anyone can view active templates"
  ON public.wellness_plan_templates
  FOR SELECT
  USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_wellness_plan_templates_updated_at
  BEFORE UPDATE ON public.wellness_plan_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.wellness_plan_templates (name, description, template_type, base_recommendations, display_order) VALUES
  (
    'Pacote Holístico Menstrual',
    'Pacote focado em bem-estar durante o ciclo menstrual',
    'cycle',
    '[
      {"category": "Autocuidado", "title": "Práticas de relaxamento", "description": "Meditação, respiração profunda e alongamentos suaves", "priority": "alta"},
      {"category": "Nutrição", "title": "Alimentos anti-inflamatórios", "description": "Priorize chá de gengibre, frutas vermelhas e vegetais verdes", "priority": "alta"},
      {"category": "Sono", "title": "Rotina de sono regular", "description": "Estabelecer horário fixo para dormir e acordar", "priority": "média"}
    ]'::jsonb,
    1
  ),
  (
    'Rotina de Sono Saudável',
    'Pacote para melhorar qualidade do sono',
    'sleep',
    '[
      {"category": "Rotina Noturna", "title": "Desligar telas 1h antes", "description": "Reduzir exposição à luz azul antes de dormir", "priority": "alta"},
      {"category": "Ambiente", "title": "Quarto escuro e fresco", "description": "Temperatura ideal entre 18-21°C", "priority": "alta"},
      {"category": "Alimentação", "title": "Evitar cafeína após 15h", "description": "Limite consumo de café, chá preto e refrigerantes", "priority": "média"}
    ]'::jsonb,
    2
  ),
  (
    'Equilíbrio Emocional',
    'Pacote para gerenciamento de humor e emoções',
    'mood',
    '[
      {"category": "Mindfulness", "title": "Meditação diária", "description": "10-15 minutos de meditação guiada", "priority": "alta"},
      {"category": "Expressão", "title": "Journaling terapêutico", "description": "Escrever sobre emoções e pensamentos", "priority": "média"},
      {"category": "Social", "title": "Conexão social", "description": "Conversar com amigos ou familiares", "priority": "média"}
    ]'::jsonb,
    3
  ),
  (
    'Energia e Vitalidade',
    'Pacote para aumentar energia e disposição',
    'energy',
    '[
      {"category": "Atividade Física", "title": "Exercícios moderados", "description": "30 minutos de caminhada ou yoga", "priority": "alta"},
      {"category": "Hidratação", "title": "2L de água por dia", "description": "Manter hidratação adequada ao longo do dia", "priority": "alta"},
      {"category": "Nutrição", "title": "Refeições balanceadas", "description": "Incluir proteínas, carboidratos complexos e gorduras saudáveis", "priority": "média"}
    ]'::jsonb,
    4
  ),
  (
    'Nutrição Hormonal',
    'Pacote de alimentação adaptada ao ciclo',
    'nutrition',
    '[
      {"category": "Fase Folicular", "title": "Alimentos energéticos", "description": "Grãos integrais, vegetais verdes, proteínas magras", "priority": "alta"},
      {"category": "Fase Ovulatória", "title": "Antioxidantes", "description": "Frutas cítricas, berries, nozes e sementes", "priority": "alta"},
      {"category": "Fase Lútea", "title": "Magnésio e B6", "description": "Chocolate amargo, banana, abacate, grão-de-bico", "priority": "média"}
    ]'::jsonb,
    5
  );