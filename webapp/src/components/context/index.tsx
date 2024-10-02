import { createContext, useState, Children, useEffect } from "react";
import { useTranslation } from "react-i18next";
const message_vi = require("@Assets/translate/vi.json");
const message_en = require("@Assets/translate/en.json");
const message_ja = require("@Assets/translate/ja.json");

const defaultState = {
  isOpenSlider: false,
  setIsOpenSlider: (newStatus: boolean) => {}
};

export const AppContext = createContext(defaultState);

const AppProvider = (props: any) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    let langObj = window.localStorage.getItem("lang");
    if (langObj && langObj !== i18n.language) {
      i18n.changeLanguage(langObj);
    }
  }, []);
  const [isOpenSlider, setGlobalIsOpenSlider] = useState(false);
  const setIsOpenSlider = (newStatus: boolean) => {
    setGlobalIsOpenSlider(newStatus);
  };
  return (
    <AppContext.Provider
      value={{
        isOpenSlider,
        setIsOpenSlider: setIsOpenSlider
      }}
    >
      {Children.toArray(props.children)}
    </AppContext.Provider>
  );
};

export default AppProvider;
