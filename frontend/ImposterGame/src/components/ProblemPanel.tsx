import { useSocket } from "../contexts/SocketContext.tsx";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";
import { buttonVariants, itemVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

export default function ProblemPanel() {
    const {
        isConnected,
        send
    } = useSocket();

    const [activeTab, setActiveTab] = useState<"problem" | "chatroom">("problem");
    const [message, setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const { roomId, username, players } = useRoom();
    const { imposter, problem, chat } = useGame();

    const onSendClick = () => {
        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (!isConnected) {
            console.error("Socket not connected");
            return;
        }
        const request = {
            type: "send-message",
            roomId: roomId,
            playerId: username,
            message: message,
            timestamp: timestamp,
        };

        send(request);
        setMessage("");
    };

    useEffect(() => {
        if (activeTab !== "chatroom") return;
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [activeTab, chat]);

    if (!problem || problem.title === "" || problem.description === "" || problem.difficulty === "") {
        return null;
    }

    const canSend = message.trim().length > 0;
    const difficultyStyle = problem.difficulty === "Easy"
        ? "bg-green-500/20 text-green-300 border-green-500/30"
        : problem.difficulty === "Medium"
            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            : "bg-red-500/20 text-red-300 border-red-500/30";

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 w-[31%] min-w-[280px] flex-col self-stretch overflow-hidden rounded-3xl border border-white/10 bg-[#101523]/85 backdrop-blur-md"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="border-b border-white/10 p-4" variants={listItemVariants}>
                    <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#1a2030] p-1">
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("problem")}
                            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeTab === "problem"
                                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                                : "text-gray-400 hover:bg-white/10 hover:text-gray-200"
                                }`}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Problem
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("chatroom")}
                            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeTab === "chatroom"
                                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                                : "text-gray-400 hover:bg-white/10 hover:text-gray-200"
                                }`}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Chatroom
                        </motion.button>
                    </div>
                </motion.div>

                {activeTab === "problem" ? (
                    username === imposter ? (
                        <motion.div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4" variants={listContainerVariants} initial="hidden" animate="visible">
                            <motion.div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-6 text-center shadow-[0_0_40px_-24px_rgba(239,68,68,0.9)]" variants={listItemVariants}>
                                <p className="text-xs uppercase tracking-widest font-semibold text-red-300">Role</p>
                                <h1 className="text-2xl font-bold text-red-200 mt-1">You are the Imposter</h1>
                                <p className="text-sm text-gray-400 mt-2">Blend in, gather clues, and avoid getting voted out.</p>
                            </motion.div>

                            <motion.div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Mission</p>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Speak confidently, ask smart questions, and mirror the group to stay under the radar.
                                </p>
                            </motion.div>

                            <motion.div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Topic Hints</p>
                                <div className="flex flex-wrap gap-2">
                                    {(problem.topics ?? []).map((topic: string, index: number) => (
                                        <span
                                            key={index}
                                            className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div className="min-h-0 flex flex-1 flex-col p-5 gap-4" variants={listContainerVariants} initial="hidden" animate="visible">
                            <motion.div className="space-y-2" variants={listItemVariants}>
                                <h1 className="text-gray-100 font-bold text-2xl leading-tight">
                                    {problem.title}
                                </h1>
                                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyle}`}>
                                    {problem.difficulty}
                                </span>
                            </motion.div>

                            <motion.div className="min-h-0 flex-1 overflow-y-auto text-gray-400 custom-scrollbar pr-1 space-y-4" variants={listContainerVariants}>
                                <motion.p className="leading-relaxed" variants={listItemVariants}>{problem.description}</motion.p>

                                <motion.div className="space-y-3" variants={listContainerVariants}>
                                    {(problem.examples ?? []).map((example: string, index: number) => (
                                        <motion.div key={index} variants={listItemVariants}>
                                            <p className="text-gray-300 text-sm font-semibold mb-1">Example {index + 1}</p>
                                            <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#171d2c] p-3 text-sm font-mono text-gray-300">
                                                {example}
                                            </pre>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                                    <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Constraints</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {(problem.constraints ?? []).map((constraint: string, index: number) => (
                                            <li key={index} className="text-sm text-gray-400">
                                                {constraint}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )
                ) : (
                    <motion.div className="min-h-0 flex flex-1 flex-col px-5 py-5 gap-4 overflow-hidden" variants={listContainerVariants} initial="hidden" animate="visible">
                        <motion.div className="rounded-2xl border border-white/10 bg-[#1a2030] p-3" variants={listItemVariants}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Room</p>
                                    <h2 className="text-base font-semibold text-gray-100">{roomId || "Lobby"}</h2>
                                </div>
                                <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                    {(players ?? []).length} online
                                </div>
                            </div>
                        </motion.div>

                        <motion.div ref={chatContainerRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-3 pr-1 w-full min-w-0" variants={listContainerVariants}>
                            {chat.map((message: any, index: number) => {
                                if (message.sender === "System") {
                                    return (
                                        <motion.div key={`${message.time}-${index}`} className="flex justify-center" variants={listItemVariants}>
                                            <span className="rounded-full border border-gray-700 bg-gray-700/50 px-3 py-1 text-xs text-gray-400">
                                                {message.message}
                                            </span>
                                        </motion.div>
                                    );
                                }

                                const isOwnMessage = message.sender === username;

                                return (
                                    <motion.div key={`${message.time}-${index}`} className={`flex min-w-0 ${isOwnMessage ? "justify-end" : "justify-start"}`} variants={listItemVariants}>
                                        <div className={`max-w-[85%] min-w-0 overflow-hidden rounded-2xl border px-3 py-2 ${isOwnMessage ? "border-cyan-400/40 bg-cyan-500/15" : "border-white/10 bg-white/[0.03]"}`}>
                                            <div className="mb-1 flex items-center gap-2 text-xs">
                                                <span className={`font-semibold ${isOwnMessage ? "text-purple-300" : "text-gray-300"}`}>
                                                    {isOwnMessage ? "You" : message.sender}
                                                </span>
                                                <span className="text-gray-500">{message.timestamp}</span>
                                            </div>
                                            <p className="whitespace-pre-wrap break-all text-sm text-gray-200 [overflow-wrap:anywhere]">{message.message}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        <motion.form className="flex items-stretch gap-3" variants={listItemVariants}>
                            <div className="flex-1">
                                <textarea
                                    id="chat-message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    placeholder="Drop a hint or ask a question..."
                                    className="custom-scrollbar h-[50px] w-full resize-none rounded-2xl border border-white/10 bg-[#1a2030] px-3 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors duration-200 focus:border-cyan-500"
                                    rows={1}
                                    maxLength={200}
                                    onKeyDown={(e) => {
                                        if (e.key !== "Enter") return;
                                        if (e.shiftKey) return;
                                        e.preventDefault();
                                        if (message.trim().length > 0) onSendClick();
                                    }}
                                />
                            </div>
                            <motion.button
                                type="button"
                                onClick={onSendClick}
                                className={`h-[50px] cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 px-5 text-sm font-bold text-white ${canSend ? "hover:from-cyan-500 hover:to-purple-500 active:scale-95" : ""} transition-all duration-200 disabled:cursor-default disabled:opacity-40`}
                                disabled={!canSend}
                                variants={buttonVariants}
                                whileHover={canSend ? "hover" : undefined}
                                whileTap={canSend ? "tap" : undefined}
                            >
                                Send
                            </motion.button>
                        </motion.form>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}