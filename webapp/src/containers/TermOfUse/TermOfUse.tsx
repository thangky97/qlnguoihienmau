import { useEffect } from "react";
import LandingService from "@Network/landingService";
import appActions from "@Store/actions/appActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
export default function TermOfUseSection() {
  const { t: translation, i18n } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.app);
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
    <div className="profile-section w-full 2xl:w-3/5 xl:w-4/5 mx-auto">
      <div className="p-6 mt-6 border-solid border border-[#ccc]">
        {/* <Form
          form={form}
          name="profile"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
        >
          <Form>
            <span className="text-4xl font-bold">
              {translation("Terms of use")}
            </span>
            <div>
              <span
                className="text-left "
                style={{ maxWidth: "100%", lineHeight: "235%" }}
              >
                <div
                  style={{ marginTop: "38px", fontSize: "16px" }}
                  dangerouslySetInnerHTML={{
                    __html: app?.terms_of_use || ""
                  }}
                ></div>
              </span>
            </div>
          </Form>
        </Form> */}
      </div>
    </div>
  );
}
