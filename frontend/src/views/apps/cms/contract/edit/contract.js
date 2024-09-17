import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Modal, ModalHeader, ModalBody, ModalFooter , UncontrolledAlert } from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

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

import ContractService from "@services/ContractService";
import CustomerService from "@services/CustomerService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_CONTRACT } from "../../../../../constants/validation";
import { isObjEmpty } from "../../../../../utility/Utils";
import JobfieldService from "@services/JobfieldService";
import UserService from "../../../../../services/UserService";
import OpportunityService from "../../../../../services/OpportunityService";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { uploadImage } from "../../../../../helper/common";


const statusObject = {
  NEW: { value: "NEW", label: "Mới", number: 1 },
  INPROCESS: { value: "INPROCESS", label: "Đang tiến hành", number: 2 },
  COMPLETED: { value: "COMPLETED", label: "Hoàn thành", number: 3 },
};
const processingStatusObject = {
  CONTACT: {
    value: "CONTACT",
    label: "Đang thực hiện",
    number: 1,
  },
  Survey: {
    value: "Survey",
    label: "Vướng mắc",
    number: 2,
  },
  NEGOTIATION: {
    value: "NEGOTIATION",
    label: "Quá hạn",
    number: 3,
  },
  SURNOTIMPLEMENTEDVEY: {
    value: "SURNOTIMPLEMENTEDVEY",
    label: "Hoàn thành",
    number: 4,
  },
  CONTRACT: {
    value: "CONTRACT",
    label: "Đã thanh toán",
    number: 5,
  },
};

const schema = yup.object(SCHEMA_CONTRACT).required();

const ContractTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);
  const [customer, setCustomer] = useState();
  const [user, setUser] = useState();
  const [jobfield, setJobfield] = useState();
  const [inquiry, setInquiry] = useState();

  const [showConfirm, setShowConfirm] = useState(false);
  const [contractStatus, setContractStatus] = useState(null);
  const [contractId, setContractId] = useState(null);


  const [selectedFileContract, setSelectedFileContract] = useState(null);


  const initialValues = {
    ...initial,
    status: statusObject[initial.status],
    customer_code: {
      value: initial?.customer?.code,
      label: `${initial?.customer?.code} - ${initial?.customer?.name}`,
    },
    processingStatus: processingStatusObject[initial.processingStatus],
    user_code: {
      value: initial?.contractUser?.code,
      label: `${initial?.contractUser?.code} - ${initial?.contractUser?.name} - ${initial?.contractUser?.username}`,
    },
    jobfield_id: {
      value: initial?.jobfield?.id,
      label: `${initial?.jobfield?.code} - ${initial?.jobfield?.name}`,
    },
    inquiry_id: initial?.inquiry 
    ? {
        value: initial.inquiry.id,
        label: `${initial.inquiry.name}`,
      }
    : null,
    createDate: new Date(moment(initial?.createDate, "YYYY/MM/DD").toDate()),
    signing_date: new Date(
      moment(initial?.signing_date, "YYYY/MM/DD").toDate()
    ),

    file_contract: initial?.file_contract || null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
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
    })();

    // (async () => {
    //   setSelectedFileContract(initial?.file_contract);
    // })();
  }, []);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

      setDisable(true);
      const result = await ContractService.updateContract({
        id: initial.id,
        contract_number_information: values?.contract_number_information,
        name: values?.name,
        duration: values?.duration,
        description: values?.description || "",
        note: values?.note || "",
        status: values?.status.value,
        processingStatus: values?.processingStatus.value,
        createDate:
          moment(values?.createDate).format("YYYY/MM/DD") || formattedDate,
        signing_date: moment(values?.createDate).format("YYYY/MM/DD"),
        customer_code: values.customer_code && values.customer_code.value,
        user_code: values.user_code && values.user_code.value,
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
        inquiry_id:
          parseInt(values.inquiry_id && values.inquiry_id.value) || null,

        file_contract: values?.file_contract || null,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();
        toast.success("Cập nhật hợp đồng thành công");
        // Open confirmation dialog
        // Save contract ID and status to state
        setContractId(initial.id);
        setContractStatus(values?.processingStatus.value);

        setShowConfirm(true);
        // toast.success("Cập nhật thành công");
        // history.push("/apps/contract/list");
      } else {
        setDisable(false);
      }
    }
  };


  const handleConfirmYes = async () => {
    setShowConfirm(false);

    // Call the API to update Job and Task according to the Contract status
    const updateResult = await ContractService.updateTasksStatus({
      contractId: contractId, 
      status: contractStatus,
    }); // Replace with your actual API call

    const result =updateResult.isSuccess; 
    if (result) {
      toast.success("Cập nhật trạng thái công việc thành công");
    } else {
      toast.error("Cập nhật trạng thái công việc thất bại"); // Optional: Handle failure case
    }


    // Navigate to contract list page
    history.push("/apps/contract/list");
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    // Navigate to contract list page
    history.push("/apps/contract/list");
  };


  // hanlde upload file

  // Load the existing file (if any) into the state when the component mounts
  useEffect(() => {
    if (initial?.file_contract) {
      // If there's an existing file, set it as the selected file
      setSelectedFileContract({ name: initial?.file_contract });
    }
  }, [initial?.file_contract]);

  useEffect(() => {
    if(selectedFileContract !== null && selectedFileContract?.name !== initial?.file_contract){
      handleFileContractUpload();
    }
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

  const handleFileRemove = () => {
    setSelectedFileContract(null);
    // Optionally reset the file input field
    setValue('file_contract','');
  };

  // end handle file upload

  return (
    <>

       {/* Confirmation Modal */}
       <Modal isOpen={showConfirm} toggle={() => setShowConfirm(false)}>
        <ModalHeader toggle={() => setShowConfirm(false)}>
          Xác nhận cập nhật công việc của hợp đồng
        </ModalHeader>
        <ModalBody>
          Bạn có muốn cập nhật trạng thái công việc theo trạng thái hợp đồng không?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleConfirmNo}>No</Button>
          <Button color="primary" onClick={handleConfirmYes}>Yes</Button>
        </ModalFooter>
      </Modal>

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
              <Label for="d">
                Tên hợp đồng <span className="text-danger">*</span>
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

          <Col md="3" className="section">
            <FormGroup>
              <Label>Nguồn nhu cầu:</Label>
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
                    value={field.value || null}  // Handle the case where field.value is undefined
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

          <Col md="3" className="section d-none">
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
                      {
                        value: "NEW",
                        label: "Mới",
                        number: 1,
                      },
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
                    placeholder="Chọn khách hàng"
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

          <Col sm="12" className="mt-1">
            <FormGroup>
              <Label for="name">Chi tiết hợp đồng</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input type="textarea" {...field} />}
              />
            </FormGroup>
          </Col>

          <Col sm="12" className="mt-1">
            <FormGroup>
              <Label for="name">Ghi chú</Label>
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
            
            {selectedFileContract && (
              <div className="file-info">
                <p>
                  File attached: {selectedFileContract.name}
                  &nbsp; &nbsp;
                  <a href="#" onClick={handleFileRemove} className="remove-button">
                    <i className="fas fa-times"></i> Bỏ đính kèm
                  </a>
                </p>
              </div>
            )}


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
export default ContractTab;
