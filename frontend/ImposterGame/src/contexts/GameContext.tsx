import { createContext, useContext, useState } from "react";

const GameContext = createContext({
    gameState: "",
    time: 0,
    players: [],
    currentPlayer: "",
    imposter: "",
    problemTitle: "",
    problemDifficulty: "",
    problemDescription: "",
    problemExamples: [],
    problemConstraints: [],
    problemTopics: [],
    problemCode: "",
    problemTests: [1, 2, 3],
    code: "",
    commits: [],
    votes: [],
    voted: "",
    votedCorrectly: false,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, setGameState] = useState("coding");
    const [time, setTime] = useState(0);

    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [imposter, setImposter] = useState("");

    const [problemTitle, setProblemTitle] = useState("");
    const [problemDifficulty, setProblemDifficulty] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [problemExamples, setProblemExamples] = useState([]);
    const [problemConstraints, setProblemConstraints] = useState([]);
    const [problemTopics, setProblemTopics] = useState([]);
    const [problemCode, setProblemCode] = useState("");
    const [problemTests, setProblemTests] = useState([1, 2, 3]);
    const [code, setCode] = useState("");

    const [commits, setCommits] = useState([]);
    const [votes, setVotes] = useState([]);
    const [voted, setVoted] = useState("");
    const [votedCorrectly, setVotedCorrectly] = useState(false);

    const value = {
        gameState,
        time,
        players,
        currentPlayer,
        imposter,
        problemTitle,
        problemDifficulty,
        problemDescription,
        problemExamples,
        problemConstraints,
        problemTopics,
        problemCode,
        problemTests,
        code,
        commits,
        votes,
        voted,
        votedCorrectly,
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