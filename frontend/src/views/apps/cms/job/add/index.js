import { yupResolver } from "@hookform/resolvers/yup";
import JobService from "@services/JobService";
import { isObjEmpty, selectThemeColors } from "@utils";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
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

import "./style.scss";

import * as yup from "yup";
import { SCHEMA_JOB } from "../../../../../constants/validation";
import { useSelector } from "react-redux";
import JobfieldService from "@services/JobfieldService";
import ContractService from "./../../../../../services/ContractService";
import UserService from "./../../../../../services/UserService";
import moment from "moment";

const schema = yup.object(SCHEMA_JOB).required();

const AddJob = ({}) => {
  const userData = useSelector((state) => state?.auth?.userData);

  const [user, setUser] = useState();
  const [jobfield, setJobfield] = useState([]);
  const [contract, setContract] = useState([]);
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { contractId } = location.state || {};
  const { jobfieldId } = location.state || {};

  const [existingContractIds, setExistingContractIds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      status: {
        value: "NEW",
        label: "Mới",
        number: 1,
      },
      workstatusJob: {
        value: "NOPROCESS",
        label: "Chưa xử lý",
        number: 1,
      },
      user_code: userData
        ? {
            value: userData.code,
            label: `${userData.code} - ${userData.name} - ${userData.username}`,
          }
        : null,
    },
  });

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
      if (jobfieldId) {
        const jobfieldOption = data.find(
          (item) => item?.id === parseInt(jobfieldId)
        );
        setValue("jobfield_id", {
          value: jobfieldOption.id,
          label: `${jobfieldOption?.code} - ${jobfieldOption?.name}`,
        });
      }
    })();
    (async () => {
      const { data: contracts } = await ContractService.getAllContract({});
      const { data: jobs } = await JobService.getAllJob({});
      const contractIdsWithJobs = jobs.map((job) => job.contract_id);
      setExistingContractIds(contractIdsWithJobs);
      setContract(contracts);
      if (contractId) {
        const contractOption = contracts.find(
          (item) => item.id === parseInt(contractId)
        );
        setValue("contract_id", {
          value: contractOption.id,
          label: contractOption.name,
        });
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (selectedContract) {
  //     const isContractInUse = existingContractIds.includes(
  //       selectedContract.value
  //     );
  //     setDisable(isContractInUse);
  //   }
  // }, [selectedContract, existingContractIds]);

  const onSubmit = async (values) => {
    if (existingContractIds.includes(values?.contract_id?.value)) {
      toast.error(
        `Tạo công việc - Giao việc của HĐ ${values?.contract_id?.label}`
      );
      return;
    }

    if (isObjEmpty(errors)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

      setDisable(true);
      const result = await JobService.addJob({
        name: values?.name,
        description: values?.description || " ",
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

        toast.success("Thêm thành công");
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
                Công việc<span className="text-danger">*</span>
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
              className={classnames({
                "is-invalid": errors["jobDate"],
              })}
              innerRef={register}
              render={({ field }) => (
                <DatePicker
                  name="jobDate"
                  id="jobDate"
                  className={classnames(
                    "form-control",
                    errors.jobDate?.message
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

export default AddJob;
