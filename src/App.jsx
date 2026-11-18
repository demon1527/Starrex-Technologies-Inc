import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PlanetController from "./components/PlanetController";
import ScrollToTopButton from "./components/ScrollToTop";
import AmbientSoundToggle from "./components/AmbientSoundToggle";
import ScrollToTopOnRoute from "./components/ScrollToTopOnRoute";
import RouteSeo from "./components/RouteSeo";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <ScrollToTopOnRoute />
      <ScrollToTopButton />
      <AmbientSoundToggle />
      <PlanetController />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/software-development" element={<SoftwareDevelopment />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;