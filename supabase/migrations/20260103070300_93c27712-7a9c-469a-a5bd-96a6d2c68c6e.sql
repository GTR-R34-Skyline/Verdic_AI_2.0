-- Create role_requests table for admin approval workflow
CREATE TABLE public.role_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role public.app_role NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  bar_council_id text,
  court_name text,
  years_of_experience integer,
  specialization text,
  reason text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own role requests"
ON public.role_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own role requests
CREATE POLICY "Users can create role requests"
ON public.role_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all role requests
CREATE POLICY "Admins can view all role requests"
ON public.role_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update role requests (approve/reject)
CREATE POLICY "Admins can update role requests"
ON public.role_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_role_requests_updated_at
BEFORE UPDATE ON public.role_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();