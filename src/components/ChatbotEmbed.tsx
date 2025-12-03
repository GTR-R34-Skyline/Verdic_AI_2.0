import React, { lazy, Suspense, useState, useCallback } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lazy load the chat panel component
const ChatPanel = lazy(() => import("./ChatPanel"));

interface ChatbotEmbedProps {
  caseId?: string;
  context?: {
    title?: string;
    description?: string;
    caseType?: string;
    priority?: string;
  };
  initialOpen?: boolean;
  enabled?: boolean;
}

/**
 * ChatbotEmbed - Floating chat widget with lazy-loaded panel
 * - Renders a floating bubble bottom-right
 * - Opens slide-up panel when clicked
 * - Passes caseId and context to the chatbot
 */
const ChatbotEmbed: React.FC<ChatbotEmbedProps> = ({
  caseId,
  context,
  initialOpen = false,
  enabled = true,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Floating Chat Bubble */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-all duration-300 hover:scale-110",
          isOpen && "rotate-90"
        )}
        size="icon"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Panel Overlay */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]",
            "h-[500px] max-h-[calc(100vh-8rem)]",
            "bg-background border rounded-2xl shadow-2xl overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in-0 duration-300"
          )}
        >
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ChatPanel caseId={caseId} context={context} onClose={toggleChat} />
          </Suspense>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleChat}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default ChatbotEmbed;
