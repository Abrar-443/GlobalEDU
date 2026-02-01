import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { SEOHead } from '@/components/SEOHead';
import { usePathway } from '@/contexts/PathwayContext';
import { Loader2, Brain, Globe, Sparkles, CheckCircle } from 'lucide-react';

const ANALYSIS_STEPS = [
  { icon: Brain, text: 'Analyzing your profile...' },
  { icon: Globe, text: 'Comparing local vs international opportunities...' },
  { icon: Sparkles, text: 'Generating personalized recommendations...' },
  { icon: CheckCircle, text: 'Finalizing your pathway...' },
];

const PathwayAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, setResult, isAnalyzing, setIsAnalyzing, setError } = usePathway();
  const [currentStep, setCurrentStep] = React.useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Check if profile is complete
    if (!userProfile.age || !userProfile.country) {
      navigate('/pathway/onboarding');
      return;
    }

    const analyzePathway = async () => {
      setIsAnalyzing(true);
      setError(null);

      // Animate through steps
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pathway-decision`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ userProfile }),
          }
        );

        clearInterval(stepInterval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to analyze pathway');
        }

        const data = await response.json();
        setResult(data);
        navigate('/pathway/results');
      } catch (err) {
        clearInterval(stepInterval);
        console.error('Analysis error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during analysis');
        navigate('/pathway/results');
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzePathway();
  }, [userProfile, navigate, setResult, setIsAnalyzing, setError]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Analyzing Your Pathway - Global Pathways AI"
        description="Our AI is analyzing your profile to find the best pathway for you"
      />

      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>

      <div className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main Loading Animation */}
          <div className="mb-12">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-secondary" />
              <div className="absolute inset-0 rounded-full border-4 border-foreground border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-foreground animate-spin" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-medium mb-4 animate-fade-in">
              Analyzing Your Pathway
            </h1>
            <p className="text-muted-foreground animate-fade-in">
              Please wait while our AI processes your information...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {ANALYSIS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-foreground text-background'
                      : isComplete
                      ? 'bg-secondary text-foreground'
                      : 'bg-secondary/50 text-muted-foreground'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-background/20'
                        : isComplete
                        ? 'bg-foreground/10'
                        : 'bg-foreground/5'
                    }`}
                  >
                    {isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-sm md:text-base font-medium">{step.text}</span>
                </div>
              );
            })}
          </div>

          {/* Fun Facts / Tips */}
          <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Did you know? Over 5.6 million international students are studying abroad worldwide, with the number growing every year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayAnalysis;
