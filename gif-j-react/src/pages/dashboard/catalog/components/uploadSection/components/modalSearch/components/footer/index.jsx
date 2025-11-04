import React from "react";
import { Button, Pagination } from "antd";

import giphy from "../../assets/image/gipfy_logo.png";

import "./style.css";

export const SearchModalFooter = ({
  count,
  onCancel,
  onOk,
  total,
  onChangeData,
  page,
}) => {
  const disable = count === 0 || count > 10;
  const giphyContainer = document.getElementById("giphy");

  return (
    <div className={"search_modal__footer"}>
      <img src={giphy} alt="giphy_logo" />

      {total !== 0 && (
        <Pagination
          defaultCurrent={1}
          current={page === 0 ? 1 : page + 1}
          total={50}
          hideOnSinglePage={true}
          responsive={true}
          size={"small"}
          onChange={(page) => {
            onChangeData((page - 1) * 50);
            giphyContainer.scrollTop = 0;
          }}
        />
      )}

      <div className={"search_modal__footer__buttons"}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" disabled={disable} onClick={onOk}>
          Add {count} to playlist
        </Button>
      </div>
    </div>
  );
};
