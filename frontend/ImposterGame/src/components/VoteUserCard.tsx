import { User } from "lucide-react";

type VoteUserCardProps = {
    username: string;
    votes: number;
    highlight: boolean;
    handleCardClick: (username: string) => void;
}

export default function UserCard({ username, votes, highlight, handleCardClick }: VoteUserCardProps) {
    return (
        <>
            <div
                onClick={() => handleCardClick(username)}
                className={`flex items-center cursor-pointer text-white mr-5 mt-3 p-3 rounded-r-xl ${highlight ? "bg-purple-700" : "bg-gray-800"
                    }`}
            >
                <User className="mr-3" />
                {username}

                <div className="ml-auto w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-200 text-xs">
                    {votes}
                </div>
            </div>
        </>
    );
}