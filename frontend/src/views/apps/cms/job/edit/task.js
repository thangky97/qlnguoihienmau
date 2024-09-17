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
import DepartmentService from "@services/DepartmentService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_TASK } from "../../../../../constants/validation";
import { isObjEmpty } from "../../../../../utility/Utils";
import JobfieldService from "@services/JobfieldService";
import moment from "moment";
import JobService from "../../../../../services/JobService";
import UserService from "../../../../../services/UserService";
import TaskService from "../../../../../services/TaskService";

const statusObject = {
  ACTIVE: { value: "ACTIVE", label: "Hoạt động", number: 1 },
  DEACTIVE: { value: "DEACTIVE", label: "Ngừng hoạt động", number: 2 },
};

const workStatusObject = {
  NOPROCESS: { value: "NOPROCESS", label: "Chưa xử lý", number: 1 },
  PROCESSING: { value: "PROCESSING", label: "Đang xử lý", number: 2 },
  COMPLETED: { value: "COMPLETED", label: "Hoàn thành", number: 3 },
  CANCEL: { value: "CANCEL", label: "Huỷ", number: 4 },
};

const schema = yup.object(SCHEMA_TASK).required();

const JobTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState();
  const [jobfield, setJobfield] = useState();
  const [job, setJob] = useState();
  const [department, setDepartment] = useState([]);
  const initialValues = {
    ...initial,
    status: statusObject[initial.status],
    workstatus: workStatusObject[initial.workstatus],
    department_id: {
      value: initial?.department?.id,
      label: `${initial?.department?.code} - ${initial?.department?.name}`,
    },
    jobfield_id: {
      value: initial?.jobfield?.id,
      label: `${initial?.jobfield?.code} - ${initial?.jobfield?.name}`,
    },
    job_id: {
      value: initial?.job?.id,
      label: `${initial?.job?.name}`,
    },
    createDate: new Date(moment(initial?.createDate, "YYYY/MM/DD").toDate()),
    processDate: new Date(moment(initial?.processDate, "YYYY/MM/DD").toDate()),
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
      const { data } = await UserService.get_all_operator({
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
      const { data } = await JobService.getAllJob({});
      setJob(data);
    })();
    (async () => {
      const { data } = await DepartmentService.getAllDepartment({
        status: "ACTIVE",
      });
      setDepartment(data);
    })();
  }, []);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

      setDisable(true);
      const result = await TaskService.updateTask({
        id: initial?.id,
        taskname: values?.taskname,
        dealine: Number(values?.dealine),
        description: values?.description || "",
        note: values?.note || "",
        status: values?.status.value,
        endDate: initial?.endDate,
        workstatus: values?.workstatus.value,
        department_id: parseInt(
          values.department_id && values.department_id.value
        ),
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
        job_id: parseInt(values.job_id && values.job_id.value),
        createDate:
          moment(values?.createDate).format("YYYY/MM/DD") || formattedDate,
        processDate:
          moment(values?.processDate).format("YYYY/MM/DD") || formattedDate,
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
              <Label>
                Nhiệm vụ<span className="text-danger">*</span>
              </Label>
              <Controller
                name="taskname"
                control={control}
                render={({ field }) => (
                  <Input
                    className={classnames({
                      "is-invalid": errors["taskname"],
                    })}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.taskname && errors.taskname.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>
                Công việc: <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="job_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn công việc"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.job_id?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={
                      job?.length > 0
                        ? job?.map((item, index) => {
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
                {errors?.job_id && errors.job_id.message}
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
                    className={classnames("react-select", {
                      "is-invalid": errors["status"],
                    })}
                    placeholder="Chọn trạng thái"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        // border: errors.status?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={[
                      { value: "ACTIVE", label: "Hoạt động", number: 1 },
                      {
                        value: "DEACTIVE",
                        label: "Không hoạt động",
                        number: 2,
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
                Phòng ban: <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="department_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn phòng ban"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.department_id?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      department?.length > 0
                        ? department?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          })
                        : []
                    }
                    value={field.value}
                    // onChange={field.onChange}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.department_id && errors.department_id.message}
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
              Dealine <span className="text-danger">*</span>
            </Label>
            <Controller
              name="dealine"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  className={classnames({
                    "is-invalid": errors["dealine"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger pt-1">
              {errors.dealine?.message}
            </small>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>
                Ngày xử lý <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="processDate"
                className={classnames("form-control", {
                  "is-invalid": errors["processDate"],
                })}
                innerRef={register}
                render={({ field }) => (
                  <DatePicker
                    name="processDate"
                    id="processDate"
                    className={
                      errors.processDate?.message
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
                {errors.processDate?.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>
                Trạng thái xử lý: <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="workstatus"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className={classnames("react-select", {
                      "is-invalid": errors["workstatus"],
                    })}
                    placeholder="Chọn trạng thái xử lý"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.workstatus?.message
                          ? "1px solid red"
                          : "",
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
                {errors?.workstatus && errors.workstatus.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
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
            </FormGroup>
          </Col>

          <Col md="12" className="section">
            <FormGroup>
              <Label>Mô tả</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input type="textarea" {...field} />}
              />
            </FormGroup>
          </Col>

          <Col md="12" className="section">
            <FormGroup>
              <Label>Ghi chú</Label>
              <Controller
                name="note"
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
