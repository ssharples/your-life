
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex flex-col gap-3 pt-2"
    >
      <div className="flex gap-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full h-9 text-sm"
          >
            Cancel
          </Button>
        </motion.div>
        
        {currentStep > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="w-full h-9 text-sm"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Previous
            </Button>
          </motion.div>
        )}
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={onNext} 
          disabled={isLoading}
          className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm font-medium"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-3 w-3 mr-2 border-2 border-white border-t-transparent rounded-full"
            />
          ) : currentStep === totalSteps ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-3 w-3 mr-2" />
              </motion.div>
              Complete Review
            </>
          ) : (
            <>
              Next Step
              <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-3 w-3 ml-2" />
              </motion.div>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
