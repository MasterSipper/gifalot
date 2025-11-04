import React from "react";
import { Modal, Input, Button, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector } from "../../../store/selector/modalSelector";
import { addLinkClosed } from "../../../store/modalSlice/modalSlice";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { checkLinks, file } from "../../../../../static/api";
import { AddModalLinkCard } from "./components";
import { FoldersSelector } from "../../../../../store/selectors";
import { addImage } from "../../../../../store/slices/foldersSlice";
import { CloseCircleOutlined } from "@ant-design/icons";

import "./style.css";

export const AddLinkModal = React.memo(() => {
  const dispatch = useDispatch();
  const { addLink } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);

  const [inputValue, setInputValue] = React.useState([]);

  const [links, setLinks] = React.useState([]);

  const [addLinks, setAddLinks] = React.useState([]);

  const handleOk = async () => {
    const res = await axiosInstance.post(`${file}/${folderItem.id}/links`, {
      links: addLinks,
    });
    dispatch(addImage(res.data));
    setAddLinks([]);
  };

  const handleClosedLinkModal = () => {
    setInputValue([]);
    setLinks([]);
    setAddLinks([]);
    dispatch(addLinkClosed());
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setInputValue((prevState) => [
      ...prevState,
      { id: prevState.length, link: e.target.value },
    ]);
  };

  const handleCheck = async () => {
    const links = inputValue.map((item) => item.link);

    try {
      const res = await axiosInstance.post(checkLinks, { links });
      setLinks((prevState) => res.data.links);
    } catch (e) {
      notification.error({
        message: `Some links are invalid`,
      });
    }
  };

  const handleChecked = (e, checked, id) => {
    if (!checked) {
      setAddLinks((prevState) => prevState.concat(id));
    } else {
      const newArr = addLinks.filter((item) => item !== id);
      setAddLinks(newArr);
    }
  };

  const removeLink = (e, link) => {
    e.stopPropagation();
    const filtered = inputValue.filter((item) => item.id !== link);

    setInputValue((prevState) => filtered);
  };

  return (
    <Modal
      className={"add_link__modal"}
      width={803}
      title="Add from link"
      centered={true}
      open={addLink}
      okText={`ADD ${addLinks.length}`}
      onOk={handleOk}
      onCancel={handleClosedLinkModal}
    >
      <div className={"modal_input__section"}>
        <Input.TextArea value={""} rows={7} onChange={handleChange} />

        <div className={"values__wrapper"}>
          {inputValue.map((link, index) => {
            return (
              <div className={"value__item"} key={index}>
                <p>{link.link}</p>
                <CloseCircleOutlined
                  className={"CloseCircleOutlined"}
                  onClick={(e) => removeLink(e, link.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="add_link">
        <p>Paste one or more links here to add to your compilation</p>
        <Button className="add_link__button" onClick={handleCheck}>
          Check
        </Button>
      </div>
      <>
        <ul className={"add_link__text"}>
          {links?.map((link, index) => (
            <AddModalLinkCard
              key={link + index}
              link={link}
              add={handleChecked}
              condition={addLinks.length}
            />
          ))}
        </ul>
      </>
    </Modal>
  );
});
