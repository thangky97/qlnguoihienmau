import { yupResolver } from "@hookform/resolvers/yup";
import OpportunityService from "@services/OpportunityService";
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

import * as yup from "yup";
import { SCHEMA_INQUIRYY } from "../../../../../constants/validation";
import CustomerService from "../../../../../services/CustomerService";
import { useSelector } from "react-redux";
import JobfieldService from "@services/JobfieldService";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT } from "./../../../../../constants/app";
import FormCreateAccount from "./createAccount";
import UserService from "../../../../../services/UserService";
import moment from "moment";

const schema = yup.object(SCHEMA_INQUIRYY).required();

const AddInquiry = ({}) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const roleData = userData?.role;
  const isAuthCreate = checkauth(roleData, auth, "C");
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [createdDate, setCreatedDate] = useState(null);

  const [customer, setCustomer] = useState();
  const [jobfield, setJobfield] = useState([]);
  const [disable, setDisable] = useState(false);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
      processingStatus: {
        value: "tiepXuc",
        label: "Tiếp Xúc",
        number: 1,
      },
    },
  });

  const optionValues = [
    {
      value: "tiepXuc",
      label: "Tiếp xúc",
      number: 1,
    },
    {
      value: "khaoSat",
      label: "Khảo sát",
      number: 2,
    },
    {
      value: "baoGia",
      label: "Báo Giá",
      number: 3,
    },

    {
      value: "dangThuongThao",
      label: "Đang Thương Thảo",
      number: 4,
    },
    {
      value: "khongThucHien",
      label: "Không Thực Hiện",
      number: 5,
    },
    {
      value: "kyHD",
      label: "Ký HĐ",
      number: 6,
    },
  ];

  useEffect(() => {
    // // set default value
    setCreatedDate(new Date());
    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setCustomer(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setJobfield(data);
    })();
  }, []);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const defaultcreatdate = new Date();

      const result = await OpportunityService.add({
        name: values?.name || "",
        description: values?.description || " ",
        note: values?.note || " ",
        status: values?.status.value,
        processingStatus: values?.processingStatus.value,
        customer_code: values.customer_code && values.customer_code.value,
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
        inquiry_date: createdDate || defaultcreatdate,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Thêm thành công");
        history.push("/apps/inquiry/list");
      } else {
        setDisable(false);
      }
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
          {/* <Col md="4" className="section">
            <FormGroup>
              <Label>
                Tên nhu cầu<span className="text-danger">*</span>
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
          </Col> */}
          {/* <Col md="4" className="section">
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
                        label: "Ngừng hoạt động",
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
          </Col> */}

          <Col md="2" className="section">
            <FormGroup>
              <label>Ngày tạo:</label>
              <DatePicker
                className="datepicker"
                selected={createdDate}
                onChange={(date) => setCreatedDate(date)}
                dateFormat="dd/MM/yyyy"
              />
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

          <Col md="6" className="section">
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
                              label: `${item?.name} - MST: ${item?.tax_code}`,
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

          {isCreateAccount && (
            <Col md="12">
              <FormCreateAccount
                getInfoCreated={getInfoCreated}
                CustomerService={CustomerService}
                setIsCreateAccount={setIsCreateAccount}
              />
            </Col>
          )}

          <Col sm="12" className="section">
            <FormGroup>
              <Label>Mô tả nhu cầu</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input type="textarea" {...field} />}
              />
            </FormGroup>
          </Col>

          <Col md="4" className="section">
            <FormGroup>
              <Label>Tình trạng:</Label>
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
                    placeholder="Chọn tình trạng"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        // border: errors.status?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={optionValues}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.processingStatus && errors.processingStatus.message}
              </small>
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
                "Lưu lại"
              )}
            </Button.Ripple>
            <Button.Ripple
              outline
              color="secondary"
              onClick={() => {
                history.push("/apps/inquiry/list");
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

export default AddInquiry;
