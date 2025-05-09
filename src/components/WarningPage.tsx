
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePhishSafe } from "@/context/PhishSafeContext";
import WarningIcon from "./WarningIcon";
import PhishingAssessment from "./PhishingAssessment";
import RecoveryActions from "./RecoveryActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, ArrowRight, HelpCircle, CheckCircle } from "lucide-react";

const WarningPage: React.FC = () => {
  const { suspiciousUrl, phishingScore, assessmentStatus } = usePhishSafe();
  const [loaded, setLoaded] = useState(false);
  const [showSafeMessage, setShowSafeMessage] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const returnStatus = searchParams.get('status');
    if (returnStatus === 'safe') {
      setShowSafeMessage(true);
    }
    
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [suspiciousUrl, phishingScore, assessmentStatus]);

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

  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scoreIndicatorVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.4,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const backgroundStyle = {
    backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    backgroundAttachment: "fixed"
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={backgroundStyle}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg"
        >
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Security Information...</h1>
          <p className="text-gray-600">PhishSafe is analyzing this site for your protection.</p>
        </motion.div>
      </div>
    );
  }

  if (showSafeMessage) {
    return (
      <div className="min-h-screen flex flex-col" style={backgroundStyle}>
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
            <Link to="/help">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-phishsafe-darkBlue"
                size="sm"
              >
                <HelpCircle size={18} className="mr-1" />
                <span>Help</span>
              </Button>
            </Link>
          </div>
        </motion.header>

        <div className="flex-1 container mx-auto py-12 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center"
          >
            <motion.div 
              className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              You're Now Safe!
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              You've successfully completed the recommended security actions. Your accounts are now better protected.
            </motion.p>
            <motion.div 
              className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-blue-700">
                Remember to always verify website URLs and be cautious about sharing personal information online.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/help">
                <Button 
                  className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white flex items-center gap-2"
                >
                  <span>Learn More About Phishing Protection</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
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
          <Link to="/help">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-phishsafe-darkBlue"
              size="sm"
            >
              <HelpCircle size={18} className="mr-1" />
              <span>Help</span>
            </Button>
          </Link>
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
          whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center mb-6">
            <WarningIcon size={80} animated={true} />
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-center mt-6 text-gray-800"
              variants={textAnimation}
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
                    Our AI has identified this as a potential phishing site with {Math.round((phishingScore || 0.85) * 100)}% confidence.
                  </p>
                </div>
              </div>
            </div>

            <motion.div 
              className="mb-6"
              variants={scoreIndicatorVariants}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Threat Assessment:</h3>
              <div className="bg-gray-100 rounded-full h-4 w-full mb-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-red-500 h-4"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((phishingScore || 0.85) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Suspicious URL:</h3>
              <p className="font-mono p-3 bg-gray-100 rounded break-all text-sm">
                {suspiciousUrl || "https://fake-bank-login.com/auth/signin?account=verification"}
              </p>
            </motion.div>

            <motion.div 
              className="border-t border-gray-200 pt-6 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {assessmentStatus === "not_started" && (
                <PhishingAssessment />
              )}
              
              {assessmentStatus === "failed" && (
                <RecoveryActions />
              )}
              
              {assessmentStatus === "completed" && (
                <div className="text-center">
                  <motion.div 
                    className="bg-green-50 p-4 rounded-lg mb-6"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-green-800 font-medium">Good news! You recognized the phishing attempt.</p>
                    <p className="text-green-700 mt-2">
                      Always verify website URLs and be cautious about sharing personal information online.
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/help">
                      <Button 
                        className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white flex items-center gap-2"
                      >
                        <span>Learn More About Phishing Protection</span>
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
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
