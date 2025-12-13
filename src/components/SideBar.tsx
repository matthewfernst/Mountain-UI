import { usePollingQuery } from "@/hooks/usePollingQuery";
import { ResortData } from "@/type/ResortFeed";
import TodaysConditions from "./Sidebar/TodaysConditions";
import LiveStreams from "./Map/LiveStream";
import Alerts from "./Sidebar/Alerts";
import Forecast from "./Sidebar/Forecast";
import MountainStatus from "./Sidebar/MountainStatus";
import Leaderboard from "./Sidebar/Leaderboard";
import { PanelRightClose } from "lucide-react";

const SideBar = ({ setShowSideBar }: { setShowSideBar: (v: boolean) => void }) => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;

    const {
        data: resortData,
        isLoading,
        error
    } = usePollingQuery<ResortData>(
        "resortData",
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`,
        VITE_TIME_INTERVAL
    );

    // TODO: Making loading screen?
    if (!resortData || isLoading || error) {
        return null;
    }

    const todaysWeather = resortData.CurrentConditions.Base;
    const forecast = [
        resortData.Forecast.TwoDay,
        resortData.Forecast.ThreeDay,
        resortData.Forecast.FourDay
    ];

    return (
        <div className="flex flex-col pt-1 px-3 bg-white text-neutral-900 border-r border-neutral-900">
            <div className="flex flex-row items-center justify-between -ml-3 -mt-1">
                <button
                    onClick={() => setShowSideBar(false)}
                    className="bg-transparent text-neutral-900 hover:bg-neutral-200 p-2"
                >
                    <PanelRightClose size={20} />
                </button>
                <div className="flex flex-row justify-end items-center">
                    <LiveStreams />
                    <Alerts />
                </div>
            </div>

            <h1 className="text-center text-xl font-semibold text-neutral-900 tracking-tight">
                Steamboat Springs
            </h1>

            {todaysWeather && (
                <TodaysConditions
                    todaysWeather={todaysWeather}
                    todaysSnow={resortData.Forecast.OneDay}
                />
            )}
            {forecast && <Forecast forecast={forecast} />}
            <MountainStatus />
            <Leaderboard />
        </div>
    );
};

export default SideBar;
