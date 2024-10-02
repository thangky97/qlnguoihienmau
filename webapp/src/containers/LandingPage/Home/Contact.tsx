import LandingService from "@Network/landingService";
import appActions from "@Store/actions/appActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Contact(props: any) {
  const app = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const { i18n, t: translation } = useTranslation();

  // useEffect(() => {
  //   (async function () {
  //     let resAbout = await LandingService.getDataAbout(i18n.language);
  //     let resSetting = await LandingService.getDataSetting();

  //     if (resAbout.isSuccess && resSetting.isSuccess) {
  //       let buildData = resSetting.data;
  //       if (resAbout.data?.data?.length > 0) {
  //         buildData = {
  //           ...buildData,
  //           ...resAbout.data.data[0]
  //         };
  //       }
  //       dispatch({
  //         type: appActions.APP_CHANGE,
  //         payload: buildData
  //       });
  //     }
  //   })();
  // }, [i18n.language]);

  return (
    // <section id="contact" className="gap-x-16 pt-28 flex contact-conatainer intro_with_media">
    //   <div className="w-1/5 content-right">
    //     <div className="title">{translation('contact')}</div>
    //     <div className="hint">{translation('corporate_address')}</div>
    //     <div className="information">{app?.address_1 || ""}</div>
    //     <div className="information">{app?.address_2 || ""}</div>
    //     <div className="hint">{translation("phone_number")}</div>
    //     <div className="information text-dot text-dot-1">{app?.phone_1 || ""}</div>
    //     <div className="information text-dot text-dot-1">{app?.phone_2 || ""}</div>
    //     <div className="hint">{translation("email")}</div>
    //     <div className="information">{app?.email || ""}</div>
    //   </div>
    //   <div className="w-4/5 content-left"
    //     dangerouslySetInnerHTML={{
    //       __html: app?.map_source?.replace(/\\"/g, "") || ""
    //     }}
    //   />
    // </section>

    <section
      id="contact"
      className="gap-x-16 pt-28 flex contact-conatainer intro_with_media"
    >
      <div className="w-1/5 content-right">
        <div className="title">{translation("contact")}</div>
        <div className="hint">{translation("corporate_address")}</div>
        <div className="information">địa chỉ</div>
        <div className="hint">{translation("phone_number")}</div>
        <div className="information text-dot text-dot-1">phone</div>
        <div className="hint">{translation("email")}</div>
        <div className="information">email</div>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2012934147315!2d105.78583537492891!3d21.024630280623644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4984052283%3A0x405da29983542b07!2zVmnhu4duIEh1eeG6v3QgaOG7jWMgLSBUcnV54buBbiBtw6F1IFRydW5nIMawxqFuZw!5e0!3m2!1svi!2s!4v1727889125452!5m2!1svi!2s"
          width="1360"
          height="500"
          // style="border:0;"
          // allowfullscreen=""
          loading="lazy"
          // referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
