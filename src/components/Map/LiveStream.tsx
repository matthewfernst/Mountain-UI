import { ChevronDown, ChevronUp, Video, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LiveStreams = () => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINKS = "", VITE_LIVE_STREAM_BUTTON_TITLES = "" } = import.meta
        .env;

    const liveStreamLinks = VITE_YOUTUBE_LIVE_STREAM_LINKS.split(",");
    const liveStreamTitles = VITE_LIVE_STREAM_BUTTON_TITLES.split(",");

    // fallback to single "unknown" entry if envs are empty
    if (liveStreamLinks.length === 0) liveStreamLinks.push("about:blank");
    if (liveStreamTitles.length === 0) liveStreamTitles.push("Live");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

    // click-away: close dropdown when clicking outside the menuRef
    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            // if click is inside menuRef, ignore
            if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
            setDropdownOpen(false);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    return (
        <>
            {/* Opener */}
            <button
                onClick={() => setDialogOpen(true)}
                className="p-2 rounded-md bg-transparent text-neutral-900 hover:bg-neutral-100 transition"
                aria-label="Open live streams"
            >
                <Video size={20} />
            </button>

            {/* Fullscreen Modal */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white">
                    {/* Top bar: dropdown left, close right */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-white/90 backdrop-blur-sm">
                        {/* LEFT: dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                ref={toggleButtonRef}
                                onClick={(e) => {
                                    e.stopPropagation(); // stop click from reaching document mousedown handler
                                    setDropdownOpen((s) => !s);
                                }}
                                aria-haspopup="menu"
                                aria-expanded={dropdownOpen}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 transition shadow-sm"
                            >
                                <span className="truncate max-w-[16ch]">
                                    {liveStreamTitles[selectedIndex]}
                                </span>
                                {dropdownOpen ? (
                                    <ChevronUp size={18} className="text-neutral-700" />
                                ) : (
                                    <ChevronDown size={18} className="text-neutral-700" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute left-0 mt-2 w-56 rounded-lg bg-neutral-200 border border-neutral-300 shadow-xl z-50 overflow-hidden">
                                    {liveStreamTitles.map((title: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedIndex(idx);
                                                setDropdownOpen(false);
                                            }}
                                            className={`flex items-center w-full px-4 py-2 gap-2 text-sm transition ${
                                                idx === selectedIndex
                                                    ? "font-semibold text-neutral-900 bg-neutral-100"
                                                    : "text-neutral-800 bg-neutral-200 hover:bg-neutral-100"
                                            }`}
                                        >
                                            {idx === selectedIndex ? (
                                                <Check size={14} className="text-neutral-900" />
                                            ) : (
                                                <span className="w-[14px]" />
                                            )}
                                            <span>{title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setDialogOpen(false)}
                            className="bg-transparent p-2 rounded-md text-neutral-600 hover:bg-neutral-200 transition"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Video */}
                    <div className="flex-1 flex items-center justify-center p-2 bg-white w-full">
                        <div className="w-full max-w-5xl h-full">
                            <iframe
                                title="live-stream"
                                className="w-full h-full rounded-lg shadow-2xl border border-neutral-100 bg-white"
                                src={`${liveStreamLinks[selectedIndex]}?autoplay=1&vq=hd1080`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LiveStreams;
