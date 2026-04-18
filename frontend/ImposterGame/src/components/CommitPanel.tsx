import { GitCommitHorizontal } from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";

import Editor, { DiffEditor } from "@monaco-editor/react";
import CommitCard from "./CommitCard.tsx";

import { useGame } from "../contexts/GameContext.tsx";
import { itemVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

export default function VersionPanel() {
    const [selectedCommit, setSelectedCommit] = useState<number>(-1);

    const {
        commits
    } = useGame();

    const handleCommitClick = (index: number) => {
        setSelectedCommit(index)
    };

    const selectedCode = selectedCommit >= 0 ? commits[selectedCommit].code : "";
    const previousCode = selectedCommit >= 0 ? (selectedCommit === 0 ? commits[selectedCommit].code : commits[selectedCommit - 1].code) : "";

    return (
        <>
            <motion.div
                className="flex h-full min-h-0 min-w-[420px] flex-[1.15] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101523]/85"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="border-b border-white/10 px-4 py-3" variants={listItemVariants}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-purple-600 rounded-full" />
                            <h2 className="text-gray-100 text-sm font-bold uppercase tracking-widest">Commit Review</h2>
                        </div>
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
                            {commits.length} snapshots
                        </span>
                    </div>
                </motion.div>
                <div className="flex min-h-0 flex-1">
                    <motion.div className="flex min-h-0 w-[40%] flex-col border-r border-white/10 bg-[#0d1220] text-gray-200" variants={listItemVariants}>
                        <motion.h1 className="flex items-center m-4 mb-3 text-sm uppercase tracking-widest font-bold text-gray-300" variants={listItemVariants}>
                            <GitCommitHorizontal className="mr-2" size={16} />
                            Commits
                        </motion.h1>
                        <motion.div className="custom-scrollbar flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-4 pb-4" variants={listContainerVariants} initial="hidden" animate="visible">
                            {(commits ?? []).map((commit, index) => (
                                <motion.div key={index} className="w-full" variants={listItemVariants}>
                                    <CommitCard index={index} username={commit.player_id} isFirst={index === 0} isLast={index === (commits ?? []).length - 1} selected={index === selectedCommit} handleCommitClick={handleCommitClick} />
                                </motion.div>
                            ))}
                        </motion.div>

                    </motion.div>
                    {selectedCommit !== -1 ? (
                        <motion.div className="min-h-0 w-[60%] bg-[#111827]/70" variants={listItemVariants}>
                            {selectedCommit === 0 ? (
                                <Editor
                                    height="100%"
                                    width="100%"
                                    defaultLanguage="python"
                                    value={selectedCode}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false }
                                    }}
                                />
                            ) : (
                                <DiffEditor
                                    height="100%"
                                    width="100%"
                                    language="python"
                                    original={previousCode}
                                    modified={selectedCode}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        originalEditable: false,
                                        renderSideBySide: true,
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        diffWordWrap: "on",
                                        scrollBeyondLastLine: false,
                                        ignoreTrimWhitespace: false
                                    }}
                                />
                            )}
                        </motion.div>)
                        :
                        (<motion.div className="flex min-h-0 w-[60%] flex-1 items-center justify-center bg-[#111827]/70 p-8 text-center" variants={listItemVariants}>
                            <motion.div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8" variants={listItemVariants}>
                                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Review Mode</p>
                                <p className="text-gray-300 text-lg font-semibold">
                                    Pick a commit snapshot to inspect
                                </p>
                                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                    Compare coding patterns, look for suspicious edits, and decide who played like the imposter.
                                </p>
                            </motion.div>
                        </motion.div>)}
                </div>
                <div className="flex h-16 min-h-16 shrink-0 justify-end border-t border-white/10 bg-[#0d1220]" />
            </motion.div>
        </>
    );
}