import { GET_LEADERBOARD } from "@/graphql/query";
import { useQuery } from "@apollo/client/react";
import { Triangle } from "lucide-react";
import { useState } from "react";

type LeaderboardResults = {
    leaderboard: User[];
};

type User = {
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    stats?: {
        verticalDistance: number;
        topSpeed: number;
        runCount: number;
    };
};

type LeaderboardFieldInfo = {
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    stat: number;
    unit: string;
};

enum StatField {
    RUN_COUNT = "runCount",
    VERTICAL_DISTANCE = "verticalDistance",
    TOP_SPEED = "topSpeed"
}

const Leaderboard = () => {
    const { loading, error, data } = useQuery<LeaderboardResults>(GET_LEADERBOARD);

    const [currentLeaderboardIndex, setCurrentLeaderboardIndex] = useState(0);

    if (loading || error) {
        return null;
    }

    if (!data || data.leaderboard.length === 0) {
        return (
            <div className="w-full flex justify-center">
                <h3>No Leaderboard Data</h3>
            </div>
        );
    }

    const fields = [StatField.VERTICAL_DISTANCE, StatField.RUN_COUNT, StatField.TOP_SPEED];

    const getUserStat = (user: User, field: StatField) => {
        return {
            ...user,
            stat: user.stats![field],
            unit: unitFromField(field)
        } as LeaderboardFieldInfo;
    };

    const getStatFieldTitle = (field: StatField) => {
        switch (field) {
            case StatField.RUN_COUNT:
                return "Run Count";
            case StatField.VERTICAL_DISTANCE:
                return "Vertical Distance";
            case StatField.TOP_SPEED:
                return "Top Speed";
        }
    };

    const leaderboards = fields.map((field) => {
        return {
            title: getStatFieldTitle(field),
            leaders: data.leaderboard.map((user) => getUserStat(user, field))
        };
    });

    const currentLeaderboard = leaderboards[currentLeaderboardIndex];

    return (
        <div className="flex flex-col items-center justify-between w-full">
            {/* Header with Arrows */}
            <div className="flex items-center justify-center w-full mb-4">
                <div className="w-10 flex items-center justify-center">
                    {currentLeaderboardIndex > 0 ? (
                        <button
                            onClick={() => setCurrentLeaderboardIndex((i) => i - 1)}
                            className="bg-transparent"
                        >
                            <Triangle size={18} fill="true" className="-rotate-90" />
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}
                </div>

                {/* Title */}
                <div className="flex-grow flex justify-center">
                    <h2 className="text-[17px] font-medium text-center">
                        {currentLeaderboard.title}
                    </h2>
                </div>

                <div className="w-10 flex items-center justify-center">
                    {currentLeaderboardIndex < leaderboards.length - 1 ? (
                        <button
                            onClick={() => setCurrentLeaderboardIndex((i) => i + 1)}
                            className="bg-transparent"
                        >
                            <Triangle size={18} fill="true" className="rotate-90" />
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}
                </div>
            </div>
            <LeaderboardSection leaders={currentLeaderboard.leaders} />
        </div>
    );
};

const LeaderboardSection = ({ leaders }: { leaders: LeaderboardFieldInfo[] }) => {
    return (
        <div className="flex flex-col w-full">
            {leaders.slice(0, 4).map((user: any, index: number) => (
                <div key={index}>
                    <div className="flex items-center justify-between px-2 py-2 rounded-md transition-colors hover:bg-black/5">
                        {/* Left section */}
                        <div className="flex items-center gap-3">
                            <span className="text-neutral-500 font-medium w-5 text-right">
                                {index + 1}
                            </span>

                            <img
                                src={user.profilePictureUrl}
                                alt={user.firstName}
                                className="w-8 h-8 rounded-full"
                            />

                            <span className="text-neutral-900 text-[15px]">
                                {user.firstName} {user.lastName}
                            </span>
                        </div>

                        {/* Stat */}
                        <span className="text-[14px] font-medium">
                            {Intl.NumberFormat("en-US", {
                                style: "decimal"
                            }).format(user.stat.toFixed(0))}{" "}
                            {user.unit}
                        </span>
                    </div>

                    {index !== leaders.length - 1 && (
                        <div className="border-b border-black/10 mx-2 my-2" />
                    )}
                </div>
            ))}
        </div>
    );
};

const unitFromField = (field: string) => {
    switch (field) {
        case "verticalDistance":
            return "ft";
        case "topSpeed":
            return "mph";
        case "runCount":
            return "runs";
        default:
            return "ft";
    }
};

export default Leaderboard;
