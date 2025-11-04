import { useState, useEffect } from "react";

export function useFullscreenMode() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleResize = () => {
    if (
      window.innerWidth === window.screen.width &&
      window.innerHeight === window.screen.height
    ) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.document.innerWidth, window.document.innerHeight]);

  return { isFullscreen };
}
