// ** React Import
import { yupResolver } from "@hookform/resolvers/yup";
import { checkauth, selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
// ** Custom Components

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import classnames from "classnames";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { Download } from "react-feather";
import XLSX from "xlsx";
// ** Store & Actions

import "./edit_warehouse.scss";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_BLOOD } from "../../../../../constants/validation";
import BloodService from "../../../../../services/BloodService";
import BloodDetailService from "../../../../../services/BloodDetailService";
import importMaterialTransaction from "./IMPORT_WAREHOUSE_IN.xlsx";

import { useSelector } from "react-redux";
import { MANAGEMENT } from "../../../../../constants/app";
import HospitalService from "../../../../../services/HospitalService";

const schema = yup.object(SCHEMA_ADD_BLOOD).required();

const statusOption = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};

const bloodOption = {
  AD: { value: "AD", label: "A +", number: 1 },
  AA: { value: "AA", label: "A -", number: 2 },
  ARhD: { value: "ARhD", label: "A Rh +", number: 3 },
  ARhA: { value: "ARhA", label: "A Rh -", number: 4 },

  BD: { value: "BD", label: "B +", number: 5 },
  BA: { value: "BA", label: "B -", number: 6 },
  BRhD: { value: "BRhD", label: "B Rh +", number: 7 },
  BRhA: { value: "BRhA", label: "B Rh -", number: 8 },

  OD: { value: "OD", label: "O +", number: 9 },
  OA: { value: "OA", label: "O -", number: 10 },
  ORhD: { value: "ORhD", label: "O Rh +", number: 11 },
  ORhA: { value: "ORhA", label: "O Rh -", number: 12 },

  ABD: { value: "ABD", label: "AB +", number: 13 },
  ABA: { value: "ABA", label: "AB -", number: 14 },
  ABRhD: { value: "ABRhD", label: "AB Rh +", number: 15 },
  ABRhA: { value: "ABRhA", label: "AB Rh -", number: 16 },
};

