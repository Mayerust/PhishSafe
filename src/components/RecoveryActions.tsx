
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePhishSafe } from "@/context/PhishSafeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Shield, 
  RotateCw, 
  Mail
} from "lucide-react";

const RecoveryActions: React.FC = () => {
  const { 
    suspiciousUrl, 
    isCredentialsLeaked, 
    setIsCredentialsLeaked,
    checkBreachedCredentials 
  } = usePhishSafe();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [isCheckingLeaks, setIsCheckingLeaks] = useState(false);
  const [breachResults, setBreachResults] = useState<any>(null);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const { toast } = useToast();

  // Check for leaked credentials
  const handleCheckCredentials = async () => {
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    
    setIsCheckingLeaks(true);
    
    try {
      const result = await checkBreachedCredentials(email);
      setBreachResults(result);
      
      if (result.breached) {
        toast({
          variant: "destructive",
          title: "Potential data breach detected",
          description: `Found ${result.breachCount} breach${result.breachCount > 1 ? 'es' : ''} containing your email.`,
        });
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Error checking breaches",
          description: result.message,
        });
      } else {
        toast({
          title: "No breaches found",
          description: "Your email doesn't appear in known data breaches.",
        });
      }
    } catch (error) {
      console.error("Error checking breaches:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check for data breaches. Please try again.",
      });
    } finally {
      setIsCheckingLeaks(false);
    }
  };

  // Take recovery action
  const takeAction = (action: string) => {
    if (!actionsTaken.includes(action)) {
      setActionsTaken(prev => [...prev, action]);
      
      toast({
        title: "Action completed",
        description: `${action} has been successfully completed.`,
      });
    }
  };
  
  // Return to safety with "safe" status
  const returnToSafety = () => {
    navigate("/?status=safe");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <motion.div variants={itemVariants}>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded text-left">
          <div className="flex">
            <AlertCircle className="text-amber-500 mr-3 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-amber-800">
                You may have been exposed to a phishing attack
              </p>
              <p className="text-amber-700 mt-1">
                Follow these recovery steps to secure your accounts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 text-left">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Recommended recovery actions:</h3>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Mail className="text-blue-500" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Check for data breaches</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Check if your email appears in known data breaches.
                </p>
                
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isCheckingLeaks}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCheckCredentials}
                      disabled={isCheckingLeaks || !email}
                      className="whitespace-nowrap"
                    >
                      {isCheckingLeaks ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Check Now"
                      )}
                    </Button>
                  </div>
                  
                  {breachResults && (
                    <div className={`p-3 rounded text-sm ${breachResults.breached ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                      {breachResults.message}
                      
                      {breachResults.breached && breachResults.breaches && breachResults.breaches.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Compromised in these breaches:</p>
                          <ul className="list-disc list-inside mt-1">
                            {breachResults.breaches.map((breach: any, index: number) => (
                              <li key={index}>
                                {breach.name} ({breach.breachDate}) - Exposed: {breach.dataClasses.join(', ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {actionsTaken.includes("Log out all sessions") ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Lock className="text-blue-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Log out of all sessions</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Terminate all active sessions on accounts that may be compromised.
                </p>
                <Button
                  onClick={() => takeAction("Log out all sessions")}
                  variant="outline"
                  disabled={actionsTaken.includes("Log out all sessions")}
                >
                  {actionsTaken.includes("Log out all sessions") ? "Completed" : "Take action"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {actionsTaken.includes("Change passwords") ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Lock className="text-blue-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Change your passwords</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Update passwords for any accounts that may have been exposed.
                </p>
                <Button
                  onClick={() => takeAction("Change passwords")}
                  variant="outline"
                  disabled={actionsTaken.includes("Change passwords")}
                >
                  {actionsTaken.includes("Change passwords") ? "Completed" : "Take action"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {actionsTaken.includes("Enable 2FA") ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Shield className="text-blue-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Enable 2FA authentication</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Add an extra layer of security to your accounts with two-factor authentication.
                </p>
                <Button
                  onClick={() => takeAction("Enable 2FA")}
                  variant="outline"
                  disabled={actionsTaken.includes("Enable 2FA")}
                >
                  {actionsTaken.includes("Enable 2FA") ? "Completed" : "Take action"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mt-8">
        <Button 
          onClick={returnToSafety}
          className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white"
        >
          Return to Safety
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RecoveryActions;
