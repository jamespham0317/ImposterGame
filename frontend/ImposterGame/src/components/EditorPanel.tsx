import { useSocket } from "../contexts/SocketContext.tsx";
import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Editor from "@monaco-editor/react";
import ConsolePanel from "./ConsolePanel.tsx";

import { ChevronUp, ChevronDown } from "lucide-react";
import { buttonVariants, itemVariants, listItemVariants } from "../utils/animations.ts";

export default function EditorPanel() {
    const { isConnected, send, onMessage } = useSocket();
    const { roomId, username } = useRoom();
    const { currentPlayer, code, setCode } = useGame();

    const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
    const [editorHeight, setEditorHeight] = useState<number>(100);
    const [consoleHeight, setConsoleHeight] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        const unsub = onMessage("test-results", () => setIsRunning(false));
        return () => unsub();
    }, [onMessage]);

    const handleEditorChange = (code: string | undefined) => {
        if (code !== undefined) {
            setCode(code);

            if (!isConnected) {
                console.error("Socket not connected");
                return;
            }
            const request = {
                type: "new-code",
                roomId: roomId,
                code: code
            };
            send(request);
        }
    };

    const runCode = () => {
        if (!isConnected || isRunning) {
            console.error("Socket not connected or tests already running");
            return;
        }
        const request = {
            type: "run-tests",
            roomId: roomId,
            playerId: username,
            code: code
        }
        setIsRunning(true);
        send(request);
        if (!isConsoleOpen) {
            toggleConsole();
        }
    };

    const toggleConsole = () => {
        if (!isConsoleOpen) {
            setIsConsoleOpen(true);
            setEditorHeight(65);
            setConsoleHeight(35);
        } else {
            setIsConsoleOpen(false);
            setEditorHeight(100);
            setConsoleHeight(0);
        }
    };

    const handleConsoleResize = (newHeight: number) => {
        setConsoleHeight(newHeight);
        setEditorHeight(100 - newHeight);
    };

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 min-w-[420px] flex-[1.25] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101523]/85"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div className="border-b border-white/10 px-4 py-3" variants={listItemVariants}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-purple-600 rounded-full" />
                            <h2 className="text-gray-100 text-sm font-bold uppercase tracking-widest">Editor</h2>
                        </div>
                        <motion.span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${currentPlayer === username ? "bg-cyan-500/15 text-cyan-300" : "bg-white/5 text-gray-400"}`}
                            animate={currentPlayer === username ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                            transition={{ duration: 1.4, repeat: currentPlayer === username ? Infinity : 0 }}
                        >
                            {currentPlayer === username ? "Your Turn" : `${currentPlayer}'s Turn`}
                        </motion.span>
                    </div>
                </motion.div>
                {currentPlayer === username ? (
                    <motion.div className="flex flex-1 flex-col min-h-0" variants={listItemVariants}>
                        <div className="min-h-0" style={{ height: `${editorHeight}%` }}>
                            <Editor
                                height="100%"
                                width="100%"
                                defaultLanguage="python"
                                defaultValue="// Start coding..."
                                theme="vs-dark"
                                value={code}
                                onChange={handleEditorChange}
                            />
                        </div>
                        <ConsolePanel
                            height={consoleHeight}
                            isOpen={isConsoleOpen}
                            onResize={handleConsoleResize}
                        />
                        <motion.div className="flex h-16 min-h-16 shrink-0 items-center justify-between border-t border-white/10 bg-[#0d1220] px-3" variants={listItemVariants}>
                            <motion.button
                                type="button"
                                className="cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold text-gray-300 transition-colors duration-200 hover:bg-white/10"
                                onClick={toggleConsole}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Console {isConsoleOpen ? <ChevronDown className="inline" size={16} /> : <ChevronUp className="inline" size={16} />}
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={runCode}
                                disabled={isRunning}
                                className={`rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 ${
                                    isRunning
                                    ? "cursor-not-allowed bg-cyan-900/60 opacity-50"
                                    : "cursor-pointer bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95"
                                }`}
                                variants={buttonVariants}
                                whileHover={!isRunning ? "hover" : undefined}
                                whileTap={!isRunning ? "tap" : undefined}
                                animate={isRunning ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                                transition={{ duration: 0.8, repeat: isRunning ? Infinity : 0 }}
                            >
                                {isRunning ? "Running..." : "Run"}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div className="flex min-h-0 flex-1 flex-col bg-[#101523]" variants={listItemVariants}>
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1220] px-4 py-2">
                            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Live View</p>
                            <p className="text-sm font-semibold text-gray-300">
                                {currentPlayer} is coding
                            </p>
                        </div>
                        <div className="flex-1 min-h-0">
                            <Editor
                                height="100%"
                                width="100%"
                                defaultLanguage="python"
                                theme="vs-dark"
                                value={code}
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false }
                                }}
                            />
                        </div>
                        <div className="flex h-16 min-h-16 shrink-0 justify-end border-t border-white/10 bg-[#0d1220]" />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}