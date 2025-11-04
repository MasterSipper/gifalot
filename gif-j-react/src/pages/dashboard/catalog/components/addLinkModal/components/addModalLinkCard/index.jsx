import React from "react";
import { Checkbox } from "antd";

import "./style.css";

export const AddModalLinkCard = ({ link, add, condition }) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (condition === 0) {
      setChecked(false);
    }
  }, [condition]);

  const onChange = (e) => {
    setChecked(e.target.checked);
    add(e, checked, link);
  };
  return (
    <li className={"add_modal_link_card"}>
      <Checkbox checked={checked} onChange={onChange} />
      <img
        className={"add_modal_link_card__img"}
        width={63}
        height={52}
        src={link}
        alt={"name"}
      />
      <a
        className={"add_modal_link_card__a"}
        href={link}
        target={"_blank"}
        rel="noreferrer"
      >
        {link}
      </a>
    </li>
  );
};
