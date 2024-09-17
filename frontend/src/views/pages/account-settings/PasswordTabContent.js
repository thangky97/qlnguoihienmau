import * as yup from "yup";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormGroup, Row, Col, Button, Label, Spinner } from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import { FormattedMessage } from "react-intl";
import { toast, Slide } from "react-toastify";
import api, { CHANGE_PASSWORD } from "../../../constants/api";
import Service from "./../../../services/request";
import { isObjEmpty } from "@utils";
import { SCHEMA_CHANGE_PASSWORD } from "../../../constants/validation";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const schema = yup.object(SCHEMA_CHANGE_PASSWORD).required();

const PasswordTabContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [disable, setDisable] = useState(false);
const history = useHistory()
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      Service.send({
        method: CHANGE_PASSWORD.method,
        path: CHANGE_PASSWORD.path,
        data: {
          old_password: values.current_password,
          new_password: values.retype_new_password,
        },
      })
        .then((result) => {
          toast.success("Đổi mật khẩu thành công");
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/";
          }, 2000);
        })
        .catch(() => setDisable(false));
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12">
          <FormGroup>
            <Label className="form-label" for="password">
              {/* <FormattedMessage id="Mật khẩu cũ" /> */}
              Mật khẩu cũ
            </Label>
            <Controller
              name="current_password"
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                  className={classnames({
                    "is-invalid": errors["current_password"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.current_password && errors.current_password.message}
            </small>
          </FormGroup>
        </Col>
        <Col sm="12">
          <FormGroup>
            <Label className="form-label" for="newPassword">
              {/* <FormattedMessage id="New Password" /> */}
              Mật khẩu mới
            </Label>
            <Controller
              name="new_password"
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                  className={classnames({
                    "is-invalid": errors["new_password"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.new_password && errors.new_password.message}
            </small>
          </FormGroup>
        </Col>
        <Col sm="12">
          <FormGroup>
            <Label className="form-label" for="retype_new_password">
              Nhập lại mật khẩu mới
            </Label>
            <Controller
              name="retype_new_password"
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                  className={classnames({
                    "is-invalid": errors["retype_new_password"],
                  })}
                  {...field}
                />
              )}
            />

            <small className="text-danger">
              {errors?.retype_new_password &&
                errors.retype_new_password.message}
            </small>
          </FormGroup>
        </Col>
        <Col sm="12" className="pt-2">
          <Row className="justify-content-end">
            <FormGroup className="d-flex mb-0 mx-1">
              <Button.Ripple
                className="mr-1"
                color="primary"
                type="submit"
                disabled={disable}
              >
                {disable ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-50">Vui lòng đợi...</span>
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button.Ripple>
              <Button.Ripple
                outline
                color="secondary"
                onClick={() => {
                  history.push("/");
                }}
              >
                Huỷ
              </Button.Ripple>
            </FormGroup>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default PasswordTabContent;
