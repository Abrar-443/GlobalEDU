import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { SEOHead } from '@/components/SEOHead';
import { usePathway } from '@/contexts/PathwayContext';
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Globe,
  Home,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';

const PathwayResults: React.FC = () => {
  const navigate = useNavigate();
  const { result, error, resetAll } = usePathway();

  const handleStartOver = () => {
    resetAll();
    navigate('/pathway');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Error - Global Pathways AI" description="An error occurred during analysis" />
        <Navbar />

        <div className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium mb-4">Something Went Wrong</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={handleStartOver} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="No Results - Global Pathways AI" description="No analysis results available" />
        <Navbar />

        <div className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-medium mb-4">No Results Available</h1>
            <p className="text-muted-foreground mb-8">
              Please complete the pathway analysis to see your results.
            </p>
            <Button onClick={() => navigate('/pathway/onboarding')} className="gap-2">
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Your Pathway Results - Global Pathways AI"
        description="Your personalized career pathway recommendation"
      />

      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>

      <div className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Your Pathway Analysis</h1>
            <p className="text-muted-foreground">
              Based on your profile, here's our AI-powered recommendation
            </p>
          </div>

          {/* Main Recommendation */}
          <Card className="mb-8 border-2 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <CardHeader className="bg-foreground text-background">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardDescription className="text-background/70 mb-1">Recommended Pathway</CardDescription>
                  <CardTitle className="text-xl md:text-2xl">{result.final_recommendation}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className={`text-2xl font-bold ${getConfidenceColor(result.confidence_score)}`}>
                    {result.confidence_score}%
                  </span>
                  <span className="text-sm text-background/70">confidence</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Why This Recommendation?</h3>
              <ul className="space-y-2">
                {result.reasoning_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Local vs Abroad Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Local Option */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <CardTitle className="text-lg">Stay Local</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{result.local_vs_abroad_comparison.local.estimated_timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{result.local_vs_abroad_comparison.local.estimated_cost}</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-green-600">Pros</h4>
                  <ul className="space-y-1">
                    {result.local_vs_abroad_comparison.local.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-red-600">Cons</h4>
                  <ul className="space-y-1">
                    {result.local_vs_abroad_comparison.local.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Abroad Option */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle className="text-lg">Go Abroad</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{result.local_vs_abroad_comparison.abroad.estimated_timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{result.local_vs_abroad_comparison.abroad.estimated_cost}</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-green-600">Pros</h4>
                  <ul className="space-y-1">
                    {result.local_vs_abroad_comparison.abroad.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-red-600">Cons</h4>
                  <ul className="space-y-1">
                    {result.local_vs_abroad_comparison.abroad.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alternate Pathways */}
          <Card className="mb-8 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <CardHeader>
              <CardTitle className="text-lg">Alternative Pathways to Consider</CardTitle>
              <CardDescription>Other options that might work for your situation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.alternate_pathways.map((pathway, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium mb-3">{pathway.path}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-2">Pros</h5>
                        <ul className="space-y-1">
                          {pathway.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-600 mb-2">Cons</h5>
                        <ul className="space-y-1">
                          {pathway.cons.map((con, conIndex) => (
                            <li key={conIndex} className="flex items-start gap-2 text-sm">
                              <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            <Button onClick={handleStartOver} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Start New Analysis
            </Button>
            <Button onClick={() => navigate('/pathway')} className="gap-2">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayResults;
