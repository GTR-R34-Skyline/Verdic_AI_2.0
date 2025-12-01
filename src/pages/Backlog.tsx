import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, ArrowLeft, AlertCircle, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Backlog = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchBacklogCases();
  }, [statusFilter, priorityFilter]);

  const fetchBacklogCases = async () => {
    try {
      let query = supabase
        .from("cases")
        .select(`
          *,
          petitioner_lawyer:petitioner_lawyer_id(full_name),
          respondent_lawyer:respondent_lawyer_id(full_name),
          assigned_judge:assigned_judge_id(full_name)
        `)
        .order("priority", { ascending: false })
        .order("filing_date", { ascending: true });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }

      if (priorityFilter !== "all") {
        query = query.eq("priority", priorityFilter as any);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Detect stale cases (no update in 30+ days)
      const now = new Date();
      const casesWithStaleness = (data || []).map((c) => {
        const lastUpdate = c.updated_at ? new Date(c.updated_at) : new Date(c.created_at);
        const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...c,
          is_stale: daysSinceUpdate > 30,
          days_since_update: daysSinceUpdate,
        };
      });

      setCases(casesWithStaleness);
    } catch (error) {
      console.error("Error fetching backlog:", error);
      toast.error("Failed to load backlog");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-accent/10 text-accent border-accent/20",
      low: "bg-muted",
    };
    return colors[priority] || "bg-muted";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      filed: "bg-muted",
      under_review: "bg-warning/10 text-warning border-warning/20",
      hearing_scheduled: "bg-accent/10 text-accent border-accent/20",
      evidence_submission: "bg-blue-100 text-blue-700 border-blue-200",
      judgment_pending: "bg-purple-100 text-purple-700 border-purple-200",
      closed: "bg-success/10 text-success border-success/20",
      appealed: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[status] || "bg-muted";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const staleCases = cases.filter((c) => c.is_stale);
  const criticalCases = cases.filter((c) => c.priority === "critical");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Case Backlog Management</h1>
              <p className="text-xs text-muted-foreground">{cases.length} cases in backlog</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{cases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Critical Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{criticalCases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Stale Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{staleCases.length}</div>
              <p className="text-xs text-muted-foreground mt-1">No activity in 30+ days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="filed">Filed</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="hearing_scheduled">Hearing Scheduled</SelectItem>
                    <SelectItem value="evidence_submission">Evidence Submission</SelectItem>
                    <SelectItem value="judgment_pending">Judgment Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                caseItem.is_stale ? "border-l-4 border-l-warning" : ""
              }`}
              onClick={() => navigate(`/cases/${caseItem.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{caseItem.case_number}</h3>
                      {caseItem.is_stale && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Stale ({caseItem.days_since_update}d)
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{caseItem.title}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="outline" className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(caseItem.status)}>
                      {caseItem.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Filed: {new Date(caseItem.filing_date).toLocaleDateString()}
                    </span>
                  </div>
                  {caseItem.assigned_judge && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Judge: {caseItem.assigned_judge.full_name}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-medium">{caseItem.case_type}</span>
                  </div>
                  {caseItem.next_hearing_date && (
                    <div>
                      <span className="text-muted-foreground">Next Hearing: </span>
                      <span className="font-medium">
                        {new Date(caseItem.next_hearing_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {cases.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No cases found in backlog</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Backlog;
