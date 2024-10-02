import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { LIST_USER_OPTION } from "@Constants/constants";
import { ROUTES } from "@Constants/route";
import userActions from "@Store/actions/userActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { Dropdown, Menu } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AppContext } from "../context/index";
import Helper from "@Helper/utils";
import "./landingLayout.scss";
const { onRedirect } = Helper;
const menuAccount = (
  children: {
    name: string;
    key: string;
    path: any;
    onClick?: any;
    className?: string;
    children?: any;
    type?: string;
  }[],
  callback: (path: string) => void,
  pathname: string,
  translation: (key: string) => string
) => (
  <Menu
    mode="vertical"
    items={children.map(item => {
      return {
        type: item.type ? item.type : "group",
        children: item?.children || null,
        label: (
          <div
            className="header-text py-1"
            onClick={e => {
              e.preventDefault();
              if (item.path && !item.onClick) {
                callback(item.path);
              } else {
                item.onClick();
              }
            }}
          >
            {translation(item.name)}
          </div>
        ),
        key: item.key,
        className: `menu-item ${
          pathname === item.path ? "selected" : ""
        } cursor-pointer ${item?.className || ""} disable-active-antd`
      };
    })}
  />
);
export default function HeaderMobile() {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t: translation, i18n } = useTranslation();
  const app = useAppSelector(state => state.app);
  const user = JSON.parse(window.localStorage.getItem("user_data") || "{}");
  const pathname = window.location.pathname;
  function onClickMenu(overflow: string) {
    ctx.setIsOpenSlider(!ctx.isOpenSlider);
    document.body.style.overflow = overflow;
  }

  const listMenuAccount = [
    ...LIST_USER_OPTION,
    {
      name: "logout",
      key: "logout",
      path: "",
      onClick: () => {
        dispatch({
          type: userActions.USER_RESET
        });
      }
    }
  ];
  return (
    <div>
      <div
        className="landing-header-mobile flex justify-between items-center flex-wrap"
        style={{ position: "fixed", top: "0", width: "100%" }}
      >
        <div className="content-left ">
          {/* {ctx.isOpenSlider ? (
            <CloseOutlined onClick={() => onClickMenu("auto")} />
          ) : (
            <MenuOutlined onClick={() => onClickMenu("hidden")} />
          )} */}
          <span>
            {/* <img src={img} alt="logo" style={{ maxWidth: 120 }} /> */}
            <img src={app.logo} alt="logo" style={{ maxWidth: 120 }} />
          </span>
        </div>

        <div className="header-right flex justify-between items-center flex-wrap ">
          {user?.isLoggedIn ? (
            <Dropdown
              overlay={() =>
                menuAccount(
                  listMenuAccount,
                  path => onRedirect(path, newPath => navigate(newPath)),
                  pathname,
                  translation
                )
              }
              arrow
              trigger={["click"]}
              className="p-0"
            >
              <span className="user-info flex">
                <img
                  style={{
                    width: "37px",
                    height: "37px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    margin: "auto",
                    border: "1px solid #f1e0e0",
                    background: "beige"
                  }}
                  className="mr-5"
                  src={
                    user?.avatar?.trim() ||
                    require("@Assets/images/defaultAvt.png")
                  }
                />
                <span className="text-black text-name ml-2">
                  {user?.email?.trim() || user?.username || ""}
                </span>
              </span>
            </Dropdown>
          ) : (
            <div className="header-launch-button-mobile">
              <div
                className="cursor-pointer login-mobile"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                <div>
                  {}
                  <button>
                    {/* <UserOutlined className=" mr-1 text-3xl " /> */}
                    Hiến Máu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
