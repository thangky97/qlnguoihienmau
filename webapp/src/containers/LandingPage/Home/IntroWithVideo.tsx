import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
function IntroWithVideo(props: any) {
  const { t: translate } = useTranslation();
  const data = JSON.parse(props.data || "{}");
  return (
    <>
      <div className="text-color text-4xl	text-center w-full font-bold my-10">
        {translate("intro_withvideo_title")}
      </div>
      <section
        id="intro_with_video"
        className="intro_container intro_with_media"
      >
        <div className="w-3/5 content-left">
          <ReactPlayer
            url={data?.embed_content1}
            controls={true}
            width="98%"
            height="440px"
          />
        </div>
        <div className="w-2/5 content-right">
          <div className="text-4xl font-bold not-italic" style={{ lineHeight: "130%" }}>{data?.title_content1}</div>
          <div className="description desc-number text-base desc-around">
          <span
              dangerouslySetInnerHTML={{
                __html: data && data.content_content1 + ""
              }}
            ></span>
          </div>
        </div>
      </section>
    </>
  );
}

export default IntroWithVideo;
