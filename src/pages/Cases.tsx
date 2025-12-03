import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, Plus, ArrowLeft, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import TextRenderer from "@/components/TextRenderer";

const Cases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      let query = supabase
        .from("cases")
        .select(`
          *,
          petitioner_lawyer:petitioner_lawyer_id(full_name),
          respondent_lawyer:respondent_lawyer_id(full_name),
          assigned_judge:assigned_judge_id(full_name)
        `)
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-accent/10 text-accent border-accent/20",
      low: "bg-muted",
    };
    return colors[priority] || "bg-muted";
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Case Management</h1>
              <p className="text-xs text-muted-foreground">{filteredCases.length} cases</p>
            </div>
          </div>
          
          <Button onClick={() => navigate("/cases/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by case number or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="hearing_scheduled">Hearing Scheduled</SelectItem>
                  <SelectItem value="evidence_submission">Evidence Submission</SelectItem>
                  <SelectItem value="judgment_pending">Judgment Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="appealed">Appealed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No cases found</p>
              <Button className="mt-4" onClick={() => navigate("/cases/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Case
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/cases/${caseItem.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{caseItem.case_number}</CardTitle>
                      <CardDescription className="mt-1">
                        <TextRenderer text={caseItem.title} />
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(caseItem.status)}>
                      {caseItem.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="outline">
                      {caseItem.case_type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Petitioner:</span>
                      <span className="font-medium">{caseItem.petitioner_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Respondent:</span>
                      <span className="font-medium">{caseItem.respondent_name}</span>
                    </div>
                    {caseItem.assigned_judge && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Judge:</span>
                        <span className="font-medium">{caseItem.assigned_judge.full_name}</span>
                      </div>
                    )}
                    {caseItem.next_hearing_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Hearing:</span>
                        <span className="font-medium">
                          {new Date(caseItem.next_hearing_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;