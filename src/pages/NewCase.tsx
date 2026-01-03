import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const NewCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    case_number: "",
    title: "",
    description: "",
    case_type: "",
    priority: "medium",
    petitioner_name: "",
    respondent_name: "",
    court_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.case_number || !formData.title || !formData.case_type || !formData.petitioner_name || !formData.respondent_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a case");
        return;
      }

      const { data, error } = await supabase
        .from("cases")
        .insert([{
          case_number: formData.case_number,
          title: formData.title,
          description: formData.description || null,
          case_type: formData.case_type as any,
          priority: formData.priority as any,
          petitioner_name: formData.petitioner_name,
          respondent_name: formData.respondent_name,
          court_name: formData.court_name || null,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Case created successfully");
      navigate(`/cases/${data.id}`);
    } catch (error: any) {
      console.error("Error creating case:", error);
      if (error.code === "42501") {
        toast.error("You don't have permission to create cases. Only lawyers, judges, and admins can create cases.");
      } else {
        toast.error("Failed to create case");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cases")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Case</h1>
            <p className="text-xs text-muted-foreground">Create a new case filing</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
            <CardDescription>Fill in the required information to create a new case</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case_number">Case Number *</Label>
                  <Input
                    id="case_number"
                    placeholder="e.g., CIV/2024/001"
                    value={formData.case_number}
                    onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="case_type">Case Type *</Label>
                  <Select
                    value={formData.case_type}
                    onValueChange={(value) => setFormData({ ...formData, case_type: value })}
                    required
                  >
                    <SelectTrigger id="case_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="constitutional">Constitutional</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title describing the case"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the case..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petitioner_name">Petitioner Name *</Label>
                  <Input
                    id="petitioner_name"
                    placeholder="Name of the petitioner"
                    value={formData.petitioner_name}
                    onChange={(e) => setFormData({ ...formData, petitioner_name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="respondent_name">Respondent Name *</Label>
                  <Input
                    id="respondent_name"
                    placeholder="Name of the respondent"
                    value={formData.respondent_name}
                    onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="court_name">Court Name</Label>
                  <Input
                    id="court_name"
                    placeholder="e.g., Supreme Court of India"
                    value={formData.court_name}
                    onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/cases")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Case"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewCase;
