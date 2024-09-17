import React from "react";
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
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { SCHEMA_FORGOT_PASSWORD } from "../../../constants/validation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import classnames from "classnames";
import { useState } from "react";
import { FORGOT_PASSWORD } from "@constants/api";
import Service from "@services/request";
import { toast } from "react-toastify";
import { isObjEmpty } from "@utils";
import { useHistory } from "react-router-dom";
import "./style.scss";

const schema = yup.object(SCHEMA_FORGOT_PASSWORD).required();

const ForgotPassword = () => {
  const history = useHistory();
  const [disable, setDisable] = useState(false);
  const [skin] = useSkin();

  const illustration =
      skin === "dark"
        ? "forgot-password-v2-dark.svg"
        : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      Service.send({
        method: FORGOT_PASSWORD.method,
        path: FORGOT_PASSWORD.path,
        data: {
          email: values?.email?.trim(),
        },
      })
        .then((result) => {
          toast.success("Gửi yêu cầu thành công. Hãy kiểm tra email.");
          setDisable(false);
          reset();
          history.push("/login");
        })
        .catch(() => {
          setDisable(false);
        });
    }
  };

  return (
    <div className="auth-wrapper auth-v2 container-rest-password">
      <Row className="auth-inner m-0">
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
          style={{ background: "#fff" }}
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div className="">
              <CardTitle tag="h2" className="font-weight-bold mb-1">
                Quên mật khẩu
              </CardTitle>
            </div>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="username">
                  Email
                </Label>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className={classnames({
                        "is-invalid": errors["email"],
                      })}
                      {...field}
                    />
                  )}
                />
                <small className="text-danger">
                  {errors?.email && errors.email.message}
                </small>
              </FormGroup>
              <Button.Ripple
                type="submit"
                color="primary"
                className="btn-rest-password"
                block
                disabled={disable}
              >
                {disable ? (
                  <>
                    <Spinner size="sm" />
                    {/* <span className="ml-50">Gửi yêu cầu</span> */}
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">Đã có tài khoản?</span>
              <Link to="/login">
                <span style={{ color: "#005BDF" }}>Đăng nhập</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
