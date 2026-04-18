import { useState, useRef, useEffect, type CSSProperties, type MouseEvent } from "react";
import { motion } from "framer-motion";

import Info from "../components/Info.tsx";
import JoinForm from "../components/JoinForm.tsx";
import CreateForm from "../components/CreateForm.tsx"

import { Github, CircleQuestionMark } from "lucide-react";
import { pageVariants, itemVariants, heroVariants, buttonVariants } from "../utils/animations.ts";

interface OrbState {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default function Welcome() {
    const [isJoinOpen, setIsJoinOpen] = useState<boolean>(false);
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [orbPositions, setOrbPositions] = useState<OrbState[]>([
        { x: 350, y: 200, vx: 1.2, vy: 0.8 },
        { x: 200, y: 400, vx: -1.1, vy: -0.9 },
        { x: 500, y: 300, vx: 0.9, vy: 1.3 },
    ]);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | undefined>(undefined);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: -1000, y: -1000 });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const orbRadius = 120; // avg orb radius
        const mouseRepelDist = 250;
        const mouseRepelStrength = 0.15;

        const animate = () => {
            setOrbPositions((prev) =>
                prev.map((orb) => {
                    let { x, y, vx, vy } = orb;

                    // Mouse repulsion (only affects closest orb indirectly via distance)
                    const dx = x - mousePos.x;
                    const dy = y - mousePos.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouseRepelDist && dist > 0) {
                        const force = (1 - dist / mouseRepelDist) * mouseRepelStrength;
                        const angle = Math.atan2(dy, dx);
                        vx += Math.cos(angle) * force;
                        vy += Math.sin(angle) * force;
                    }

                    // Apply friction
                    vx *= 0.995;
                    vy *= 0.995;

                    // Update position
                    x += vx;
                    y += vy;

                    // Wrapping at screen edges
                    if (x > width + orbRadius) x = -orbRadius;
                    if (x < -orbRadius) x = width + orbRadius;
                    if (y > height + orbRadius) y = -orbRadius;
                    if (y < -orbRadius) y = height + orbRadius;

                    return { x, y, vx, vy };
                })
            );

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [mousePos]);

    const getOrbStyle = (orb: OrbState): CSSProperties => ({
        transform: `translate3d(${orb.x}px, ${orb.y}px, 0)`,
        position: "absolute",
        left: "-11rem",
        top: "-11rem",
    });

    return (
        <>
            <motion.div
                ref={containerRef}
                className="welcome-background relative h-screen bg-brand-black flex flex-col overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial="hidden"
                animate="visible"
                variants={pageVariants}
            >
                {/* Animated background orbs */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="animated-orb orb-one" style={getOrbStyle(orbPositions[0])} />
                </div>
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="animated-orb orb-two" style={getOrbStyle(orbPositions[1])} />
                </div>
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="animated-orb orb-three" style={getOrbStyle(orbPositions[2])} />
                </div>
                <div className="welcome-grid" />

                {/* Header with icon buttons */}
                <motion.div
                    className="flex justify-between items-center px-5 pt-5"
                    variants={itemVariants}
                >
                    <motion.button
                        type="button"
                        onClick={() => setIsInfoOpen(true)}
                        className="relative z-10 p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                        title="How to play"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <CircleQuestionMark size={22} />
                    </motion.button>
                    <motion.a
                        href="https://github.com/AbdouMurad/ImposterGame"
                        className="relative z-10 p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all duration-200"
                        title="View on GitHub"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Github size={22} />
                    </motion.a>
                </motion.div>

                {/* Hero content */}
                <motion.div
                    className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-6"
                    variants={pageVariants}
                >
                    <motion.div className="flex flex-col items-center gap-3">
                        <motion.h1
                            className="text-5xl font-extrabold tracking-tight"
                            custom={0}
                            variants={heroVariants}
                        >
                            <span className="text-purple-500">Cheat</span><span className="text-white">Code</span>
                        </motion.h1>
                        <motion.p
                            className="text-gray-500 text-sm text-center max-w-xs leading-relaxed"
                            custom={1}
                            variants={heroVariants}
                        >
                            A social deduction game for coders. One imposter. One problem. Can you blend in?
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-3 w-full max-w-xs"
                        custom={2}
                        variants={heroVariants}
                    >
                        <motion.button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 active:scale-95 transition-all duration-200 cursor-pointer"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Create Room
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setIsJoinOpen(true)}
                            className="w-full py-3 rounded-xl font-bold text-sm text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Join Room
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {isJoinOpen && <JoinForm onCancelJoinClick={() => setIsJoinOpen(false)} />}
            {isInfoOpen && <Info onInfoExitClick={() => setIsInfoOpen(false)} />}
            {isCreateOpen && <CreateForm onCancelCreateClick={() => setIsCreateOpen(false)} />}
        </>
    );
}