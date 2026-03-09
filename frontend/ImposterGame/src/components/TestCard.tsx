import { Check, X } from "lucide-react";

type TestCardProps = {
    index: number;
    passed?: boolean;
    highlight: boolean;
    handleCardClick: (index: number) => void;
}

export default function TestCard({ index, passed, highlight, handleCardClick }: TestCardProps) {
    return (
        <>
            <div
                className={`text-gray-300 m-3 py-2 px-5 rounded-xl cursor-pointer ${highlight ? "bg-gray-800" : "bg-gray-950"} ${highlight ? "hover:bg-gray-800" : "hover:bg-gray-900"}`}
                onClick={() => handleCardClick(index)}
            >
                {passed !== undefined ? (passed ? <Check className="inline-block mr-2 text-green-500" /> : <X className="inline-block ml-2 text-red-500" />) : null}
                Test {index + 1}
            </div>
        </>
    );
}