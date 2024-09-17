// ** React Import
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
import { useSkin } from "@hooks/useSkin";
import { useEffect, useState } from "react";
import Select from "react-select";
// ** Custom Components

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  CardTitle,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";

import "react-phone-number-input/style.css";
// ** Store & Actions

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_REGISTER } from "../../../constants/validation";
import RegisterService from "../../../services/RegisterService";
import InputPasswordToggle from "@components/input-password-toggle";
import CompanyService from "@services/CompanyService";
import "./style.scss";

const schema = yup.object(SCHEMA_REGISTER).required();

const SignUp = ({ param }) => {
  const [skin] = useSkin();
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const [disable, setDisable] = useState(false);
  const history = useHistory();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (values) => {
    console.log(values);
    if (isObjEmpty(errors)) {
      const checkUser = await RegisterService.registerValidate({
        username: values?.username.trim(),
        email: values?.email.trim(),
      });
      if (checkUser?.isSuccess) {
        await RegisterService.addCompany({
          name: values?.name.trim(),
          contactemail: values?.email.trim(),
          contactmobile: values?.phone.trim(),
          address: values?.address.trim(),
          description: "",
          phonezalo: values?.zalo.trim(),
          linkfb: "",
          langname: "vn",
          status: "ACTIVE",
        }).then(async ({ data }) => {
          console.log(data);
          const result = await RegisterService.signUpCustomer({
            name: values?.name || "",
            company_id: data?.id,
            username: values?.username.trim(),
            password: values?.password.trim(),
            phone: values?.phone.trim(),
            company_tax_code: values?.company_tax_code || "",
            referral_source_id: null,
            email: values?.email.trim(),
            gender: "OTHER",
            role: "COMPANYADMIN",
            status: "ACTIVE",
            verify: "UNVERIFIED",
            authorities: [],
          });

          if (result.isSuccess) {
            setDisable(false);
            if (result?.data?.status === 400) {
              toast.warning("Đăng ký thất bại");
            } else {
              reset();
              toast.success("Đăng ký thành công");
              history.push("/verify");
            }
          } else {
            setDisable(false);
          }
        });
      }
    }
  };

  return (
    <>
      <div className="auth-wrapper auth-v2 container-register">
        <Row className="auth-inner m-0">
          <Col
            className="d-none d-lg-flex align-items-center p-5"
            lg="8"
            sm="12"
          >
            <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
              <img className="img-fluid" src={source} alt="Login V2" />
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
                  Tạo tài khoản công ty
                </CardTitle>
              </div>

              <Form
                className="auth-login-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormGroup>
                  <Label for="name">
                    Tên công ty <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        className={classnames({
                          "is-invalid": errors["name"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.name && errors.name.message}
                  </small>
                </FormGroup>
                <FormGroup>
                  <Label for="company_tax_code">Mã số thuế</Label>
                  <Controller
                    name="company_tax_code"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="address">
                    Địa chỉ <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        className={classnames({
                          "is-invalid": errors["address"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.address && errors.address.message}
                  </small>
                </FormGroup>
                <FormGroup>
                  <Label for="phone">
                    Số điện thoại <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        className={classnames({
                          "is-invalid": errors["phone"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.phone && errors.phone.message}
                  </small>
                </FormGroup>
                <FormGroup>
                  <Label for="email">
                    Email <span className="text-danger">*</span>
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
                <FormGroup>
                  <Label for="zalo">Zalo</Label>
                  <Controller
                    name="zalo"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="form-label" for="username">
                    Tài khoản <span className="text-danger">*</span>
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
                    <Label className="form-label" for="password">
                      Mật khẩu <span className="text-danger">*</span>
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
                </FormGroup>

                <FormGroup>
                  <Label className="form-label" for="confirm_password">
                    Xác thực mật khẩu <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="confirm_password"
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className={classnames({
                          "is-invalid": errors["confirm_password"],
                        })}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.confirm_password &&
                      errors.confirm_password.message}
                  </small>
                </FormGroup>

                <Button.Ripple
                  type="submit"
                  color="primary"
                  className="btn-register"
                  block
                  disabled={disable}
                >
                  {disable ? (
                    <>
                      <Spinner size="sm" />
                      <span className="ml-50">Đăng ký...</span>
                    </>
                  ) : (
                    "Đăng ký"
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
    </>
  );
};

export default SignUp;
