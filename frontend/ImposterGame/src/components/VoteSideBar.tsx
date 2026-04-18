import { useSocket } from "../contexts/SocketContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";
import { useRoom } from "../contexts/RoomContext.tsx";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import VoteUserCard from "./VoteUserCard.tsx";
import { buttonVariants, itemVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

type VoteBarProps = {
    voting: boolean;
};

export default function VoteBar({ voting }: VoteBarProps) {
    const { send, isConnected } = useSocket();
    const { roomId, username } = useRoom();
    const {
        votingTime,
        players,
        votes
    } = useGame();

    const [voted, setVoted] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string>("");

    useEffect(() => {
        if (!players.includes(selectedUser)) {
            setSelectedUser("");
            setVoted(false);
        }
    }, [players]);

    const handleCardClick = (username: string) => {
        setSelectedUser(username)
    };

    const castVote = () => {
        if (!isConnected) {
            console.error("Socket not connected");
            return;
        }
        const request = {
            type: "cast-vote",
            roomId: roomId,
            voterId: username,
            votedId: selectedUser
        };
        send(request);
        setVoted(true);
    };

    const canVote = !voted && selectedUser !== "";

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 w-[14%] min-w-[180px] shrink-0 flex-col gap-4 self-stretch rounded-3xl border border-white/10 bg-[#0f1320]/85 p-4 backdrop-blur-md"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex items-center justify-between" variants={listItemVariants}>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-600 rounded-full" />
                        <h2 className="text-gray-100 text-sm font-bold uppercase tracking-widest">Voting</h2>
                    </div>
                    <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${voting ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                        {voting ? "Open" : "Closed"}
                    </span>
                </motion.div>

                <motion.div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">Time Until Voting Ends</p>
                    {voting ? (
                        <>
                            <motion.strong
                                className="font-bold text-3xl text-white leading-tight tabular-nums"
                                animate={votingTime <= 10 && votingTime > 0 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                transition={{ duration: 1, repeat: votingTime <= 10 && votingTime > 0 ? Infinity : 0 }}
                            >
                                {Math.floor(votingTime / 60)}:{String(votingTime % 60).padStart(2, "0")}
                            </motion.strong>
                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-1000"
                                    style={{ width: `${(votingTime / 120) * 100}%` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(votingTime / 120) * 100}%` }}
                                    transition={{ duration: 0.35 }}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-sm mt-1">Voting has ended.</p>
                    )}
                </motion.div>

                <motion.div className="flex items-center justify-between px-1" variants={listItemVariants}>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">Players</p>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-300">{players.length}</span>
                </motion.div>

                <motion.div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1" variants={listContainerVariants}>
                    {players.map((player, index) => (
                        <motion.div key={index} variants={listItemVariants}>
                            <VoteUserCard
                                username={player}
                                votes={votes?.[player] ?? 0}
                                selected={player === selectedUser}
                                disabled={!voting || voted || player === username}
                                handleCardClick={handleCardClick}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div className="pt-1" variants={listItemVariants}>
                    {voting ? (
                        <motion.button
                            type="button"
                            onClick={castVote}
                            className={`cursor-pointer w-full p-3 rounded-xl font-bold text-sm text-white bg-purple-700 ${canVote ? "hover:bg-purple-600 active:scale-95" : ""} transition-all duration-200 disabled:cursor-default disabled:opacity-40`}
                            disabled={!canVote}
                            variants={buttonVariants}
                            whileHover={canVote ? "hover" : undefined}
                            whileTap={canVote ? "tap" : undefined}
                        >
                            Vote
                        </motion.button>
                    ) : null}
                </motion.div>
            </motion.div>
        </>
    );
}