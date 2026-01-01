import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotEmbed from "@/components/ChatbotEmbed";
import ScrollToTop from "@/components/home/ScrollToTop";
import { chatbotConfig } from "@/config/chatbot";

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showChatbot?: boolean;
  showScrollToTop?: boolean;
  chatbotContext?: {
    title: string;
    description: string;
  };
  className?: string;
}

const AppLayout = ({
  children,
  showNavbar = true,
  showFooter = true,
  showChatbot = true,
  showScrollToTop = true,
  chatbotContext = {
    title: "Verdic AI",
    description: "AI-powered legal backlog management for Indian judiciary",
  },
  className = "",
}: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {showNavbar && <Navbar />}
      
      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
      
      {showScrollToTop && <ScrollToTop />}
      
      {showChatbot && chatbotConfig.enabled && (
        <ChatbotEmbed context={chatbotContext} />
      )}
    </div>
  );
};

export default AppLayout;
