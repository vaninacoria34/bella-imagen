import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CartSidebar from "./components/CartSidebar";
import TopBar from "./components/TopBar";
import Checkout from "./components/Checkout";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <TopBar />
      <Navbar />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}