const MaterialTransactionTab = ({ initial }) => {
  const [hospitals, setHospital] = useState([]);

  const valueItems =
    initial?.bloodDetail?.length > 0 &&
    initial?.bloodDetail?.map((item, index) => ({
      ids: item?.id,
      bloodName: bloodOption[item?.bloodName],
      qty: item?.qty,
    }));

  const [disable, setDisable] = useState(false);

  const initialValues = {
    transactionCodes: initial?.transactionCodes,
    addDate: initial?.transactionDate
      ? new Date(moment(initial?.transactionDate, "DD-MM-YYYY").toDate())
      : null,
    hospital_id: {
      value: initial?.hospital?.id,
      label: initial?.hospital?.name,
    },
    status: statusOption[initial?.status],
    description: initial?.description || "",
    items: valueItems || [],
  };

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    (async () => {
      const data = await HospitalService.getAllHospital({
        status: "ACTIVE",
      });
      setHospital(data?.data);
    })();
  }, []);

  const history = useHistory();
  const userData = useSelector((state) => state?.auth?.userData);

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.MATERIALBALANCE
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthimport = checkauth(role, auth, "I");

  const onSubmit = async (values) => {
    console.log(values);

    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await BloodService.updateBlood({
        transactionCodes: initial?.transactionCodes,
        bloodtype: initial?.bloodtype,
        hospital_id: values?.hospital_id?.value,
        transactionDate: moment(values?.addDate).format("DD/MM/YYYY"),
        description: values?.description || "",
        status: values?.status?.value,
      });

      if (result.isSuccess) {
        if (values?.items?.length > 0) {
          const promiseItem = values?.items?.map((item) => {
            if (initial?.bloodDetail?.length > 0) {
              var findId = initial?.bloodDetail?.find(function (obj) {
                return obj.id === item?.ids;
              });

              if (findId) {
                return BloodDetailService.updateBloodDetail({
                  id: item?.ids,
                  transactionCode: initial?.transactionCodes,
                  bloodName: item?.bloodName?.value,
                  hospital_id: values?.hospital_id?.value,
                  qty: parseInt(item?.qty || 0),
                  status: values?.status?.value,
                });
              } else {
                return BloodDetailService.addBloodDetail({
                  transactionCode: initial?.transactionCodes,
                  bloodName: item?.bloodName?.value,
                  hospital_id: values?.hospital_id?.value,
                  qty: parseInt(item?.qty || 0),
                  status: values?.status?.value,
                });
              }
            }
          });

          Promise.all(promiseItem).then(() => {
            setDisable(false);
            reset();

            toast.success("Cập nhật thành công");
            history.push("/apps/blood/list");
          });
        }
      } else {
        setDisable(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const columnNames = jsonData.shift();

      const filteredArray = jsonData.filter((subArr) =>
        subArr.some((element) => element !== undefined && element !== "")
      );

      const dataArray = filteredArray.map((row) => {
        const obj = {};
        columnNames.forEach((column, index) => {
          obj[column] = row[index];
        });
        return obj;
      });

      const dataItem = dataArray.map((item, index) => {
        return {
          qty: item?.QTY,
          bloodlName: item?.MATERIAL_NAME,
        };
      });
      reset({ items: [] });
      setValue("items", dataItem);
    };

    reader.readAsArrayBuffer(file);
  };

  const deleteItems = async (id) => {
    var checkId = initial?.bloodDetail?.find(function (obj) {
      return obj.id === id;
    });
    if (checkId) {
      await BloodDetailService.deleteBloodDetail(id);
    }
  };

  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <CardTitle>
            Chỉnh sửa
            {(initial?.bloodtype === 1 && " Nhập ") ||
              (initial?.bloodtype === 2 && " Xuất ")}
            kho
          </CardTitle>
          <Row>
            <Col sm="4">
              <FormGroup>
                <Label for="transactionCodes">
                  Mã giao dịch <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="transactionCodes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled
                      className={classnames({
                        "is-invalid": errors["transactionCodes"],
                      })}
                      {...field}
                    />
                  )}
                />
                <small className="text-danger">
                  {errors?.transactionCodes && errors.transactionCodes.message}
                </small>
              </FormGroup>
            </Col>

            <Col sm="4" className="d-flex flex-column">
              <Label>
                Ngày{" "}
                {(initial?.bloodtype === 1 && " nhập ") ||
                  (initial?.bloodtype === 2 && " xuất ")}{" "}
                <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                name="addDate"
                className={classnames({
                  "is-invalid": errors["addDate"],
                })}
                innerRef={register}
                render={({ field }) => (
                  <DatePicker
                    name="addDate"
                    id="addDate"
                    className={
                      errors.addDate?.message
                        ? "datepicker border border-danger"
                        : "datepicker"
                    }
                    innerRef={register}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    dateFormat="dd-MM-y"
                    selected={field.value}
                    value={field.value}
                    selectsStart
                    maxDate={new Date()}
                  />
                )}
              />
              <small className="text-danger pt-1">
                {errors.addDate?.message}
              </small>
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
                        {
                          value: "deactive",
                          label: "Ngừng hoạt động",
                          number: 2,
                        },
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
                <Label>
                  Bệnh viện:<span className="text-danger">*</span>
                </Label>
                <Controller
                  control={control}
                  name="hospital_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Chọn bệnh viện"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: errors.hospital_id?.message
                            ? "1px solid red"
                            : "",
                        }),
                      }}
                      options={
                        hospitals?.length > 0
                          ? hospitals?.map((item, index) => {
                              return {
                                value: item?.id,
                                label: `${item?.name}`, // Gán tên bệnh viện vào nhãn (label)
                                number: index + 1,
                              };
                            })
                          : []
                      }
                      value={field.value} // Giá trị hiện tại của trường hospital_id
                      onChange={field.onChange} // Cập nhật giá trị khi người dùng chọn
                      {...field}
                    />
                  )}
                />
                <small className="text-danger">
                  {errors?.hospital_id && errors.hospital_id.message}
                </small>
              </FormGroup>
            </Col>

            <Col sm="12">
              <FormGroup>
                <Label for="content">Ghi chú</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Input type="textarea" {...field} />}
                />
                <small className="text-danger">
                  {errors?.description && errors.description.message}
                </small>
              </FormGroup>
            </Col>
          </Row>

          <Col className="d-flex mt-1 mb-2" style={{ marginLeft: "-1rem" }}>
            <Button type="button" color="success" onClick={() => append({})}>
              Thêm
            </Button>
          </Col>

          <CardTitle>
            Chi tiết{" "}
            {(initial?.bloodtype === 1 && " nhập ") ||
              (initial?.bloodtype === 2 && " xuất ")}{" "}
            kho
          </CardTitle>
          <Row className="pb-2">
            <Col sm="10">
              <div className="d-lg-flex d-none d-md-flex  mt-md-0 mt-1" sm="6">
                {isAuthimport && (
                  <>
                    <Button
                      color="dark"
                      outline
                      tag={Label}
                      size="md"
                      type="button"
                    >
                      <Download size={14} />{" "}
                      <span className="align-middle ms-25">
                        Import
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          hidden
                          accept="xlsx/*"
                        />
                      </span>
                    </Button>
                  </>
                )}

                {isAuth && (
                  <Link
                    to={importMaterialTransaction}
                    className="align-middle ms-25 pl-2 pt-0 text-secondary "
                    target="_blank"
                    download
                  >
                    {" "}
                    <Download size={14} /> Download template
                  </Link>
                )}
              </div>
            </Col>
          </Row>

          {fields.map((item, index) => (
            <Row key={item.ids}>
              <Col sm="4">
                <FormGroup>
                  <Label for={`items[${index}].bloodName`}>
                    Nhóm máu <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name={`items[${index}].bloodName`}
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        placeholder="Chọn nhóm máu"
                        classNamePrefix="select"
                        className={classnames({
                          "is-invalid": errors?.items?.[index]?.bloodName,
                          "react-select": true,
                        })}
                        options={[
                          { value: "AD", label: "A +", number: 1 },
                          { value: "AA", label: "A -", number: 2 },
                          { value: "ARhD", label: "A Rh +", number: 3 },
                          { value: "ARhA", label: "A Rh -", number: 4 },

                          { value: "BD", label: "B +", number: 5 },
                          { value: "BA", label: "B -", number: 6 },
                          { value: "BRhD", label: "B Rh +", number: 7 },
                          { value: "BRhA", label: "B Rh -", number: 8 },

                          { value: "OD", label: "O +", number: 9 },
                          { value: "OA", label: "O -", number: 10 },
                          { value: "ORhD", label: "O Rh +", number: 11 },
                          { value: "ORhA", label: "O Rh -", number: 12 },

                          { value: "ABD", label: "AB +", number: 13 },
                          { value: "ABA", label: "AB -", number: 14 },
                          { value: "ABRhD", label: "AB Rh +", number: 15 },
                          { value: "ABRhA", label: "AB Rh -", number: 16 },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        {...field}
                      />
                    )}
                  />
                  <small className="text-danger">
                    {errors?.items?.[index]?.bloodName &&
                      errors.items[index].bloodName.message}
                  </small>
                </FormGroup>
              </Col>

              <Col sm="4">
                <FormGroup>
                  <Label for={`items[${index}].qty`}>Số lượng máu(ml):</Label>

                  <Controller
                    name={`items[${index}].qty`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Số lượng máu"
                        {...field}
                      />
                    )}
                  />
                </FormGroup>
              </Col>

              <FormGroup className="d-flex btn-action">
                <Button
                  type="button"
                  color="danger"
                  onClick={() => {
                    deleteItems(item?.ids); // Gọi hàm deleteItems với item?.id
                    return remove(index); // Sau đó xóa item trong useFieldArray
                  }}
                >
                  Xóa
                </Button>
              </FormGroup>
            </Row>
          ))}

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
                  history.push("/apps/blood/list");
                }}
              >
                Huỷ
              </Button.Ripple>
            </FormGroup>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};
export default MaterialTransactionTab;
