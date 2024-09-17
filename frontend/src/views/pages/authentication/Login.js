import Avatar from "@components/avatar";
import { LOGIN_CUSTOMER, LOGIN_STAFF } from "@constants/api";
import { firebase } from "@constants/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSkin } from "@hooks/useSkin";
import classnames from "classnames";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
// import Google from "@assets/icons/google.svg";
import Service from "@services/request";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Slide, toast } from "react-toastify";
// import { handleLogin } from '@store/actions/auth'
import InputPasswordToggle from "@components/input-password-toggle";
import { isObjEmpty } from "@utils";
import { Link } from "react-router-dom";
import {
  Button,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

import "@styles/base/pages/page-auth.scss";
import { SCHEMA_LOGIN } from "../../../constants/validation";
import "./style.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const schema = yup.object(SCHEMA_LOGIN).required();

const Login = (props) => {
  const [skin] = useSkin();
  const [disable, setDisable] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const history = useHistory();
  const illustration =
      skin === "dark" ? "login-v2-dark.svg" : "login-qlcongviec.jpg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      Service.send({
        method: LOGIN_STAFF.method,
        path: LOGIN_STAFF.path,
        data,
      })
        .then((result) => {
          if (result) {
            const {
              access_token,
              username,
              role,
              code,
              gender,
              name,
              phone,
              refresh_token,
              authorities,
            } = result;
            const newData = {
              information: {
                username,
                role,
                code,
                gender,
                name,
                phone,
                authorities,
              },
              accessToken: access_token,
              refreshToken: refresh_token,
            };

            // history.push(getHomeRouteForLoggedInUser('admin'))
            // toast.success(<ToastContent name={newData.email} />, {
            //   transition: Slide,
            //   hideProgressBar: true,
            //   autoClose: 2000,
            // });
            localStorage.setItem(
              "userData",
              JSON.stringify(newData.information)
            );
            localStorage.setItem(
              "accessToken",
              JSON.stringify(newData.accessToken)
            );
            localStorage.setItem(
              "refreshToken",
              JSON.stringify(newData.refreshToken)
            );
            setTimeout(() => {
              window.location.href = "/";
              // alert("a");
              // history.push(getHomeRouteForLoggedInUser("admin"))
              // history.push(getHomeRouteForLoggedInUser("admin"))
            }, 1500);
          }
        })
        .catch(() => {
          setDisable(false);
        });
    }
  };

  return (
    <>
      <div className="auth-wrapper auth-v2 container-login">
        <Row className="auth-inner m-0">
          <Col
            className="d-none d-lg-flex align-items-center p-0"
            lg="8"
            sm="12"
          >
            <div
              className="w-100 d-lg-flex align-items-center justify-content-center px-0"
              style={{ flex: "1" }}
            >
              <img
                className="img-fluid"
                src={source}
                alt="Login V2"
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col
            className="d-flex align-items-center auth-bg px-2 p-lg-5"
            lg="4"
            sm="12"
          >
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
              <div className=" ">
                <CardTitle tag="h2" className="font-weight-bold mb-1">
                  ĐĂNG NHẬP
                </CardTitle>
              </div>

              <Form
                className="auth-login-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormGroup>
                  <Label className="form-label" for="username">
                    Username
                  </Label>

                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input
                        className={classnames({
                          "is-invalid": errors["username"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.username && errors.username.message}
                  </small>
                </FormGroup>
                <FormGroup>
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                  </div>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className={classnames({
                          "is-invalid": errors["password"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.password && errors.password.message}
                  </small>
                  {/* <Link
                    className="pt-1 d-flex justify-content-end"
                    to="/forgot-password"
                  >
                    <small style={{ color: "#005BDF" }}>Quên mật khẩu?</small>
                  </Link> */}
                </FormGroup>
                <Button.Ripple
                  type="submit"
                  className="btn-login"
                  block
                  disabled={disable}
                >
                  {disable ? (
                    <>
                      <Spinner size="sm" />
                      <span className="ml-50">Đăng nhập...</span>
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button.Ripple>
              </Form>
              {/* <Link
                className="pt-1 d-flex justify-content-center"
                style={{ textDecoration: "underline" }}
                to="/register"
              >
                <small style={{ color: "#005BDF" }}>
                  Đăng ký tài khoản công ty
                </small>
              </Link> */}
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
