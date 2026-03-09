import { GitCommitHorizontal } from "lucide-react";

import { useState } from "react";

import Editor from "@monaco-editor/react";
import CommitCard from "./CommitCard.tsx";

import { useGame } from "../contexts/GameContext.tsx";

export default function VersionPanel() {
    const [highlightedCommit, setHighlightedCommit] = useState<number>(-1);

    const {
        commits
    } = useGame();

    const handleCommitClick = (index: number) => {
        setHighlightedCommit(index)
    };

    return (
        <>
            <div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                <div className="border-b-2 border-gray-700 h-5">
                </div>
                <div className="flex">
                    <div className="bg-gray-950 w-[40%] text-gray-200 font-bold border-r-2 border-gray-700">
                        <h1 className="flex m-5">
                            <GitCommitHorizontal className="mr-2" />
                            Commits
                        </h1>
                        <div className="flex flex-col items-center ">
                            {commits.map((commit, index) => (
                                <div key={index}>
                                    <CommitCard index={index} username={commit.player_id} isFirst={index === 0} isLast={index === commits.length - 1} highlight={index === highlightedCommit} handleCommitClick={handleCommitClick} />
                                </div>
                            ))}
                        </div>

                    </div>
                    {highlightedCommit !== -1 ? (
                        <Editor
                            height="600px"
                            width="60%"
                            defaultLanguage="python"
                            value={commits?.[highlightedCommit]?.code}
                            theme="vs-dark"
                            options={{
                                readOnly: true
                            }}
                        />)
                        :
                        (<div className="flex text-center items-center h-[600px] w-[60%] text-gray-500 text-lg bg-gray-900">
                            <div className="m-10">
                                The problem has been solved! Review the code snapshots carefully, select the commit files to inspect changes, then vote for the player you think was the imposter.
                                Remember — look for suspicious edits, unusual patterns, and don’t be fooled!
                            </div>
                        </div>)}
                </div>
                <div className="flex justify-end border-t-2 border-gray-700 h-15">
                </div>
            </div>
        </>
    );
}