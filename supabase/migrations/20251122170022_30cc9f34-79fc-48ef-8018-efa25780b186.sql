-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'judge', 'lawyer', 'public_user');
CREATE TYPE public.case_status AS ENUM ('filed', 'under_review', 'hearing_scheduled', 'evidence_submission', 'judgment_pending', 'closed', 'appealed');
CREATE TYPE public.case_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.case_type AS ENUM ('civil', 'criminal', 'family', 'corporate', 'constitutional', 'tax', 'labor');
CREATE TYPE public.document_type AS ENUM ('petition', 'evidence', 'affidavit', 'order', 'judgment', 'notice', 'appeal', 'contract', 'other');

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    bar_council_id TEXT,
    specialization TEXT,
    years_of_experience INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cases table
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    case_type case_type NOT NULL,
    status case_status DEFAULT 'filed',
    priority case_priority DEFAULT 'medium',
    filing_date DATE NOT NULL DEFAULT CURRENT_DATE,
    petitioner_name TEXT NOT NULL,
    respondent_name TEXT NOT NULL,
    petitioner_lawyer_id UUID REFERENCES public.profiles(id),
    respondent_lawyer_id UUID REFERENCES public.profiles(id),
    assigned_judge_id UUID REFERENCES public.profiles(id),
    court_name TEXT,
    next_hearing_date TIMESTAMPTZ,
    estimated_duration_months INTEGER,
    ai_priority_score DECIMAL(5,2),
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Case documents table
CREATE TABLE public.case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    document_type document_type NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT,
    file_size BIGINT,
    mime_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    is_verified BOOLEAN DEFAULT false,
    ai_summary TEXT,
    extracted_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Legal precedents database
CREATE TABLE public.legal_precedents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citation TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    court_name TEXT NOT NULL,
    judgment_date DATE,
    case_type case_type,
    summary TEXT NOT NULL,
    full_text TEXT,
    key_principles TEXT[],
    related_laws TEXT[],
    judges TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Case assignments and scheduling
CREATE TABLE public.case_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    hearing_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    courtroom TEXT,
    hearing_type TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Legal consultations (chatbot interactions)
CREATE TABLE public.legal_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT,
    context JSONB,
    helpful_rating INTEGER CHECK (helpful_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Case similarity tracking
CREATE TABLE public.case_similarities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    similar_case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    similarity_score DECIMAL(5,4) NOT NULL,
    common_factors TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(case_id, similar_case_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_precedents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_similarities ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  
  -- Assign public_user role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'public_user');
  
  RETURN NEW;
END;
$$;

-- Trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cases
CREATE POLICY "Authenticated users can view cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Lawyers and judges can create cases"
  ON public.cases FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'lawyer') OR 
    public.has_role(auth.uid(), 'judge') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Assigned users can update cases"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR
    auth.uid() = petitioner_lawyer_id OR
    auth.uid() = respondent_lawyer_id OR
    auth.uid() = assigned_judge_id OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for case_documents
CREATE POLICY "Users can view case documents"
  ON public.case_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload documents"
  ON public.case_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- RLS Policies for legal_precedents
CREATE POLICY "Anyone can view precedents"
  ON public.legal_precedents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage precedents"
  ON public.legal_precedents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for case_schedules
CREATE POLICY "Users can view schedules"
  ON public.case_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Judges and admins can manage schedules"
  ON public.case_schedules FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'judge') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for legal_consultations
CREATE POLICY "Users can view own consultations"
  ON public.legal_consultations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create consultations"
  ON public.legal_consultations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for case_similarities
CREATE POLICY "Users can view case similarities"
  ON public.case_similarities FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_priority ON public.cases(priority);
CREATE INDEX idx_cases_case_type ON public.cases(case_type);
CREATE INDEX idx_cases_assigned_judge ON public.cases(assigned_judge_id);
CREATE INDEX idx_cases_next_hearing ON public.cases(next_hearing_date);
CREATE INDEX idx_case_documents_case_id ON public.case_documents(case_id);
CREATE INDEX idx_case_schedules_case_id ON public.case_schedules(case_id);
CREATE INDEX idx_case_schedules_hearing_date ON public.case_schedules(hearing_date);
CREATE INDEX idx_legal_consultations_user_id ON public.legal_consultations(user_id);
CREATE INDEX idx_legal_consultations_session_id ON public.legal_consultations(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();