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

import HospitalService from "@services/HospitalService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_HOSPITAL } from "../../../../../constants/validation";

const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};

const schema = yup.object(SCHEMA_HOSPITAL).required();

const HospitalTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);

  const initialValues = {
    ...initial,
    status: statusObject[initial?.status],
  };

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

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await HospitalService.updateHospital({
        id: initial.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        description: values?.description || "",
        status: values.status.value,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Sửa thành công");
        history.push("/apps/hospital/list");
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
        <Col md="4">
          <FormGroup>
            <Label for="name">
              Tên bệnh viện <span className="text-danger">*</span>
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
        </Col>

        <Col md="4">
          <FormGroup>
            <Label for="name">
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
        </Col>

        <Col md="4">
          <FormGroup>
            <Label for="name">
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
        </Col>

        <Col md="4">
          <FormGroup>
            <Label for="name">
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
        </Col>

        <Col md="4" className="mb-2">
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
              history.push("/apps/hospital/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};
export default HospitalTab;
