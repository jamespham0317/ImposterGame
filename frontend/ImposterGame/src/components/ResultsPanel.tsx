import { useSocket } from "../contexts/SocketContext.tsx";
import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buttonVariants, itemVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

export default function ResultsPanel() {
    const { send, isConnected } = useSocket();
    const { roomId, username } = useRoom();
    const {
        imposter,
        voted,
        votedCorrectly
    } = useGame();

    const navigate = useNavigate();

    const onMainMenuClick = () => {
        if (!isConnected) {
            console.error("Socket not connected");
            return;
        }
        const request = {
            type: "leave",
            roomId: roomId,
            playerId: username
        };
        send(request);
        navigate("/");
    }

    const isImposter = imposter === username;
    const won = (votedCorrectly && !isImposter) || (!votedCorrectly && isImposter);

    const headline = votedCorrectly
        ? (isImposter ? "You Got Caught!" : "Imposter Caught!")
        : (isImposter ? "You Got Away!" : "Imposter Escaped!");

    const subtext = votedCorrectly
        ? (isImposter ? "The crew was onto you all along." : "Great detective work — justice served.")
        : (isImposter ? "You blended in perfectly. Well played." : "The imposter slipped through the cracks.");

    const votedOutText = voted.length === 0
        ? "No one was voted out"
        : voted.length === 1
            ? `${voted[0]} was voted out`
            : `${voted.slice(0, -1).join(", ")} and ${voted[voted.length - 1]} were voted out`;

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 w-[33%] min-w-[300px] flex-col self-stretch rounded-3xl border border-white/10 bg-[#101523]/85"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 py-10 gap-6" variants={listContainerVariants}>
                    <motion.div className={`flex w-full flex-col items-center gap-3 rounded-2xl border px-6 py-8 ${won ? "border-cyan-500/30 bg-cyan-500/10" : "border-red-500/25 bg-red-500/10"}`} variants={listItemVariants}>
                        <h1 className={`font-bold text-3xl tracking-tight ${won ? "text-purple-300" : "text-red-400"}`}>
                            {headline}
                        </h1>
                        <p className="text-gray-400 text-sm text-center leading-relaxed">
                            {subtext}
                        </p>
                    </motion.div>

                    <motion.div className="w-full flex flex-col gap-3" variants={listContainerVariants}>
                        <motion.div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3" variants={listItemVariants}>
                            <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">Voted Out</span>
                            <span className="text-gray-300 text-sm font-medium">{votedOutText}</span>
                        </motion.div>
                        <motion.div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3" variants={listItemVariants}>
                            <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">The Imposter Was</span>
                            <span className="text-gray-300 text-sm font-medium">
                                {isImposter ? "You" : imposter}
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div className="flex justify-center px-6 pb-6" variants={listItemVariants}>
                    <motion.button
                        type="button"
                        onClick={() => onMainMenuClick()}
                        className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 p-3 text-sm font-bold text-white transition-all duration-200 hover:from-cyan-500 hover:to-purple-500 active:scale-95"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Back to Main Menu
                    </motion.button>
                </motion.div>
            </motion.div>
        </>
    );
}