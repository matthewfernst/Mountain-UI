import { usePollingQuery } from "@/hooks/usePollingQuery";
import { NationalWeatherServiceAlert } from "@/type/NationalWeatherServiceAlerts";
import { ResortData } from "@/type/ResortFeed";
import { Bell, X } from "lucide-react";
import { useState } from "react";

const Alerts = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID, VITE_NATIONAL_WEATHER_SERVICE_ZONE } =
        import.meta.env;

    const [showAlert, setShowAlert] = useState(false);
    const [badgeNumber, setBadgeNumber] = useState(0);

    const [prevNationalWeatherServiceMessage, setPrevNationalWeatherServiceMessage] = useState<
        string | null
    >(null);
    const [prevSnowPatrolServiceMessage, setPrevSnowPatrolServiceMessage] = useState<string | null>(
        null
    );

    const resortDataResult = usePollingQuery<ResortData>(
        "resortDataResult",
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`,
        VITE_TIME_INTERVAL
    );

    const getPlainMessage = (html: string): string => {
        const withoutLinks = html.replace(/<a\b[^>]*>.*?<\/a>/gi, "");

        const parser = new DOMParser();
        const doc = parser.parseFromString(withoutLinks, "text/html");

        return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
    };

    const snowPartolMessage = resortDataResult.data
        ? getPlainMessage(resortDataResult.data?.SnowReport.Alert)
        : undefined;

    const nationalWeatherServiceAlertResult = usePollingQuery<NationalWeatherServiceAlert>(
        "nationalServiceAlertResult",
        `https://api.weather.gov/alerts/active?zone=${VITE_NATIONAL_WEATHER_SERVICE_ZONE}`,
        VITE_TIME_INTERVAL
    );
    const nationalWeatherServiceMessage =
        nationalWeatherServiceAlertResult.data?.features?.[0]?.properties?.description;

    if (
        nationalWeatherServiceMessage &&
        prevNationalWeatherServiceMessage !== nationalWeatherServiceMessage
    ) {
        setPrevNationalWeatherServiceMessage(nationalWeatherServiceMessage);
        setBadgeNumber((prev) => prev + 1);
    }

    if (snowPartolMessage && prevSnowPatrolServiceMessage !== snowPartolMessage) {
        setPrevSnowPatrolServiceMessage(snowPartolMessage);
        setBadgeNumber((prev) => prev + 1);
    }

    return (
        <>
            <button
                onClick={() => setShowAlert(true)}
                className="relative bg-transparent hover:bg-neutral-200 p-2 text-neutral-800 transition"
                aria-label="View alerts"
            >
                {/* Badge */}
                {badgeNumber > 0 && (
                    <span className="absolute -top-[0.5px] right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                        {badgeNumber}
                    </span>
                )}
                <Bell size={20} />
            </button>

            {showAlert && (
                <CollapsableAlert
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    setBadgeNumber={setBadgeNumber}
                    nationalWeatherServiceMessage={nationalWeatherServiceMessage}
                    snowPatrolMessage={snowPartolMessage}
                />
            )}
        </>
    );
};

interface AlertProps {
    showAlert: boolean;
    setShowAlert: (v: boolean) => void;
    setBadgeNumber: (count: number) => void;
    nationalWeatherServiceMessage: string | undefined;
    snowPatrolMessage: string | undefined;
}
const CollapsableAlert = ({
    showAlert,
    setShowAlert,
    setBadgeNumber,
    nationalWeatherServiceMessage,
    snowPatrolMessage
}: AlertProps) => {
    if (!showAlert) return null;

    return (
        <div className="fixed top-4 right-4 w-80 bg-neutral-100 border border-neutral-800 rounded-xl shadow-lg p-4 text-neutral-100 z-50">
            {/* Header */}
            <div className="flex justify-between items-start">
                <p className="font-semibold text-neutral-800 text-xl">Alerts</p>
                <button
                    onClick={() => {
                        setShowAlert(false);
                        setBadgeNumber(0);
                    }}
                    className="bg-transparent text-neutral-800 hover:text-neutral-900 transition rounded p-1"
                >
                    <X size={16} />
                </button>
            </div>
            <hr className="border-neutral-300" />

            {/* No Alerts */}
            {!nationalWeatherServiceMessage && !snowPatrolMessage && (
                <p className="text-neutral-600 text-md">No Alerts</p>
            )}

            {/* National Weather Service */}
            {nationalWeatherServiceMessage && (
                <>
                    <p className="font-medium text-neutral-800 text-sm">
                        National Weather Service Alerts
                    </p>
                    <div className="text-neutral-700 text-sm space-y-1">
                        {nationalWeatherServiceMessage
                            .split("*")
                            .filter((line: string) => line.length > 0)
                            .map((line: string, idx: number) => (
                                <p key={idx}>{`• ${line}`}</p>
                            ))}
                    </div>
                </>
            )}

            {/* Snow Patrol */}
            {snowPatrolMessage && (
                <div className="pt-5">
                    <p className="font-medium text-neutral-800 text-sm">Snow Patrol Alerts</p>
                    <div className="text-neutral-800 text-sm space-y-1">{snowPatrolMessage}</div>
                </div>
            )}
        </div>
    );
};

export default Alerts;
