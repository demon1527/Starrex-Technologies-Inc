import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// What each page shows in the background, and the colour of the space around it.
//   scene: "earth" | "saturn" | "mars" | "moon" | "none" | "galaxy"
//   space: matches the html[data-space="..."] colours in index.css
function getScene(pathname) {
  if (pathname.startsWith("/projects")) return { scene: "saturn", space: "saturn" };
  if (pathname.startsWith("/services")) return { scene: "mars", space: "mars" };
  if (pathname.startsWith("/software-development")) return { scene: "moon", space: "moon" };
  if (pathname.startsWith("/about")) return { scene: "none", space: "purple" };
  if (pathname.startsWith("/contact")) return { scene: "galaxy", space: "purple" };
  return { scene: "earth", space: "earth" };
}

let firstRun = true;

function PlanetController() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { scene, space } = getScene(pathname);
    const root = document.documentElement;

    if (firstRun) {
      // On page load, set the space colour instantly (no fade from purple).
      firstRun = false;
      root.style.transition = "none";
      root.dataset.space = space;
      void root.offsetHeight; // apply it before the fade is switched back on
      root.style.transition = "";
    } else {
      root.dataset.space = space;
    }

    if (window.StarrexPlanets) window.StarrexPlanets.show(scene);
  }, [pathname]);

  return null;
}

export default PlanetController;
