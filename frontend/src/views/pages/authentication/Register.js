import { Fragment, useState, useContext } from "react";
import { isObjEmpty } from "@utils";
import classnames from "classnames";
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { handleLogin } from "@store/actions/auth";
import { Link, useHistory } from "react-router-dom";
import { AbilityContext } from "@src/utility/context/Can";
import InputPasswordToggle from "@components/input-password-toggle";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import api from "@constants/api";
import Service from "@services/request";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  FormGroup,
  Label,
  Button,
  Form,
  Spinner,
  Input,
  CustomInput,
} from "reactstrap";
import { SCHEMA_REGISTER } from "../../../constants/validation";

import "@styles/base/pages/page-auth.scss";
import { Slide, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { SIGNUP_USER } from "../../../constants/api";
const schema = yup.object(SCHEMA_REGISTER).required();

const Register = () => {
  const ability = useContext(AbilityContext);

  const [skin, setSkin] = useSkin();

  const history = useHistory();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const [email, setEmail] = useState("");
  const [valErrors, setValErrors] = useState({});
  const [fullname, setfullname] = useState("");
  const [password, setPassword] = useState("");

  const illustration =
      skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const Terms = () => {
    return (
      <Fragment>
        I agree to
        <a className="ml-25" href="/" onClick={(e) => e.preventDefault()}>
          privacy policy & terms
        </a>
      </Fragment>
    );
  };
  const ToastContent = () => (
    <Fragment>
      <div className="toastify-header">
        <div className="title-wrapper">
          <h6 className="toast-title font-weight-bold">
            <FormattedMessage id="Complete registration" />
          </h6>
        </div>
      </div>
      {/* <div className="toastify-body">
        <span>to Kiemdinhoto.vn. Now you can start to explore. Enjoy!</span>
      </div> */}
    </Fragment>
  );
  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      Service.send({
        method: SIGNUP_USER.method,
        path: SIGNUP_USER.path,
        data,
      })
        .then((result) => {
          history.push("/form-registered", {
            email: data?.email,
          });
        })
        .catch((result) => {
          setDisable(false);
        });
    }
  };

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient
                x1="100%"
                y1="10.5120544%"
                x2="50%"
                y2="89.4879456%"
                id="linearGradient-1"
              >
                <stop stopColor="#000000" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="64.0437835%"
                y1="46.3276743%"
                x2="37.373316%"
                y2="100%"
                id="linearGradient-2"
              >
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                <g id="Group" transform="translate(400.000000, 178.000000)">
                  <path
                    d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                    id="Path"
                    className="text-primary"
                    style={{ fill: "currentColor" }}
                  ></path>
                  <path
                    d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                    id="Path"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  ></path>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.049999997"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                  ></polygon>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.099999994"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                  ></polygon>
                  <polygon
                    id="Path-3"
                    fill="url(#linearGradient-2)"
                    opacity="0.099999994"
                    points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className="brand-text text-primary ml-1">Vuexy</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
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
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Register 🚀
            </CardTitle>
            {/* <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText> */}

            <Form
              action="/"
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="email">
                  Full Name
                </Label>
                <Input
                  name="fullname"
                  className={classnames({ "is-invalid": errors["fullname"] })}
                  innerRef={register}
                />
                <small className="text-danger">
                  {errors?.fullname && errors.fullname.message}
                </small>
              </FormGroup>

              <FormGroup>
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Input
                  name="email"
                  className={classnames({ "is-invalid": errors["email"] })}
                  innerRef={register}
                />
                <small className="text-danger">
                  {errors?.email && errors.email.message}
                </small>
              </FormGroup>

              <FormGroup>
                <Label className="form-label" for="password">
                  Password
                </Label>
                <InputPasswordToggle
                  name="password"
                  className={classnames({ "is-invalid": errors["password"] })}
                  innerRef={register}
                />
                <small className="text-danger">
                  {errors?.password && errors.password.message}
                </small>
              </FormGroup>

              <FormGroup>
                <Label className="form-label" for="retype_password">
                  Retype password
                </Label>
                <InputPasswordToggle
                  name="retype_password"
                  className={classnames({
                    "is-invalid": errors["retype_password"],
                  })}
                  innerRef={register}
                />
                <small className="text-danger">
                  {errors?.retype_password && errors.retype_password.message}
                </small>
              </FormGroup>
              {/* <FormGroup>
                <CustomInput
                  type="checkbox"
                  id="terms"
                  name="terms"
                  value="terms"
                  label={<Terms />}
                  className="custom-control-Primary"
                  innerRef={register({ required: true })}
                  onChange={(e) => setTerms(e.target.checked)}
                  invalid={errors.terms && true}
                />
              </FormGroup> */}
              <Button.Ripple
                type="submit"
                color="primary"
                block
                disabled={disable}
              >
                {disable ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-50">Sign up...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button.Ripple color="facebook">
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color="twitter">
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color="google">
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className="mr-0" color="github">
                <GitHub size={14} />
              </Button.Ripple>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
