import { useSocket } from "../contexts/SocketContext.tsx";
import { useRoom } from "../contexts/RoomContext.tsx";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";

import Logo from "../components/Logo.tsx";
import LobbyUserCard from "../components/LobbyUserCard.tsx";
import { pageVariants, itemVariants, buttonVariants, listContainerVariants, listItemVariants } from "../utils/animations.ts";

type LobbyLocationState = {
  roomId: string;
  username: string;
  difficulty: string;
  capacity: number;
  codingTime: number;
  votingTime: number;
  players: string[];
};

const MIN_PLAYERS_TO_START = (() => {
  const raw = import.meta.env.VITE_MIN_PLAYERS_TO_START;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 3;
})();

export default function Lobby() {
  const {
    send,
    onMessage,
    isConnected
  } = useSocket();
  const {
    roomId,
    setRoomId,
    username,
    setUsername,
    difficulty,
    setDifficulty,
    capacity,
    setCapacity,
    codingTime,
    setCodingTime,
    votingTime,
    setVotingTime,
    players,
    setPlayers
  } = useRoom();

  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as LobbyLocationState;
  const formattedCodingTime = `${codingTime / 60} min`;
  const formattedVotingTime = `${votingTime / 60} min`;

  useEffect(() => {
    const unsubGameStart = onMessage("game-started", (data) => {
      navigate("/Game", {
        state: {
          players: data.playerList,
          currentPlayer: data.playerList[0],
          imposter: data.imposterId,
          chat: data.chat,
          problem: data.problem,
          tests: data.tests,
          code: data.problem["code"]
        },
      });
    });

    return () => unsubGameStart();
  }, [onMessage]);

  useEffect(() => {
    setRoomId(navState.roomId);
    setUsername(navState.username);
    setDifficulty(navState.difficulty);
    setCapacity(navState.capacity);
    setCodingTime(navState.codingTime);
    setVotingTime(navState.votingTime);

    setPlayers(navState.players);

  }, [navState]);

  async function copyCode() {
    await navigator.clipboard.writeText(roomId);
  }

  async function onStartGameClick() {
    if (!isConnected) {
      console.error("Socket not connected");
      return;
    }
    const request = {
      type: "start-game",
      roomId: roomId,
    };
    send(request);
  }

  async function onLeaveRoomClick() {
    if (!isConnected) {
      console.error("Socket not connected");
      return;
    }
    const request = {
      type: "leave",
      roomId: roomId,
      playerId: username
    };
    send(request);
    navigate("/");
  }

  const canStartGame = players.length >= MIN_PLAYERS_TO_START && players[0] === username;

  return (
    <>
      <motion.div
        className="relative min-h-screen overflow-hidden bg-[#07090f]"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <div className="pointer-events-none absolute -left-40 top-12 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

        <motion.div className="px-5 pt-5 pb-3" variants={itemVariants}>
          <div className="w-full rounded-2xl border border-white/10 bg-[#0d1018]/80 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <Logo />
                <div className="hidden h-10 w-px bg-white/10 lg:block" />
                <div className="hidden lg:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">Mission Control</p>
                  <p className="text-sm font-semibold text-gray-200">Room Staging</p>
                </div>
              </div>
              <motion.span
                className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                Lobby
              </motion.span>
            </div>
          </div>
        </motion.div>

        <motion.div className="px-4 pb-6" variants={itemVariants}>
          <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d1018] via-[#0a0d16] to-[#101421] p-2.5">
            <div className="grid min-h-[74vh] grid-cols-1 gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Players Section */}
              <motion.div className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-[#101523]/85 text-gray-200" variants={itemVariants}>
                <motion.div className="flex items-center justify-between border-b border-white/10 px-5 pb-3 pt-5" variants={itemVariants}>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-600 rounded-full" />
                    <h1 className="text-gray-200 font-bold text-xl">Players</h1>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
                    {players.length} / {capacity}
                  </span>
                </motion.div>

                <motion.div
                  className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar px-4 py-4"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {players.map((player, index) => (
                    <motion.div key={index} variants={listItemVariants}>
                      <LobbyUserCard username={player} highlight={player === username} />
                    </motion.div>
                  ))}
                  {Array.from({ length: Math.max(0, capacity - players.length) }).map((_, i) => (
                    <motion.div
                      key={`empty-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 p-3 text-sm text-gray-500"
                      variants={listItemVariants}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-5 h-5 rounded-full border border-dashed border-gray-700" />
                      Waiting for player...
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Room Details Section */}
              <motion.div className="flex min-h-0 flex-col justify-between rounded-3xl border border-white/10 bg-[#101523]/85 text-gray-200" variants={itemVariants}>
                <motion.div className="flex flex-col gap-4 px-5 pt-5" variants={listContainerVariants}>
                  <motion.div className="flex items-center gap-2 mb-1" variants={listItemVariants}>
                    <div className="w-1 h-5 bg-purple-600 rounded-full" />
                    <h1 className="text-gray-200 font-bold text-xl">Room Details</h1>
                  </motion.div>

                  <motion.div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#1a2030] p-4" variants={listItemVariants}>
                    <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Room Code</span>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-cyan-300 text-2xl font-mono font-bold tracking-widest">
                        {roomId}
                      </span>
                      <motion.button
                        type="button"
                        onClick={copyCode}
                        className="cursor-pointer rounded-lg border border-white/15 p-2 text-gray-400 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-200"
                        title="Copy room code"
                        aria-label="Copy room code"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Copy size={18} />
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" variants={listItemVariants}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Host</p>
                        <p className="mt-1 text-gray-100 font-semibold truncate">{players[0]}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Capacity</p>
                        <p className="mt-1 text-gray-300 text-sm">{capacity} players</p>
                      </div>
                    </div>
                    <motion.div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
                        <span>Lobby Fill</span>
                        <span>{players.length}/{capacity}</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-700">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${capacity > 0 ? (players.length / capacity) * 100 : 0}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 gap-2 sm:grid-cols-3" variants={listContainerVariants}>
                    <motion.div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3" variants={listItemVariants}>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-semibold">Difficulty</p>
                      <p className="mt-1 text-sm font-semibold text-gray-200 truncate">{difficulty || "Not set"}</p>
                    </motion.div>

                    <motion.div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3" variants={listItemVariants}>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-semibold">Coding</p>
                      <p className="mt-1 text-sm font-semibold text-gray-200 truncate">{formattedCodingTime}</p>
                    </motion.div>

                    <motion.div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3" variants={listItemVariants}>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-semibold">Voting</p>
                      <p className="mt-1 text-sm font-semibold text-gray-200 truncate">{formattedVotingTime}</p>
                    </motion.div>
                  </motion.div>

                </motion.div>

                <motion.div className="flex flex-col gap-2 px-5 pb-5 pt-4" variants={listContainerVariants}>
                  {!canStartGame && (
                    <motion.p className="text-gray-500 text-xs text-center" variants={listItemVariants}>
                      {players[0] !== username
                        ? "Only the host can start"
                        : `Need at least ${MIN_PLAYERS_TO_START} player${MIN_PLAYERS_TO_START === 1 ? "" : "s"}`}
                    </motion.p>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => onStartGameClick()}
                    className={`w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 py-3 text-sm font-bold text-white ${canStartGame ? "hover:from-cyan-500 hover:to-purple-500 active:scale-95" : ""} transition-all duration-200 disabled:cursor-default disabled:opacity-40 cursor-pointer`}
                    disabled={!canStartGame}
                    variants={buttonVariants}
                    whileHover={canStartGame ? "hover" : undefined}
                    whileTap={canStartGame ? "tap" : undefined}
                  >
                    Start Game
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => onLeaveRoomClick()}
                    className="w-full rounded-2xl border border-white/15 bg-transparent py-3 text-sm font-bold text-gray-400 transition-all duration-200 hover:border-cyan-400/45 hover:text-cyan-200 active:scale-95 cursor-pointer"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Leave Room
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
