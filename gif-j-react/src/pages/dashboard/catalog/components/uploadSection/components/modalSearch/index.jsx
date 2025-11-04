import React from "react";
import { Button, Col, Form, Input, Modal, notification } from "antd";
import { SearchModalFooter, Gif } from "./components";
import { UserOutlined } from "@ant-design/icons";
import { modalSelector } from "../../../../../store/selector/modalSelector";
import { GridContainer } from "../../../../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { searchClosed } from "../../../../../store/modalSlice/modalSlice";
import { file } from "../../../../../../../static/api";
import { searchFormFields } from "../../../../../../../static/searchForm";
import { addImage } from "../../../../../../../store/slices/foldersSlice";
import axiosInstance from "../../../../../../../helpers/axiosConfig";
import { FoldersSelector } from "../../../../../../../store/selectors";

import "./style.css";

export const ModalSearch = () => {
  const dispatch = useDispatch();

  const { folderItem } = useSelector(FoldersSelector);
  const { search } = useSelector(modalSelector);

  const [fields, setFields] = React.useState(searchFormFields);

  const [gifs, setGifs] = React.useState([]);
  // const [total, setTotal] = React.useState(50);
  const [offset, setOffset] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [addGifs, setAddGifs] = React.useState([]);

  const fetchGifs = (page, search) => {
    const condition = search === undefined ? searchValue : search;

    axiosInstance
      .get(`${file}/giphy-search?q=${condition}&offset=${page}&limit=${50}`)
      .then((res) => {
        // setTotal(res.data.pagination.total_count);
        if (res.data.data.length === 0) {
          notification.info({
            message: `we couldn't find something on you request, try again`,
          });
          setGifs([]);
        } else {
          setOffset(res.data.pagination.offset);
          setGifs((prevState) => res.data.data);
        }
      })
      .catch((e) => {
        notification.open({
          message: e.message,
        });
      });
  };

  const onFinish = async (values) => {
    const { search } = values;
    setSearchValue(search);
    await fetchGifs(0, search);
  };

  const handleOk = async () => {
    const res = await axiosInstance.post(`${file}/${folderItem.id}/giphy`, {
      ids: addGifs,
    });

    const arr = res.data.map((item) => ({
      ...item,
      timePerSlide: folderItem.timePerSlide,
      transitionType: folderItem.transitionType,
    }));

    dispatch(addImage(arr));
    setAddGifs([]);
    reset();
  };

  const handleCancel = async () => {
    setFields(searchFormFields);
    dispatch(searchClosed());
    setAddGifs([]);
    // setTotal(0);
    setGifs([]);
  };

  const handleChecked = (e, checked, id) => {
    if (!checked) {
      setAddGifs((prevState) => prevState.concat(id));
    } else {
      const newArr = addGifs.filter((item) => item !== id);
      setAddGifs(newArr);
    }
  };

  if (addGifs.length > 10) {
    notification.open({
      message: `You can't add more than 10 gifs for one time`,
    });
  }

  const reset = () => {
    return false;
  };

  const renderGif = () =>
    gifs?.map((gif) => {
      return (
        <Col key={gif.id} md={12} lg={8} xxl={6} className={"col"}>
          <Gif
            key={gif.id}
            item={gif}
            onChecked={handleChecked}
            condition={addGifs.length}
          />
        </Col>
      );
    });

  return (
    <>
      <Modal
        title={"Search Giphy"}
        open={search}
        closable={true}
        onCancel={handleCancel}
        centered={true}
        keyboard={true}
        className={"search__modal"}
        footer={
          <SearchModalFooter
            onCancel={handleCancel}
            total={gifs.length}
            page={offset / 50}
            onOk={handleOk}
            count={addGifs.length}
            onChangeData={fetchGifs}
          />
        }
      >
        <Form
          className={"search__modal__form"}
          name="basic"
          layout={"vertical"}
          fields={fields}
          onFinish={onFinish}
          onFieldsChange={(_, allFields) => {
            setFields(allFields);
          }}
          autoComplete="off"
        >
          <div className={"form__search__section"}>
            <Form.Item name="search" className={"section__search_input"}>
              <Input
                autoComplete={""}
                placeholder={"search"}
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Button type={"text"} htmlType="submit">
              Search
            </Button>
          </div>
        </Form>

        <GridContainer height={"55vh"} id={"giphy"}>
          {renderGif()}
        </GridContainer>
      </Modal>
    </>
  );
};
