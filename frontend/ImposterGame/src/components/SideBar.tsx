import { useGame } from "../contexts/GameContext.tsx";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UserCard from "./UserCard.tsx";
import { itemVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

export default function SideBar() {
    const {
        codingTime,
        turnTime,
        players,
        currentPlayer
    } = useGame();

    const CLIP_URL = "/sounds/clockTicking.mp3";
    const PLAY_MS = 5000; //5 seconds

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const stopTimerRef = useRef<number | null>(null);
    const startedForRef = useRef<number | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(CLIP_URL);
        audioRef.current.preload = "auto";

        return () => {
            if (stopTimerRef.current != null) window.clearTimeout(stopTimerRef.current);
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        // start exactly when the countdown reaches 5
        if (turnTime > 5 || turnTime <= 0) {
            startedForRef.current = null;
            return;
        }

        // guard against duplicate starts (re-renders / repeated state)
        if (startedForRef.current === 5) return;
        startedForRef.current = 5;

        const a = audioRef.current;
        if (!a) return;

        if (stopTimerRef.current != null) window.clearTimeout(stopTimerRef.current);

        a.pause();
        a.currentTime = 0;

        a.play().catch(() => {
            // may be blocked until a user gesture (browser autoplay policy)
        });

        stopTimerRef.current = window.setTimeout(() => {
                a.pause();
                a.currentTime = 0;
            }, PLAY_MS);
    }, [turnTime]);

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 w-[14%] min-w-[170px] shrink-0 flex-col gap-4 self-stretch rounded-3xl border border-white/10 bg-[#0f1320]/85 p-4 backdrop-blur-md"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex items-center justify-between gap-3" variants={listItemVariants}>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-600 rounded-full" />
                        <h2 className="text-gray-100 text-sm font-bold uppercase tracking-widest">Round</h2>
                    </div>
                    <div className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                        {Math.floor(codingTime / 60)}:{String(codingTime % 60).padStart(2, "0")}
                    </div>
                </motion.div>

                <motion.div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">Time Until Next Round</p>
                    <motion.strong
                        className="font-bold text-3xl text-white leading-tight tabular-nums"
                        animate={turnTime <= 5 && turnTime > 0 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ duration: 1, repeat: turnTime <= 5 && turnTime > 0 ? Infinity : 0 }}
                    >
                        {Math.floor(turnTime / 60)}:{String(turnTime % 60).padStart(2, "0")}
                    </motion.strong>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${((turnTime % 60) / 30) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${((turnTime % 60) / 30) * 100}%` }}
                            transition={{ duration: 0.35 }}
                        />
                    </div>
                </motion.div>

                <motion.div className="flex items-center justify-between px-1" variants={listItemVariants}>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">Players</p>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-300">{players.length}</span>
                </motion.div>

                <motion.div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1" variants={listContainerVariants}>
                    {players.map((player, index) => (
                        <motion.div key={index} variants={listItemVariants}>
                            <UserCard username={player} highlighted={player === currentPlayer} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </>
    );
}