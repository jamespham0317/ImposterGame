import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import ProblemPanel from "../components/ProblemPanel.tsx";
import ImposterPanel from "../components/ImposterPanel.tsx";
import EditorPanel from "../components/EditorPanel.tsx";
import CommitPanel from "../components/CommitPanel.tsx";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

type GameLocationState = {
    players: string[];
    currentPlayer: string;
    imposter: string;
    problem: any;
    testCycle: any;
    code: string;
};

export default function Game() {
    const {
        username,
    } = useRoom();

    const {
        gameState,
        setPlayers,
        setCurrentPlayer,
        imposter,
        setImposter,
        setProblem,
        setTestCycle,
        setCode,
    } = useGame();

    const location = useLocation();
    const navState = location.state as GameLocationState;

    useEffect(() => {
        setPlayers(navState.players);
        setCurrentPlayer(navState.currentPlayer);
        setImposter(navState.imposter);
        setProblem(navState.problem);
        setTestCycle(navState.testCycle);
        setCode(navState.code);

    }, [navState]);

    return (
        <>
            <div className="h-screen bg-gray-950">
                <div className="flex">
                    <h1 className="text-purple-700 text-xl font-bold m-5">
                        Cheet
                        <strong className="text-white">Code</strong>
                    </h1>
                </div>
                {gameState === "coding" &&
                    (<div className="flex flex-1">
                        <SideBar />
                        {username === imposter ? <ImposterPanel /> : <ProblemPanel />}
                        <EditorPanel />
                    </div>)}
                {gameState === "voting" &&
                    (<div className="flex flex-1">
                        <VoteSideBar />
                        {username === imposter ? <ImposterPanel /> : <ProblemPanel />}
                        <CommitPanel />
                    </div>)}
            </div >
        </>
    );
}