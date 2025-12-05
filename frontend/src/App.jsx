import { BrowserRouter, Routes, Route } from "react-router-dom";
import Designer from "./pages/Designer";
import Home from "./pages/Home";
import Examples from "./pages/Examples";
import Docs from "./pages/Docs";
import Setup from "./pages/Setup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  );
}