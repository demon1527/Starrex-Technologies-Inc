import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PlanetController() {
  const { pathname } = useLocation();

  useEffect(() => {
    let planet = "earth";
    if (pathname.startsWith("/projects")) planet = "saturn";
    else if (pathname.startsWith("/services")) planet = "mars";
    if (window.StarrexPlanets) window.StarrexPlanets.show(planet);
  }, [pathname]);

  return null;
}

export default PlanetController;
