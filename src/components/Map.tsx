import { SideBarProps } from "@/App";
import { PanelRightOpen } from "lucide-react";
import { useEffect, useRef } from "react";

const Map = (props: SideBarProps) => {
    return (
        <div className="relative w-full h-full bg-black">
            <SteamboatInteractiveMap {...props} />
        </div>
    );
};

const SteamboatInteractiveMap = (props: SideBarProps) => {
    const { VITE_MAP_ANIMATIONS } = import.meta.env;
    const mapRef = useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        const iframeReactLoadDelayTimeout = setTimeout(() => {
            if (mapRef.current) {
                const iframeWindow = mapRef.current.contentWindow;
                setUserAgent(iframeWindow, "Mozilla/5.0");

                const iframeDocument = iframeWindow?.document;
                if (iframeDocument) {
                    [
                        iframeDocument.getElementById("fullscreen"),
                        iframeDocument.getElementById("zoomControls"),
                        iframeDocument.getElementById("menu"),
                        iframeDocument.getElementById("infoLayer")
                    ].forEach((element) => element?.remove());
                }
            }
        }, 5000);
        return () => clearTimeout(iframeReactLoadDelayTimeout);
    }, [mapRef]);

    const setUserAgent = (window: Window | null, userAgent: string) => {
        if (window && window.navigator.userAgent != userAgent) {
            const userAgentProp = { get: () => userAgent };
            try {
                Object.defineProperty(window.navigator, "userAgent", userAgentProp);
            } catch (e) {
                (window as any).navigator = Object.create(navigator, { userAgent: userAgentProp });
            }
        }
    };

    return (
        <div className="relative w-full h-full bg-black">
            {!props.showSideBar && (
                <button
                    onClick={() => props.setShowSideBar(true)}
                    className="
                    absolute top-4 right-4 z-50 
                    bg-neutral-900/80 backdrop-blur 
                    text-white px-3 py-2 rounded-xl
                    border border-white/10 
                    hover:bg-neutral-800/80
                "
                >
                    <PanelRightOpen />
                </button>
            )}
            <iframe
                src={`https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=${VITE_MAP_ANIMATIONS}&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.8`}
                className="w-full h-full border-0"
                allowFullScreen
                ref={mapRef}
            />
        </div>
    );
};

export default Map;
