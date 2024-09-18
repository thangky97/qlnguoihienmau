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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

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
    date_birthday: new Date(
      moment(initial?.date_birthday, "YYYY/MM/DD").toDate()
    ),
  };

  const [value, setValue] = useState(initial?.phone);
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
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
        tax_code: "",
        loaiHinh: "",
        status: values.status.value,
        company_id: null,
        email: values.email.trim() || "",
        branch_id: null,
        password: values?.password || "123456",
        date_birthday: moment(values?.date_birthday).format("YYYY/MM/DD"),
        weight: values?.weight,
        height: values?.height,
        nhommau: values?.nhommau || "",
        huyetap: values?.huyetap || "",
        hemoglobin: values?.hemoglobin || "",
        tinhtrangbenhly: values?.tinhtrangbenhly || "",
        tieususdthuoc: values?.tieususdthuoc || "",
        duchitieuhien: values?.duchitieuhien || "",
        luongmauhien: values?.luongmauhien || "",
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
        <Col sm="3">
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
        <Col sm="3">
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

        <Col sm="3">
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

        <Col md="3">
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

        <Col sm="2" className="section">
          <Label>
            Năm sinh <span className="text-danger">*</span>
          </Label>
          <Controller
            control={control}
            name="date_birthday"
            className={classnames({
              "is-invalid": errors["date_birthday"],
            })}
            innerRef={register}
            render={({ field }) => (
              <DatePicker
                name="date_birthday"
                id="date_birthday"
                className={classnames(
                  "form-control",
                  errors.date_birthday?.message
                    ? "datepicker border border-danger"
                    : "datepicker"
                )}
                innerRef={register}
                onChange={(date) => {
                  field.onChange(date);
                }}
                dateFormat="yyyy/MM/dd"
                selected={field.value}
                value={field.value}
                selectsStart
              />
            )}
          />
          <small className="text-danger pt-1">
            {errors.date_birthday?.message}
          </small>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="weight">
              Cân nặng <span className="text-danger">*</span>
            </Label>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["weight"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.weight && errors.weight.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="height">
              Chiều cao <span className="text-danger">*</span>
            </Label>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["height"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.height && errors.height.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="nhommau">Nhóm máu </Label>
            <Controller
              name="nhommau"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["nhommau"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.nhommau && errors.nhommau.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="huyetap">Huyếp áp </Label>
            <Controller
              name="huyetap"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["huyetap"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.huyetap && errors.huyetap.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="hemoglobin">Hàm lượng hemoglobin </Label>
            <Controller
              name="hemoglobin"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["hemoglobin"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.hemoglobin && errors.hemoglobin.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="name">Lượng máu hiến</Label>
            <Controller
              name="luongmauhien"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="name">Tình trạng bệnh lý</Label>
            <Controller
              name="tinhtrangbenhly"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <Label for="name">Tiền sử sử dụng thuốc</Label>
            <Controller
              name="tieususdthuoc"
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
