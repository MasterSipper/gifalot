import React from "react";
import "./style.css";

const DEFAULT_TRANSITION_DURATION = 500;

export const AnimationHandler = ({
  children,
  type,
  rotation,
  isActive,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
  const imageRef = React.useRef(null);

  // React.useEffect(() => {
  //   const handleResize = () => {
  //     const image = imageRef.current;
  //     const parent = image.parentNode;
  //     const parentWidth = parent.offsetWidth;
  //     const parentHeight = parent.offsetHeight;
  //
  //     const imageAspect = image.naturalWidth / image.naturalHeight;
  //     const parentAspect = parentWidth / parentHeight;
  //
  //     let width, height;
  //
  //     if (parentAspect > imageAspect) {
  //       width = parentWidth;
  //       height = parentWidth / imageAspect;
  //     } else {
  //       width = parentHeight * imageAspect;
  //       height = parentHeight;
  //     }
  //
  //     // Применяем поворот
  //     // image.style.transform = 'rotate(45deg)';
  //     console.log(parentWidth, height);
  //     // Устанавливаем новые размеры с учетом поворота
  //     if (condition) {
  //       image.style.width = `${width}px`;
  //       image.style.height = `${height}px`;
  //     }
  //   };
  //
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // Always apply animation-handler class, and active class only when isActive is true
  const className = `animation-handler ${isActive ? `${type || ''} active` : ''}`.trim();
  
  return (
    <div
      className={className}
      ref={imageRef}
      style={{
        animationDuration: `${transitionDuration}ms`,
        transform: `rotate(${rotation || 0}deg)`,
      }}
    >
      {children}
    </div>
  );
};
