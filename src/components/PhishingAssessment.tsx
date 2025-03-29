
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePhishSafe } from "@/context/PhishSafeContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const PhishingAssessment: React.FC = () => {
  const { startAssessment, completeAssessment } = usePhishSafe();
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    startAssessment();
    setIsStarted(true);
  };

  const handleAnswer = (isVictim: boolean) => {
    completeAssessment(!isVictim);
  };

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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {!isStarted ? (
        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Did you interact with this website?
          </h3>
          <p className="text-gray-600 mb-6">
            Let us know if you entered any information or clicked on any links on this site
            so we can help protect your accounts.
          </p>
          <Button
            onClick={handleStart}
            className="bg-phishsafe-blue hover:bg-phishsafe-darkBlue text-white"
          >
            Start Assessment
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Did you enter any personal information on this site?
          </h3>
          <p className="text-gray-600 mb-6">
            This includes usernames, passwords, credit card details, or other sensitive information.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => handleAnswer(true)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-2"
            >
              <XCircle size={18} />
              <span>Yes, I entered information</span>
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2"
            >
              <CheckCircle size={18} />
              <span>No, I didn't enter anything</span>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PhishingAssessment;
