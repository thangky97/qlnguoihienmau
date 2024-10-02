import ImageAbout from "@Assets/images/about_image.png";
import { useTranslation } from "react-i18next";

function IntroAbout(props: any) {
  const { t: translate } = useTranslation();

  const data = JSON.parse(props.data || "{}");

  return (
    <>
      <div className="intro_container text-color text-4xl ml-[3rem] w-full font-semibold mt-[3.5rem]">
        {data?.header_about}
      </div>
      <section
        id="about"
        className="intro_container pt-6 about intro_with_media"
        style={{ alignItems: "normal" }}
      >
        <div className="w-2/5 content-left">
          <img src={data?.image_about} alt="Image" />
        </div>
        <div className="w-3/5 content-right">
          <div className="hint about-us text-4xl" style={{ color: "#252525" }}>
            {data?.title_about}
          </div>
          {/* <div className="text-color text-4xl md:w-2/3">{data?.title_about}</div>
        <div className=" description text-base">{data?.content_about}</div> */}
          {/* <div className="text-color text-4xl md:w-2/3">
            {" "}
            {data?.title_about}
          </div> */}
          <div className="description desc text-base desc-number desc-around">
            <span
              dangerouslySetInnerHTML={{
                __html: data && data?.content_about + ""
              }}
            ></span>
          </div>
        </div>
      </section>
    </>
  );
}

export default IntroAbout;
