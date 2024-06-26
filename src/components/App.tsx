import { Box, CssBaseline, PaletteMode } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";
import { DateTime } from "luxon";

import SideBar from "./SideBar";
import MountainMapCard from "./Map";
import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";

/* eslint-disable no-unused-vars */
declare module "@mui/material/styles" {
    interface Palette {
        neutral: Palette["primary"];
    }
    interface PaletteOptions {
        neutral: PaletteOptions["primary"];
    }

    interface PaletteColor {
        medium?: string;
        mediumDark?: string;
    }
    interface SimplePaletteColorOptions {
        medium?: string;
        mediumDark?: string;
    }
}

const App = () => {
    const { VITE_TIME_INTERVAL, VITE_LATITUDE, VITE_LONGITUDE } = import.meta.env;
    if (!VITE_TIME_INTERVAL) {
        throw new Error("Missing .env file. Please refer to the README.md for more information.");
    }

    const sunData: any | undefined = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://api.sunrise-sunset.org/json?lat=${VITE_LATITUDE}&lng=${VITE_LONGITUDE}&formatted=0`
    );

    let mode: PaletteMode = "light";

    if (sunData) {
        const nowHour = DateTime.now().hour;
        const sunsetHour = DateTime.fromISO(sunData.results.sunset).hour;
        const sunriseHour = DateTime.fromISO(sunData.results.sunrise).hour;
        if (nowHour <= sunriseHour + 1 || nowHour >= sunsetHour + 1) {
            mode = "dark";
        }
    }

    const theme = responsiveFontSizes(
        createTheme({
            palette: {
                mode,
                primary: { main: blue[800] },
                secondary: { main: red[600], dark: red[800] },
                neutral: {
                    main: "#FFFFFF",
                    light: grey[100],
                    medium: grey[200],
                    mediumDark: grey[300],
                    dark: grey[900]
                }
            }
        })
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box height={"100%"} display={"flex"}>
                    <Box flexGrow={1} height={"100%"}>
                        <MountainMapCard />
                    </Box>
                    <SideBar />
                </Box>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
