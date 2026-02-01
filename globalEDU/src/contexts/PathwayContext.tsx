import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  // Background
  age: string;
  country: string;
  currentStatus: string;
  field: string;
  
  // Goals
  incomeGoal: string;
  prGoal: string;
  stabilityPreference: string;
  timeHorizon: string;
  
  // Financials
  savingsRange: string;
  willingToTakeLoan: boolean;
  
  // Constraints
  visaRiskTolerance: string;
  preferredCountries: string[];
}

export interface PathwayResult {
  final_recommendation: string;
  confidence_score: number;
  local_vs_abroad_comparison: {
    local: {
      pros: string[];
      cons: string[];
      estimated_timeline: string;
      estimated_cost: string;
    };
    abroad: {
      pros: string[];
      cons: string[];
      estimated_timeline: string;
      estimated_cost: string;
    };
  };
  reasoning_points: string[];
  alternate_pathways: {
    path: string;
    pros: string[];
    cons: string[];
  }[];
}

interface PathwayContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  result: PathwayResult | null;
  setResult: React.Dispatch<React.SetStateAction<PathwayResult | null>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  resetAll: () => void;
}

const defaultProfile: UserProfile = {
  age: '',
  country: '',
  currentStatus: '',
  field: '',
  incomeGoal: '',
  prGoal: '',
  stabilityPreference: '',
  timeHorizon: '',
  savingsRange: '',
  willingToTakeLoan: false,
  visaRiskTolerance: '',
  preferredCountries: [],
};

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export const PathwayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [result, setResult] = useState<PathwayResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetAll = () => {
    setUserProfile(defaultProfile);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <PathwayContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateProfile,
        result,
        setResult,
        isAnalyzing,
        setIsAnalyzing,
        error,
        setError,
        resetAll,
      }}
    >
      {children}
    </PathwayContext.Provider>
  );
};

export const usePathway = () => {
  const context = useContext(PathwayContext);
  if (context === undefined) {
    throw new Error('usePathway must be used within a PathwayProvider');
  }
  return context;
};
