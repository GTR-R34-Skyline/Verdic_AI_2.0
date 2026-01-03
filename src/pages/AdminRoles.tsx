import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft, Loader2, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RoleRequest = {
  id: string;
  user_id: string;
  requested_role: string;
  status: string;
  bar_council_id: string | null;
  court_name: string | null;
  years_of_experience: number | null;
  specialization: string | null;
  reason: string | null;
  rejection_reason: string | null;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
  };
};

const AdminRoles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; requestId: string | null }>({ open: false, requestId: null });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast.error("You don't have permission to access this page");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchRequests();
    } catch (error) {
      console.error("Error checking admin:", error);
      navigate("/dashboard");
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("role_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for each request
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", request.user_id)
            .maybeSingle();
          return { ...request, profile } as RoleRequest;
        })
      );

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load role requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: RoleRequest) => {
    setProcessing(request.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Add the role to user_roles
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{
          user_id: request.user_id,
          role: request.requested_role as any,
        }]);

      if (roleError) throw roleError;

      // Update the request status
      const { error: updateError } = await supabase
        .from("role_requests")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Update profile with additional info if provided
      if (request.bar_council_id || request.specialization || request.years_of_experience) {
        await supabase
          .from("profiles")
          .update({
            bar_council_id: request.bar_council_id,
            specialization: request.specialization,
            years_of_experience: request.years_of_experience,
          })
          .eq("id", request.user_id);
      }

      toast.success(`Approved ${request.profile?.full_name || "user"} as ${request.requested_role}`);
      fetchRequests();
    } catch (error: any) {
      console.error("Error approving request:", error);
      if (error.code === "23505") {
        toast.error("User already has this role");
        // Still update the request status
        await supabase
          .from("role_requests")
          .update({ status: "approved" })
          .eq("id", request.id);
        fetchRequests();
      } else {
        toast.error("Failed to approve request");
      }
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.requestId) return;
    
    setProcessing(rejectDialog.requestId);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("role_requests")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason || null,
        })
        .eq("id", rejectDialog.requestId);

      if (error) throw error;

      toast.success("Request rejected");
      setRejectDialog({ open: false, requestId: null });
      setRejectionReason("");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const processedRequests = requests.filter(r => r.status !== "pending");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Role Management</h1>
            <p className="text-xs text-muted-foreground">Approve or reject role requests</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending role requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{request.profile?.full_name || "Unknown User"}</CardTitle>
                          <CardDescription>{request.profile?.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{request.requested_role}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {request.bar_council_id && (
                        <div>
                          <span className="text-muted-foreground block">Bar Council ID</span>
                          <span className="font-medium">{request.bar_council_id}</span>
                        </div>
                      )}
                      {request.court_name && (
                        <div>
                          <span className="text-muted-foreground block">Court/Organization</span>
                          <span className="font-medium">{request.court_name}</span>
                        </div>
                      )}
                      {request.years_of_experience && (
                        <div>
                          <span className="text-muted-foreground block">Experience</span>
                          <span className="font-medium">{request.years_of_experience} years</span>
                        </div>
                      )}
                      {request.specialization && (
                        <div>
                          <span className="text-muted-foreground block">Specialization</span>
                          <span className="font-medium">{request.specialization}</span>
                        </div>
                      )}
                    </div>

                    {request.reason && (
                      <div className="text-sm">
                        <span className="text-muted-foreground block mb-1">Additional Information</span>
                        <p className="bg-muted/50 p-3 rounded-md">{request.reason}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(request.created_at).toLocaleString()}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApprove(request)}
                        disabled={processing === request.id}
                        className="flex-1"
                      >
                        {processing === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setRejectDialog({ open: true, requestId: request.id })}
                        disabled={processing === request.id}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {processedRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No processed requests yet</p>
                </CardContent>
              </Card>
            ) : (
              processedRequests.map((request) => (
                <Card key={request.id} className="border-border opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{request.profile?.full_name || "Unknown User"}</CardTitle>
                          <CardDescription>{request.profile?.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{request.requested_role}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  {request.rejection_reason && (
                    <CardContent>
                      <div className="text-sm">
                        <span className="text-muted-foreground block mb-1">Rejection Reason</span>
                        <p className="bg-destructive/5 p-3 rounded-md text-destructive">{request.rejection_reason}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, requestId: open ? rejectDialog.requestId : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Role Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this request (optional).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, requestId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!!processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRoles;
