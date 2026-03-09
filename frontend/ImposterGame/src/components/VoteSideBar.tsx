import VoteUserCard from "./VoteUserCard.tsx";

import { useState } from "react";

import { useSocket } from "../contexts/SocketContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";
import { useRoom } from "../contexts/RoomContext.tsx";

export default function VoteBar() {
    const { send, isConnected } = useSocket();
    const { roomId, username } = useRoom();
    const [voted, setVoted] = useState(false);
    const [highlightedCard, setHighlightedCard] = useState("");

    const {
        time,
        players,
        votes
    } = useGame();

    const handleCardClick = (username: string) => {
        setHighlightedCard(username)
    };

    const castVote = () => {
        if (!isConnected) {
            console.error("Socket not connected");
            return;
        }

        const request = {
            type: "cast-vote",
            roomId: roomId,
            playerId: highlightedCard
        };
        send(request);
        setVoted(true);
    };

    return (
        <>
            <div className="flex flex-col justify-between w-[15%] bg-gray-900 my-3 mr-10 border-y-2 border-r-2 border-gray-700 rounded-r-xl">
                <div>
                    <div className="text-gray-400 m-5 text-sm mb-10 ">
                        Time until voting ends:
                        <br />
                        <strong className="font-bold text-white">
                            {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                        </strong>
                    </div>
                    {players.map((player) => (
                        <div key={player}>
                            <VoteUserCard username={player} votes={votes?.[player] ?? 0} highlight={player === highlightedCard} handleCardClick={handleCardClick} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={castVote}
                        className="cursor-pointer w-20 m-2 mt-60 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                        disabled={voted || highlightedCard === ""}
                    >
                        Vote
                    </button>
                </div>
            </div>
        </>
    );
}