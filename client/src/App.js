import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ZipcodeSearchPage from "./pages/ZipcodeSearchPage";
import BusinessZipSearchPage from "./pages/BusinessZipSearchPage";
import ParametersSearchPage from "./pages/ParametersSearchPage";
import RankingsPage from "./pages/RankingsPage";
import AnalysisPage from "./pages/AnalysisPage";


export const theme = createTheme({
  palette: {
    light: '#ffa726',
    main: '#f57c00',
    dark: '#ef6c00',
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zipcodeSearch" element={<ZipcodeSearchPage />} />
          <Route path="/businessZipCodeSearch" element={<BusinessZipSearchPage />} />
          <Route path="/parametersSearch" element={<ParametersSearchPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}