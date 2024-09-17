import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_JOB } from "../../../../../constants/validation";
import { isObjEmpty } from "../../../../../utility/Utils";
import JobfieldService from "@services/JobfieldService";
import moment from "moment";
import ContractService from "../../../../../services/ContractService";
import JobService from "../../../../../services/JobService";

const statusObject = {
  NEW: { value: "NEW", label: "Mới", number: 1 },
  INPROCESS: { value: "INPROCESS", label: "Đang tiến hành", number: 2 },
  COMPLETED: { value: "COMPLETED", label: "Hoàn thành", number: 3 },
};

const workStatusObj = {
  NOPROCESS: {
    value: "NOPROCESS",
    label: "Chưa xử lý",
    number: 1,
  },
  PROCESSING: {
    value: "PROCESSING",
    label: "Đang xử lý",
    number: 2,
  },
  COMPLETED: {
    value: "COMPLETED",
    label: "Hoàn thành",
    number: 3,
  },
  CANCEL: {
    value: "CANCEL",
    label: "Huỷ",
    number: 4,
  },
};

const schema = yup.object(SCHEMA_JOB).required();

const JobTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState();
  const [jobfield, setJobfield] = useState();
  const [contract, setContract] = useState();

  const initialValues = {
    ...initial,
    status: statusObject[initial.status],
    workstatusJob: workStatusObj[initial?.workstatusJob],
    user_code: {
      value: initial?.userJob?.code,
      label: `${initial?.userJob?.code} - ${initial?.userJob?.name} - ${initial?.userJob?.username}`,
    },
    jobfield_id: {
      value: initial?.jobfield?.id,
      label: `${initial?.jobfield?.code} - ${initial?.jobfield?.name}`,
    },
    contract_id: initial?.contract
      ? {
          value: initial.contract.id,
          label: `${initial.contract.name}`,
        }
      : undefined,
    createDate: new Date(moment(initial?.createDate, "YYYY/MM/DD").toDate()),
    jobDate: new Date(moment(initial?.jobDate, "YYYY/MM/DD").toDate()),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      ...initialValues,
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setUser(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setJobfield(data);
    })();
    (async () => {
      const { data } = await ContractService.getAllContract({});
      setContract(data);
    })();
  }, []);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

      setDisable(true);
      const result = await JobService.updateJob({
        id: initial?.id,
        code: initial.code,
        name: values?.name,
        description: values?.description || "",
        status: values?.status.value,
        workstatusJob: values?.workstatusJob.value,
        user_code: values.user_code && values.user_code.value,
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
        contract_id:
          parseInt(values.contract_id && values.contract_id.value) || null,
        createDate:
          moment(values?.createDate).format("YYYY/MM/DD") || formattedDate,
        jobDate: moment(values?.jobDate).format("YYYY/MM/DD") || formattedDate,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Cập nhật thành công");
        history.push("/apps/job/list");
      } else {
        setDisable(false);
      }
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="4" className="section">
            <FormGroup>
              <Label for="d">
                Công việc <span className="text-danger">*</span>
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
                {errors?.name && errors?.name?.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>Hợp đồng:</Label>
              <Controller
                control={control}
                name="contract_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn hợp đồng"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.contract_id?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      contract?.length > 0
                        ? contract?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.name}`,
                              number: index + 1,
                            };
                          })
                        : []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.contract_id && errors.contract_id.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
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
                      { value: "NEW", label: "Mới", number: 1 },
                      {
                        value: "INPROCESS",
                        label: "Đang tiến hành",
                        number: 2,
                      },
                      {
                        value: "COMPLETED",
                        label: "Hoàn thành",
                        number: 3,
                      },
                    ]}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.status && errors.status.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>
                Người tạo: <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="user_code"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn người tạo"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.user_code?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      user?.length > 0
                        ? user?.map((item, index) => {
                            return {
                              value: item?.code,
                              label: `${item?.code} - ${item?.name} - ${item?.username}`,
                              number: index + 1,
                            };
                          })
                        : []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.user_code && errors.user_code.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>
                Lĩnh vực: <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="jobfield_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn lĩnh vực"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.jobfield_id?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      jobfield?.length > 0
                        ? jobfield?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          })
                        : []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.jobfield_id && errors.jobfield_id.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <Label>
              Ngày làm việc <span className="text-danger">*</span>
            </Label>
            <Controller
              control={control}
              name="jobDate"
              className={classnames("form-control", {
                "is-invalid": errors["jobDate"],
              })}
              innerRef={register}
              render={({ field }) => (
                <DatePicker
                  name="jobDate"
                  id="jobDate"
                  className={
                    errors.jobDate?.message
                      ? "datepicker border border-danger"
                      : "datepicker"
                  }
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
              {errors.jobDate?.message}
            </small>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>Trạng thái xử lý:</Label>
              <Controller
                control={control}
                name="workstatusJob"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className={classnames("react-select", {
                      "is-invalid": errors["workstatusJob"],
                    })}
                    placeholder="Chọn trạng thái"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        // border: errors.workstatusJob?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={[
                      { value: "NOPROCESS", label: "Chưa xử lý", number: 1 },
                      {
                        value: "PROCESSING",
                        label: "Đang xử lý",
                        number: 2,
                      },
                      {
                        value: "COMPLETED",
                        label: "Hoàn thành",
                        number: 3,
                      },
                      {
                        value: "CANCEL",
                        label: "Huỷ",
                        number: 4,
                      },
                    ]}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.workstatusJob && errors.workstatusJob.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <Label>Ngày tạo</Label>
            <Controller
              control={control}
              name="createDate"
              className={classnames("form-control", {
                "is-invalid": errors["createDate"],
              })}
              innerRef={register}
              render={({ field }) => (
                <DatePicker
                  name="createDate"
                  id="createDate"
                  className={
                    errors.createDate?.message
                      ? "datepicker border border-danger"
                      : "datepicker"
                  }
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
              {errors.createDate?.message}
            </small>
          </Col>

          <Col md="12" className="mt-1">
            <FormGroup>
              <Label for="name">Mô tả</Label>
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
                "Cập nhật"
              )}
            </Button.Ripple>
            <Button.Ripple
              outline
              color="secondary"
              onClick={() => {
                history.push("/apps/job/list");
              }}
            >
              Huỷ
            </Button.Ripple>
          </FormGroup>
        </Row>
      </Form>
    </>
  );
};
export default JobTab;
