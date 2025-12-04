import { useEffect, useState } from "react";

export function useChromecast() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    // Check if Cast Framework is available
    const checkCastAvailability = () => {
      // Check if both cast framework and chrome.cast are available
      if (
        window.cast &&
        window.cast.framework &&
        window.chrome &&
        window.chrome.cast &&
        window.chrome.cast.media
      ) {
        try {
          const castContext = window.cast.framework.CastContext.getInstance();
          const autoJoinPolicy = window.cast.framework.AutoJoinPolicy;
          
          if (autoJoinPolicy) {
            castContext.setOptions({
              receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
              autoJoinPolicy: autoJoinPolicy.ORIGIN_SCOPED,
            });

            // Listen for cast state changes
            const castSession = castContext.getCurrentSession();
            if (castSession) {
              setIsCasting(true);
            }

            castContext.addEventListener(
              window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
              (event) => {
                setIsCasting(
                  event.castState === window.cast.framework.CastState.CONNECTED
                );
              }
            );

            setIsAvailable(true);
          }
        } catch (error) {
          console.warn("Error initializing Cast framework:", error);
        }
      }
    };

    // Set up callback for when Cast SDK loads
    if (window.__onGCastApiAvailable) {
      // Already set, check immediately
      checkCastAvailability();
    } else {
      // Set up callback for when SDK loads
      window.__onGCastApiAvailable = (loaded, errorInfo) => {
        if (loaded) {
          checkCastAvailability();
        }
      };
    }

    // Check immediately in case SDK is already loaded
    checkCastAvailability();
    
    // Also check after delays in case SDK loads asynchronously
    const timeout1 = setTimeout(checkCastAvailability, 500);
    const timeout2 = setTimeout(checkCastAvailability, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const castToChromecast = (url) => {
    if (
      !window.cast ||
      !window.cast.framework ||
      !window.chrome ||
      !window.chrome.cast ||
      !window.chrome.cast.media
    ) {
      console.warn("Chromecast SDK not loaded");
      // Fallback: Open in new window so user can use browser cast button
      window.open(url, "_blank");
      return;
    }

    try {
      const castContext = window.cast.framework.CastContext.getInstance();
      
      // Request a session
      castContext.requestSession().then((session) => {
        if (!session) {
          console.error("Failed to get cast session");
          window.open(url, "_blank");
          return;
        }

        const mediaInfo = new window.chrome.cast.media.MediaInfo(url, "text/html");
        mediaInfo.contentType = "text/html";
        mediaInfo.streamType = window.chrome.cast.media.StreamType.LIVE;
        
        if (window.chrome.cast.media.GenericMediaMetadata) {
          mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = "Gifalot Carousel";
        }

        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        
        session.loadMedia(request).then(
          () => {
            setIsCasting(true);
          },
          (error) => {
            console.error("Error loading media:", error);
            window.open(url, "_blank");
          }
        );
      }).catch((error) => {
        console.error("Error requesting session:", error);
        window.open(url, "_blank");
      });
    } catch (error) {
      console.error("Error casting:", error);
      // Fallback: Open in new window
      window.open(url, "_blank");
    }
  };

  const stopCasting = () => {
    if (window.cast && window.cast.framework) {
      const castContext = window.cast.framework.CastContext.getInstance();
      const session = castContext.getCurrentSession();
      if (session) {
        session.endSession(true);
        setIsCasting(false);
      }
    }
  };

  return {
    isAvailable,
    isCasting,
    castToChromecast,
    stopCasting,
  };
}

