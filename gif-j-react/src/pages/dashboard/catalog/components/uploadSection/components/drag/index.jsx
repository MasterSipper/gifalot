import React from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { notification, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector } from "../../../../../store/selector/modalSelector";
import axiosInstance from "../../../../../../../helpers/axiosConfig";
import { FoldersSelector } from "../../../../../../../store/selectors";
import { apiUrl, file } from "../../../../../../../static/api";
import { addImage } from "../../../../../../../store/slices/foldersSlice";
import { UploadLimit } from "../../../../../../../static/fileSize";
import axios from "axios";

import "./style.css";

const { Dragger } = Upload;

export const Drag = () => {
  const { drag } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);
  const dispatch = useDispatch();

  const DndConfig = {
    height: 120,
    customRequest: () => {},
    name: "file",
    accept: "image/*, video/*",
    multiple: true,
    showUploadList: false,
    fileList: [],
    onDrop: () => {},
    onChange: async (info) => {
      if (info.file.originFileObj.size >= UploadLimit) {
        notification.error({
          message: `You couldn't upload file bigger than 20mb`,
        });
        return;
      }
      const res = await axiosInstance.post(
        `${apiUrl}${file}/${folderItem.id}`,
        {
          mimeType: info.file.originFileObj.type,
          filename: info.file.originFileObj.name,
        }
      );
      const nextUrl = res.data.upload.url;
      const formData = new FormData();

      Object.entries(res.data.upload.fields).forEach((item) => {
        formData.append(item[0], item[1]);
      });

      formData.append("Content-Type", info.file.originFileObj.type);
      formData.append(file, info.file.originFileObj);
      await axios.post(nextUrl, formData);

      dispatch(addImage(res.data.file));
    },
  };

  return (
    <>
      {drag && (
        <Dragger {...DndConfig}>
          <p className="ant-upload-drag-icon">
            <RiUploadCloud2Line
              className="remix-icon"
              style={{ color: "blue", width: 30, height: 30 }}
            />
          </p>

          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      )}
    </>
  );
};
