import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotEmbed from "@/components/ChatbotEmbed";
import { chatbotConfig } from "@/config/chatbot";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import ScrollToTop from "@/components/home/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
      
      <ScrollToTop />
      
      {chatbotConfig.enabled && chatbotConfig.enabledOnHomepage && (
        <ChatbotEmbed 
          context={{ 
            title: "Homepage", 
            description: "Verdic AI - AI-powered legal backlog management for Indian judiciary" 
          }}
        />
      )}
    </div>
  );
};

export default Index;
