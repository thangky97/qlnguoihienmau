import { useContext, useEffect } from "react";
import { LIST_LANDING_HEADER } from "@Constants/constants";
import { AppContext } from "@Components/context";
import Helper from "@Helper/utils";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
const { onRedirect } = Helper;

export default function Slider() {
  const navigate = useNavigate();
  const ctx = useContext(AppContext);
  const { t: translate, i18n } = useTranslation();

  const onMobileHeaderRedirect = (path: string) => {
    ctx.setIsOpenSlider(false);
    document.body.style.overflow = "auto";
    onRedirect(path, newPath => navigate(newPath));
  };

  function onChangeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    let appData = window.localStorage.getItem("app_config");
    appData = JSON.parse(appData || "{}");
    // @ts-ignore
    appData.lang = lang;
    window.localStorage.setItem("app_config", JSON.stringify(appData));
  }

  useEffect(() => {
    ctx.setIsOpenSlider(false);
  }, []);

  const listHeader = [
    ...LIST_LANDING_HEADER,
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
      className={`landing-header-mobile left-menu flex-col ${
        ctx?.isOpenSlider ? "active" : ""
      }`}
    >
      <div className="flex flex-column w-full">
        <nav id="navbar" className="nav-menu navbar w-full nav-menu-landing">
          <ul>
            {listHeader.map((item: any) => {
              if (item.children) {
                return item.children.map((child: any, index: any) => {
                  return (
                    <li key={`${item.key}-${index}`}>
                      <span
                        className="nav-link"
                        onClick={() => onMobileHeaderRedirect(child.path)}
                      >
                        {translate(`${child.name}`)}
                      </span>
                    </li>
                  );
                });
              }
              if (item.onclick) {
                return (
                  <li key={item.key}>
                    <span
                      className={`nav-link ${
                        i18n.language === item.key ? "selected" : ""
                      }`}
                      onClick={() => item.onclick()}
                    >
                      {translate(`${item.name}`)}
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.key}>
                  <span
                    className="nav-link"
                    onClick={() => onMobileHeaderRedirect(item.path)}
                  >
                    {translate(`${item.name}`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="copyright smaller ">
        <span>&#169;</span>&nbsp;{translate("copyright")}
      </div>
    </header>
  );
}
