import { useState, useEffect } from "react";

import { GripHorizontal } from "lucide-react";

import TestCard from "./TestCard.tsx";

import { useGame } from "../contexts/GameContext.tsx";
import { useSocket } from "../contexts/SocketContext.tsx";

type ConsolePanelProps = {
    height: number;
    onResize: (newHeight: number) => void;
};

export default function ConsolePanel({ height, onResize }: ConsolePanelProps) {
    const { testCycle } = useGame();
    const { onMessage } = useSocket();

    const [isResizing, setIsResizing] = useState(false);
    const [highlightedCard, setHighlightedCard] = useState(0);
    const [outputs, setOutputs] = useState([]);
    const [passed, setPassed] = useState([]);

    useEffect(() => {
        const unsubTestResults = onMessage("test-results", (data) => {
            setOutputs(data.outputList);
            setPassed(data.passedList);
        });

        return () => unsubTestResults();
    }, [onMessage]);

    const handleCardClick = (index: number) => {
        setHighlightedCard(index)
    };

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const newHeight = Math.min(500, Math.max(100, height - e.movementY));
            onResize(newHeight);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return (
        <>
            <div
                className="bg-gray-950 text-gray-200 border-t-2 border-gray-700 overflow-y-auto custom-scrollbar"
                style={{ height: `${height}px` }}
            >
                <div
                    className="flex justify-center cursor-row-resize h-1"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <GripHorizontal />
                </div>
                <div className="mt-5 mx-5 text-gray-200 text-xl font-bold">
                    Test Cases
                </div>
                <div className="flex">
                    {testCycle.map((test, index) => (
                        <div key={index}>
                            {passed.length > 0 ?
                                <TestCard index={index} passed={passed[index]} highlight={index === highlightedCard} handleCardClick={handleCardClick} /> :
                                <TestCard index={index} highlight={index === highlightedCard} handleCardClick={handleCardClick} />}
                        </div>
                    ))}
                </div>
                <div className="m-5">
                    <strong className="text-gray-300">Input:</strong>
                    <div className="bg-gray-900 p-3 rounded-xl mt-2">
                        {Object.entries(testCycle[highlightedCard].input)
                            .map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
                            .join(", ")}
                    </div>
                </div>

                <div className="m-5">
                    <strong className="text-gray-300">Output:</strong>
                    <div className="bg-gray-900 p-3 rounded-xl mt-2">
                        {JSON.stringify(outputs[highlightedCard], null, 2)}
                    </div>
                </div>

                <div className="m-5">
                    <strong className="text-gray-300">Expected result:</strong>
                    <div className="bg-gray-900 p-3 rounded-xl mt-2">
                        {JSON.stringify(testCycle[highlightedCard].expected, null, 2)}
                    </div>
                </div>
            </div>
        </>
    );
}