import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HackathonListingPage from "./pages/HackathonListingPage";
import FiltersPage from "./pages/FiltersPage";
export function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<HackathonListingPage />} />
        <Route path="/filters" element={<FiltersPage />} />
      </Routes>
    </BrowserRouter>;
}