import React from "react";
import classes from "./style.module.scss";
import RightArrow from "@Assets/icons/right-arrow.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ROUTES } from "@Constants/route";
//@dev this is a box an item of support section Ex: document box
//@link https://www.figma.com/file/rh93YorqiRNtFgaio4OR3Y/ETA_Q-traffic?node-id=126%3A722
const BoxItem: React.FC<{
  title: string;
  content: string;
  postId: any;
}> = ({ title, content, postId }) => {
  const { t: tranlsate } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`p-25 h-100 bg-box ${classes["box-frame"]} flex flex-col justify-between`}
    >
      <div>
        <h3 className="text-subtitle font-bold  mb-7 text-dot text-dot-1 text-balck">
          {title || ""}
        </h3>
        <p
          className="text-base  m-0 text-dot text-dot-3 text-black"
          dangerouslySetInnerHTML={{
            __html: content || ""
          }}
        />
      </div>
      <div className="group flex items-center cursor-pointer">
        <span
          className="mr-2.5 text-base group-hover:text-red-100" style={{ color: "#037ddc"}}
          onClick={() => navigate(ROUTES.DETAIL_DOC + "?id=" + postId)}
        >
          {tranlsate("detail")}
        </span>
        <span>
          <img src={RightArrow} alt="right-arrow" className="flex" />
        </span>
      </div>
    </div>
  );
};

export default BoxItem;
