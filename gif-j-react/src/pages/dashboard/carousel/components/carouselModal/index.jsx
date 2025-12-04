import {useNavigate} from "react-router";
import React from "react";
import {useSelector} from "react-redux";
import {FoldersSelector} from "../../../../../store/selectors";
import {fullScreen} from "../../../../../helpers/screen";
import {Button, Modal} from "antd";
import {routes} from "../../../../../static/routes";

export const CarouselModal = () => {
    const navigate = useNavigate();
    const {folderItem} = useSelector(FoldersSelector)

    const handleOpenFullScreen = () => {
        fullScreen();
    };

    return (
        <Modal
            centered={true}
            title={`Gifalot - ${folderItem?.name}`}
            closable={false}
            open={true}
            width={"589px"}
            className={"public_carousel_modal"}
            footer={<></>}
        >
            <div className={"public_carousel_modal__main"}>
                <div className={"main__top"}>
                    <p className={"text"}>
                        Return to full screen mode.
                    </p>
                    <Button
                        type={"primary"}
                        style={{height:48, width:"auto", margin:'24px 0'}}
                        onClick={handleOpenFullScreen}
                    >
                        Open in full screen
                    </Button>
                </div>
                <div className={"main__bottom"}>

                    <div className={"main__bottom__auth"}>
                        <p className={"text"}>...or go back to </p>
                        <Button
                            className={"main__bottom__auth__btn"}
                            onClick={() => navigate(`/${routes.dashboard}/${folderItem?.id}`)}
                        >
                            Compilation page
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
