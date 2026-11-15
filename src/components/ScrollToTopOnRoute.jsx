import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Every time the page (route) changes, jump straight to the top.
// "instant" is needed because global.css sets html { scroll-behavior: smooth },
// which would otherwise make the page visibly scroll up from the bottom.
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTopOnRoute;