// ** React Import
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
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
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";

// ** Store & Actions

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_BRANCH } from "../../../../../constants/validation";
import BranchService from "@services/BranchService";
import { useSelector } from "react-redux";

const schema = yup.object(SCHEMA_ADD_BRANCH).required();

const AddBranch = ({ param }) => {
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const userData = useSelector((state) => state?.auth?.userData);

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
      const result = await BranchService.add({
        name: values?.name,
        contactemail: values?.contactemail,
        contactmobile: values?.contactmobile,
        address: values?.address || "",
        description: values?.description || "",
        phonezalo: values?.phonezalo || "",
        linkfb: values?.linkfb || "",
        status: values.status.value,
        company_id: null,
        branch_id: null,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();
        toast.success("Thêm thành công");
        history.push("/apps/cms/branch/list");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="4">
          <FormGroup>
            <Label for="name">
              Tên Chi nhánh <span className="text-danger">*</span>
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
            <Label for="contactmobile">
              Số điện thoại <span className="text-danger">*</span>
            </Label>
            <Controller
              name="contactmobile"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["contactmobile"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.contactmobile && errors.contactmobile.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="contactemail">
              Email <span className="text-danger">*</span>
            </Label>
            <Controller
              name="contactemail"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["contactemail"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.contactemail && errors.contactemail.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="4">
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
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="phonezalo">Zalo</Label>
            <Controller
              name="phonezalo"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["phonezalo"],
                  })}
                  {...field}
                />
              )}
            />
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="linkfb">Link facebook</Label>
            <Controller
              name="linkfb"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["linkfb"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.linkfb && errors.linkfb.message}
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

        <Col sm="12">
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
        {/* <Col sm="4"> */}
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
              history.push("/apps/cms/branch/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
        {/* </Col> */}
      </Row>
    </Form>
  );
};

export default AddBranch;
