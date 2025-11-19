-- Create table for menstrual cycle tracking
CREATE TABLE public.cycle_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE,
  cycle_length INTEGER,
  period_length INTEGER,
  flow_intensity TEXT CHECK (flow_intensity IN ('leve', 'moderado', 'intenso')),
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for sleep tracking
CREATE TABLE public.sleep_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIME,
  wake_time TIME,
  sleep_duration_hours DECIMAL(4,2),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, sleep_date)
);

-- Create table for mood tracking
CREATE TABLE public.mood_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_date DATE NOT NULL,
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 5),
  mood_type TEXT CHECK (mood_type IN ('feliz', 'ansiosa', 'triste', 'irritada', 'calma', 'energizada', 'cansada')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mood_date, mood_type)
);

-- Create table for energy tracking
CREATE TABLE public.energy_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  energy_date DATE NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  time_of_day TEXT CHECK (time_of_day IN ('manhã', 'tarde', 'noite')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, energy_date, time_of_day)
);

-- Create table for personalized wellness plans
CREATE TABLE public.wellness_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT CHECK (plan_type IN ('sono', 'meditacao', 'nutricao', 'exercicio', 'geral')),
  plan_content JSONB NOT NULL,
  ai_recommendations TEXT NOT NULL,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cycle_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cycle_tracking
CREATE POLICY "Users can view their own cycle tracking"
ON public.cycle_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cycle tracking"
ON public.cycle_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycle tracking"
ON public.cycle_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycle tracking"
ON public.cycle_tracking FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for sleep_tracking
CREATE POLICY "Users can view their own sleep tracking"
ON public.sleep_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep tracking"
ON public.sleep_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep tracking"
ON public.sleep_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep tracking"
ON public.sleep_tracking FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for mood_tracking
CREATE POLICY "Users can view their own mood tracking"
ON public.mood_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood tracking"
ON public.mood_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood tracking"
ON public.mood_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood tracking"
ON public.mood_tracking FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for energy_tracking
CREATE POLICY "Users can view their own energy tracking"
ON public.energy_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own energy tracking"
ON public.energy_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy tracking"
ON public.energy_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy tracking"
ON public.energy_tracking FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for wellness_plans
CREATE POLICY "Users can view their own wellness plans"
ON public.wellness_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness plans"
ON public.wellness_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness plans"
ON public.wellness_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness plans"
ON public.wellness_plans FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_cycle_tracking_updated_at
BEFORE UPDATE ON public.cycle_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sleep_tracking_updated_at
BEFORE UPDATE ON public.sleep_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_plans_updated_at
BEFORE UPDATE ON public.wellness_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_cycle_tracking_user_date ON public.cycle_tracking(user_id, cycle_start_date DESC);
CREATE INDEX idx_sleep_tracking_user_date ON public.sleep_tracking(user_id, sleep_date DESC);
CREATE INDEX idx_mood_tracking_user_date ON public.mood_tracking(user_id, mood_date DESC);
CREATE INDEX idx_energy_tracking_user_date ON public.energy_tracking(user_id, energy_date DESC);
CREATE INDEX idx_wellness_plans_user_active ON public.wellness_plans(user_id, is_active, valid_from DESC);