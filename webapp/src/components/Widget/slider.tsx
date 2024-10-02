import { LIST_HEADER, LIST_USER_OPTION } from "@Constants/constants";
import Helper from "@Helper/utils";
import userActions from "@Store/actions/userActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
const { onRedirect } = Helper;

export default function Slider(props: any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const { t: translation, i18n } = useTranslation();

  const onMobileHeaderRedirect = (path: string) => {
    props?.setIsOpenSlider(false);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      onRedirect(path, newPath => navigate(newPath), true);
    }, 500);
  };

  function onChangeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    let appData = window.localStorage.getItem("app_config");
    appData = JSON.parse(appData || "{}");
    // @ts-ignore
    appData.lang = lang;
    window.localStorage.setItem("app_config", JSON.stringify(appData));
  }

  const listHeader = [
    ...LIST_USER_OPTION,
    {
      name: "vn",
      key: "vn",
      onclick: () => {
        onChangeLanguage("vn");
      }
    },
    {
      name: "en",
      key: "en",
      onclick: () => {
        onChangeLanguage("en");
      }
    },
    {
      name: "jp",
      key: "jp",
      onclick: () => {
        onChangeLanguage("jp");
      }
    }
  ];

  return (
    <header
      id="header"
      className={`left-menu flex-col ${props?.isOpenSlider ? "active" : ""}`}
      style={{ background: "#fff", top: "80px" }}
    >
      <div className="flex flex-column w-full grow">
        <nav id="navbar" className="nav-menu navbar w-full">
          <ul className="user_info">
            <img
              src={
                user?.avatar?.trim() || require("@Assets/images/defaultAvt.png")
              }
              alt="img"
            />
            <span style={{ color: "#252525" }}>
              {user?.email || user?.username || ""}
            </span>
          </ul>
          <ul>
            {LIST_HEADER.map((item: any) => {
              if (item.children) {
                return item.children.map((child: any) => {
                  return (
                    <li key={child.key}>
                      <span
                        className={`nav-link ${
                          item.path === window.location.pathname
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => onMobileHeaderRedirect(child.path)}
                      >
                        {translation(child.name)}
                      </span>
                    </li>
                  );
                });
              }
              return (
                <li key={item.key}>
                  <span
                    className={`nav-link ${
                      item.path === window.location.pathname ? "selected" : ""
                    }`}
                    onClick={() => onMobileHeaderRedirect(item.path)}
                  >
                    {translation(item.name)}
                  </span>
                </li>
              );
            })}
            {listHeader.map((item: any) => {
              if (item.onclick) {
                return (
                  <li key={item.key}>
                    <span
                      className={`nav-link ${
                        i18n.language === item.key ? "selected" : ""
                      }`}
                      onClick={() => item.onclick()}
                    >
                      {translation(`${item.name}`)}
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.key}>
                  <span
                    className={`nav-link ${
                      item.path === window.location.pathname ? "selected" : ""
                    }`}
                    onClick={() => onMobileHeaderRedirect(item.path)}
                  >
                    {translation(item.name)}
                  </span>
                </li>
              );
            })}
            <li>
              <span
                className={`nav-link`}
                style={{ color: "#FF6262" }}
                onClick={() => dispatch({ type: userActions.USER_RESET })}
              >
                {translation("logout")}
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer">
        <span>&#169;</span>&nbsp;{translation("copyright")}
      </div>
    </header>
  );
}
