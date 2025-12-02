import { useEffect, useState } from "react";

const fullscreenEventNames = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
];

const isDocumentFullscreen = () => {
  const doc = window.document;
  return Boolean(
    doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
  );
};

export function useFullscreenMode() {
  const [isFullscreen, setIsFullscreen] = useState(isDocumentFullscreen());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(isDocumentFullscreen());
    };

    fullscreenEventNames.forEach((eventName) => {
      document.addEventListener(eventName, handleFullscreenChange);
    });

    handleFullscreenChange();

    return () => {
      fullscreenEventNames.forEach((eventName) => {
        document.removeEventListener(eventName, handleFullscreenChange);
      });
    };
  }, []);

  return { isFullscreen };
}
