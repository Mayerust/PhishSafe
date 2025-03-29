
import React, { createContext, useContext, useState, ReactNode } from "react";

type AssessmentStatus = "not_started" | "in_progress" | "completed" | "failed";

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
}

const PhishSafeContext = createContext<PhishSafeContextType | undefined>(undefined);

export const PhishSafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suspiciousUrl, setSuspiciousUrl] = useState<string>("example-phishing-site.com");
  const [phishingScore, setPhishingScore] = useState<number>(0.92);
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>("not_started");
  const [isCredentialsLeaked, setIsCredentialsLeaked] = useState<boolean>(false);

  const startAssessment = () => {
    setAssessmentStatus("in_progress");
  };

  const completeAssessment = (passed: boolean) => {
    setAssessmentStatus(passed ? "completed" : "failed");
  };

  const resetAssessment = () => {
    setAssessmentStatus("not_started");
    setIsCredentialsLeaked(false);
  };

  // Chrome extension integration - fetch the suspicious URL from storage
  React.useEffect(() => {
    // Check if we're in a browser environment with chrome API
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['suspiciousUrl', 'phishingScore'], (result) => {
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
