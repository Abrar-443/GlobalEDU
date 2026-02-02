import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/Navbar';
import { SEOHead } from '@/components/SEOHead';
import { usePathway } from '@/contexts/PathwayContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STEPS = ['Background', 'Goals', 'Financials', 'Constraints'];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'Netherlands', 'France', 'Singapore', 'Japan', 'New Zealand',
  'Ireland', 'Sweden', 'Switzerland', 'Norway', 'Denmark'
];

const PathwayOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = usePathway();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/pathway/analysis');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/pathway');
    }
  };

  const toggleCountry = (country: string) => {
    const current = userProfile.preferredCountries;
    if (current.includes(country)) {
      updateProfile({ preferredCountries: current.filter((c) => c !== country) });
    } else {
      updateProfile({ preferredCountries: [...current, country] });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return userProfile.age && userProfile.country && userProfile.currentStatus && userProfile.field;
      case 1:
        return userProfile.incomeGoal && userProfile.prGoal && userProfile.stabilityPreference && userProfile.timeHorizon;
      case 2:
        return userProfile.savingsRange;
      case 3:
        return userProfile.visaRiskTolerance && userProfile.preferredCountries.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age Range</Label>
              <Select value={userProfile.age} onValueChange={(value) => updateProfile({ age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-22">18-22</SelectItem>
                  <SelectItem value="23-27">23-27</SelectItem>
                  <SelectItem value="28-32">28-32</SelectItem>
                  <SelectItem value="33-40">33-40</SelectItem>
                  <SelectItem value="40+">40+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Current Country</Label>
              <Input
                id="country"
                value={userProfile.country}
                onChange={(e) => updateProfile({ country: e.target.value })}
                placeholder="e.g., India, Nigeria, Brazil"
              />
            </div>

            <div className="space-y-2">
              <Label>Current Status</Label>
              <RadioGroup
                value={userProfile.currentStatus}
                onValueChange={(value) => updateProfile({ currentStatus: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="font-normal">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employed" id="employed" />
                  <Label htmlFor="employed" className="font-normal">Employed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unemployed" id="unemployed" />
                  <Label htmlFor="unemployed" className="font-normal">Unemployed / Job Seeking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelancer" id="freelancer" />
                  <Label htmlFor="freelancer" className="font-normal">Freelancer / Self-employed</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field / Industry</Label>
              <Input
                id="field"
                value={userProfile.field}
                onChange={(e) => updateProfile({ field: e.target.value })}
                placeholder="e.g., Software Engineering, Healthcare, Finance"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Target Annual Income (USD)</Label>
              <RadioGroup
                value={userProfile.incomeGoal}
                onValueChange={(value) => updateProfile({ incomeGoal: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30k-50k" id="income-30k" />
                  <Label htmlFor="income-30k" className="font-normal">$30,000 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50k-80k" id="income-50k" />
                  <Label htmlFor="income-50k" className="font-normal">$50,000 - $80,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="80k-120k" id="income-80k" />
                  <Label htmlFor="income-80k" className="font-normal">$80,000 - $120,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="120k+" id="income-120k" />
                  <Label htmlFor="income-120k" className="font-normal">$120,000+</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Permanent Residency Goal</Label>
              <RadioGroup
                value={userProfile.prGoal}
                onValueChange={(value) => updateProfile({ prGoal: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="essential" id="pr-essential" />
                  <Label htmlFor="pr-essential" className="font-normal">Essential - I want to settle permanently</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preferred" id="pr-preferred" />
                  <Label htmlFor="pr-preferred" className="font-normal">Preferred - Nice to have but not required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-important" id="pr-not-important" />
                  <Label htmlFor="pr-not-important" className="font-normal">Not important - Just want experience</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Stability Preference</Label>
              <RadioGroup
                value={userProfile.stabilityPreference}
                onValueChange={(value) => updateProfile({ stabilityPreference: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="stability-high" />
                  <Label htmlFor="stability-high" className="font-normal">High - I prefer certainty and security</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="stability-medium" />
                  <Label htmlFor="stability-medium" className="font-normal">Medium - Balanced risk and reward</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="stability-low" />
                  <Label htmlFor="stability-low" className="font-normal">Low - Willing to take risks for bigger rewards</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Time Horizon</Label>
              <RadioGroup
                value={userProfile.timeHorizon}
                onValueChange={(value) => updateProfile({ timeHorizon: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2years" id="time-1-2" />
                  <Label htmlFor="time-1-2" className="font-normal">1-2 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5years" id="time-3-5" />
                  <Label htmlFor="time-3-5" className="font-normal">3-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+years" id="time-5plus" />
                  <Label htmlFor="time-5plus" className="font-normal">5+ years</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Available Savings (USD)</Label>
              <RadioGroup
                value={userProfile.savingsRange}
                onValueChange={(value) => updateProfile({ savingsRange: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0-5k" id="savings-0-5k" />
                  <Label htmlFor="savings-0-5k" className="font-normal">$0 - $5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5k-15k" id="savings-5k-15k" />
                  <Label htmlFor="savings-5k-15k" className="font-normal">$5,000 - $15,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15k-30k" id="savings-15k-30k" />
                  <Label htmlFor="savings-15k-30k" className="font-normal">$15,000 - $30,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30k-50k" id="savings-30k-50k" />
                  <Label htmlFor="savings-30k-50k" className="font-normal">$30,000 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50k+" id="savings-50k" />
                  <Label htmlFor="savings-50k" className="font-normal">$50,000+</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loan"
                  checked={userProfile.willingToTakeLoan}
                  onCheckedChange={(checked) => updateProfile({ willingToTakeLoan: checked === true })}
                />
                <Label htmlFor="loan" className="font-normal">
                  I'm willing to take an education/relocation loan if needed
                </Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Visa Risk Tolerance</Label>
              <RadioGroup
                value={userProfile.visaRiskTolerance}
                onValueChange={(value) => updateProfile({ visaRiskTolerance: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="visa-low" />
                  <Label htmlFor="visa-low" className="font-normal">Low - Only consider easy-to-obtain visas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="visa-medium" />
                  <Label htmlFor="visa-medium" className="font-normal">Medium - Willing to go through some visa complexity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="visa-high" />
                  <Label htmlFor="visa-high" className="font-normal">High - Open to any pathway regardless of visa difficulty</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Preferred Destination Countries (select all that interest you)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COUNTRIES.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={country}
                      checked={userProfile.preferredCountries.includes(country)}
                      onCheckedChange={() => toggleCountry(country)}
                    />
                    <Label htmlFor={country} className="font-normal text-sm">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Pathway Analysis - ${STEPS[currentStep]}`}
        description="Tell us about yourself to get personalized career pathway recommendations"
      />

      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>

      <div className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex justify-between mb-2">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`text-xs md:text-sm font-medium ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <CardHeader>
              <CardTitle>{STEPS[currentStep]}</CardTitle>
              <CardDescription>
                {currentStep === 0 && 'Tell us about your current situation'}
                {currentStep === 1 && 'What are you hoping to achieve?'}
                {currentStep === 2 && 'What resources do you have available?'}
                {currentStep === 3 && 'What are your preferences and constraints?'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()} className="gap-2">
                  {currentStep === STEPS.length - 1 ? 'Analyze My Pathway' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PathwayOnboarding;
