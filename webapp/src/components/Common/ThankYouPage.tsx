import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ThankYouPage: React.FC = () => {
  const { t: translation, i18n } = useTranslation();
  return (
    <Result
      status="success"
      title= {translation("title_thank")}
      subTitle= {translation("content_thank")}
      extra={
        <Link to="/">
          <Button type="primary"> {translation("back_home")} </Button>
        </Link>
      }
    />
  );
};

export default ThankYouPage;
