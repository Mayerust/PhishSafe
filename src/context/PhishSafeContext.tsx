
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define assessment question type
export interface AssessmentQuestion {
  id: string;
  question: string;
  risk: 'high' | 'medium' | 'low';
}

// Define user answers type
export interface UserAnswers {
  [questionId: string]: boolean;
}

type AssessmentStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';
type RiskLevel = 'high' | 'medium' | 'low' | 'none';

interface PhishSafeContextType {
  suspiciousUrl: string;
  phishingScore: number;
  phishingConfidence: string;
  phishingReasons: string[];
  assessmentStatus: AssessmentStatus;
  isCredentialsLeaked: boolean;
  assessmentQuestions: AssessmentQuestion[];
  userAnswers: UserAnswers;
  setAssessmentStatus: (status: AssessmentStatus) => void;
  setIsCredentialsLeaked: (isLeaked: boolean) => void;
  setUserAnswer: (questionId: string, value: boolean) => void;
  calculateRiskLevel: () => RiskLevel;
  completeAssessment: (passed: boolean) => void;
  checkBreachedCredentials: (email: string) => Promise<any>;
}

const PhishSafeContext = createContext<PhishSafeContextType | undefined>(undefined);

// Default assessment questions
const defaultQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'Did you enter your username and password on the suspicious site?',
    risk: 'high'
  },
  {
    id: 'q2',
    question: 'Did you receive an email asking you to urgently log in to your account?',
    risk: 'medium'
  },
  {
    id: 'q3',
    question: 'Did you click on a link from an email or message you weren\'t expecting?',
    risk: 'medium'
  },
  {
    id: 'q4',
    question: 'Did the website ask for security questions or other personal information?',
    risk: 'high'
  },
  {
    id: 'q5',
    question: 'Did the website URL look different from the official website?',
    risk: 'low'
  }
];

export const PhishSafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suspiciousUrl, setSuspiciousUrl] = useState<string>('');
  const [phishingScore, setPhishingScore] = useState<number>(0);
  const [phishingConfidence, setPhishingConfidence] = useState<string>('Low');
  const [phishingReasons, setPhishingReasons] = useState<string[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>('not_started');
  const [isCredentialsLeaked, setIsCredentialsLeaked] = useState<boolean>(false);
  const [assessmentQuestions] = useState<AssessmentQuestion[]>(defaultQuestions);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  useEffect(() => {
    // Get suspicious URL from Chrome storage
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome?.storage) {
      window.chrome.storage.local.get(
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

  // Function to set a user answer to an assessment question
  const setUserAnswer = (questionId: string, value: boolean) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Function to calculate risk level based on user answers
  const calculateRiskLevel = (): RiskLevel => {
    const answeredQuestions = Object.keys(userAnswers).filter(id => userAnswers[id]);
    
    if (answeredQuestions.length === 0) {
      return 'none';
    }
    
    // Find the highest risk level among answered questions
    const highRiskAnswered = assessmentQuestions
      .filter(q => userAnswers[q.id] && q.risk === 'high')
      .length > 0;
      
    const mediumRiskAnswered = assessmentQuestions
      .filter(q => userAnswers[q.id] && q.risk === 'medium')
      .length > 0;
      
    const lowRiskAnswered = assessmentQuestions
      .filter(q => userAnswers[q.id] && q.risk === 'low')
      .length > 0;
    
    if (highRiskAnswered) {
      return 'high';
    } else if (mediumRiskAnswered) {
      return 'medium';
    } else if (lowRiskAnswered) {
      return 'low';
    }
    
    return 'none';
  };

  // Function to complete assessment and update status
  const completeAssessment = (passed: boolean) => {
    setAssessmentStatus(passed ? 'completed' : 'failed');
  };

  // Function to check if credentials have been leaked
  const checkBreachedCredentials = async (email: string) => {
    try {
      if (typeof window !== 'undefined' && 'chrome' in window && window.chrome?.runtime) {
        // Use Chrome messaging to communicate with background script
        return new Promise((resolve) => {
          window.chrome.runtime.sendMessage(
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
        assessmentQuestions,
        userAnswers,
        setAssessmentStatus,
        setIsCredentialsLeaked,
        setUserAnswer,
        calculateRiskLevel,
        completeAssessment,
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
