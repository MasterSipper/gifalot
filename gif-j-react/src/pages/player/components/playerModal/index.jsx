import React from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { fullScreen } from "../../../../helpers/screen";
import { UserInfo } from "../../../../store/selectors";
import { routes } from "../../../../static/routes";

import "./style.css";

export const PlayerModal = ({ handleChangePlay, folderId, collectionName, isPublic }) => {
  const navigate = useNavigate();
  const { userInfo, isAuth } = useSelector(UserInfo);

  const handlePlay = () => {
    handleChangePlay(true);
    fullScreen();
  };

  const handleGoToDashboard = () => {
    if (folderId) {
      navigate(`/${routes.dashboard}/${folderId}`);
    } else {
      navigate(`/${routes.dashboard}`);
    }
  };

  const handleSignIn = () => {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate(routes.login);
  };

  const handleCreateAccount = () => {
    // Store the current URL to redirect back after registration
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate(routes.reg);
  };

  const handleLearnMore = () => {
    navigate(routes.learnMore);
  };

  return (
    <Modal
      centered={true}
      title={`Gifalot - ${collectionName || "Compilation"}`}
      closable={false}
      open={true}
      width={"589px"}
      className={"player_modal"}
      footer={<></>}
    >
      <div className={"player_modal__main"}>
        <div className={"main__top"}>
          <p className={"text"}>
            {isPublic 
              ? "Start this compilation by pressing the play button."
              : "Start this compilation by pressing the play button."}
          </p>
          <Button
            type={"primary"}
            className={"main__top__btn"}
            onClick={handlePlay}
            style={{ height: 48, width: "auto", margin: "24px 0" }}
          >
            Play
          </Button>
        </div>
        <div className={"main__bottom"}>
          {isAuth && userInfo ? (
            // User is logged in - show dashboard link
            <div className={"main__bottom__auth"}>
              <p className={"text"}>...or go back to </p>
              <Button
                className={"main__bottom__auth__btn"}
                onClick={handleGoToDashboard}
              >
                Compilation page
              </Button>
            </div>
          ) : (
            // User is not logged in - show login/register options
            <div className={"main__bottom__no__auth"}>
              <div className={"no__auth__block"}>
                <p className={"text"}>
                  ...or sign up and start making your own compilations
                </p>
                <Button
                  className={"main__bottom__auth__btn"}
                  onClick={handleCreateAccount}
                >
                  Create account
                </Button>
              </div>

              <div className={"no__auth__block__left"}>
                <p className={"text"}>Already a Gifalot-user?</p>
                <Button
                  className={"main__bottom__auth__btn"}
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              </div>

              <div className={"no__auth__block__left"}>
                <p className={"text"}>Want to learn more?</p>
                <Button
                  className={"main__bottom__auth__btn"}
                  onClick={handleLearnMore}
                >
                  Learn more
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};




