import { Form } from "antd";
import { useNavigate } from "react-router";
import { ROUTES } from "@Constants/route";
import RegisterService from "@Network/registerService";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();

  const { t: translation } = useTranslation();

  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  const onFinish = (values: any) => {
    window.sessionStorage.setItem("register", JSON.stringify(values));
    navigate(ROUTES.SETUP);
  };

  const checkExistingUsername = async (username: string) => {
    const res = await RegisterService.checkExisting(
      "/user/check-existing-username",
      {
        username: username
      }
    );
    return res.data.isUsed ?? true;
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:pb-32 w-full xl:w-[427px] sm:px-5">
      <div className="register-title text-center">{translation("register-title")}</div>
      <Form name="register" onFinish={onFinish} className="register-detail">
        <div className="user-register">
          <label className="label-register">
            {translation("register-label")}
          </label>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: translation("required")
              },
              {
                min: 6,
                message: translation("too-short", { length: 6 })
              },
              {
                pattern: /^((?! ).)*$/g,
                message: translation("invalid-username")
              },
              {
                max: 50,
                message: translation("too-long", { length: 50 })
              },
              _ => ({
                async validator(_, value) {
                  if (value) {
                    const isAccountUsed = await checkExistingUsername(value);
                    if (isAccountUsed)
                      return Promise.reject(translation("used-account"));
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="infor-register"
              placeholder={translation("register-placeholder")}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <div className="button-register">
            <button className="primary-button w-full" type="submit">
              {translation("next")}
            </button>
          </div>
        </Form.Item>
        <div className="note">
          <br></br>
          {translation("click")} <a className="next">"{translation("next")}"</a>{" "}
          {translation("agree")}
          <br></br>
          <a className="transaction" href="#">
            {translation("transaction-term")}
          </a>
        </div>
        <div className="text-center mt-5 flex items-center gap-2 justify-center">
          {translation("already-had-account")}
          <Link to={ROUTES.LOGIN}>{translation("login-now")}</Link>
          <ArrowRightOutlined />
        </div>
      </Form>
    </div>
  );
};

export default Register;
