import { Form } from "antd";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import userActions from "@Store/actions/userActions";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ROUTES } from "@Constants/route";
import { firebase } from "@Constants/firebase/index";
import LoginService from "@Network/loginService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IResponse } from "@Constants/models/responseInterface";
import { Toast } from "@Helper/utils";
import { ERROR_FROM_SERVER } from "@Constants/constants";
import InputPassword from "@Components/InputPassword";
import { useState } from "react";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pathUrl = useAppSelector(state => state.monitoring);
  const { t: translation } = useTranslation();
  const [disable, setDisable] = useState<boolean>();
  const onSubmit = (data: { username: string; password: string }) => {
    // setDisable(true);
    // LoginService.login({
    //   username: data.username,
    //   password: data.password
    //   // @ts-ignore
    // })
    //   .then((response: IResponse) => {
    //     if (response.isSuccess) {
    //       if (response.data.status !== 1) {
    //         Toast("error", translation("login-locked"));
    //         return;
    //       }
    //       dispatch({
    //         type: userActions.USER_UPDATE,
    //         payload: response.data
    //       });
    //       toast.success(
    //         `Welcome back! ${
    //           response?.data?.username || response?.data?.email || ""
    //         }`
    //       );
    //       setTimeout(() => {
    //         if (pathUrl?.pathname) {
    //           navigate(pathUrl?.pathname);
    //         } else {
    //           navigate("/");
    //         }
    //       }, 2000);
    //     } else {
    //       if (response.error === ERROR_FROM_SERVER.AUTH.USER_LOCKED) {
    //         Toast("error", translation("login-locked"));
    //         setDisable(false);
    //       } else if (response.error === ERROR_FROM_SERVER.AUTH.USER_NOT_FOUND) {
    //         Toast("error", translation("not-found-email"));
    //         setDisable(false);
    //       } else {
    //         Toast("error", translation("login-error"));
    //         setDisable(false);
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     setDisable(false);
    //     console.log("login_error", err);
    //     Toast("error", translation("login-error"));
    //   });
  };

  const responseGoogle = () => {
    let ggProvider = new firebase.auth.GoogleAuthProvider();
    firebase // send req to firebase
      .auth()
      .signInWithPopup(ggProvider)
      .then((result: any) => {
        const { given_name, family_name, email, id, picture } =
          result.additionalUserInfo.profile;

        const loginData = {
          google_id: id,
          google_avatar: picture,
          google_email: email,
          google_first_name: family_name,
          google_last_name: given_name
        };
        // send req to server
        LoginService.loginGoogle(loginData)
          .then((response: any) => {
            if (response.isSuccess) {
              if (response.data.status !== 1) {
                Toast("error", translation("login-locked"));
                return;
              }
              dispatch({
                type: userActions.USER_UPDATE,
                payload: response.data
              });
              toast.success(
                `Welcome back! ${
                  response?.data?.username || response?.data?.email || ""
                }`
              );
              setTimeout(() => {
                if (pathUrl?.pathname) {
                  navigate(pathUrl?.pathname);
                } else {
                  navigate("/");
                }
              }, 2000);
            } else {
              // toast.error(translation("login-google-error"),);
              setDisable(false);
              console.log("login google err", response);
            }
          })
          .catch((err: any) => {
            // toast.error(translation("login-google-error"),);
            setDisable(false);
            console.log("login google err", err);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
      })
      .catch((error: any) => {
        // toast.error(translation("login-google-error"),);
        setDisable(false);
        console.log("login google err", error);
      });
  };

  return (
    <div className="login">
      <div className="login-left"></div>
      <div className="login-right">
        <div className="login-title">
          {translation("login-to")}&nbsp;bệnh viện
        </div>
        <Form
          className="login-detail"
          onFinish={onSubmit}
          autoComplete="off"
          name="basic"
        >
          <div className="user">
            <label className="login-label">{translation("username")}</label>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: translation("required") },
                {
                  pattern: /^((?! ).)*$/g,
                  max: 50,
                  message: translation("invalid-username")
                }
              ]}
            >
              <input
                className="infor"
                placeholder={translation("register-placeholder")}
              />
            </Form.Item>
          </div>

          <div>
            {/* <div className="flex justify-between">
              <div className="pass">
                <label className="login-label">{translation("password")}</label>
              </div>
              <Link className="forgot-pass" to={ROUTES.FORGOT}>
                {translation("forgot_password")}
              </Link>
            </div> */}
            <InputPassword id="password" />
          </div>

          {/* <div className="login-note">
            <Link className="create-acc" to={ROUTES.SETUP}>
              {translation("register-title")}
            </Link>
          </div> */}

          <Form.Item>
            <div className="button-login">
              <button
                className="primary-button w-full"
                type="submit"
                disabled={disable}
              >
                {translation("login")}
              </button>
            </div>
          </Form.Item>

          {/* <Form.Item>
            <div className="middle-text">
              <div className="grow"></div>
              {translation("or")}
              <div className="grow"></div>
            </div>
          </Form.Item> */}
        </Form>
        {/* <div className="button-google">
          <button
            className="google sm:px-3 flex justify-between items-center"
            onClick={responseGoogle}
          >
            <img src={Google} alt="icon" />
            <span>{translation("login-google")}</span>
            <span></span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
