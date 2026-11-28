import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// What each page shows in the background.
//   "earth" | "saturn" | "mars" | "moon" | "none" (About) | "galaxy" (Contact)
function getScene(pathname) {
  if (pathname.startsWith("/projects")) return "saturn";
  if (pathname.startsWith("/services")) return "mars";
  if (pathname.startsWith("/software-development")) return "moon";
  if (pathname.startsWith("/about")) return "none";
  if (pathname.startsWith("/products")) return "none";
  if (pathname.startsWith("/privacy") || pathname.startsWith("/terms")) return "none";
  if (pathname.startsWith("/contact")) return "galaxy";
  return "earth";
}

function PlanetController() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.StarrexPlanets) window.StarrexPlanets.show(getScene(pathname));
  }, [pathname]);

  return null;
}

export default PlanetController;
