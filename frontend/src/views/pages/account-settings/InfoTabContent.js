import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import {
  Label,
  Input,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SCHEMA_UPADTE_PROFILE } from "../../../constants/validation";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../../../services/UserService";
import { isObjEmpty } from "@utils";
import { toast } from "react-toastify";

const schema = yup.object(SCHEMA_UPADTE_PROFILE).required();

const InfoTabContent = () => {
  const [initialValue, setInitialValue] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  const [invalidPhone, setInvalidPhone] = useState(false);
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState(initialValue?.phone);
  const genderObject = {
    MALE: { value: "MALE", label: "Nam", number: 1 },
    FEMALE: {
      value: "FEMALE",
      label: "Nữ",
      number: 2,
    },
    OTHER: {
      value: "OTHER",
      label: "Khác",
      number: 3,
    },
  };
  const initialValues = {
    ...initialValue,
    gender: genderObject[initialValue.gender],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (values) => {
  
    if (invalidPhone) {
      setInvalidPhone(true);
    }
    if (isObjEmpty(errors) && !invalidPhone) {
      setDisable(true);
      const result = await UserService.updateprofile({
        name: values.name || "",
        phone: value || "",
        gender: values?.gender?.value || "",
      });
      if (result.isSuccess) {
        toast.success("Cập nhật thành công");
        setDisable(false);
        const payload = {
          ...initialValue,
          name:result?.data?.name,
          gender:result?.data?.gender,
          phone:result?.data?.phone,
        }
      localStorage.setItem("userData",JSON.stringify(payload))        

      } else {
        setDisable(false);
      }
    }
  };
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
        console.log(error);
        setInvalidPhone(true);
      }
    } else {
      setInvalidPhone(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12">
          <FormGroup>
            <Label className="form-label" for="name">
              Tên
              {/* <span className="text-danger">*</span> */}
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
            {/* <small className="text-danger">
              {errors?.name && errors.name.message}
            </small> */}
          </FormGroup>
        </Col>
        <Col sm="12">
          <Label>Giới tính:</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={[
                  { value: "MALE", label: "Nam", number: 1 },
                  {
                    value: "FEMALE",
                    label: "Nữ",
                    number: 2,
                  },
                  {
                    value: "OTHER",
                    label: "Khác",
                    number: 3,
                  },
                ]}
                placeholder="Chọn giới tính"
                value={field.value}
                onChange={field.onChange}
                {...field}
              />
            )}
          />
        </Col>
        <Col sm="12">
          <FormGroup className="mt-1">
            <Label for="name">
              Số điện thoại 
            </Label>
            <PhoneInput
              value={initialValue.phone}
              placeholder="Nhập số điện thoại"
              defaultCountry="VN"
              countries={["VN"]}
              onBlur={() => {
                let phone1 = document.getElementById("phone");
                if (phone1 && phone1.value) {
                  phone1.value = phone1.value.trim();
                }
              }}
              className={classnames("form-control",invalidPhone && "is-invalid")}
              onChange={(e) => {
                setValue();
                handleOnchangePhone(e);
              }}
            />

<small className="text-danger">
              {invalidPhone && "Số điện thoại không hợp lệ"}
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
                  "Cập nhật"
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

export default InfoTabContent;
