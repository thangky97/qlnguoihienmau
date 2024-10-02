import { ArrowRightOutlined } from "@ant-design/icons";
import { ROUTES } from "@Constants/route";
import LandingService from "@Network/landingService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import "./otherPost.scss";

interface dataPost {
  createdAt: string;
  id: number;
  image: string;
  open: number;
  status: number;
  type: string;
  updatedAt: string;

  [key: string]: any;
}

export default function MoreContent(props: any) {
  const { t: translate, i18n } = useTranslation();
  const [dataPost, setDataPost] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await LandingService.getContent({
        page: {
          page: 1,
          limit: 4
        },
        filter: {},
        sort: {
          by: "sequence",
          type: "ASC"
        }
      });

      if (res.isSuccess) {
        setDataPost(res.data.list);
      }
    })(); // IIFE: Hàm tự động gọi sau khi được định nghĩa
  }, []);

  return (
    <div id="blog" className="content-container intro_with_media mt-10">
      <div
        className="text-color text-center text-4xl w-full font-bold mt-[4.5rem] mb-[1.5rem]"
        style={{ lineHeight: "130%" }}
      >
        {translate("more_content")}
      </div>
      <div className="content-content grid grid-cols-4 custom-grid-cols-1">
        {dataPost &&
          dataPost.map((item: dataPost) => {
            return (
              <Item
                // @ts-ignore
                key={item.id}
                {...item}
                translate={translate}
              />
            );
          })}
      </div>
    </div>
  );
}

function Item(props: any) {
  const navigate = useNavigate();

  return (
    <div className="content-content-item">
      <div className="title text-dot text-dot-1">{props?.name || ""}</div>
      <div className="description">{props?.content || ""}</div>
      <div className="button">
        <button onClick={() => navigate(ROUTES.DETAIL_DOC + "?id=" + props.id)}>
          {props.translate("detail")}
        </button>
        <ArrowRightOutlined />
      </div>
    </div>
  );
}
