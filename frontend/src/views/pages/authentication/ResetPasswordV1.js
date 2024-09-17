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
import { useSkin } from "@hooks/useSkin";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import classnames from "classnames";
import { useState } from "react";
import Service from "@services/request";
import { toast } from "react-toastify";
import { isObjEmpty } from "@utils";
import { useHistory, useParams } from "react-router-dom";
import { RESET_PASSWORD } from "@constants/api";
import InputPasswordToggle from "@components/input-password-toggle";

import { SCHEMA_RESET_PASSWORD } from "../../../constants/validation";
const schema = yup.object(SCHEMA_RESET_PASSWORD).required();

const ResetPasswordV1 = () => {
  const history = useHistory();
  const { token } = useParams();
  console.log(token);
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
        method: RESET_PASSWORD.method,
        path: RESET_PASSWORD.path,
        data: {
          password: values?.password?.trim(),
        },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((result) => {
          toast.success("Mật khẩu đã được thay đổi.");
          setDisable(false);
          reset();
          history.push("/login");
        })
        .catch(() => {
          toast.error("Unauthorized");
          setDisable(false);
        });
    }
  };

  return (
    <div className="auth-wrapper auth-v2">
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
                Đặt lại mật khẩu
              </CardTitle>
            </div>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="password">
                  Mật khẩu
                </Label>

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
              </FormGroup>

              <FormGroup>
                <Label className="form-label" for="retype_password">
                  Nhập lại mật khẩu
                </Label>

                <Controller
                  name="retype_password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className={classnames({
                        "is-invalid": errors["retype_password"],
                      })}
                      {...field}
                    />
                  )}
                />
                <small className="text-danger">
                  {errors?.retype_password && errors.retype_password.message}
                </small>
              </FormGroup>

              <Button.Ripple
                type="submit"
                color="primary"
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
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPasswordV1;
