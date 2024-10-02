import { Dropdown, Menu } from "antd";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import Helper from "@Helper/utils";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import userActions from "@Store/actions/userActions";
import { LIST_LANDING_HEADER, LIST_USER_OPTION } from "@Constants/constants";
import { useTranslation } from "react-i18next";
import { ReactComponent as Facebook } from "@Assets/icons/facebook_rounded.svg";
import { ReactComponent as Instagram } from "@Assets/icons/ico-ig.svg";
import { ReactComponent as Youtube } from "@Assets/icons/ico-youtube.svg";
import { UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import cartActions from "@Store/actions/cartActions";
import { ROUTES } from "@Constants/route";
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

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user_data") || "{}");
  const pathname = window.location.pathname;
  const app = useAppSelector(state => state.app);
  const { t: translate, i18n } = useTranslation();
  const aboutSystem = JSON.parse(app?.section_system || "{}");

  const dispatch = useAppDispatch();

  const listMenuAccount: any = [
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

  useEffect(() => {
    dispatch({
      type: cartActions.CART_UPDATE
    });
  }, []);

  return (
    <div id="header" className="header">
      <div>
        <nav className="menu-top">
          <ul>
            <li>
              <Link to="/terms-of-use">{translate("terms-of-use")}</Link>
            </li>
            <li className="border-r">
              <Link to="/frequently-asked-questions">
                {translate("frequently-asked-questions")}
              </Link>
            </li>
            <li>
              <Link to="/contact-us">{translate("contact-us")}</Link>
            </li>
            <li>
              <div className="flex gap-[10px]">
                <a href={aboutSystem?.link_facebook || "/"}>
                  <Facebook />
                </a>
                <a href={aboutSystem?.link_instagram || "/"}>
                  <Instagram />
                </a>
                <a href={aboutSystem?.link_youtube || "/"}>
                  <Youtube />
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div
        id="landing-top-bar"
        className="md:px-10 flex justify-between items-center w-full flex-row "
      >
        <div className="header__logo">
          <img
            src={app.logo}
            alt="logo"
            style={{ maxWidth: 100 }}
            onClick={() => navigate("/")}
          />

          {/* <img src={img} alt="logo" style={{ maxWidth: 220 }} /> */}
        </div>
        <div className="flex justify-center mr-[65px]">
          {LIST_LANDING_HEADER.map((item: any) => {
            if (item.children) {
              return (
                <div key={item.key} className="menu-item">
                  <Dropdown
                    overlay={() =>
                      menuAccount(
                        item.children,
                        path =>
                          onRedirect(path, newPath => {
                            item?.isOpenBlank
                              ? window.open(newPath, "_blank")
                              : navigate(newPath);
                          }),
                        pathname,
                        translate
                      )
                    }
                    // overlayStyle
                    // arrow
                    trigger={["click"]}
                    className="p-0"
                  >
                    <div className="text-menu">{translate(`${item.name}`)}</div>
                  </Dropdown>
                </div>
              );
            } else {
              return (
                <div
                  key={item.key}
                  className={`menu-item ${
                    pathname === item.path ? "active" : ""
                  }`}
                  onClick={() =>
                    onRedirect(item.path, newPath => {
                      item.isOpenBlank
                        ? window.open(newPath, "_blank")
                        : navigate(newPath);
                    })
                  }
                >
                  {translate(`${item.name}`)}
                </div>
              );
            }
          })}

          <div className="header-launch-button">
            <div className="header-right">
              {user?.isLoggedIn ? (
                <Dropdown
                  overlay={() =>
                    menuAccount(
                      listMenuAccount,
                      path => onRedirect(path, newPath => navigate(newPath)),
                      pathname,
                      translate
                    )
                  }
                  arrow
                  trigger={["hover"]}
                  className="p-0"
                >
                  <span className="user-info">
                    <img
                      src={
                        user?.avatar?.trim() ||
                        "https://v-robotic-media.c2i.asia/media/qgg4rzypx8nmkm4pd95ii.png"
                      }
                    />
                    <span>{user?.email?.trim() || user?.username || ""}</span>
                  </span>
                </Dropdown>
              ) : (
                <div>
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.LOGIN)}
                  >
                    {}
                    <button style={{ display: "flex" }}>
                      <UserOutlined className="text-base mr-1 md:text-3xl " />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
