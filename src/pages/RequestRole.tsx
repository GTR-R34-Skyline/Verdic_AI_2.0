import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, ArrowLeft, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type RoleRequest = {
  id: string;
  requested_role: string;
  status: string;
  bar_council_id: string | null;
  court_name: string | null;
  years_of_experience: number | null;
  specialization: string | null;
  reason: string | null;
  rejection_reason: string | null;
  created_at: string;
};

const RequestRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingRequest, setExistingRequest] = useState<RoleRequest | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    requested_role: "",
    bar_council_id: "",
    court_name: "",
    years_of_experience: "",
    specialization: "",
    reason: "",
  });

  useEffect(() => {
    checkExistingRequest();
  }, []);

  const checkExistingRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check existing roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      setUserRoles((roles || []).map(r => r.role));

      // Check for pending request
      const { data: requests } = await supabase
        .from("role_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (requests && requests.length > 0) {
        setExistingRequest(requests[0] as RoleRequest);
      }
    } catch (error) {
      console.error("Error checking request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requested_role) {
      toast.error("Please select a role to request");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase
        .from("role_requests")
        .insert([{
          user_id: user.id,
          requested_role: formData.requested_role as any,
          bar_council_id: formData.bar_council_id || null,
          court_name: formData.court_name || null,
          years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
          specialization: formData.specialization || null,
          reason: formData.reason || null,
        }]);

      if (error) throw error;

      toast.success("Role request submitted successfully! An admin will review your request.");
      checkExistingRequest();
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Clock className="h-3 w-3 mr-1" /> Pending Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasRole = (role: string) => userRoles.includes(role);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Request Professional Role</h1>
            <p className="text-xs text-muted-foreground">Apply for lawyer or judge access</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Current Roles */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle>Your Current Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userRoles.length === 0 ? (
                <p className="text-muted-foreground">No roles assigned yet</p>
              ) : (
                userRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="capitalize">
                    {role.replace("_", " ")}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Request Status */}
        {existingRequest && existingRequest.status === "pending" && (
          <Card className="border-warning/50 bg-warning/5 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Request
              </CardTitle>
              <CardDescription>
                You have a pending role request submitted on{" "}
                {new Date(existingRequest.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Role:</span>
                  <span className="font-medium capitalize">{existingRequest.requested_role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(existingRequest.status)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Your request is being reviewed by an administrator. You will be notified once a decision is made.
              </p>
            </CardContent>
          </Card>
        )}

        {existingRequest && existingRequest.status === "rejected" && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Previous Request Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Role:</span>
                  <span className="font-medium capitalize">{existingRequest.requested_role}</span>
                </div>
                {existingRequest.rejection_reason && (
                  <div>
                    <span className="text-muted-foreground">Reason:</span>
                    <p className="text-sm mt-1">{existingRequest.rejection_reason}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                You can submit a new request below with additional information.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Role Request Form */}
        {(hasRole("lawyer") && hasRole("judge")) ? (
          <Card className="border-success/50 bg-success/5">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold">You have all professional roles</h3>
              <p className="text-muted-foreground">No additional roles available to request.</p>
            </CardContent>
          </Card>
        ) : existingRequest?.status === "pending" ? null : (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Request a Professional Role</CardTitle>
              <CardDescription>
                Provide your credentials to request lawyer or judge access. An administrator will review your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requested_role">Role to Request *</Label>
                  <Select
                    value={formData.requested_role}
                    onValueChange={(value) => setFormData({ ...formData, requested_role: value })}
                    required
                  >
                    <SelectTrigger id="requested_role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {!hasRole("lawyer") && <SelectItem value="lawyer">Lawyer</SelectItem>}
                      {!hasRole("judge") && <SelectItem value="judge">Judge</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bar_council_id">Bar Council ID / License Number</Label>
                  <Input
                    id="bar_council_id"
                    placeholder="e.g., BAR/2020/12345"
                    value={formData.bar_council_id}
                    onChange={(e) => setFormData({ ...formData, bar_council_id: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="court_name">Court / Organization</Label>
                    <Input
                      id="court_name"
                      placeholder="e.g., Supreme Court of India"
                      value={formData.court_name}
                      onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    <Input
                      id="years_of_experience"
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      value={formData.years_of_experience}
                      onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Constitutional Law, Criminal Law"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Additional Information</Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide any additional details to support your request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestRole;
