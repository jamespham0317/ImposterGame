import { X } from "lucide-react";

type JoinFormProps = {
    onInfoExitClick: () => void;
};

export default function JoinForm({ onInfoExitClick }: JoinFormProps) {
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                <div className="relative border border-gray-700 bg-brand-gray w-125 h-auto rounded-lg">
                    <h1 className="text-xl text-gray-200 font-bold p-4">About CheetCode</h1>
                    <button
                        type="button"
                        className="absolute top-2 right-2 text-white cursor-pointer"
                        onClick={onInfoExitClick}
                    >
                        <X />
                    </button>
                    <div className="text-gray-500 m-5 text-center">
                        CheetCode is a multiplayer game where players must use
                        logic and a bit of deception to win. Each round,
                        players work together to solve a coding problem while trying to
                        identify the hidden imposter among them. The imposter’s goal is to
                        blend in and avoid suspicion without knowing the problem, while the
                        rest of the group must collaborate and pay attention to subtle clues
                        to figure out who doesn’t belong.
                        <br /> <br /> The game combines elements of programming
                        challenges with the strategy and psychology of party games. Whether you're
                        trying to solve problems efficiently or secretly sabotage the team, every
                        round creates new opportunities for clever plays, surprising
                        accusations, and unexpected twists. Gather your friends, sharpen your
                        problem-solving skills, and see if you can uncover the imposter before
                        it’s too late.
                    </div>
                </div>
            </div>
        </>
    );
}