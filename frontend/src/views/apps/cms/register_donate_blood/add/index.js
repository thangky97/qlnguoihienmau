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
import { SCHEMA_ADD_CATEGORY_POST } from "../../../../../constants/validation";
import RegisterDonateBloodService from "../../../../../services/RegisterDonateBloodService";
import { toast } from "react-toastify";

const schema = yup.object(SCHEMA_ADD_CATEGORY_POST).required();

const AddCategoryPost = ({ param }) => {
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
      const result = await RegisterDonateBloodService.addRegisterDonateBlood({
        name: values.name,
        description: values.description || "",
        status: values.status.value,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();
        toast.success("Thêm thành công");
        history.push("/apps/register_donate_blood/list");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Danh mục<span className="text-danger">*</span>
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
              history.push("/apps/register_donate_blood/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};

export default AddCategoryPost;
