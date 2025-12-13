import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import SideBar from "./components/SideBar";

export type SideBarProps = {
    showSideBar: boolean;
    setShowSideBar: (v: boolean) => void;
};

const App = () => {
    const [showSideBar, setShowSideBar] = useState(true);

    return (
        <div className="flex h-full w-full bg-neutral overflow-hidden">
            <div className="flex-grow h-full">
                <Map {...{ showSideBar, setShowSideBar }} />
            </div>

            {showSideBar && (
                <div className="w-80 bg-white border-l border-neutral-200">
                    <SideBar setShowSideBar={setShowSideBar} />
                </div>
            )}
        </div>
    );
};

export default App;
