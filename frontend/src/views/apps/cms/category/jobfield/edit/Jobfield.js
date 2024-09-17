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
import JobfieldService from "@services/JobfieldService";

import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_JOBFIELD } from "../../../../../../constants/validation";
import { useSelector } from "react-redux";

const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};

const schema = yup.object(SCHEMA_ADD_JOBFIELD).required();

const JobfieldTab = ({ initial }) => {
  const userData = useSelector((state) => state?.auth?.userData);

  const [disable, setDisable] = useState(false);
  const initialValues = {
    ...initial,
    status: statusObject[initial?.status],
  };
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });

  const history = useHistory();

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await JobfieldService.update({
        id: initial.id,
        code: values?.code,
        name: values?.name,
        description: values?.description || "",
        langname: "vn",
        status: values.status.value,
        company_id: null,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Sửa thành công");
        history.push("/apps/category/jobfield/list");
      } else {
        setDisable(false);
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
            <Label for="name">
              Mã lĩnh vực <span className="text-danger">*</span>
            </Label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["code"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.code && errors.code.message}
            </small>
          </FormGroup>
        </Col>
        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Tên lĩnh vực <span className="text-danger">*</span>
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
              history.push("/apps/category/jobfield/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};
export default JobfieldTab;
