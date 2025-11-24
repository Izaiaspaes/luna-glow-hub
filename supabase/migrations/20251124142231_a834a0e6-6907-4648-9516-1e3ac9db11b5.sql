-- Create work_tracking table for daily work routine tracking
CREATE TABLE public.work_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  work_date DATE NOT NULL,
  
  -- Work routine data
  routine_type TEXT NOT NULL CHECK (routine_type IN ('fixed', 'variable', 'shift')),
  hours_worked NUMERIC NOT NULL CHECK (hours_worked >= 0 AND hours_worked <= 24),
  shift_type TEXT CHECK (shift_type IN ('day', 'night', 'mixed', 'off')),
  
  -- Automatic classifications
  workload_level TEXT NOT NULL CHECK (workload_level IN ('light', 'moderate', 'heavy', 'exhausting')),
  mood_impact_level TEXT NOT NULL CHECK (mood_impact_level IN ('low', 'medium', 'high', 'very_high')),
  
  -- Auto-generated message
  daily_message TEXT,
  
  -- Optional notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one entry per day per user
  UNIQUE(user_id, work_date)
);

-- Enable RLS
ALTER TABLE public.work_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own work tracking"
  ON public.work_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work tracking"
  ON public.work_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work tracking"
  ON public.work_tracking
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work tracking"
  ON public.work_tracking
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_work_tracking_updated_at
  BEFORE UPDATE ON public.work_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_work_tracking_user_date ON public.work_tracking(user_id, work_date DESC);

-- Add routine_type to user_onboarding_data for initial setup
ALTER TABLE public.user_onboarding_data
ADD COLUMN work_routine_type TEXT CHECK (work_routine_type IN ('fixed', 'variable', 'shift'));