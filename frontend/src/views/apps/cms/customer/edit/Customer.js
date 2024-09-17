import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { isObjEmpty, selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";

import CustomerService from "@services/CustomerService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_CUSTOMER } from "../../../../../constants/validation";

const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};

const schema = yup.object(SCHEMA_ADD_CUSTOMER).required();

const CustomerTab = ({ initial }) => {
  const [loading, setLoading] = useState();

  const [disable, setDisable] = useState(false);

  const [invalidPhone, setInvalidPhone] = useState(false);

  const initialValues = {
    ...initial,
    status: statusObject[initial?.status],
  };

  const [value, setValue] = useState(initial?.phone);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });
  const history = useHistory();
  const handleOnchangePhone = (e) => {
    setValue(e);
    if (e !== undefined) {
      try {
        const check = isValidPhoneNumber(e);
        if (!check) {
          setInvalidPhone(true);
        } else {
          setInvalidPhone(false);
        }
      } catch (error) {
        setInvalidPhone(true);
      }
    } else {
      setInvalidPhone(false);
    }
  };
  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await CustomerService.updateCustomer({
        code: initial.code,
        name: values.name.trim(),
        phone: value || "",
        address: values?.address || "",
        description: values?.description || "",
        tax_code: values?.tax_code || "",
        loaiHinh: values?.loaiHinh || "",
        status: values.status.value,
        company_id: null,
        email: values.email.trim() || "",
        branch_id: null,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Sửa thành công");
        history.push("/apps/customer/list");
      }
    }
  };

  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="4">
          <FormGroup>
            <Label for="name">Tên</Label>
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
        </Col>
        <Col sm="4">
          <FormGroup>
            <Label for="name">Số điện thoại</Label>
            <PhoneInput
              placeholder="Nhập số điện thoại"
              value={initialValues.phone}
              defaultCountry="VN"
              countries={["VN", "EG"]}
              onBlur={() => {
                let phone1 = document.getElementById("phone");
                if (phone1 && phone1.value) {
                  phone1.value = phone1.value.trim();
                }
              }}
              className={classnames(
                "form-control",
                invalidPhone && "is-invalid"
              )}
              onChange={(e) => {
                setValue();
                handleOnchangePhone(e);
              }}
            />

            <p className="text-danger">
              {" "}
              {invalidPhone && "Số điện thoại không hợp lệ"}
            </p>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="email"> </Label>
            Email
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
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="tax_code">Mã số thuế</Label>
            <Controller
              name="tax_code"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="name">Địa chỉ</Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="loaiHinh">Loại hình</Label>
            <Controller
              name="loaiHinh"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["loaiHinh"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.loaiHinh && errors.loaiHinh.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="3" className="mb-2">
          <FormGroup>
            <Label>Trạng thái:</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  placeholder="Select status"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.status?.message ? "1px solid red" : "",
                    }),
                  }}
                  options={[
                    { value: "active", label: "Hoạt động", number: 1 },
                    {
                      value: "deactive",
                      label: "Ngừng hoạt động",
                      number: 2,
                    },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.status && errors.status.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="12">
          <FormGroup>
            <Label for="description">Mô tả</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="justify-content-end ">
        <FormGroup className="d-flex mb-0 mx-1 py-3">
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
              "Sửa"
            )}
          </Button.Ripple>
          <Button.Ripple
            outline
            color="secondary"
            onClick={() => {
              history.push("/apps/customer/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};
export default CustomerTab;
