import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { SEOHead } from '@/components/SEOHead';
import { ArrowRight, Globe, Target, Compass } from 'lucide-react';

const PathwayLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Global Pathways AI - Your Career Decision Guide"
        description="AI-powered decision support to help you decide: should you work or study locally, or go abroad?"
        keywords="career decision, study abroad, work abroad, immigration, AI career guide"
      />
      
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 md:mb-10 inline-flex flex-col items-center">
            <div className="flex items-center flex-wrap justify-center">
              <span
                className="border border-foreground px-3 md:px-6 py-2 md:py-4 animate-fade-in"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              >
                Global
              </span>
              <span
                className="bg-[#ff6bff] border border-foreground px-3 md:px-6 py-2 md:py-4 rounded-[20px] md:rounded-[40px] -ml-px animate-fade-in"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              >
                Pathways
              </span>
              <span
                className="border border-foreground px-3 md:px-6 py-2 md:py-4 -ml-px animate-fade-in"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              >
                AI
              </span>
            </div>
          </h1>

          <p
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            Should you work or study locally, or go abroad? Let AI help you make the right decision based on your unique goals, finances, and preferences.
          </p>

          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            <Button
              onClick={() => navigate('/pathway/onboarding')}
              size="lg"
              className="group relative overflow-hidden bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start My Pathway Analysis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-medium text-center mb-12 animate-fade-in"
            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center p-6 animate-fade-in"
              style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-foreground text-background rounded-full flex items-center justify-center">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Share Your Goals</h3>
              <p className="text-muted-foreground">
                Tell us about your background, career aspirations, and financial situation
              </p>
            </div>

            <div
              className="text-center p-6 animate-fade-in"
              style={{ animationDelay: '1.0s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-foreground text-background rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes local vs. abroad opportunities tailored to your profile
              </p>
            </div>

            <div
              className="text-center p-6 animate-fade-in"
              style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-foreground text-background rounded-full flex items-center justify-center">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Get Your Pathway</h3>
              <p className="text-muted-foreground">
                Receive a personalized recommendation with clear reasoning and alternatives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-medium mb-6 animate-fade-in"
            style={{ animationDelay: '1.2s', animationFillMode: 'both' }}
          >
            Ready to Find Your Path?
          </h2>
          <p
            className="text-muted-foreground mb-8 animate-fade-in"
            style={{ animationDelay: '1.3s', animationFillMode: 'both' }}
          >
            It only takes a few minutes to get your personalized pathway analysis
          </p>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '1.4s', animationFillMode: 'both' }}
          >
            <Button
              onClick={() => navigate('/pathway/onboarding')}
              variant="outline"
              size="lg"
              className="group border-foreground hover:bg-foreground hover:text-background px-8 py-6 text-base"
            >
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PathwayLanding;
