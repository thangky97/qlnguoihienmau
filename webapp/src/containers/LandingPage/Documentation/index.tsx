import React, { useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import BoxItem from "@Components/BoxItem";
import { useTranslation } from "react-i18next";
import { IResponse } from "@Constants/models/responseInterface";
import { Toast } from "@Helper/utils";
import LandingService from "@Network/landingService";
import { IPost } from "@Constants/models/metadata";

const Documentation: React.FC<{}> = () => {
  const { t: translate, i18n } = useTranslation();
  const [dataPost, setDataPost] = useState<Array<IPost>>([]);
  const [total, setTotal] = useState<number>(0);
  const paramsFilter = {
    filter: {
      type: "documentation",
      open: 1,
      lang: i18n.language
    },
    skip: 0,
    limit: 8,
    order: {
      key: "createdAt",
      value: "DESC"
    }
  };

  // function getData(params: any) {
  //   LandingService.getContent(params).then((res: IResponse) => {
  //     if (res.isSuccess) {
  //       setDataPost(res.data.data);
  //       setTotal(res.data.total);
  //     } else {
  //       Toast("error", translate("unknown-error"));
  //     }
  //   });
  // }

  // useEffect(() => {
  //   getData(paramsFilter);
  // }, [i18n.language]);

  return (
    <div className="sm:p-2.5 lg:pt-50">
      {/* <Space size={20} direction="vertical">
        <Space size={10} direction="vertical">
          <h2 className="text-c2i-linear text-title font-bold mb-0">
            {translate("documents")}
          </h2>
        </Space>
        <p
          className="text-subtitle  text-black"
          dangerouslySetInnerHTML={{
            __html: translate("blog_des")
          }}
        />
      </Space> */}
      {/* <h4 className="text-subtitle font-bold  mt-10 mb-8">Support</h4> */}

      {/* <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
        {dataPost &&
          dataPost.length > 0 &&
          dataPost.map((item: IPost) => (
            <BoxItem
              key={item.id}
              postId={item?.id || 0}
              title={
                (item.document_labels && item.document_labels[0]?.label) || ""
              }
              content={
                (item.document_contents &&
                  item.document_contents[0]?.short_content) ||
                ""
              }
            />
          ))}
      </div>
      {(dataPost && dataPost.length === 0) || !dataPost ? (
        <Empty />
      ) : (
        <div className="w-full flex justify-center mt-10">
          <Pagination
            defaultCurrent={1}
            total={total}
            defaultPageSize={8}
            onChange={(page: number) => {
              let newParamsFilter = {
                ...paramsFilter,
                skip: (page - 1) * 8
              };
              getData(newParamsFilter);
            }}
          />
        </div>
      )} */}

      {/* <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2.5 mt-2.5">
        <div
          className={`p-25 bg-linear flex flex-col justify-between h-[258px]`}
        >
          <h3 className="text-subtitle font-bold mb-7 text-c2i-linear w-[250px]">
            Contact Support
          </h3>
          <div className="flex items-center cursor-pointer">
            <span className="mr-2.5 text-c2i-blue text-base">Contact</span>
            <span>
              <img src={RightArrow} alt="right-arrow" className="flex" />
            </span>
          </div>
        </div>
        <div className="h-[258px] bg-[url('@Assets/images/support-img.svg')] "></div>
      </div> */}
    </div>
  );
};

export default Documentation;
