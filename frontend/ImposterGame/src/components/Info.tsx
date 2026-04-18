import { motion } from "framer-motion";
import { X } from "lucide-react";
import { modalVariants, modalContentVariants, itemVariants, buttonVariants, staggerContainerVariants } from "../utils/animations.ts";

type InfoProps = {
    onInfoExitClick: () => void;
};

export default function Info({ onInfoExitClick }: InfoProps) {
    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div
                    className="relative border border-gray-700 bg-brand-gray w-full max-w-2xl rounded-2xl shadow-xl"
                    variants={modalContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-700" variants={itemVariants}>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-purple-600 rounded-full" />
                            <h1 className="text-xl text-gray-100 font-bold">About CheatCode</h1>
                        </div>
                        <motion.button
                            type="button"
                            className="rounded-xl p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                            onClick={onInfoExitClick}
                            aria-label="Close info panel"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <X size={18} />
                        </motion.button>
                    </motion.div>

                    <motion.div className="px-6 py-5 space-y-4 text-sm text-gray-400 leading-relaxed" variants={staggerContainerVariants} initial="hidden" animate="visible">
                        <motion.p variants={itemVariants}>
                            CheatCode is a social deduction coding game. Everyone appears to solve the same problem,
                            but one player is the imposter and never sees the full prompt.
                        </motion.p>

                        <motion.div className="rounded-xl border border-gray-700 bg-brand-gray-light/40 p-4 space-y-3" variants={itemVariants}>
                            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">How A Round Works</p>
                            <motion.div className="space-y-2" variants={staggerContainerVariants}>
                                <motion.p variants={itemVariants}>1. Players discuss and share clues while coding.</motion.p>
                                <motion.p variants={itemVariants}>2. The imposter improvises and tries to blend in.</motion.p>
                                <motion.p variants={itemVariants}>3. Everyone votes on who seems suspicious.</motion.p>
                            </motion.div>
                        </motion.div>

                        <motion.div className="rounded-xl border border-gray-700 bg-brand-gray-light/40 p-4 space-y-2" variants={itemVariants}>
                            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Win Conditions</p>
                            <motion.div className="space-y-1" variants={staggerContainerVariants}>
                                <motion.p variants={itemVariants}>Crew wins by correctly identifying the imposter.</motion.p>
                                <motion.p variants={itemVariants}>Imposter wins by surviving the vote or misdirecting the room.</motion.p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
}