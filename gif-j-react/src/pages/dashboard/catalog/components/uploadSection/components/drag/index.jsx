import React from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { notification, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector } from "../../../../../store/selector/modalSelector";
import axiosInstance from "../../../../../../../helpers/axiosConfig";
import { FoldersSelector } from "../../../../../../../store/selectors";
import { file } from "../../../../../../../static/api";
import { addImage } from "../../../../../../../store/slices/foldersSlice";
import { UploadLimit } from "../../../../../../../static/fileSize";

import "./style.css";

const { Dragger } = Upload;

export const Drag = () => {
  const { drag } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);
  const dispatch = useDispatch();
  const [uploading, setUploading] = React.useState(false);

  // Track files being uploaded to prevent duplicates
  const uploadingFilesRef = React.useRef(new Set());

  const uploadFile = async (fileToUpload) => {
    // Create unique identifier for this file
    const fileId = `${fileToUpload.name}-${fileToUpload.size}`;
    
    // Prevent duplicate uploads
    if (uploadingFilesRef.current.has(fileId)) {
      console.log('File already uploading, skipping:', fileToUpload.name);
      return;
    }
    
    // Mark file as uploading
    uploadingFilesRef.current.add(fileId);

    // Check if folderItem exists
    if (!folderItem || !folderItem.id) {
      notification.error({
        message: "Please select a compilation first",
      });
      return;
    }

    // Check file size
    if (fileToUpload.size >= UploadLimit) {
      notification.error({
        message: `You couldn't upload file bigger than 20mb`,
      });
      return;
    }

    setUploading(true);
    try {
      console.log('Starting upload for file:', fileToUpload.name, 'Size:', fileToUpload.size, 'Type:', fileToUpload.type);
      
      // Create FormData with the file
      const formData = new FormData();
      formData.append("file", fileToUpload);

      console.log('Uploading file to backend...');
      
      // Upload file directly to backend - backend will handle Contabo upload
      const res = await axiosInstance.post(
        `${file}/${folderItem.id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload successful:', res.data);
      console.log('File data:', {
        id: res.data.file?.id,
        name: res.data.file?.name,
        mimeType: res.data.file?.mimeType,
        url: res.data.file?.url,
        hasUrl: !!res.data.file?.url,
      });

      // Add file to state
      dispatch(addImage(res.data.file));
      
      notification.success({
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      notification.error({
        message: "Failed to upload file",
        description: error.response?.data?.message || error.response?.data?.error || error.message || "Please try again",
        duration: 5,
      });
    } finally {
      setUploading(false);
      // Remove file from uploading set
      uploadingFilesRef.current.delete(fileId);
    }
  };

  // Only handle uploads in beforeUpload to avoid duplicates
  const handleBeforeUpload = (file) => {
    console.log('beforeUpload called for:', file.name, 'Type:', file.type, 'Size:', file.size);
    // Process upload immediately
    uploadFile(file);
    // Return false to prevent default upload behavior
    return false;
  };

  // onChange is only for tracking, not uploading
  const handleChange = (info) => {
    // Only log changes, upload is handled in beforeUpload
    if (info.file.status === 'done' || info.file.status === 'error') {
      console.log('Upload status changed:', {
        status: info.file.status,
        fileName: info.file.name,
      });
    }
  };

  const DndConfig = {
    height: 120,
    name: "file",
    accept: "image/*, video/*",
    multiple: true,
    showUploadList: false,
    fileList: [],
    onChange: handleChange,
    beforeUpload: handleBeforeUpload,
    onDrop: (e) => {
      console.log('File dropped:', e.dataTransfer.files);
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
