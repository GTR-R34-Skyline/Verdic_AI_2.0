import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Scale, FileText, Calendar, TrendingUp, 
  AlertCircle, CheckCircle, Clock, Users,
  Brain, MessageSquare, FileSearch, LogOut
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    upcomingHearings: 0,
    pendingDocuments: 0,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Fetch dashboard statistics
      const { count: totalCases } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true });

      const { count: activeCases } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true })
        .in("status", ["under_review", "hearing_scheduled", "evidence_submission"]);

      const { count: upcomingHearings } = await supabase
        .from("case_schedules")
        .select("*", { count: "exact", head: true })
        .gte("hearing_date", new Date().toISOString())
        .eq("status", "scheduled");

      setStats({
        totalCases: totalCases || 0,
        activeCases: activeCases || 0,
        upcomingHearings: upcomingHearings || 0,
        pendingDocuments: 0,
      });

    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Verdic AI</h1>
              <p className="text-xs text-muted-foreground">Legal Case Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || "User"}
          </h2>
          <p className="text-muted-foreground">
            Here's your legal dashboard overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCases}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All registered cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.activeCases}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.upcomingHearings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Consultations</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Active</div>
              <p className="text-xs text-muted-foreground mt-1">
                AI assistant ready
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary"
                onClick={() => navigate("/cases")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Case Management</CardTitle>
                  <CardDescription>View and manage all cases</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-accent"
                onClick={() => navigate("/legal-assistant")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>AI Legal Assistant</CardTitle>
                  <CardDescription>Get instant legal guidance</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-success"
                onClick={() => navigate("/research")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <FileSearch className="h-6 w-6 text-success" />
                </div>
                <div>
                  <CardTitle>Legal Research</CardTitle>
                  <CardDescription>Search precedents & case law</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">AI Services</p>
                    <p className="text-sm text-muted-foreground">Operational</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Badge variant="outline">
                  Healthy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;