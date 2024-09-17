import { yupResolver } from "@hookform/resolvers/yup";
import ContractService from "@services/ContractService";
import { isObjEmpty, selectThemeColors } from "@utils";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
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
import { useParams, useLocation } from "react-router-dom";
import * as yup from "yup";
import { SCHEMA_CONTRACT } from "../../../../../constants/validation";
import CustomerService from "../../../../../services/CustomerService";
import { useSelector } from "react-redux";
import JobfieldService from "@services/JobfieldService";
import UserService from "../../../../../services/UserService";
import OpportunityService from "../../../../../services/OpportunityService";
import moment from "moment";
import { MANAGEMENT } from "../../../../../constants/app";
import { checkauth } from "../../../../../utility/Utils";
import FormCreateAccount from "./createAccount";
import JobService from "../../../../../services/JobService";
import { uploadImage } from "../../../../../helper/common";



const schema = yup.object(SCHEMA_CONTRACT).required();

const AddContract = ({}) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const location = useLocation();
  const history = useHistory();
  const { inquiryId } = location.state || {};

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const roleData = userData?.role;
  const isAuthCreate = checkauth(roleData, auth, "C");

  const [isCreateAccount, setIsCreateAccount] = useState(false);

  const [customer, setCustomer] = useState();
  const [user, setUser] = useState();
  const [jobfield, setJobfield] = useState([]);
  const [inquiry, setInquiry] = useState([]);
  const [disable, setDisable] = useState(false);

  const [selectedFileContract, setSelectedFileContract] = useState(null);

 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      status: {
        value: "NEW",
        label: "Mới",
        number: 1,
      },

      processingStatus: {
        value: "CONTACT",
        label: "Đang thực hiện",
        number: 1,
      },
    },
  });

  useEffect(() => {
    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setCustomer(data);
    })();
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
      const { data } = await OpportunityService.getAll({
        status: "ACTIVE",
      });
      setInquiry(data);
      if (inquiryId) {
        const inquiryOption = data.find(
          (item) => item.id === parseInt(inquiryId)
        );
        setValue("inquiry_id", {
          value: inquiryOption?.id,
          label: inquiryOption?.name,
        });
      }
    })();
  }, []);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

      setDisable(true);
      const result = await ContractService.addContract({
        contract_number_information: values?.contract_number_information,
        name: values?.name,
        duration: values?.duration || "",
        description: values?.description || " ",
        note: values?.note || "",
        status: values?.status.value,
        processingStatus: values?.processingStatus.value,
        createDate:
          moment(values?.createDate).format("YYYY/MM/DD") || formattedDate,
        signing_date: moment(values?.signing_date).format("YYYY/MM/DD"),
        customer_code: values.customer_code && values.customer_code.value,
        user_code: values.user_code && values.user_code.value,
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
        inquiry_id:
          parseInt(values.inquiry_id && values.inquiry_id.value) || null,
        file_contract: values?.file_contract || null,
      });

      if (result.isSuccess) {
        console.log(result);
        const data = await JobService.addJob({
          name: values?.contract_number_information,
          description: " ",
          status: result?.data?.status,
          workstatusJob: "NOPROCESS",
          user_code: values.user_code && values.user_code.value,
          jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
          contract_id: result?.data?.id,
          createDate: moment(values?.signing_date).format("YYYY/MM/DD"),
          jobDate: moment(values?.signing_date).format("YYYY/MM/DD"),
        });
        if (data.isSuccess) {
          setDisable(false);
          reset();

          toast.success("Thêm thành công");
          history.push("/apps/contract/list");
        } else {
          setDisable(false);
        }
      } else {
        setDisable(false);
      }
    }
  };

  // hanlde upload file
  useEffect(() => {
    handleFileContractUpload();
  }, [selectedFileContract]);

  const handleFileContractUpload = async () => {
    if (!selectedFileContract) {
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFileContract);
    try {
      const res = await uploadImage(formData);
      if (res && res?.trim()) {
        setValue("file_contract", res?.trim());
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle file attach
  const handleFileChange = (event) => {
    try {
      const file = event.target.files[0];
      if (file?.size > 10485760) {
        toast.error("Maximum image size is only 10MB");
        return null;
      }
      setSelectedFileContract(event.target.files[0]); // Get the selected file

    } catch (error) {
      console.log(error);
      toast.error("Lỗi attach file");
    }
  };

  const getInfoCreated = (value) => {
    setCustomer((prev) => [...prev, value]);
    setValue("customer_code", {
      value: value,
      label: `${value?.code} - ${value?.name}`,
      number: customer.length,
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="3" className="section">
            <FormGroup>
              <Label>
                Số hợp đồng<span className="text-danger">*</span>
              </Label>
              <Controller
                name="contract_number_information"
                control={control}
                render={({ field }) => (
                  <Input
                    className={classnames({
                      "is-invalid": errors["contract_number_information"],
                    })}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.contract_number_information &&
                  errors.contract_number_information.message}
              </small>
            </FormGroup>
          </Col>
          <Col sm="3" className="section">
            <FormGroup>
              <Label>
                Tên hợp đồng<span className="text-danger">*</span>
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

          <Col md="3" className="section">
            <FormGroup>
              <Label>Nguồn nhu cầu</Label>
              <Controller
                control={control}
                name="inquiry_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn nguồn nhu cầu"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.inquiry_id?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      inquiry?.length > 0
                        ? inquiry?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.id} - ${item?.jobfield?.name}`,
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
                {errors?.inquiry_id && errors.inquiry_id.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="3" className="section">
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

          <Col md="3" className="section">
            <FormGroup>
              <Label>Tình trạng xử lí:</Label>
              <Controller
                control={control}
                name="processingStatus"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className={classnames("react-select", {
                      "is-invalid": errors["processingStatus"],
                    })}
                    placeholder="Chọn tình trạng xử lí"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        // border: errors.status?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={[
                      {
                        value: "CONTACT",
                        label: "Đang thực hiện",
                        number: 1,
                      },
                      {
                        value: "Survey",
                        label: "Vướng mắc",
                        number: 2,
                      },
                      {
                        value: "NEGOTIATION",
                        label: "Quá hạn",
                        number: 3,
                      },

                      {
                        value: "SURNOTIMPLEMENTEDVEY",
                        label: "Hoàn thành",
                        number: 4,
                      },
                      {
                        value: "CONTRACT",
                        label: "Đã thanh toán",
                        number: 5,
                      },
                    ]}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.processingStatus && errors.processingStatus.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="3" className="section">
            <FormGroup>
              <Label>
                Khách hàng: <span className="text-danger">*</span>
              </Label>
              {isAuthCreate && (
                <Label
                  className="cursor-pointer text-primary"
                  style={{ marginLeft: "7rem" }}
                  onClick={() => setIsCreateAccount(!isCreateAccount)}
                >
                  Tạo khách hàng mới
                </Label>
              )}
              <Controller
                control={control}
                name="customer_code"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Chọn khách hàng"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.customer_code?.message
                          ? "1px solid red"
                          : "",
                      }),
                    }}
                    options={
                      customer?.length > 0
                        ? customer?.map((item, index) => {
                            return {
                              value: item?.code,
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
                {errors?.customer_code && errors.customer_code.message}
              </small>
            </FormGroup>
          </Col>

          <Col md="3" className="section">
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

          <Col md="3" className="section">
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

          {isCreateAccount && (
            <Col md="12">
              <FormCreateAccount
                getInfoCreated={getInfoCreated}
                CustomerService={CustomerService}
                setIsCreateAccount={setIsCreateAccount}
              />
            </Col>
          )}

          <Col sm="3" className="section">
            <FormGroup>
              <Label>Ngày ký</Label>
              <Controller
                control={control}
                name="signing_date"
                className={classnames("form-control", {
                  "is-invalid": errors["signing_date"],
                })}
                innerRef={register}
                render={({ field }) => (
                  <DatePicker
                    name="signing_date"
                    id="signing_date"
                    className={
                      errors.signing_date?.message
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
                {errors.signing_date?.message}
              </small>
            </FormGroup>
          </Col>
          <Col sm="3" className="section">
            <FormGroup>
              <Label>Thời hạn hợp đồng</Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    className={classnames({
                      "is-invalid": errors["duration"],
                    })}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.duration && errors.duration.message}
              </small>
            </FormGroup>
          </Col>
          <Col sm="3" className="section">
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

          <Col sm="12" className="section">
            <FormGroup>
              <Label>Chi tiết hợp đồng</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input type="textarea" {...field} />}
              />
            </FormGroup>
          </Col>

          <Col sm="12" className="section">
            <FormGroup>
              <Label>Ghi chú</Label>
              <Controller
                name="note"
                control={control}
                render={({ field }) => <Input type="textarea" {...field} />}
              />
            </FormGroup>
          </Col>

          {/* File attach */}
          <Col sm="12" className="section">
            <FormGroup>
            <label htmlFor="file_contract">File hợp đồng:</label>
            <input 
              type="file" 
              name = "file_contract"
              id="file_contract" 
              onChange={handleFileChange}
            />
            {selectedFileContract && <p>File attached: {selectedFileContract.name}</p>}
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
                history.push("/apps/contract/list");
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

export default AddContract;
