import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import TemplateDetailPage from "./pages/dashboard/TemplateDetailPage";
import TvScreen from "./pages/tv/TVScreen";
import TrainerDashboard from "./pages/dashboard/TrainerDashboard";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                    path="/templates/:id"
                    element={<TemplateDetailPage />}
                    />
                <Route path="/tv" element={<TvScreen />} />
                <Route path="/trainer" element={<TrainerDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;