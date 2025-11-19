-- Add columns for tracking plan completion and archival
ALTER TABLE public.wellness_plans
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'));

-- Create index for faster queries on status
CREATE INDEX IF NOT EXISTS idx_wellness_plans_status ON public.wellness_plans(status);

-- Update existing records to have 'active' status if they are active
UPDATE public.wellness_plans
SET status = 'active'
WHERE is_active = true AND status IS NULL;

-- Update existing records to have 'archived' status if they are not active
UPDATE public.wellness_plans
SET status = 'archived',
    archived_at = updated_at
WHERE is_active = false AND status IS NULL;