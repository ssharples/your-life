
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const ReviewNavigation = ({ 
  currentStep, 
  totalSteps, 
  isLoading, 
  onCancel, 
  onPrevious, 
  onNext 
}: ReviewNavigationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-4"
    >
      <div className="flex flex-col sm:flex-row gap-2 order-2 sm:order-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto transition-all duration-200 hover:shadow-md"
          >
            Cancel
          </Button>
        </motion.div>
        {currentStep > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="w-full sm:w-auto transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          </motion.div>
        )}
      </div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="order-1 sm:order-2"
      >
        <Button 
          onClick={onNext} 
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
            />
          ) : currentStep === totalSteps ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
              </motion.div>
              Complete Review
            </>
          ) : (
            <>
              Next
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4 ml-2" />
              </motion.div>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
