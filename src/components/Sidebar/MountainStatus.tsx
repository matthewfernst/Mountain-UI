import { usePollingQuery } from "@/hooks/usePollingQuery";
import { ResortData } from "@/type/ResortFeed";

const MountainStatus = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const snowReport = usePollingQuery<ResortData>(
        "resortData",
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`,
        VITE_TIME_INTERVAL
    )?.data?.SnowReport;

    if (!snowReport) return null;

    const stats = [
        {
            label: "Trails",
            totalOpen: snowReport.TotalOpenTrails,
            total: snowReport.TotalTrails
        },
        {
            label: "Lifts",
            totalOpen: snowReport.TotalOpenLifts,
            total: snowReport.TotalLifts
        },
        {
            label: "Acres",
            totalOpen: parseInt(snowReport.OpenTerrainAcres),
            total: parseInt(snowReport.TotalTerrainAcres)
        }
    ];

    return (
        <div className="flex justify-center gap-4 mt-2">
            {stats.map((stat) => (
                <CircularStat key={stat.label} {...stat} />
            ))}
        </div>
    );
};

const CircularStat = ({
    totalOpen,
    total,
    label
}: {
    totalOpen: number;
    total: number;
    label: string;
}) => {
    const radius = 36;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percent = total > 0 ? (totalOpen / total) * 100 : 0;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center text-neutral-800 w-20 h-20">
            <svg height={radius * 2} width={radius * 2}>
                {/* Background circle */}
                <circle
                    stroke="#cacdd1ff"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress circle */}
                <circle
                    stroke="#04131bff"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
                {/* Center text */}
                <text
                    x="50%"
                    y="45%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="700"
                    fill="#0f1010ff" // neutral-50
                >
                    {totalOpen}
                </text>
                <text
                    x="50%"
                    y="65%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#4b4e54ff" // neutral-400
                >
                    {label}
                </text>
            </svg>
        </div>
    );
};

export default MountainStatus;
