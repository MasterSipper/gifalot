import React from "react";
import { Button, Col, Form, Input, Modal, notification, Select, Space } from "antd";
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
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedRatings, setSelectedRatings] = React.useState(['g', 'pg', 'pg-13', 'r']); // All ratings selected by default
  const [selectedOrientation, setSelectedOrientation] = React.useState('all'); // 'all', 'landscape', 'portrait', 'square'

  // When modal opens, use compilation name as search term and trigger search
  React.useEffect(() => {
    if (search && folderItem?.name) {
      // Set the search value to compilation name
      setSearchValue(folderItem.name);
      // Update form fields to show the compilation name
      const updatedFields = searchFormFields.map(field => 
        Array.isArray(field.name) && field.name[0] === 'search' 
          ? { ...field, value: folderItem.name } 
          : field
      );
      setFields(updatedFields);
      // Trigger search automatically
      fetchGifs(0, folderItem.name, selectedRatings, selectedOrientation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, folderItem?.name]);

  const fetchGifs = (page, search, ratings = selectedRatings, orientation = selectedOrientation) => {
    const condition = search === undefined ? searchValue : search;
    
    // Build params object - axios will handle array parameters correctly
    const params = {
      q: condition,
      offset: page,
      limit: 50,
    };
    
    // Add ratings if specified and not all are selected (to avoid unnecessary filtering)
    if (ratings && ratings.length > 0 && ratings.length < 4) {
      params.ratings = ratings;
    }

    axiosInstance
      .get(`${file}/giphy-search`, { params })
      .then((res) => {
        // Filter by orientation if specified (client-side filtering based on dimensions)
        let filteredData = res.data.data;
        if (orientation && orientation !== 'all' && res.data.data.length > 0) {
          filteredData = res.data.data.filter((gif) => {
            // Check if gif has dimensions in the response
            // The backend should include width/height if available from Giphy API
            if (gif.width && gif.height) {
              const aspectRatio = gif.width / gif.height;
              if (orientation === 'landscape') {
                return aspectRatio > 1.1; // Width significantly greater than height
              } else if (orientation === 'portrait') {
                return aspectRatio < 0.9; // Height significantly greater than width
              } else if (orientation === 'square') {
                return aspectRatio >= 0.9 && aspectRatio <= 1.1; // Roughly square
              }
            }
            // If no dimensions, include it (can't filter)
            return true;
          });
        }
        
        // setTotal(res.data.pagination.total_count);
        if (filteredData.length === 0) {
          notification.info({
            message: `we couldn't find something on you request, try again`,
          });
          setGifs([]);
        } else {
          setOffset(res.data.pagination.offset);
          setGifs((prevState) => filteredData);
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
    await fetchGifs(0, search, selectedRatings, selectedOrientation);
  };

  const handleRatingChange = (value) => {
    // value is now a single string or array from Select
    const ratings = Array.isArray(value) ? value : value ? [value] : ['g', 'pg', 'pg-13', 'r'];
    setSelectedRatings(ratings);
    // Re-fetch with new ratings if we have a search value
    if (searchValue) {
      fetchGifs(offset, searchValue, ratings, selectedOrientation);
    }
  };

  const handleOrientationChange = (value) => {
    setSelectedOrientation(value);
    // Re-fetch with new orientation if we have a search value
    if (searchValue) {
      fetchGifs(offset, searchValue, selectedRatings, value);
    }
  };

  const handleOk = async () => {
    console.log('handleOk called', { addGifs, folderItem });
    
    if (addGifs.length === 0) {
      notification.warning({
        message: "Please select at least one GIF to add",
      });
      return;
    }

    if (!folderItem || !folderItem.id) {
      notification.error({
        message: "Please select a playlist first",
      });
      console.error('No folderItem or folderItem.id:', folderItem);
      return;
    }

    if (isAdding) {
      // Prevent multiple simultaneous requests
      return;
    }

    setIsAdding(true);
    
    try {
      // Ensure all IDs are strings (Giphy API requires string IDs)
      const idsToSend = addGifs.map((id) => String(id));
      console.log('Sending API request:', { 
        collectionId: folderItem.id, 
        originalIds: addGifs,
        idsToSend,
        idsType: addGifs.map(id => typeof id),
      });
      
      notification.info({
        message: `Adding ${addGifs.length} GIF(s)...`,
        description: 'This may take a moment, especially for multiple large GIFs.',
        duration: 3,
      });
      
      const res = await axiosInstance.post(`${file}/${folderItem.id}/giphy`, {
        ids: idsToSend,
      }, {
        timeout: 120000, // 120 seconds timeout for Giphy requests (multiple large GIFs can take time)
      });

      console.log('API response:', res.data);

      const arr = res.data.map((item) => ({
        ...item,
        timePerSlide: folderItem.timePerSlide || 4000,
        transitionType: folderItem.transitionType || 'fadeInOut',
      }));

      dispatch(addImage(arr));
      setAddGifs([]); // Clear selections
      setGifs([]); // Clear search results
      dispatch(searchClosed());
      notification.success({
        message: `Successfully added ${arr.length} GIF(s) to playlist`,
      });
    } catch (error) {
      console.error('Error adding GIFs:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });
      
      let errorMessage = "Failed to add GIFs to playlist";
      let errorDescription = "";
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = "Request timed out";
        errorDescription = "The request took too long. This can happen with large GIFs. Please try adding fewer GIFs at once or try again.";
      } else if (error.response?.status === 400) {
        // Handle validation errors from NestJS
        const responseData = error.response.data;
        if (Array.isArray(responseData.message)) {
          // NestJS validation errors come as an array
          errorMessage = "Validation error";
          errorDescription = responseData.message.join(', ');
        } else if (responseData.message) {
          errorMessage = responseData.message;
          errorDescription = responseData.error || error.response.statusText;
        } else {
          errorMessage = "Invalid request";
          errorDescription = "Please check that you've selected valid GIFs and try again.";
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        errorDescription = error.response.data.error || error.response.statusText;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      notification.error({
        message: errorMessage,
        description: errorDescription,
        duration: 5,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = async () => {
    setFields(searchFormFields);
    setAddGifs([]); // Clear selections first
    setGifs([]);
    dispatch(searchClosed());
  };

  const handleChecked = (e, checked, id) => {
    console.log('handleChecked called', { checked, id, currentAddGifs: addGifs });
    // checked is the NEW state: true = now checked (add), false = now unchecked (remove)
    if (checked) {
      // GIF is now checked - add it to the list
      setAddGifs((prevState) => {
        // Prevent duplicates
        if (prevState.includes(id)) {
          console.log('GIF already in list:', id);
          return prevState;
        }
        const newState = prevState.concat(id);
        console.log('Adding GIF, new state:', newState);
        return newState;
      });
    } else {
      // GIF is now unchecked - remove it from the list
      const newArr = addGifs.filter((item) => item !== id);
      console.log('Removing GIF, new state:', newArr);
      setAddGifs(newArr);
    }
  };

  React.useEffect(() => {
    if (addGifs.length > 10) {
      notification.warning({
        message: `You can't add more than 10 gifs for one time`,
      });
    }
  }, [addGifs.length]);

  const renderGif = () =>
    gifs?.map((gif) => {
      return (
        <Col key={gif.id} md={12} lg={8} xxl={6} className={"col"}>
          <Gif
            key={gif.id}
            item={gif}
            onChecked={handleChecked}
            condition={addGifs.length}
            selectedIds={addGifs}
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
            loading={isAdding}
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
          
          <div className={"form__filters__section"}>
            <Space direction="horizontal" size="middle" style={{ width: '100%', flexWrap: 'wrap' }}>
              <Form.Item label="Content Rating" style={{ marginBottom: 0, minWidth: 200 }}>
                <Select
                  mode="multiple"
                  value={selectedRatings}
                  onChange={handleRatingChange}
                  placeholder="Select ratings"
                  style={{ width: '100%' }}
                  options={[
                    { label: 'G (General)', value: 'g' },
                    { label: 'PG (Parental Guidance)', value: 'pg' },
                    { label: 'PG-13 (Parents Strongly Cautioned)', value: 'pg-13' },
                    { label: 'R (Restricted)', value: 'r' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item label="Orientation" style={{ marginBottom: 0, minWidth: 150 }}>
                <Select
                  value={selectedOrientation}
                  onChange={handleOrientationChange}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Landscape', value: 'landscape' },
                    { label: 'Portrait', value: 'portrait' },
                    { label: 'Square', value: 'square' },
                  ]}
                />
              </Form.Item>
            </Space>
          </div>
        </Form>

        <div className={"giphy__results__container"} id={"giphy"}>
          <GridContainer>
            {renderGif()}
          </GridContainer>
        </div>
      </Modal>
    </>
  );
};
