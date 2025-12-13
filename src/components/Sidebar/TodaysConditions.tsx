import { usePollingQuery } from "@/hooks/usePollingQuery";
import { BaseConditions, DayWeather } from "@/type/ResortFeed";
import { SunData } from "@/type/SunData";

import { Snowflake, Wind, Gauge, Sunset, Sunrise } from "lucide-react";
import { DateTime } from "luxon";

interface WeatherCardProps {
    icon: React.ReactNode;
    iconLabel: string;
    value: string | number;
    unit: string;
}

const TodaysConditions = (props: { todaysWeather: BaseConditions; todaysSnow: DayWeather }) => {
    const todaysConditons = props.todaysWeather.Conditions.replace("_", "-");

    const { VITE_TIME_INTERVAL, VITE_LATITUDE, VITE_LONGITUDE } = import.meta.env;
    const {
        data: sunData,
        isLoading,
        error
    } = usePollingQuery<SunData>(
        "sunData",
        `https://api.sunrise-sunset.org/json?lat=${VITE_LATITUDE}&lng=${VITE_LONGITUDE}&formatted=0`,
        VITE_TIME_INTERVAL
    );

    if (!sunData || isLoading || error) return null;

    const sunriseTime = DateTime.fromISO(sunData.results.sunrise);
    const sunsetTime = DateTime.fromISO(sunData.results.sunset);
    const shouldUseSunrise = DateTime.now() < sunriseTime;
    const sunTime = shouldUseSunrise ? sunriseTime : sunsetTime;

    const weatherCards: WeatherCardProps[] = [
        {
            icon: <Snowflake size={14} />,
            iconLabel: "Snow",
            value: props.todaysSnow.forecasted_snow_in,
            unit: "in"
        },
        {
            icon: <Wind size={14} />,
            iconLabel: "Wind",
            value: props.todaysWeather.WindStrengthMph,
            unit: "mph"
        },
        {
            icon: shouldUseSunrise ? <Sunrise size={14} /> : <Sunset size={14} />,
            iconLabel: shouldUseSunrise ? "Sunrise" : "Sunset",
            value: sunTime.toFormat("h:mm"),
            unit: sunTime.toFormat("a")
        }
    ];

    return (
        <div className="flex flex-col w-full text-neutral-800 space-y-4">
            {/* Current Temp */}
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <span
                        className={`wi wi-forecast-io-${todaysConditons}`}
                        style={{ fontSize: 36 }}
                    />
                    <div className="text-3xl font-medium">{props.todaysWeather.TemperatureF}°</div>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                    <span>{`H:${props.todaysWeather.TemperatureHighF}°`}</span>
                    <span>{`L:${props.todaysWeather.TemperatureLowF}°`}</span>
                </div>
            </div>

            {/* Compact Weather Cards Row */}
            <div className="flex items-center justify-between gap-2">
                {weatherCards.map((card, idx) => (
                    <MiniWeatherCard key={idx} {...card} />
                ))}
            </div>
        </div>
    );
};

const MiniWeatherCard = (props: WeatherCardProps) => {
    return (
        <div className="flex flex-col items-center bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 min-w-[60px]">
            <div className="flex items-center gap-1 text-neutral-600 text-xs">
                {props.icon} {props.iconLabel}
            </div>
            <div className="text-sm font-medium pt-1 text-center">
                {props.value} {props.unit}
            </div>
        </div>
    );
};

export default TodaysConditions;
