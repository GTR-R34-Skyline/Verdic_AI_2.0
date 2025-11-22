import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Scale, FileText, Users, Brain } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJhMiAyIDAgMCAxIDIgMnYyYTIgMiAwIDAgMS0yIDJoLTJ2Mmg0djRoLTR2Mmg0djJoLTR2Mmg0djRoLTR2MmgtNHYtMmgtMnYyaC00di0yaC0ydjJoLTR2LTJoLTJ2LTJoLTR2LTRoNHYtMmgtNHYtMmg0di0yaC00di00aDR2LTJoLTR2LTJoNHYtMmgtNHYtNGg0di0yaC00di0yaDR2LTJoLTR2LTRoNHYtMmgtNFYwaDR2Mmg0VjBoNHYyaDJ2LTJoNHYyaDJWMGg0djJoNHYyaDRWMGg0djJoNHYyaDR2Mmg0djRoLTR2Mmg0djJoLTR2Mmg0djRoLTR2Mmg0djJoLTR2Mmg0djRoLTR2Mmg0djJoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-12">
            <Scale className="h-16 w-16 mb-4 text-accent" />
            <h1 className="text-5xl font-bold mb-4">Verdic AI</h1>
            <p className="text-xl opacity-90">
              Revolutionizing Legal Case Management with AI
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">AI-Powered Research</h3>
                <p className="text-sm opacity-80">
                  Instant access to precedents and case law analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Smart Documentation</h3>
                <p className="text-sm opacity-80">
                  Automated document generation and analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Collaborative Platform</h3>
                <p className="text-sm opacity-80">
                  Seamless coordination between lawyers, judges, and clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Scale className="mx-auto h-12 w-12 text-primary lg:hidden mb-4" />
            <h2 className="text-3xl font-bold text-foreground">
              {view === 'sign_in' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {view === 'sign_in' 
                ? 'Sign in to access your legal dashboard' 
                : 'Join Verdic AI to transform legal workflows'}
            </p>
          </div>

          <div className="mt-8">
            <SupabaseAuth
              supabaseClient={supabase}
              view={view}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(215 45% 25%)',
                      brandAccent: 'hsl(38 92% 50%)',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'bg-primary hover:bg-primary-hover text-primary-foreground',
                  input: 'border-input',
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />

            <div className="mt-6 text-center">
              <button
                onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')}
                className="text-sm text-primary hover:text-primary-hover font-medium"
              >
                {view === 'sign_in' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;