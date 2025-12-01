-- Create case reassignment log table
CREATE TABLE public.case_reassignment_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  old_priority case_priority,
  new_priority case_priority NOT NULL,
  old_assignee UUID,
  new_assignee UUID,
  reason TEXT,
  changed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_reassignment_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reassignment log
CREATE POLICY "Users can view reassignment logs"
  ON public.case_reassignment_log
  FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create reassignment logs"
  ON public.case_reassignment_log
  FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'judge'::app_role) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Create index for better performance
CREATE INDEX idx_case_reassignment_log_case_id ON public.case_reassignment_log(case_id);
CREATE INDEX idx_case_reassignment_log_created_at ON public.case_reassignment_log(created_at DESC);