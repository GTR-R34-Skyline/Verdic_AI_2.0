import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowUpDown,
  Gavel
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "case_created" | "case_updated" | "hearing_scheduled" | "reassignment" | "status_change";
  title: string;
  description: string;
  timestamp: string;
  priority?: string;
  status?: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch recent cases
      const { data: recentCases } = await supabase
        .from("cases")
        .select("id, title, status, priority, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5);

      // Fetch recent schedules
      const { data: recentSchedules } = await supabase
        .from("case_schedules")
        .select("id, case_id, hearing_date, hearing_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent reassignments
      const { data: recentReassignments } = await supabase
        .from("case_reassignment_log")
        .select("id, case_id, old_priority, new_priority, reason, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      const activityItems: ActivityItem[] = [];

      // Process cases
      recentCases?.forEach((c) => {
        const isNew = new Date(c.created_at || "").getTime() === new Date(c.updated_at || "").getTime();
        activityItems.push({
          id: `case-${c.id}`,
          type: isNew ? "case_created" : "case_updated",
          title: isNew ? "New Case Filed" : "Case Updated",
          description: c.title,
          timestamp: c.updated_at || c.created_at || "",
          priority: c.priority || undefined,
          status: c.status || undefined,
        });
      });

      // Process schedules
      recentSchedules?.forEach((s) => {
        activityItems.push({
          id: `schedule-${s.id}`,
          type: "hearing_scheduled",
          title: "Hearing Scheduled",
          description: `${s.hearing_type || "Hearing"} scheduled`,
          timestamp: s.created_at || "",
        });
      });

      // Process reassignments
      recentReassignments?.forEach((r) => {
        activityItems.push({
          id: `reassign-${r.id}`,
          type: "reassignment",
          title: "Priority Changed",
          description: `${r.old_priority} → ${r.new_priority}`,
          timestamp: r.created_at || "",
        });
      });

      // Sort by timestamp
      activityItems.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(activityItems.slice(0, 10));
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "case_created":
        return <FileText className="h-4 w-4 text-primary" />;
      case "case_updated":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "hearing_scheduled":
        return <Calendar className="h-4 w-4 text-accent" />;
      case "reassignment":
        return <ArrowUpDown className="h-4 w-4 text-warning" />;
      case "status_change":
        return <Gavel className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "high":
        return "bg-warning/10 text-warning border-warning/20";
      case "medium":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your cases</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mb-2" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.priority && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(activity.priority)}`}
                        >
                          {activity.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
