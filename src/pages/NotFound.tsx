import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Scale, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layouts/AppLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppLayout showFooter={false} showChatbot={false}>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <Scale className="h-16 w-16 text-primary mx-auto mb-4" />
            <span className="text-6xl font-bold text-gradient-neon">404</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotFound;
