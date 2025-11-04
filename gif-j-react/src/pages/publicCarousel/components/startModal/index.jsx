import React from "react";
import {Button, Modal} from "antd";
import {useNavigate, useParams} from "react-router";
import {useSelector} from "react-redux";
import {fullScreen} from "../../../../helpers/screen";
import {UserInfo} from "../../../../store/selectors";
import {routes} from "../../../../static/routes";

import "./style.css";
import axios from "axios";
import {apiUrl, collections} from "../../../../static/api";

export const StartModal = ({handleChangePlay}) => {
    const navigate = useNavigate();
    const {folderId, userId} = useParams();
    const [catalog, setCatalog] = React.useState(null)

    React.useEffect(() => {
        axios
            .get(`${apiUrl}${collections}/${userId}/${folderId}`)
            .then((res) => {
                setCatalog(res.data);
            })
    }, [])
    const {userInfo} = useSelector(UserInfo);

    const handlePlay = () => {
        handleChangePlay(true);
        fullScreen();
    };

    return (
        <Modal
            centered={true}
            title={`Gifalot - ${catalog?.name}`}
            closable={false}
            open={true}
            width={"589px"}
            className={"public_carousel_modal"}
            footer={<></>}
        >
            <div className={"public_carousel_modal__main"}>
                <div className={"main__top"}>
                    <p className={"text"}>
                        Start this compilation by pressing the play button.
                    </p>
                    <Button
                        type={"primary"}
                        className={"main__top__btn"}
                        onClick={handlePlay}
                    >
                        Play
                    </Button>
                </div>
                <div className={"main__bottom"}>
                    {Boolean(userInfo) ? (
                        <div className={"main__bottom__auth"}>
                            <p className={"text"}>...or go back to </p>
                            <Button
                                className={"main__bottom__auth__btn"}
                                onClick={() => navigate(`/${routes.dashboard}`)}
                            >
                                Compilation page
                            </Button>
                        </div>
                    ) : (
                        <div className={"main__bottom__no__auth"}>
                            <div className={"no__auth__block"}>
                                <p className={"text"}>
                                    ...or sign up and start making your own compilations
                                </p>
                                <Button
                                    className={"main__bottom__auth__btn"}
                                    onClick={() => navigate(routes.reg)}
                                >
                                    Create user
                                </Button>
                            </div>

                            <div className={"no__auth__block__left"}>
                                <p className={"text"}>Already a Gifalot-user?</p>
                                <Button
                                    className={"main__bottom__auth__btn"}
                                    onClick={() => navigate(routes.login)}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
