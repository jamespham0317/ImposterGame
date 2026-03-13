import { useGame } from "../contexts/GameContext.tsx";

export default function ProblemPanel() {
    const { problem } = useGame();

    if (!problem || problem.title === "" || problem.description === "" || problem.difficulty === "") {
        return null;
    }

    return (
        <>
            <div className="max-w-[35%] min-w-[315px] max-h-[85vh] bg-brand-gray rounded-xl my-3 border-2 border-gray-700 flex min-h-0 flex-col flex-1 self-stretch">
                <h1 className="text-gray-200 font-bold mx-7 mt-7 mb-2 text-2xl">
                    {problem.title}
                </h1>
                <div className="mb-5 text-xs ml-7">
                    {problem.difficulty === "Easy" && <span className="bg-green-500/30 text-green-500 px-2 py-1 rounded-full ">Easy</span>}
                    {problem.difficulty === "Medium" && <span className="bg-yellow-500/30 text-yellow-500 px-2 py-1 rounded-full ">Medium</span>}
                    {problem.difficulty === "Hard" && <span className="bg-red-500/30 text-red-500 px-2 py-1 rounded-full ">Hard</span>}
                </div>
                <div className="mx-7 mb-7 min-h-0 flex-1 overflow-y-auto text-gray-400 custom-scrollbar">
                    {problem.description}
                    <br />
                    <br />
                    {problem.examples.map((example: string, index: number) => (
                        <div key={index}>
                            <strong className="text-gray-300">Example {index + 1}:</strong>
                            <pre className="bg-brand-gray-light p-3 m-2 rounded-xl whitespace-pre-wrap text-sm font-mono text-gray-400">
                                {example}
                            </pre>
                        </div>
                    ))}
                    <br />
                    <ul className="list-disc">
                        <strong className="text-gray-300">Constraints:</strong>
                        {problem.constraints.map((constraint: string, index: number) => (
                            <li key={index} className="m-2 ml-7 text-gray-400">
                                {constraint}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}