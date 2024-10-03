import React, { useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import BoxItem from "@Components/BoxItem";
import { useTranslation } from "react-i18next";
import LandingService from "@Network/landingService";
import { IResponse } from "@Constants/models/responseInterface";
import { Toast } from "@Helper/utils";
import { IPost } from "@Constants/models/metadata";
import { useParams } from "react-router";

const Blog: React.FC<{}> = () => {
  const { id } = useParams();
  const { t: translate, i18n } = useTranslation();
  const [dataPost, setDataPost] = useState<Array<IPost>>([]);
  const [total, setTotal] = useState<number>(0);
  const paramsFilter = {
    page: {
      page: 1,
      limit: 8
    },
    filter: {},
    sort: {
      by: "sequence",
      type: "ASC"
    }
  };

  console.log(id);

  function getData(params: any) {
    LandingService.getContent(params).then((res: IResponse) => {
      if (res.isSuccess) {
        setDataPost(res.data.list);
        setTotal(res.data.total);
      } else {
        Toast("error", translate("unknown-error"));
      }
    });
  }

  useEffect(() => {
    if (id) {
      let paramsFilterDetail = {
        filter: {
          category_post_id: parseInt(id)
        },
        page: {
          page: 1,
          limit: 10
        },
        sort: {
          by: "sequence",
          type: "ASC"
        }
      };

      getData(paramsFilterDetail);
    } else {
      getData(paramsFilter);
    }
  }, [id]);

  return (
    <div id="blog" className="sm:p-2.5 sm:mt-12 xl:pt-24">
      {/* <Space size={20} direction="vertical">
        <h2 className="text-c2i-linear text-title font-bold w-[200px] mb-0">
          {translate("blog")}
        </h2>
        <p
          className="text-base text-black"
          style={{ lineHeight: "150%" }}
          dangerouslySetInnerHTML={{
            __html: translate("blog_des")
          }}
        />
      </Space> */}

      <div className="flex">
        <div
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 2xl:m-0 gap-2.5"
          style={{ margin: "auto" }}
        >
          {dataPost &&
            dataPost.length > 0 &&
            dataPost.map((item: IPost) => (
              <BoxItem
                key={item.id}
                postId={item?.id || 0}
                title={item.name || ""}
                content={item.content || ""}
              />
            ))}
        </div>
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
      )}
    </div>
  );
};

export default Blog;
