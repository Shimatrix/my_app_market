import React from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import AllAnnouncements from "./pages/AllAnnouncements/AllAnnouncements";
import SingleAnnouncement from "./pages/SingleAnnouncement/SingleAnnouncement";
import Orders from "./pages/Orders/Orders";

const App: React.FC = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/announcements" element={<AllAnnouncements />} />
        <Route path="/announcement/:id" element={<SingleAnnouncement />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
};

export default App;
