import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "./SocketContext";
import { useRoom } from "./RoomContext";

const GameState = {
    Coding: "coding",
    Voting: "voting",
    Results: "results"
};

const defaultProblem = {
    id: 0,
    title: "",
    difficulty: "",
    description: "",
    examples: [],
    constraints: [],
    topics: [],
    code: ""
};

type GameProviderProps = {
    children: ReactNode;
};

const GameContext = createContext({
    gameState: GameState.Coding,
    setGameState: (_gameState: React.SetStateAction<string>) => { },
    time: 0,
    setTime: (_time: React.SetStateAction<number>) => { },
    players: [] as string[],
    setPlayers: (_players: React.SetStateAction<string[]>) => { },
    currentPlayer: "",
    setCurrentPlayer: (_currentPlayer: React.SetStateAction<string>) => { },
    imposter: "",
    setImposter: (_imposter: React.SetStateAction<string>) => { },
    problem: defaultProblem,
    setProblem: (_problem: React.SetStateAction<typeof defaultProblem>) => { },
    testCycle: [] as any[],
    setTestCycle: (_testCycle: React.SetStateAction<any[]>) => { },
    code: "",
    setCode: (_code: React.SetStateAction<string>) => { },
    commits: [] as any[],
    setCommits: (_commits: React.SetStateAction<any[]>) => { },
    votes: null as any,
    setVotes: (_votes: React.SetStateAction<any>) => { },
    voted: [] as string[],
    setVoted: (_voted: React.SetStateAction<string[]>) => { },
    votedCorrectly: false,
    setVotedCorrectly: (_votedCorrectly: React.SetStateAction<boolean>) => { }
});

export default function GameProvider({ children }: GameProviderProps) {
    const { roomId, username } = useRoom();
    const { onMessage, send } = useSocket();

    const [gameState, setGameState] = useState(GameState.Coding);
    const [time, setTime] = useState(0);

    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [imposter, setImposter] = useState("");

    const [problem, setProblem] = useState(defaultProblem);
    const [testCycle, setTestCycle] = useState<any[]>([]);
    const [code, setCode] = useState("");

    const [commits, setCommits] = useState<any[]>([]);
    const [votes, setVotes] = useState<any>(null);
    const [voted, setVoted] = useState<string[]>([]);
    const [votedCorrectly, setVotedCorrectly] = useState(false);

    useEffect(() => {
        const unsubTimeUpdate = onMessage("time-left", (data) => {
            setTime(data.timeLeft);
        });
        const unsubTurnOver = onMessage("turn-over", (data) => {
            const response = {
                type: "next-turn",
                roomId: roomId,
                playerId: username,
                code: code
            }
            send(response);
        });
        const unsubNextTurn = onMessage("next-turn", (data) => {
            setCurrentPlayer(data.currentPlayer);
            setCode(data.code);
        });
        const unsubStartVote = onMessage("start-vote", (data) => {
            setGameState(GameState.Voting);
            setCommits(data.commits);
        });
        const unsubVoteCast = onMessage("vote-casted", (data) => {
            setVotes(data.voteList);
        });
        const unsubVoteOver = onMessage("vote-over", (data) => {
            setGameState(GameState.Results);
            setVoted(data.voted);
            setVotedCorrectly(data.votedCorrectly);
        });
        return () => {
            unsubTimeUpdate();
            unsubTurnOver();
            unsubNextTurn();
            unsubStartVote();
            unsubVoteCast();
            unsubVoteOver();
        };
    }, [onMessage, code]);

    const value = {
        gameState,
        setGameState,
        time,
        setTime,
        players,
        setPlayers,
        currentPlayer,
        setCurrentPlayer,
        imposter,
        setImposter,
        problem,
        setProblem,
        testCycle,
        setTestCycle,
        code,
        setCode,
        commits,
        setCommits,
        votes,
        setVotes,
        voted,
        setVoted,
        votedCorrectly,
        setVotedCorrectly
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}