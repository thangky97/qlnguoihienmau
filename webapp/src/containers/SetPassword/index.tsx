import { Form } from "antd";
import { useAppDispatch } from "@Store/hooks";
import userActions from "@Store/actions/userActions";
import { useNavigate } from "react-router";
import RegisterService from "@Network/registerService";
import { useTranslation } from "react-i18next";
import { ERROR_FROM_SERVER } from "@Constants/constants";
import { Toast } from "@Helper/utils";
import { ROUTES } from "@Constants/route";
import InputPassword from "@Components/InputPassword";

const SetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t: translation } = useTranslation();

  const onFinish = (data = {}) => {
    let sessionData = window.sessionStorage.getItem("register");
    sessionData = JSON.parse(sessionData || "{}");

    RegisterService.register({
      ...data,
      // @ts-ignore
      ...sessionData,
      password_confirmation: undefined
    }).then(res => {
      if (res.isSuccess) {
        dispatch({
          type: userActions.USER_UPDATE,
          payload: res.data
        });
        sessionStorage.removeItem("register");
        setTimeout(() => navigate(ROUTES.HOME), 500);
      } else {
        if (res.data === ERROR_FROM_SERVER.AUTH.DUPLICATED_USER) {
          Toast("error", translation("used-account"));
          setTimeout(() => {
            navigate(ROUTES.REGISTER);
          }, 500);
        } else {
          Toast("error", translation("unknown-error"));
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 pb-6 sm:pb-32 w-full xl:w-[427px] sm:px-5">
      <div className="new-title text-center">{translation("set-password")}</div>
      <Form onFinish={onFinish} name="register-password" className="new-detail">
        <div className="pass-new">
          <label>{translation("password")}</label>
          <InputPassword id="password" />
        </div>

        <div>
          <div className="pass-confirm">
            <label>{translation("password_confirmation")}</label>
          </div>
          <InputPassword
            id="password_confirmation"
            validate={({ getFieldValue }: any) => ({
              validator(_: any, value: any) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(translation("password-dont-match"))
                );
              }
            })}
          />
        </div>
        <Form.Item>
          <div className="button-new">
            <button className="primary-button w-full" type="submit">
              {translation("register-title")}
            </button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SetPassword;
