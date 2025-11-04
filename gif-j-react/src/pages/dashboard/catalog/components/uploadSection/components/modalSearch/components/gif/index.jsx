import React from "react";

import "./style.css";

export const Gif = ({ item, onChecked, condition }) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (condition === 0) {
      setChecked(false);
    }
  }, [condition]);

  const handleChecked = (e) => {
    e.stopPropagation();
    setChecked(!checked);
    onChecked(e, checked, item.id);
  };

  return (
    <img
      className={checked ? "searched__gif checked" : "searched__gif"}
      src={item.url}
      alt={item.title}
      onClick={(e) => handleChecked(e)}
    />
  );
};
