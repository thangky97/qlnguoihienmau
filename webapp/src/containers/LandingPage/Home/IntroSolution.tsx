import ImageAbout from "@Assets/images/about_image.png";
import { AlignCenter } from "react-feather";

function IntroSolution(props: any) {
  const data = JSON.parse(props.data || "{}");

  return (
    data && (
      <section
        id="solution"
        className="intro_container intro_with_media reverse" style={{ justifyContent: "space-between", gap: "62px"}}
      >
        <div className="content-right" style={{ width: "60%"}}>
          {/* <div className="hint text-base mt-10">{data && data?.header_content2}</div>
        <div className="text-color text-4xl">{data && data?.title_content2}</div>
        <div className=" description text-base">
          {data && data.content_content2}
        </div> */}
          {/* <div className="hint text-base">{data && data?.header_content2}</div> */}
          <div className="text-4xl font-bold not-italic" style={{ lineHeight: "130%" }}>
            {" "}
            {data && data?.title_content2}
          </div>
          <div className="description desc-number desc-around text-base">
            <span
              dangerouslySetInnerHTML={{
                __html: data && data.content_content2 + ""
              }}
            ></span>
          </div>
        </div>
        <div className="content-left">
          <img src={data && data.image_content2} alt="img" />
        </div>
      </section>
    )
  );
}

export default IntroSolution;
