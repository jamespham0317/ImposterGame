import { User } from "lucide-react";

type LobbyUserCardProps = {
    username: string;
    highlight: boolean;
}

export default function LobbyUserCard({ username, highlight }: LobbyUserCardProps) {
    return (
        <>
            <div className={`flex items-center text-gray-200 mx-5 mt-3 p-3 rounded-xl ${highlight ? "bg-purple-700" : "bg-gray-800"}`}>
                <User className="mr-3" />
                {username}
            </div>
        </>
    );
}