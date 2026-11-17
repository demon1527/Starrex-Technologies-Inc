import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import audioManager from "../utils/audioManager";

// Every route change jumps to the top and plays a subtle swish when audio is enabled.
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (previousPath.current !== pathname) {
      audioManager.playPageTransition();
      previousPath.current = pathname;
    }
  }, [pathname]);

  return null;
}

export default ScrollToTopOnRoute;
