import React from "react";
import { Space } from "antd";
import Helper from "@Helper/utils";
import { ROUTES } from "@Constants/route";
import { useNavigate } from "react-router";
// import { DiscordIcon } from "@Assets/icons/DiscordIcon"
// import { GithubFilled, TwitterOutlined } from "@ant-design/icons";
// import FacebookRounded from '@Assets/icons/facebook_rounded.svg';
import { useAppSelector } from "@Store/hooks";
import { useTranslation } from "react-i18next";
import img from "./../../../src/assets/images/logo.jpg";

const { onRedirect } = Helper;

const Footer: React.FC<{}> = () => {
  const { t: translation } = useTranslation();
  const app = useAppSelector(state => state.app);

  const FooterNav = [
    {
      name: "home",
      path: "/"
    },
    {
      name: "blog",
      path: "#blog"
    },
    {
      name: "contact",
      path: "#contact"
    }
  ];
  const navigate = useNavigate();

  return (
    <div className="landing-footer">
      <div className="w-full grid">
        <div className="w-full bg-white 2xl:pl-[110px] 2xl:pt-[45px] wapper-logo">
          <img src={app.logo} alt="logo" className="logo md:max-w-[300px]" />
          <div
            style={{ whiteSpace: "pre-wrap" }}
            className="text-white text-base mb-[45px] pt-[15px] w-80 text-footer"
          >
            {app?.about || ""}
          </div>
          {/* <p className=" font-bold mb-[15px]">Official social media</p> */}
          {/* <Space direction="horizontal" size={16}>
            {SocialMedia.map((Com: any, idx) => (
              <div
                key={idx}
                className="social w-[42px] h-[42px] rounded-full bg-[#292D41]"
              >{Com}</div>
            ))}
          </Space> */}
        </div>
        <div className="nav-bottom flex flex-col justify-center grid grid-cols-1 mmd:ml-[16%] sm:grid-cols-2 md:grid-cols-3 mt-[78px] mb-[35px] 2xl:px-[130px]">
          {FooterNav.map((item, idx) => (
            <p
              className="cursor-pointer flex-1 text-base m-0 mb-[35px] h-[30px]"
              key={idx}
              onClick={() =>
                onRedirect(item.path, newPath => {
                  navigate(newPath);
                })
              }
            >
              {translation(item.name)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
