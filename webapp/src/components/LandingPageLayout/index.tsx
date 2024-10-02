import { Layout } from "antd";
import Header from "./header";
import Footer from "./footer";
import HeaderMobile from "./headerMobile";
import Slider from "./slider";
import "./landingLayout.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAppSelector } from "@Store/hooks";
import Intro from "@Containers/LandingPage/Home/Intro";

export default function LandingLayout(props: any) {
  const { t: translation, i18n } = useTranslation();
  const app = useAppSelector(state => state.app);
  const url = window.location.pathname;
  let isCheck = false;

  if (url === "/") {
    isCheck = true;
  }
  const [checkurl, setcheckurl] = useState(isCheck);

  useEffect(() => {
    if (url === "/") {
      setcheckurl(true);
    } else {
      setcheckurl(false);
    }
  }, [url]);

  return (
    <div className="landing-wrapper mt-[80px] 2xl:mt-[110px]">
      <Layout className="w-full h-full">
        <Header />

        {/* <Slider /> */}
        <HeaderMobile />
        {checkurl && <Intro data={app?.section_about} />}

        <div className=" min-h-screen px-28 pb-16 body ">
          <div className="content-component">
            <props.Component />
          </div>
        </div>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
        <div
          className="copyright "
          dangerouslySetInnerHTML={{ __html: app?.footer_text || "<p></p>" }}
        ></div>
      </Layout>
    </div>
  );
}
