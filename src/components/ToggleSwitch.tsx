import React from "react";
import { ListIcon, MapIcon } from "lucide-react";
interface ToggleSwitchProps {
  isMapView: boolean;
  toggleView: () => void;
}
const ToggleSwitch = ({
  isMapView,
  toggleView
}: ToggleSwitchProps) => {
  return <div className="flex justify-center my-8">
      <div className="border-2 border-blue-800 flex font-mono">
        <button className={`flex items-center gap-2 px-6 py-3 relative overflow-hidden group ${!isMapView ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`} onClick={() => !isMapView || toggleView()}>
          <ListIcon className="h-5 w-5" strokeWidth={1.5} />
          <span className="tracking-wider text-sm">LIST VIEW</span>
          {!isMapView && <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />}
        </button>
        <div className="w-px bg-blue-800" />
        <button className={`flex items-center gap-2 px-6 py-3 relative overflow-hidden group ${isMapView ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`} onClick={() => isMapView || toggleView()}>
          <MapIcon className="h-5 w-5" strokeWidth={1.5} />
          <span className="tracking-wider text-sm">MAP VIEW</span>
          {isMapView && <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />}
        </button>
      </div>
    </div>;
};
export default ToggleSwitch;