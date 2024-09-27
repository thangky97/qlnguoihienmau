// ** React Import
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
import { useState } from "react";
import Select from "react-select";
// ** Custom Components
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
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";

import { useHistory } from "react-router-dom";
import { SCHEMA_HOSPITAL } from "../../../../../constants/validation";
import HospitalService from "../../../../../services/HospitalService";
import { toast } from "react-toastify";

const schema = yup.object(SCHEMA_HOSPITAL).required();

const AddHospital = ({ param }) => {
  const [disable, setDisable] = useState(false);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      status: {
        value: "ACTIVE",
        label: "Hoạt động",
        number: 1,
      },
    },
  });

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await HospitalService.addHospital({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        description: values.description || "",
        status: values.status.value,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();
        toast.success("Thêm thành công");
        history.push("/apps/hospital/list");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Tên bệnh viện<span className="text-danger">*</span>
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

        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Email<span className="text-danger">*</span>
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

        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Số điện thoại<span className="text-danger">*</span>
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

        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Địa chỉ<span className="text-danger">*</span>
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

        <Col md="4">
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
                  placeholder="Chọn trạng thái"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.status?.message ? "1px solid red" : "",
                    }),
                  }}
                  options={[
                    { value: "active", label: "Hoạt động", number: 1 },
                    { value: "deactive", label: "Ngừng hoạt động", number: 2 },
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

        <Col sm="12">
          <FormGroup>
            <Label for="description"> </Label>
            Mô tả
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
              "Thêm"
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

export default AddHospital;
