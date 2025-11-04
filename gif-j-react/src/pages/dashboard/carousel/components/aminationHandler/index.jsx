import React from "react";
import "./style.css";

export const AnimationHandler = ({
  children,
  type,
  time,
  rotation,
  isActive,
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

  return (
    <div
      className={isActive ? type : ""}
      ref={imageRef}
      style={{
        animationDuration: `${time}ms`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
};
