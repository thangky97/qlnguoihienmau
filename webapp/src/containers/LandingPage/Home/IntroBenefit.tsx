function IntroBenefit(props: any) {
  const data = JSON.parse(props.data || "{}");

  return (
    data && (
      <section
        id="benefit"
        className="intro_container flex justify-items-center flex-col intro_with_media"
      >
        <div className="text-sm text-[#037ddc] not-italic uppercase font-bold mt-16">{data?.header_content3}</div>
        <div className="text-color text-4xl text-center md:w-1/2 mt-4">
          {data?.short_header_content3}
        </div>

        <div className="grid grid-cols-3 gap-5 custom-grid-cols-1">
          <div className="benefit-bg">
            <div className="benefit-item">
              <img src={data?.image1_content3} />
              <div className="title h-[0px]" style={{ marginBottom: "50px"}}>{data?.title1_content3}</div>
              <div className="description h-[30px] desc-number desc-around" style={{ fontSize: "14px"}}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: data && data.content1_content3 + ""
                  }}
                ></span>
              </div>
            </div>
          </div>

          <div className="benefit-bg">
            <div className="benefit-item">
              <img src={data?.image2_content3} />
              <div className="title h-[0px]" style={{ marginBottom: "50px"}}>{data?.title2_content3}</div>
              <div className="description h-[30px] desc-number desc-around" style={{ fontSize: "14px"}}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: data && data.content2_content3 + ""
                  }}
                ></span>
              </div>
            </div>
          </div>

          <div className="benefit-bg">
            <div className="benefit-item">
              <img src={data?.image3_content3} />
              <div className="title h-[0px]" style={{ marginBottom: "50px"}}>{data?.title3_content3}</div>
              <div className="description h-[30px] desc-number desc-around desc-number desc-around" style={{ fontSize: "14px"}}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: data && data.content3_content3 + ""
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
}

export default IntroBenefit;
