import { useSocket } from "../contexts/SocketContext.tsx";
import { AnimatedModal } from "./AnimatedModal.tsx";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardPaste } from "lucide-react";
import { staggerContainerVariants, itemVariants, buttonVariants } from "../utils/animations.ts";

type JoinFormProps = {
  onCancelJoinClick: () => void;
};

export default function JoinForm({ onCancelJoinClick }: JoinFormProps) {
  const {
    isConnected,
    send,
    onMessage
  } = useSocket();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubRoomJoin = onMessage("room-joined", (data) => {
      navigate("/Lobby", {
        state: {
          roomId: data.roomId,
          username: data.playerId,
          difficulty: data.difficulty,
          capacity: data.capacity,
          codingTime: data.codingTime,
          votingTime: data.votingTime,
          players: data.playerList
        },
      });
    });

    const unsubUnableToJoin = onMessage("unable-to-join", (data) => {
      setErrorMessage(data.errorMessage);
    });

    return () => {
      unsubRoomJoin();
      unsubUnableToJoin();
    };
  }, [onMessage, navigate, username]);

  function onJoinClick() {
    if (!isConnected) {
      console.error("Socket not connected");
      return;
    }
    const request = {
      type: "join-room",
      roomId: roomId,
      playerId: username,
    };
    send(request);
  }

  async function onPasteRoomCodeClick() {
    try {
      const text = await navigator.clipboard.readText();
      setRoomId(text.toUpperCase().trim());
      setErrorMessage("");
    } catch {
      setErrorMessage("Clipboard access was blocked. Please paste manually.");
    }
  }

  const canJoin = username.trim() !== "" && roomId.trim() !== "";

  return (
    <>
      <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
        <AnimatedModal title="Join Room" onClose={onCancelJoinClick}>
          <motion.div className="flex flex-col gap-1" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-purple-600 rounded-full" />
              <h1 className="text-gray-100 text-lg font-bold">Join Room</h1>
            </div>
            <p className="text-gray-500 text-xs">Enter a username and the room code shared by the host.</p>
          </motion.div>

          <motion.div className="flex flex-col gap-4" variants={staggerContainerVariants}>
            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
              <label htmlFor="username" className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-700 rounded-xl bg-brand-gray-light text-gray-100 placeholder-gray-600 px-4 py-2.5 text-sm outline-none focus:border-purple-600 transition-colors duration-200"
              />
            </motion.div>

            <motion.div className="flex flex-col gap-2" variants={itemVariants}>
              <label htmlFor="roomId" className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Room Code</label>
              <div className="relative">
                <input
                  type="text"
                  id="roomId"
                  placeholder="e.g. ABCD12"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  autoCapitalize="characters"
                  className="w-full border border-gray-700 rounded-xl bg-brand-gray-light text-gray-100 placeholder-gray-600 px-4 pr-11 py-2.5 text-sm font-mono tracking-widest outline-none focus:border-purple-600 transition-colors duration-200"
                />
                <motion.button
                  type="button"
                  onClick={onPasteRoomCodeClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  title="Paste room code"
                  aria-label="Paste room code"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ClipboardPaste size={14} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {errorMessage && (
            <motion.div
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-red-400 text-sm">{errorMessage}</span>
            </motion.div>
          )}

          <motion.div className="flex gap-3" variants={itemVariants}>
            <motion.button
              type="button"
              onClick={onCancelJoinClick}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200 transition-all duration-200 active:scale-95 cursor-pointer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={onJoinClick}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-700 ${canJoin ? "hover:bg-purple-600 active:scale-95" : ""} transition-all duration-200 disabled:opacity-40 disabled:cursor-default cursor-pointer`}
              disabled={!canJoin}
              variants={buttonVariants}
              whileHover={canJoin ? "hover" : undefined}
              whileTap={canJoin ? "tap" : undefined}
            >
              Join Room
            </motion.button>
          </motion.div>
        </AnimatedModal>
      </motion.div>
    </>
  );
}