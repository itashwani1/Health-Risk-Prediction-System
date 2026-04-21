-- Create predictions table to store health risk prediction history
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Health input parameters
  age INTEGER NOT NULL,
  blood_pressure_systolic INTEGER NOT NULL,
  blood_pressure_diastolic INTEGER NOT NULL,
  cholesterol INTEGER NOT NULL,
  glucose INTEGER NOT NULL,
  bmi DECIMAL(4,1) NOT NULL,
  smoking BOOLEAN NOT NULL DEFAULT false,
  alcohol_intake BOOLEAN NOT NULL DEFAULT false,
  physical_activity BOOLEAN NOT NULL DEFAULT true,
  
  -- Prediction results
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own predictions
CREATE POLICY "Users can view their own predictions" 
  ON public.predictions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" 
  ON public.predictions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" 
  ON public.predictions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON public.predictions(created_at DESC);
