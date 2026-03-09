import { ChevronUp, ChevronDown } from "lucide-react";

import Editor from "@monaco-editor/react";

import ConsolePanel from "./ConsolePanel.tsx";

import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";
import { useState } from "react";
import { useSocket } from "../contexts/SocketContext.tsx";

export default function EditorPanel() {
    const { send, isConnected } = useSocket();
    const { username, roomId } = useRoom();
    const { currentPlayer, code, setCode } = useGame();

    const [isConsoleOpen, setIsConsoleOpen] = useState(false);
    const [editorHeight, setEditorHeight] = useState(600);
    const [consoleHeight, setConsoleHeight] = useState(0);

    const handleEditorChange = (code: string | undefined) => {
        if (code !== undefined) {
            setCode(code);
        }
    };

    const runCode = () => {
        if (!isConnected) {
            console.error("Socket not connected");
            return;
        }

        const request = {
            type: "run-test-cycle",
            roomId: roomId,
            playerId: username,
            code: code
        }

        send(request);
    };

    const toggleConsole = () => {
        if (!isConsoleOpen) {
            setIsConsoleOpen(true);
            setEditorHeight(400);
            setConsoleHeight(200);
        } else {
            setIsConsoleOpen(false);
            setEditorHeight(600);
            setConsoleHeight(0);
        }
    };

    const handleConsoleResize = (newHeight: number) => {
        setConsoleHeight(newHeight);
        setEditorHeight(600 - newHeight);
    };

    return (
        <>
            <div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                <div className="border-b-2 border-gray-700 h-5"></div>
                {currentPlayer === username ? (
                    <div>
                        <Editor
                            height={`${editorHeight}px`}
                            width="100%"
                            defaultLanguage="python"
                            defaultValue="// Start coding..."
                            theme="vs-dark"
                            value={code}
                            onChange={handleEditorChange}
                        />
                        <ConsolePanel
                            height={consoleHeight}
                            onResize={handleConsoleResize}
                        />
                        <div className="flex justify-between border-t-2 border-gray-700">
                            <div
                                className="text-gray-400 m-3 p-1 rounded-xl cursor-pointer hover:bg-gray-800"
                                onClick={toggleConsole}
                            >
                                Console{" "}
                                {isConsoleOpen ? (
                                    <ChevronDown className="inline" />
                                ) : (
                                    <ChevronUp className="inline" />
                                )}
                            </div>
                            <button
                                onClick={runCode}
                                className="cursor-pointer w-20 m-2 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-900 transition-colors duration-300"
                            >
                                Run
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex text-center items-center h-[600px] text-gray-500 text-lg bg-gray-900">
                            <div className="m-50">
                                It’s {currentPlayer}’s turn. Sit tight and see
                                what they write...
                            </div>
                        </div>
                        <div className="flex justify-end border-t-2 border-gray-700 h-15"></div>
                    </div>
                )}
            </div>
        </>
    );
}