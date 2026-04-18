import { useGame } from "../contexts/GameContext.tsx";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "../components/Logo.tsx";
import BriefingPanel from "../components/BriefingPanel.tsx";
import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import ProblemPanel from "../components/ProblemPanel.tsx";
import ResultsPanel from "../components/ResultsPanel.tsx";
import EditorPanel from "../components/EditorPanel.tsx";
import CommitPanel from "../components/CommitPanel.tsx";
import ErrorPanel from "../components/ErrorPanel.tsx";
import { pageVariants, itemVariants } from "../utils/animations.ts";

import { GameState } from "../contexts/GameContext.tsx";

type GameLocationState = {
    players: string[];
    currentPlayer: string;
    imposter: string;
    chat: any[];
    problem: any;
    tests: any[];
    code: string;
};

export default function Game() {
    const {
        gameError,
        gameState,
        setPlayers,
        setCurrentPlayer,
        setImposter,
        setChat,
        setProblem,
        setTests,
        setCode
    } = useGame();

    const location = useLocation();

    const navState = location.state as GameLocationState | undefined;

    useEffect(() => {
        if (!navState) return;

        setPlayers(navState.players);
        setCurrentPlayer(navState.currentPlayer);
        setImposter(navState.imposter);
        setChat(navState.chat);
        setProblem(navState.problem);
        setTests(navState.tests);
        setCode(navState.code);
    }, [navState]);

    const isBriefing = gameState === GameState.Briefing;

    const phaseLabel = gameState === GameState.Briefing
        ? "Briefing"
        : gameState === GameState.Coding
            ? "Coding"
            : gameState === GameState.Voting
                ? "Voting"
                : "Results";

    const phaseSteps = ["Briefing", "Coding", "Voting", "Results"];
    const activePhaseIndex = phaseSteps.indexOf(phaseLabel);

    return (
        <>
            {isBriefing && <BriefingPanel />}
            {gameError && <ErrorPanel />}
            <motion.div
                className={`relative flex h-screen flex-col overflow-hidden bg-[#07090f] transition-all duration-300 ${isBriefing || gameError ? "pointer-events-none select-none" : ""}`}
                initial="hidden"
                animate="visible"
                variants={pageVariants}
            >
                <div className="pointer-events-none absolute -left-40 top-8 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

                <motion.div className="px-5 pt-5 pb-3" variants={itemVariants}>
                    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1018]/80 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <Logo />
                                <div className="hidden h-10 w-px bg-white/10 lg:block" />
                                <div className="hidden lg:block">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">Mission Control</p>
                                    <p className="text-sm font-semibold text-gray-200">Live Match Session</p>
                                </div>
                            </div>
                            <motion.span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${isBriefing ? "border-purple-500/30 bg-purple-500/10 text-purple-200" : "border-gray-700 bg-brand-gray text-gray-300"}`}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                {phaseLabel}
                            </motion.span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            {phaseSteps.map((phase, index) => (
                                <div
                                    key={phase}
                                    className={`rounded-xl border px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-widest transition-all ${index <= activePhaseIndex
                                        ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-200"
                                        : "border-white/10 bg-white/[0.02] text-gray-500"
                                        }`}
                                >
                                    {phase}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div className="min-h-0 flex-1 px-3 pb-3" variants={itemVariants}>
                    <div className={`relative flex min-h-0 h-full w-full items-stretch gap-3 overflow-hidden rounded-3xl border p-2.5 transition-all duration-300 ${isBriefing
                        ? "border-purple-500/20 bg-gradient-to-b from-[#121523] via-[#0b0e17] to-[#12111d]/80 blur-[1px] saturate-50"
                        : "border-white/10 bg-gradient-to-b from-[#0d1018] via-[#0a0d16] to-[#101421]"}`}>
                        <motion.div
                            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-purple-700/10 blur-3xl"
                            animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
                            transition={{ duration: 14, repeat: Infinity }}
                        />
                        <motion.div
                            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-600/10 blur-3xl"
                            animate={{ x: [0, -25, 10, 0], y: [0, 15, -10, 0] }}
                            transition={{ duration: 16, repeat: Infinity }}
                        />

                        <AnimatePresence mode="wait" initial={false}>
                            {(gameState === GameState.Coding || isBriefing) &&
                                (<motion.div
                                    key="phase-coding"
                                    className="z-10 flex min-h-0 h-full flex-1 items-stretch gap-2"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <SideBar />
                                    <ProblemPanel />
                                    <EditorPanel />
                                </motion.div>)}
                            {gameState === GameState.Voting &&
                                (<motion.div
                                    key="phase-voting"
                                    className="z-10 flex min-h-0 h-full flex-1 items-stretch gap-2"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <VoteSideBar voting={true} />
                                    <ProblemPanel />
                                    <CommitPanel />
                                </motion.div>)}
                            {gameState === GameState.Results &&
                                (<motion.div
                                    key="phase-results"
                                    className="z-10 flex min-h-0 h-full flex-1 items-stretch gap-2"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <VoteSideBar voting={false} />
                                    <ResultsPanel />
                                    <CommitPanel />
                                </motion.div>)}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div >
        </>
    );
}