import React from "react";
import { Link } from "react-router-dom";
import { FilterIcon, CodeIcon } from "lucide-react";
const Header = () => {
  return <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
      <div className="container mx-auto flex justify-between items-center p-4 relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <CodeIcon className="h-8 w-8" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
          <h1 className="font-mono text-2xl tracking-wider">
            HACK<span className="text-blue-200">QUEST</span>
          </h1>
        </Link>
        <Link to="/filters" className="flex items-center gap-2 bg-blue-800/50 hover:bg-blue-800 px-4 py-2 transition-colors duration-300 group">
          <FilterIcon className="h-5 w-5" strokeWidth={1.5} />
          <span className="font-mono tracking-wider text-sm">FILTERS</span>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-800 to-blue-900" />
    </header>;
};
export default Header;