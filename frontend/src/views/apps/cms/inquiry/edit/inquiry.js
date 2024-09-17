import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
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

import OpportunityService from "@services/OpportunityService";
import CustomerService from "@services/CustomerService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_INQUIRYY } from "../../../../../constants/validation";
import { isObjEmpty } from "../../../../../utility/Utils";
import JobfieldService from "@services/JobfieldService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};
const processingStatusObject = {
  tiepXuc: {
    value: "tiepXuc",
    label: "Tiếp xúc",
    number: 1,
  },
  khaoSat: {
    value: "khaoSat",
    label: "Khảo sát",
    number: 2,
  },
  baoGia: {
    value: "baoGia",
    label: "Báo giá",
    number: 3,
  },
  dangThuongThao: {
    value: "dangThuongThao",
    label: "Đang Thương Thảo",
    number: 4,
  },
  khongThucHien: {
    value: "khongThucHien",
    label: "Không Thực Hiện",
    number: 5,
  },
  kyHD: {
    value: "kyHD",
    label: "Ký HD",
    number: 6,
  },
};

const schema = yup.object(SCHEMA_INQUIRYY).required();

const InquiryTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);
  const [customer, setCustomer] = useState();
  const [jobfield, setJobfield] = useState();
  const [createdDate, setCreatedDate] = useState(null);

  const initialValues = {
    ...initial,
    status: statusObject[initial.status],
    processingStatus: processingStatusObject[initial.processingStatus],
    customer_code: {
      value: initial?.customer?.code,
      label: `${initial?.customer?.code} - ${initial?.customer?.name}`,
    },
    jobfield_id: {
      value: initial?.jobfield?.id,
      label: `${initial?.jobfield?.code} - ${initial?.jobfield?.name}`,
    },
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
      const result = await OpportunityService.update({
        id: initial.id,
        name: values?.name || "",
        description: values?.description || "",
        note: values?.note || "",
        status: values?.status.value,
        processingStatus: values?.processingStatus.value,
        customer_code: values.customer_code && values.customer_code.value,
        jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Cập nhật thành công");
        history.push("/apps/inquiry/list");
      } else {
        setDisable(false);
      }
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* <Col sm="4">
            <FormGroup>
              <Label for="d">
                Tên nhu cầu <span className="text-danger">*</span>
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
          </Col> */}

          {/* <Col md="4">
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
                        value: "ACTIVE",
                        label: "Hoạt động",
                        number: 1,
                      },
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
                              label: `${item?.code} -MST: ${item?.tax_code}`,
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

          <Col sm="12" className="mt-1">
            <FormGroup>
              <Label for="name">Mô tả</Label>
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
                    options={[
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
export default InquiryTab;
