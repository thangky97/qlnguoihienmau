import { Dropdown, Badge, Menu, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LIST_HEADER, LIST_USER_OPTION } from "@Constants/constants";
import { useTranslation } from "react-i18next";
import userActions from "@Store/actions/userActions";
import { CaretDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Helper from "@Helper/utils";
import {
  LIST_LANDING_HEADER,
  LIST_LANDING_HEADER_USER
} from "@Constants/constants";
import { ROUTES } from "@Constants/route";
import { useAppSelector, useAppDispatch } from "@Store/hooks";
import { ReactComponent as Facebook } from "@Assets/icons/facebook_rounded.svg";
import { ReactComponent as Instagram } from "@Assets/icons/ico-ig.svg";
import { ReactComponent as Youtube } from "@Assets/icons/ico-youtube.svg";
import CategoryService from "@Network/categoryService";
import { error } from "console";
import LandingService from "@Network/landingService";
import appActions from "@Store/actions/appActions";
import img from "../../../src/assets/images/13.png";

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
  const [menuList, setMenuList] = useState(LIST_LANDING_HEADER);
  const dispatch = useAppDispatch();
  function onChangeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    let appData = window.localStorage.getItem("app_config");
    appData = JSON.parse(appData || "{}");
    // @ts-ignore
    appData.lang = lang;
    window.localStorage.setItem("app_config", JSON.stringify(appData));
  }

  // useEffect(() => {
  //   (async function () {
  //     let resAbout = await LandingService.getDataAbout(i18n.language);
  //     let resSetting = await LandingService.getDataSetting();
  //     if (resAbout.isSuccess && resSetting.isSuccess) {
  //       let buildData = resSetting.data;
  //       if (resAbout.data?.data?.length > 0) {
  //         buildData = {
  //           ...buildData,
  //           ...resAbout.data.data[0]
  //         };
  //       }
  //       dispatch({
  //         type: appActions.APP_CHANGE,
  //         payload: buildData
  //       });
  //     }
  //   })();
  // }, [i18n.language]);

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

  const paramsFilterCategoryPost = {
    filter: {},
    sort: {
      by: "id",
      type: "desc"
    },
    page: {
      page: 1,
      limit: 20
    }
  };

  useEffect(() => {
    CategoryService.getListCategoryPost(paramsFilterCategoryPost)
      .then((res: any) => {
        let data: any;
        if (user?.isLoggedIn) {
          data = LIST_LANDING_HEADER_USER;
        } else {
          data = LIST_LANDING_HEADER;
        }
        data[1] = {
          name: "blog",
          key: "blog",
          path: "/blog",
          children: res?.data?.list.map((item: any) => {
            return {
              name: item?.name || "",
              key: item?.name || "",
              path: `/blog/${item?.id}`
            };
          })
        };
        setMenuList(data);
      })
      .catch((error: any) => {
        if (user?.isLoggedIn) {
          setMenuList(LIST_LANDING_HEADER_USER);
        }
      });
  }, [i18n.language]);

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
          {/* <img
            src={app.logo}
            alt="logo"
            style={{ maxWidth: 100 }}
            onClick={() => navigate("/")}
          /> */}

          <img
            src={img}
            alt="logo"
            style={{ maxWidth: 100 }}
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex justify-center mr-[65px]">
          {menuList.map((item: any) => {
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

          {/* <div className="relative mt-[5px] pr-[20px]">
            <Dropdown
              overlay={
                <Menu>
                  {notifications.map(notification => (
                    <Menu.Item key={notification.id} className="w-80">
                      {notification.text}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <span className="">
                <BellOutlined className="w-6 h-6" />
              </span>
            
            </Dropdown>
          </div> */}

          <div className="header-launch-button">
            {user?.isLoggedIn ? (
              <div className="header-right header-right-login">
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
              </div>
            ) : (
              <div className="header-login">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  {}
                  {/* <button style={{ display: "flex" }}>
                      <UserOutlined className="text-base mr-1 md:text-3xl " />
                      Đăng nhập
                    </button> */}
                  <button>{translate("login")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
