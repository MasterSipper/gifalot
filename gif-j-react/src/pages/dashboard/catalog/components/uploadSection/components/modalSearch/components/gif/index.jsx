import React from "react";

import "./style.css";

export const Gif = ({ item, onChecked, condition, selectedIds = [] }) => {
  // Sync with parent's selectedIds array
  const isChecked = selectedIds.includes(item.id);
  const [checked, setChecked] = React.useState(isChecked);

  React.useEffect(() => {
    // Reset when condition is 0 (modal closed/reset)
    if (condition === 0) {
      setChecked(false);
    } else {
      // Sync with parent's selectedIds
      setChecked(selectedIds.includes(item.id));
    }
  }, [condition, selectedIds, item.id]);

  const handleChecked = (e) => {
    e.stopPropagation();
    const newChecked = !checked;
    setChecked(newChecked);
    // Pass the NEW checked value to parent so it knows whether to add or remove
    onChecked(e, newChecked, item.id);
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
