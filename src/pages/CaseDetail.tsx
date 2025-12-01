import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, ArrowLeft, ArrowUp, ArrowDown, FileSearch, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [reassigning, setReassigning] = useState(false);
  const [precedents, setPrecedents] = useState<any[]>([]);
  const [loadingPrecedents, setLoadingPrecedents] = useState(false);
  const [showPrecedents, setShowPrecedents] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  const fetchCase = async () => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          petitioner_lawyer:petitioner_lawyer_id(full_name),
          respondent_lawyer:respondent_lawyer_id(full_name),
          assigned_judge:assigned_judge_id(full_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setCaseData(data);
      setNewPriority(data.priority);
    } catch (error) {
      console.error("Error fetching case:", error);
      toast.error("Failed to load case details");
      navigate("/cases");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!newPriority || !reassignReason.trim()) {
      toast.error("Please select a new priority and provide a reason");
      return;
    }

    setReassigning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Log the reassignment
      const { error: logError } = await supabase
        .from("case_reassignment_log")
        .insert([{
          case_id: id!,
          old_priority: caseData.priority,
          new_priority: newPriority as any,
          reason: reassignReason,
          changed_by: user?.id,
        }]);

      if (logError) throw logError;

      // Update the case priority
      const { error: updateError } = await supabase
        .from("cases")
        .update({ priority: newPriority as any })
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Case priority updated successfully");
      setReassignDialogOpen(false);
      setReassignReason("");
      fetchCase();
    } catch (error) {
      console.error("Error reassigning case:", error);
      toast.error("Failed to update case priority");
    } finally {
      setReassigning(false);
    }
  };

  const findPrecedents = async () => {
    if (!caseData?.description) {
      toast.error("Case description is required to find precedents");
      return;
    }

    setLoadingPrecedents(true);
    setShowPrecedents(true);
    try {
      const { data, error } = await supabase.functions.invoke("case-precedents", {
        body: {
          caseAbstract: caseData.description,
          caseId: id,
        },
      });

      if (error) throw error;
      setPrecedents(data.similar_cases || []);
      
      if (!data.similar_cases || data.similar_cases.length === 0) {
        toast.info("No similar cases found");
      }
    } catch (error) {
      console.error("Error finding precedents:", error);
      toast.error("Failed to find similar cases");
    } finally {
      setLoadingPrecedents(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cases")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">{caseData.case_number}</h1>
              <p className="text-xs text-muted-foreground">{caseData.title}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Case Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Case Information</CardTitle>
                <CardDescription>Detailed information about this case</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={getPriorityColor(caseData.priority)}>
                  {caseData.priority}
                </Badge>
                <Badge variant="outline">
                  {caseData.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Case Type:</h4>
                <p className="text-sm text-muted-foreground">{caseData.case_type}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Court:</h4>
                <p className="text-sm text-muted-foreground">{caseData.court_name || "Not specified"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Filing Date:</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(caseData.filing_date).toLocaleDateString()}
                </p>
              </div>
              {caseData.next_hearing_date && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Next Hearing:</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(caseData.next_hearing_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Petitioner:</h4>
              <p className="text-sm text-muted-foreground">{caseData.petitioner_name}</p>
              {caseData.petitioner_lawyer && (
                <p className="text-xs text-muted-foreground">
                  Lawyer: {caseData.petitioner_lawyer.full_name}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Respondent:</h4>
              <p className="text-sm text-muted-foreground">{caseData.respondent_name}</p>
              {caseData.respondent_lawyer && (
                <p className="text-xs text-muted-foreground">
                  Lawyer: {caseData.respondent_lawyer.full_name}
                </p>
              )}
            </div>

            {caseData.assigned_judge && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Assigned Judge:</h4>
                <p className="text-sm text-muted-foreground">{caseData.assigned_judge.full_name}</p>
              </div>
            )}

            {caseData.description && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Description:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Case Reassignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Management</CardTitle>
              <CardDescription>Adjust case priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Reassign Priority
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reassign Case Priority</DialogTitle>
                    <DialogDescription>
                      Change the priority level of this case. This action will be logged.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Priority</label>
                      <Badge variant="outline" className={getPriorityColor(caseData.priority)}>
                        {caseData.priority}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">New Priority</label>
                      <Select value={newPriority} onValueChange={setNewPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Reason for Reassignment</label>
                      <Textarea
                        value={reassignReason}
                        onChange={(e) => setReassignReason(e.target.value)}
                        placeholder="Explain why this priority change is needed..."
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleReassign}
                      disabled={reassigning || !newPriority || !reassignReason.trim()}
                      className="w-full"
                    >
                      {reassigning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Confirm Reassignment"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Precedent Finding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Similar Cases</CardTitle>
              <CardDescription>AI-powered precedent discovery</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={findPrecedents} disabled={loadingPrecedents} className="w-full">
                {loadingPrecedents ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4 mr-2" />
                    Find Precedents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Similar Cases Results */}
        {showPrecedents && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5" />
                Similar Cases Found
              </CardTitle>
              <CardDescription>
                Cases with similar facts and legal issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPrecedents ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Analyzing case similarity...</p>
                </div>
              ) : precedents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No similar cases found</p>
              ) : (
                <div className="space-y-4">
                  {precedents.map((precedent, idx) => (
                    <Card
                      key={precedent.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/cases/${precedent.id}`)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="bg-accent/10 text-accent">
                                {Math.round(precedent.similarity_score * 100)}% match
                              </Badge>
                              <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                            </div>
                            <h4 className="font-semibold">{precedent.case_number}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{precedent.title}</p>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(precedent.priority)}>
                            {precedent.priority}
                          </Badge>
                        </div>
                        {precedent.reasoning && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm text-muted-foreground">{precedent.reasoning}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Type: {precedent.case_type}</span>
                          <span>Status: {precedent.status.replace(/_/g, " ")}</span>
                          <span>Filed: {new Date(precedent.filing_date).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseDetail;
