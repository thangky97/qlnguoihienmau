import { Layout } from "antd";
import Header from "../Widget/header";
import Footer from "@Components/LandingPageLayout/footer";
import HeaderMobile from "../Widget/mobileHeader";
import SliderMenu from "../Widget/slider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "@Constants/route";
import UserService from "@Network/userService";
import { IResponse } from "@Constants/models/responseInterface";
import { useAppDispatch } from "@Store/hooks";
import userActions from "@Store/actions/userActions";
import { Toast } from "@Helper/utils";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@Store/hooks";

export default function PrivateRoute(props: any) {
  const [isOpenSlider, setIsOpenSlider] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user_data") || "{}");
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.app);
  const { t: translate } = useTranslation();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate(ROUTES.LOGIN);
    } else {
      UserService.getDetail().then((res: IResponse) => {
        if (res.isSuccess) {
          if (res?.data?.status === 1) {
            dispatch({
              type: userActions.USER_UPDATE,
              payload: res.data
            });
          } else {
            Toast("error", translate("login-locked"));
            setTimeout(() => {
              dispatch({
                type: userActions.USER_RESET
              });
            }, 1000);
          }
        } else {
          Toast("error", translate("login-locked"));
          setTimeout(() => {
            dispatch({
              type: userActions.USER_RESET
            });
          }, 1000);
        }
      });
    }
  }, []);

  if (!user.isLoggedIn) {
    return <></>;
  }

  return (
    <div className="landing-wrapper mt-[0px] 2xl:mt-[110px]">
      <Layout className="w-full h-full">
        <Header />
        <HeaderMobile
          isOpenSlider={isOpenSlider}
          setIsOpenSlider={setIsOpenSlider}
        />
        {/* <SliderMenu
          isOpenSlider={isOpenSlider}
          setIsOpenSlider={setIsOpenSlider}
        /> */}
        <div className="relative">
          <div className=" min-h-screen  pt-[30px]">
            <props.Component />
          </div>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
          <div
            className="copyright "
            dangerouslySetInnerHTML={{ __html: app?.footer_text || "<p></p>" }}
          ></div>
        </div>
      </Layout>
    </div>
  );
}
