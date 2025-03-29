
import React from "react";
import { motion } from "framer-motion";
import { usePhishSafe } from "@/context/PhishSafeContext";
import WarningIcon from "./WarningIcon";
import PhishingAssessment from "./PhishingAssessment";
import RecoveryActions from "./RecoveryActions";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";

const WarningPage: React.FC = () => {
  const { suspiciousUrl, phishingScore, assessmentStatus } = usePhishSafe();

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

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Header */}
      <motion.header 
        className="bg-phishsafe-blue text-white py-4 px-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center">
          <Shield className="mr-2" size={24} />
          <h1 className="text-xl font-bold">PhishSafe</h1>
        </div>
      </motion.header>

      <motion.main 
        className="flex-1 container mx-auto py-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto"
          variants={childVariants}
        >
          <div className="flex flex-col items-center mb-6">
            <WarningIcon size={80} animated={true} />
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-center mt-6 text-gray-800"
              variants={childVariants}
            >
              Warning: Potential Phishing Attempt Detected
            </motion.h2>
          </div>

          <motion.div variants={childVariants}>
            <div className="bg-red-50 border-l-4 border-phishsafe-red p-4 mb-6 rounded">
              <div className="flex items-start">
                <AlertTriangle className="text-phishsafe-red mr-3 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-800">
                    We've blocked access to this site for your safety
                  </p>
                  <p className="text-red-700 mt-1">
                    Our AI has identified this as a potential phishing site with {Math.round(phishingScore * 100)}% confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Suspicious URL:</h3>
              <p className="font-mono p-3 bg-gray-100 rounded break-all text-sm">
                {suspiciousUrl}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              {assessmentStatus === "not_started" && (
                <PhishingAssessment />
              )}
              
              {assessmentStatus === "failed" && (
                <RecoveryActions />
              )}
              
              {assessmentStatus === "completed" && (
                <div className="text-center">
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <p className="text-green-800 font-medium">Good news! You recognized the phishing attempt.</p>
                    <p className="text-green-700 mt-2">
                      Always verify website URLs and be cautious about sharing personal information online.
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.history.back()}
                    className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white"
                  >
                    Return to Safety
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm"
          variants={childVariants}
        >
          <p>Protected by PhishSafe • AI-Powered Phishing Protection</p>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default WarningPage;
