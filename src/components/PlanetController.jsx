import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import audioManager from "../utils/audioManager";

// What each page shows in the background.
//   "earth" | "saturn" | "mars" | "moon" | "none" (About) | "galaxy" (Contact)
function getScene(pathname) {
  if (pathname.startsWith("/projects")) return "saturn";
  if (pathname.startsWith("/services")) return "mars";
  if (pathname.startsWith("/software-development")) return "moon";
  if (pathname.startsWith("/about")) return "none";
  if (pathname.startsWith("/contact")) return "galaxy";
  return "earth";
}

function PlanetController() {
  const { pathname } = useLocation();
  const previousScene = useRef(null);

  useEffect(() => {
    const scene = getScene(pathname);
    if (window.StarrexPlanets) window.StarrexPlanets.show(scene);

    if (previousScene.current !== null && previousScene.current !== scene && scene !== "none") {
      // Let the planet begin its entrance before the arrival sound.
      const timer = window.setTimeout(() => audioManager.playPlanetArrival(), 650);
      previousScene.current = scene;
      return () => window.clearTimeout(timer);
    }

    previousScene.current = scene;
  }, [pathname]);

  return null;
}

export default PlanetController;
