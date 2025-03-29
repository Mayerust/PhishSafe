
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type AssessmentStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

interface PhishSafeContextType {
  suspiciousUrl: string;
  phishingScore: number;
  phishingConfidence: string;
  phishingReasons: string[];
  assessmentStatus: AssessmentStatus;
  isCredentialsLeaked: boolean;
  setAssessmentStatus: (status: AssessmentStatus) => void;
  setIsCredentialsLeaked: (isLeaked: boolean) => void;
  checkBreachedCredentials: (email: string) => Promise<any>;
}

const PhishSafeContext = createContext<PhishSafeContextType | undefined>(undefined);

export const PhishSafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suspiciousUrl, setSuspiciousUrl] = useState<string>('');
  const [phishingScore, setPhishingScore] = useState<number>(0);
  const [phishingConfidence, setPhishingConfidence] = useState<string>('Low');
  const [phishingReasons, setPhishingReasons] = useState<string[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>('not_started');
  const [isCredentialsLeaked, setIsCredentialsLeaked] = useState<boolean>(false);

  useEffect(() => {
    // Get suspicious URL from Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(
        ['suspiciousUrl', 'phishingScore', 'phishingConfidence', 'phishingReasons'],
        (result) => {
          if (result.suspiciousUrl) {
            setSuspiciousUrl(result.suspiciousUrl);
          }
          if (result.phishingScore) {
            setPhishingScore(result.phishingScore);
          }
          if (result.phishingConfidence) {
            setPhishingConfidence(result.phishingConfidence);
          }
          if (result.phishingReasons) {
            setPhishingReasons(result.phishingReasons);
          }
        }
      );
    } else {
      // Fallback for development environment
      console.log('Chrome API not available, using mock data');
      setSuspiciousUrl('https://fake-bank-login.com/auth/signin?account=verification');
      setPhishingScore(0.85);
      setPhishingConfidence('High');
      setPhishingReasons([
        'Suspicious domain detected',
        'Page contains password input fields',
        'Multiple suspicious terms found in page content'
      ]);
    }
  }, []);

  // Function to check if credentials have been leaked
  const checkBreachedCredentials = async (email: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Use Chrome messaging to communicate with background script
        return new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: 'checkBreachedCredentials', email },
            (response) => {
              setIsCredentialsLeaked(response.breached);
              resolve(response);
            }
          );
        });
      } else {
        // Fallback for development environment
        console.log('Chrome API not available, using mock API call');
        const BACKEND_URL = 'http://localhost:3000'; // Local backend server
        
        // Call our backend API directly
        const response = await fetch(`${BACKEND_URL}/api/check-breach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const result = await response.json();
        setIsCredentialsLeaked(result.breached);
        return result;
      }
    } catch (error) {
      console.error('Error checking breached credentials:', error);
      return {
        breached: false,
        error: true,
        message: `Error checking breach status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  };

  return (
    <PhishSafeContext.Provider
      value={{
        suspiciousUrl,
        phishingScore,
        phishingConfidence,
        phishingReasons,
        assessmentStatus,
        isCredentialsLeaked,
        setAssessmentStatus,
        setIsCredentialsLeaked,
        checkBreachedCredentials,
      }}
    >
      {children}
    </PhishSafeContext.Provider>
  );
};

export const usePhishSafe = () => {
  const context = useContext(PhishSafeContext);
  if (context === undefined) {
    throw new Error('usePhishSafe must be used within a PhishSafeProvider');
  }
  return context;
};
