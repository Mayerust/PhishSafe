
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePhishSafe } from "@/context/PhishSafeContext";
import { Shield, ArrowLeft, Lock, RotateCw, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const RecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { suspiciousUrl, isCredentialsLeaked, setIsCredentialsLeaked } = usePhishSafe();
  const [isCheckingLeaks, setIsCheckingLeaks] = useState(false);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8F9FA] to-[#EFF1F5]">
      {/* Header */}
      <motion.header 
        className="bg-phishsafe-blue text-white py-4 px-6 shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-2" size={24} />
            <h1 className="text-xl font-bold">PhishSafe</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-phishsafe-darkBlue"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back</span>
          </Button>
        </div>
      </motion.header>

      <motion.main
        className="flex-1 container mx-auto py-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Account Recovery</h2>
          <p className="text-gray-600 mt-2 text-center">
            Follow these steps to secure your accounts after a potential phishing attack.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">You may have been exposed to a phishing attack</AlertTitle>
            <AlertDescription className="text-amber-700">
              The suspicious URL was: <span className="font-mono text-xs break-all">{suspiciousUrl}</span>
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Recovery Actions</h3>

            <div className="space-y-4">
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-start gap-4">
                    <div className="mt-1">
                      {isCheckingLeaks ? (
                        <RotateCw className="animate-spin text-phishsafe-blue h-5 w-5" />
                      ) : isCredentialsLeaked ? (
                        <AlertCircle className="text-red-500 h-5 w-5" />
                      ) : (
                        <CheckCircle className="text-green-500 h-5 w-5" />
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
                        <div className="flex gap-2">
                          <Button
                            onClick={() => checkCredentialsLeaked()}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Check again
                          </Button>
                          
                          {isCredentialsLeaked && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
                              onClick={() => window.open("https://haveibeenpwned.com", "_blank")}
                            >
                              View details
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isCredentialsLeaked && (
                    <div className="bg-red-50 p-3 border-t border-red-100">
                      <p className="text-xs text-red-700">
                        <strong>Recommended:</strong> Change your passwords immediately for any accounts that use the same email or password.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {actionsTaken.includes("Log out all sessions") ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <Lock className="text-phishsafe-blue h-5 w-5" />
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
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {actionsTaken.includes("Change passwords") ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <Lock className="text-phishsafe-blue h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Change your passwords</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Update passwords for any accounts that may have been exposed.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => takeAction("Change passwords")}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          disabled={actionsTaken.includes("Change passwords")}
                        >
                          {actionsTaken.includes("Change passwords") ? "Completed" : "Take action"}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => window.open("https://passwordsgenerator.net/", "_blank")}
                        >
                          Generate strong password
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {actionsTaken.includes("Enable 2FA") ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <Shield className="text-phishsafe-blue h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Enable 2FA authentication</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add an extra layer of security to your accounts with two-factor authentication.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => takeAction("Enable 2FA")}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          disabled={actionsTaken.includes("Enable 2FA")}
                        >
                          {actionsTaken.includes("Enable 2FA") ? "Completed" : "Take action"}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => window.open("https://twofactorauth.org/", "_blank")}
                        >
                          2FA directory
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {actionsTaken.length >= 3 
                  ? "Great job! You've completed all the recommended recovery actions." 
                  : `${actionsTaken.length} of 3 recovery actions completed.`}
              </p>
              
              <Button 
                onClick={() => navigate('/')}
                className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue"
              >
                Return to Warning
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default RecoveryPage;
