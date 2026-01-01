import AppLayout from "@/components/layouts/AppLayout";
import { chatbotConfig } from "@/config/chatbot";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <AppLayout 
      showChatbot={chatbotConfig.enabled && chatbotConfig.enabledOnHomepage}
      chatbotContext={{ 
        title: "Homepage", 
        description: "Verdic AI - AI-powered legal backlog management for Indian judiciary" 
      }}
    >
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </AppLayout>
  );
};

export default Index;
