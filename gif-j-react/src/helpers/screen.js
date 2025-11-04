export const fullScreen = () => {
  const el = window.document.documentElement;
  const rfs =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  }
};

export const exitScreen = () => {
  if (window.document.exitFullscreen) {
    window.document.exitFullscreen();
  } else if (window.document.mozCancelFullScreen) {
    window.document.mozCancelFullScreen();
  } else if (window.document.webkitCancelFullScreen) {
    window.document.webkitCancelFullScreen();
  } else if (window.document.msExitFullscreen) {
    window.document.msExitFullscreen();
  }
};
