
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Add a type definition for chrome
declare global {
  interface Window {
    chrome?: {
      storage?: {
        local: {
          get: (keys: string[], callback: (result: any) => void) => void;
        };
      };
    };
  }
}

type AssessmentStatus = "not_started" | "in_progress" | "completed" | "failed";
type AssessmentQuestion = {
  id: number;
  question: string;
  risk: "high" | "medium" | "low";
};

interface PhishSafeContextType {
  suspiciousUrl: string;
  phishingScore: number;
  assessmentStatus: AssessmentStatus;
  isCredentialsLeaked: boolean;
  setSuspiciousUrl: (url: string) => void;
  setPhishingScore: (score: number) => void;
  setAssessmentStatus: (status: AssessmentStatus) => void;
  setIsCredentialsLeaked: (isLeaked: boolean) => void;
  startAssessment: () => void;
  completeAssessment: (passed: boolean) => void;
  resetAssessment: () => void;
  assessmentQuestions: AssessmentQuestion[];
  userAnswers: Record<number, boolean>;
  setUserAnswer: (questionId: number, answer: boolean) => void;
  calculateRiskLevel: () => "high" | "medium" | "low" | "none";
}

const PhishSafeContext = createContext<PhishSafeContextType | undefined>(undefined);

export const PhishSafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suspiciousUrl, setSuspiciousUrl] = useState<string>("example-phishing-site.com");
  const [phishingScore, setPhishingScore] = useState<number>(0.92);
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>("not_started");
  const [isCredentialsLeaked, setIsCredentialsLeaked] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});

  // Assessment questions
  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 1,
      question: "Did you enter any personal information (username, password, etc.) on this site?",
      risk: "high"
    },
    {
      id: 2,
      question: "Did you click on any links within the website?",
      risk: "medium"
    },
    {
      id: 3,
      question: "Did you download any files from this website?",
      risk: "high"
    },
    {
      id: 4,
      question: "Did you receive an email or message that directed you to this site?",
      risk: "medium"
    },
    {
      id: 5,
      question: "Are you using the same password on multiple websites?",
      risk: "low"
    }
  ];

  const startAssessment = () => {
    setAssessmentStatus("in_progress");
  };

  const completeAssessment = (passed: boolean) => {
    setAssessmentStatus(passed ? "completed" : "failed");
  };

  const resetAssessment = () => {
    setAssessmentStatus("not_started");
    setIsCredentialsLeaked(false);
    setUserAnswers({});
  };

  const setUserAnswer = (questionId: number, answer: boolean) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateRiskLevel = (): "high" | "medium" | "low" | "none" => {
    const answeredQuestions = Object.entries(userAnswers);
    
    if (answeredQuestions.length === 0) return "none";
    
    // Check if any high risk questions were answered yes
    const hasHighRisk = assessmentQuestions.some(q => 
      q.risk === "high" && userAnswers[q.id] === true
    );
    
    if (hasHighRisk) return "high";
    
    // Check if any medium risk questions were answered yes
    const hasMediumRisk = assessmentQuestions.some(q => 
      q.risk === "medium" && userAnswers[q.id] === true
    );
    
    if (hasMediumRisk) return "medium";
    
    // Check if any low risk questions were answered yes
    const hasLowRisk = assessmentQuestions.some(q => 
      q.risk === "low" && userAnswers[q.id] === true
    );
    
    if (hasLowRisk) return "low";
    
    return "none";
  };

  // Chrome extension integration - fetch the suspicious URL from storage
  useEffect(() => {
    // Check if we're in a browser environment with chrome API
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage) {
      window.chrome.storage.local.get(['suspiciousUrl', 'phishingScore'], (result) => {
        if (result.suspiciousUrl) {
          setSuspiciousUrl(result.suspiciousUrl);
        }
        if (result.phishingScore !== undefined) {
          setPhishingScore(result.phishingScore);
        }
      });
    }
  }, []);

  const value = {
    suspiciousUrl,
    phishingScore,
    assessmentStatus,
    isCredentialsLeaked,
    setSuspiciousUrl,
    setPhishingScore,
    setAssessmentStatus,
    setIsCredentialsLeaked,
    startAssessment,
    completeAssessment,
    resetAssessment,
    assessmentQuestions,
    userAnswers,
    setUserAnswer,
    calculateRiskLevel,
  };

  return <PhishSafeContext.Provider value={value}>{children}</PhishSafeContext.Provider>;
};

export const usePhishSafe = (): PhishSafeContextType => {
  const context = useContext(PhishSafeContext);
  if (context === undefined) {
    throw new Error("usePhishSafe must be used within a PhishSafeProvider");
  }
  return context;
};
