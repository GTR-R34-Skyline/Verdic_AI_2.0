import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Scale, ArrowLeft, Search, FileSearch, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { validateSearchQuery } from "@/lib/validation";

const Research = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    // Validate and sanitize search input
    const validationResult = validateSearchQuery(searchQuery);
    if (!validationResult.success) {
      toast.error(validationResult.error);
      return;
    }
    const sanitizedQuery = validationResult.data as string;

    setLoading(true);
    try {
      // Search in legal precedents with sanitized input
      const { data: precedents, error: precedentsError } = await supabase
        .from("legal_precedents")
        .select("*")
        .or(`title.ilike.%${sanitizedQuery}%,summary.ilike.%${sanitizedQuery}%`)
        .limit(10);

      if (precedentsError) throw precedentsError;

      // Get AI analysis of the search query
      const { data: aiData, error: aiError } = await supabase.functions.invoke("legal-research", {
        body: {
          query: searchQuery,
          precedents: precedents || [],
        },
      });

      if (aiError) throw aiError;

      setResults(precedents || []);
      setAiInsights(aiData.insights || "");
      
      if ((precedents || []).length === 0) {
        toast.info("No precedents found in database. Showing AI analysis.");
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Legal Research</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Case Law Search</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Bar */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Search Legal Database
            </CardTitle>
            <CardDescription>
              Search for precedents, case law, and legal principles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter case name, legal principle, or statute..."
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        {aiInsights && (
          <Card className="mb-6 border-l-4 border-l-accent border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <BookOpen className="h-5 w-5" />
                AI Legal Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiInsights}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Found {results.length} Precedent{results.length !== 1 ? "s" : ""}
            </h2>
            {results.map((precedent) => (
              <Card key={precedent.id} className="hover:shadow-md transition-shadow border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{precedent.title}</CardTitle>
                      <CardDescription>{precedent.citation}</CardDescription>
                    </div>
                    <Badge variant="outline">{precedent.case_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Court:</h4>
                      <p className="text-sm text-muted-foreground">{precedent.court_name}</p>
                    </div>
                    
                    {precedent.judgment_date && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Date:</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(precedent.judgment_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Summary:</h4>
                      <p className="text-sm text-muted-foreground">{precedent.summary}</p>
                    </div>
                    
                    {precedent.key_principles && precedent.key_principles.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Principles:</h4>
                        <div className="flex flex-wrap gap-2">
                          {precedent.key_principles.map((principle: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{principle}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {precedent.judges && precedent.judges.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Judges:</h4>
                        <p className="text-sm text-muted-foreground">
                          {precedent.judges.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !aiInsights && results.length === 0 && searchQuery && (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try different keywords or check spelling
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Research;
