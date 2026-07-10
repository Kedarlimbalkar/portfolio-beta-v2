import { Routes, Route } from "react-router-dom";
import DataScientistPage from "./pages/DataScientistPage";
import DataEngineerPage from "./pages/DataEngineerPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DataScientistPage />} />
      <Route path="/data-engineer" element={<DataEngineerPage />} />
      <Route path="*" element={<DataScientistPage />} />
    </Routes>
  );
}
