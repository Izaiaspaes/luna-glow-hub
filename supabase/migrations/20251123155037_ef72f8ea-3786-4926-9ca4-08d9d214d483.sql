-- Create user_onboarding_data table
CREATE TABLE public.user_onboarding_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados básicos
  full_name TEXT,
  social_name TEXT,
  age INTEGER,
  profession TEXT,
  current_city TEXT,
  current_country TEXT,
  
  -- Dados de nascimento (para mapa astral)
  birth_date DATE,
  birth_time TIME,
  birth_city TEXT,
  birth_country TEXT,
  birth_coordinates JSONB, -- {lat, lng}
  
  -- Aparência física
  weight NUMERIC,
  height NUMERIC,
  body_shapes TEXT[], -- array de strings
  skin_tone TEXT,
  skin_types TEXT[], -- array para multi-seleção
  eye_color TEXT,
  hair_color TEXT,
  hair_type TEXT,
  hair_length TEXT,
  nail_preference TEXT,
  
  -- Gostos pessoais
  favorite_color TEXT,
  hobbies TEXT[],
  personal_interests TEXT,
  self_love_notes TEXT,
  
  -- Cuidados pessoais
  current_care_routines TEXT[],
  care_improvement_goals TEXT[],
  
  -- Campos da vida
  most_explored_life_area TEXT,
  life_area_to_improve TEXT,
  main_app_goal TEXT,
  
  -- Preferências gerais
  content_preferences TEXT[],
  notification_frequency TEXT,
  
  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_onboarding_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own onboarding data"
  ON public.user_onboarding_data
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data"
  ON public.user_onboarding_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data"
  ON public.user_onboarding_data
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own onboarding data"
  ON public.user_onboarding_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_onboarding_data_updated_at
  BEFORE UPDATE ON public.user_onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_user_onboarding_data_user_id ON public.user_onboarding_data(user_id);
CREATE INDEX idx_user_onboarding_data_completed ON public.user_onboarding_data(completed_at) WHERE completed_at IS NOT NULL;