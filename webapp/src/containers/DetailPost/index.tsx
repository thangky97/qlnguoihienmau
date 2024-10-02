import { IPost } from "@Constants/models/metadata";
import { IResponse } from "@Constants/models/responseInterface";
import { Toast } from "@Helper/utils";
import LandingService from "@Network/landingService";
import { Empty } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function DetailPost() {
  const search = window.location.search;
  const id = new URLSearchParams(search).get("id"); // Lấy id từ query string
  const [detailPost, setDetailPost] = useState<IPost>({});

  console.log(detailPost);

  useEffect(() => {
    if (id) {
      LandingService.getDetailPost(id).then((res: IResponse) => {
        if (res.isSuccess) {
          setDetailPost(res.data);
        }
      });
    }
  }, [id]); // Khi id thay đổi, useEffect sẽ chạy lại

  return (
    <main className="w-full mt-12 flex justify-center">
      <div className="w-full md:max-w-2xl">
        {detailPost && detailPost.id ? (
          <div>
            <div className="text-2xl font-bold mb-8">
              {detailPost?.name || ""}
            </div>
            {/* <img src={detailPost?.image || " "} alt="image" /> */}
            <div
              className="mt-8 description text-base"
              // dangerouslySetInnerHTML={{ __html: detailPost?.document_content || "<p></p>" }}
            />
            {detailPost?.content}
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </main>
  );
}

export default DetailPost;
