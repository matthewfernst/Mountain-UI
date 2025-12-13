import { Fragment } from "react/jsx-runtime";
import { DateTime } from "luxon";
import { DayWeather } from "@/type/ResortFeed";

const Forecast = ({ forecast }: { forecast: DayWeather[] }) => {
    return (
        <div className="flex flex-col w-full">
            {forecast.map((day: DayWeather, index: number) => {
                let iconConditions = day.conditions.replaceAll("_", "-");
                if (iconConditions.includes("t-storms")) {
                    iconConditions = "thunderstorm";
                }

                const low = parseInt(day.temp_low_f);
                const high = parseInt(day.temp_high_f);

                const lowColor = `hsl(${240 - 170 * (low / 75)}, 90%, 50%)`;
                const highColor = `hsl(${240 - 170 * (high / 75)}, 90%, 50%)`;

                return (
                    <Fragment key={index}>
                        <div className="flex items-center gap-x-3">
                            {/* DATE + ICON GROUP */}
                            <div className="flex items-center gap-x-2">
                                <p className="text-sm font-medium text-neutral-800">
                                    {day.date && DateTime.fromISO(day.date).toFormat("EEE")}
                                </p>

                                <span
                                    className={`wi wi-forecast-io-${iconConditions} text-neutral-700 text-sm`}
                                />
                            </div>

                            {/* TEMP BAR — TAKES MOST OF THE SPACE */}
                            <div className="flex items-center flex-1">
                                <p className="pr-2 text-neutral-800">{low}°</p>

                                <div className="w-full">
                                    <div
                                        className="h-1.5 rounded-full"
                                        style={{
                                            background: `linear-gradient(to right, ${lowColor} 30%, ${highColor} 90%)`
                                        }}
                                    />
                                </div>

                                <p className="pl-2 text-neutral-800">{high}°</p>
                            </div>

                            {/* SNOW STACK */}
                            <div className="flex flex-col items-center space-y-0">
                                <span className="wi wi-forecast-io-snow text-sm text-neutral-700" />
                                <p className="text-[12px] text-neutral-600">
                                    {day.forecasted_snow_day_in}"
                                </p>
                            </div>
                        </div>

                        <hr className="border-neutral-100 w-full my-[2px]" />
                    </Fragment>
                );
            })}
        </div>
    );
};

export default Forecast;
