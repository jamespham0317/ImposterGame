import { motion, AnimatePresence } from "framer-motion";
import { modalVariants, modalContentVariants } from "../utils/animations.ts";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AnimatedModal({ title, children, onClose }: Omit<ModalProps, "isOpen">) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.form
          className="bg-brand-gray rounded-2xl border border-gray-700 w-full max-w-xl flex flex-col gap-6 p-7 shadow-xl mx-4"
          variants={modalContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          autoComplete="off"
        >
          {children}
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
