import { useEffect, useState } from "react";
import LandingService from "@Network/landingService";
import appActions from "@Store/actions/appActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import "./Question.scss";

import { Collapse } from "antd";
const { Panel } = Collapse;

export default function Questionsection() {
  const { t: translation, i18n } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.app);
  const [dataFAQ, setDataFAQ] = useState([]);

  // useEffect(() => {
  //   (async function () {
  //     let resAbout = await LandingService.getDataAbout(i18n.language);
  //     let resSetting = await LandingService.getDataSetting();
  //     if (resAbout?.data?.data) {
  //       setDataFAQ(JSON.parse(resAbout?.data?.data[0].faq || null));
  //     }
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
    <div className="profile-section w-full 2xl:w-3/5 xl:w-4/5 mx-auto border-solid border-[#ccc]">
      {/* <Collapse className="forms">
        {dataFAQ &&
          dataFAQ?.map((item: any, index) => {
            return (
              <Panel
                className="contern"
                header={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item && item?.question + ""
                    }}
                  ></span>
                }
                key={index + 1}
              >
                <p
                  className="a"
                  dangerouslySetInnerHTML={{
                    __html: item && item?.ans + ""
                  }}
                ></p>
              </Panel>
            );
          })}
      </Collapse> */}
    </div>
  );
}
