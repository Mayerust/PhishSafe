
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePhishSafe } from "@/context/PhishSafeContext";
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    assessmentQuestions, 
    userAnswers, 
    setUserAnswer, 
    calculateRiskLevel,
    completeAssessment
  } = usePhishSafe();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openTips, setOpenTips] = useState<Record<string, boolean>>({});

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

  const toggleTip = (id: string) => {
    setOpenTips(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const riskLevel = calculateRiskLevel();
    
    // If risk level is high or medium, mark the assessment as failed
    if (riskLevel === "high" || riskLevel === "medium") {
      completeAssessment(false);
    } else {
      completeAssessment(true);
    }
  };

  const getRiskLevelColor = (level: "high" | "medium" | "low" | "none") => {
    switch (level) {
      case "high": return "text-red-600";
      case "medium": return "text-amber-600";
      case "low": return "text-yellow-600";
      case "none": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getRiskLevelBg = (level: "high" | "medium" | "low" | "none") => {
    switch (level) {
      case "high": return "bg-red-50";
      case "medium": return "bg-amber-50";
      case "low": return "bg-yellow-50";
      case "none": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  const riskLevel = calculateRiskLevel();
  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = assessmentQuestions.length;

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
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Phishing Victim Assessment</h2>
          <p className="text-gray-600 mt-2">
            Answer these questions to help us determine if you may have been affected by a phishing attempt.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-8"
        >
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">Assessment Progress</h3>
                  <span className="text-sm text-gray-500">{answeredCount}/{totalQuestions} Questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-phishsafe-blue h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                {assessmentQuestions.map((question) => (
                  <Card key={question.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id={`question-${question.id}`}
                          checked={userAnswers[question.id] === true}
                          onCheckedChange={(checked) => {
                            setUserAnswer(question.id, checked === true);
                          }}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <label 
                            htmlFor={`question-${question.id}`}
                            className="font-medium text-gray-700 cursor-pointer"
                          >
                            {question.question}
                          </label>
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              question.risk === 'high' ? 'bg-red-100 text-red-700' :
                              question.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {question.risk.charAt(0).toUpperCase() + question.risk.slice(1)} Risk
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleSubmit}
                  className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue"
                  disabled={answeredCount === 0}
                >
                  Submit Assessment
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-6 flex flex-col items-center">
                {riskLevel === "high" || riskLevel === "medium" ? (
                  <AlertTriangle size={50} className="text-amber-500 mb-4" />
                ) : (
                  <CheckCircle size={50} className="text-green-500 mb-4" />
                )}
                
                <h3 className="text-xl font-bold text-gray-800">
                  {riskLevel === "none" ? "You're Safe!" : 
                   riskLevel === "low" ? "Low Risk Detected" :
                   riskLevel === "medium" ? "Medium Risk Detected" :
                   "High Risk Detected"}
                </h3>
                
                <div className={`mt-3 p-4 rounded-lg ${getRiskLevelBg(riskLevel)}`}>
                  <p className={`${getRiskLevelColor(riskLevel)} font-medium`}>
                    {riskLevel === "none" ? "Based on your answers, you don't appear to be at risk from this phishing attempt." : 
                     riskLevel === "low" ? "There's a small chance your information could be at risk. Take some precautions." :
                     riskLevel === "medium" ? "There's a significant chance your accounts could be compromised. Take action soon." :
                     "Your accounts may be compromised. Immediate action is recommended."}
                  </p>
                </div>
              </div>

              {(riskLevel === "high" || riskLevel === "medium") && (
                <div className="mt-6">
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue"
                  >
                    View Recovery Actions
                  </Button>
                </div>
              )}

              {(riskLevel === "low" || riskLevel === "none") && (
                <div className="mt-6">
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue"
                  >
                    Return to Warning
                  </Button>
                </div>
              )}

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-700 mb-4">Phishing Prevention Tips</h4>
                
                <div className="space-y-3">
                  <Collapsible
                    open={openTips['tip-1']}
                    onOpenChange={() => toggleTip('tip-1')}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                      <span className="font-medium text-gray-700">Check the URL before entering data</span>
                      <HelpCircle size={18} className="text-gray-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 bg-white text-sm text-gray-600">
                      Always verify the website address before entering any personal information. Look for HTTPS, check for spelling errors, and be suspicious of subdomains.
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible
                    open={openTips['tip-2']}
                    onOpenChange={() => toggleTip('tip-2')}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                      <span className="font-medium text-gray-700">Use unique passwords for each site</span>
                      <HelpCircle size={18} className="text-gray-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 bg-white text-sm text-gray-600">
                      Using the same password across multiple sites puts all your accounts at risk if one is compromised. Use a password manager to create and store unique passwords.
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible
                    open={openTips['tip-3']}
                    onOpenChange={() => toggleTip('tip-3')}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                      <span className="font-medium text-gray-700">Enable Two-Factor Authentication (2FA)</span>
                      <HelpCircle size={18} className="text-gray-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 bg-white text-sm text-gray-600">
                      Add an extra layer of security by enabling 2FA on all your important accounts. Even if someone has your password, they can't access your account without the second factor.
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default HelpPage;
