
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePhishSafe } from "@/context/PhishSafeContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Lock, Shield, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RecoveryActions: React.FC = () => {
  const { suspiciousUrl, isCredentialsLeaked, setIsCredentialsLeaked } = usePhishSafe();
  const [isCheckingLeaks, setIsCheckingLeaks] = useState(false);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock API call to check if credentials are leaked
  const checkCredentialsLeaked = async () => {
    setIsCheckingLeaks(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, randomly determine if credentials are leaked
    const leaked = Math.random() > 0.5;
    setIsCredentialsLeaked(leaked);
    setIsCheckingLeaks(false);
    
    if (leaked) {
      toast({
        variant: "destructive",
        title: "Potential data breach detected",
        description: "Your credentials may have been exposed in a data breach.",
      });
    } else {
      toast({
        title: "No breaches found",
        description: "Your credentials don't appear in known data breaches.",
      });
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

  useEffect(() => {
    // Auto-check for leaked credentials when component mounts
    checkCredentialsLeaked();
  }, []);

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
                {isCheckingLeaks ? (
                  <RotateCw className="animate-spin text-blue-500" size={20} />
                ) : isCredentialsLeaked ? (
                  <AlertCircle className="text-red-500" size={20} />
                ) : (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Check for data breaches</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {isCheckingLeaks 
                    ? "Checking if your credentials appear in known data breaches..." 
                    : isCredentialsLeaked
                      ? "Your credentials may have been exposed in data breaches."
                      : "Your credentials don't appear in known data breaches."}
                </p>
                {!isCheckingLeaks && (
                  <Button
                    onClick={() => checkCredentialsLeaked()}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Check again
                  </Button>
                )}
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
                  size="sm"
                  variant="outline"
                  className="text-xs"
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
                  size="sm"
                  variant="outline"
                  className="text-xs"
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
                  size="sm"
                  variant="outline"
                  className="text-xs"
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
          onClick={() => window.history.back()}
          className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white"
        >
          Return to Safety
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RecoveryActions;
