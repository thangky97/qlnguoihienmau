import InputPasswordToggle from "@components/input-password-toggle";
import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { isObjEmpty, selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Button,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import * as yup from "yup";

import UserService from "@services/UserService";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_UPDATE_USER } from "../../../../../constants/validation";
import { Lock } from "react-feather";

const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};
const roleObject = {
  STAFF: { value: "STAFF", label: "Nhân viên", number: 1 },
  ADMIN: { value: "ADMIN", label: "Quản trị viên", number: 2 },
};

const schema = yup.object(SCHEMA_UPDATE_USER).required();

const EmployeeTab = ({ initial }) => {
  const [loading, setLoading] = useState();

  const [disable, setDisable] = useState(false);
  const [checkRole, setcheckRole] = useState(initial?.role && initial?.role);

  const [job, setJob] = useState("");
  const [report, setReport] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");

  const _authorities = [
    {
      action: job,
      management: "JOB",
    },
    {
      action: report,
      management: "REPORT",
    },
    {
      action: user,
      management: "USER",
    },
    {
      action: category,
      management: "CATEGORY",
    },
  ];

  const authorities = _authorities.filter((item) => item.action !== "");

  useEffect(() => {
    for (let i = 0; i < initial?.authorities?.length; i++) {
      if (initial?.authorities[i]?.management == "JOB") {
        setJob((initial?.authorities[i]?.action).toString());
      }
    }
    for (let i = 0; i < initial?.authorities?.length; i++) {
      if (initial?.authorities[i]?.management == "REPORT") {
        setReport((initial?.authorities[i]?.action).toString());
      }
    }
    for (let i = 0; i < initial?.authorities?.length; i++) {
      if (initial?.authorities[i]?.management == "USER") {
        setUser((initial?.authorities[i]?.action).toString());
      }
    }
    for (let i = 0; i < initial?.authorities?.length; i++) {
      if (initial?.authorities[i]?.management == "CATEGORY") {
        setCategory((initial?.authorities[i]?.action).toString());
      }
    }
  }, []);

  const initialValues = {
    ...initial,
    status: statusObject[initial?.status],
    role: roleObject[initial?.role],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });
  const history = useHistory();

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result = await UserService.updateUser({
        code: initial.code,
        username: values.username.trim(),
        password: values.password.trim(),
        name: values.name.trim(),
        phone: values?.phone || " ",
        company_tax_code: values?.company_tax_code || " ",
        address: values?.address || " ",
        referral_source_id: null,
        department_id: null,
        gender: values.gender.value || "MALE",
        role: values.role.value,
        status: values.status.value,
        company_id: null,
        authorities,
        email: values.email || " ",
        verify: initial?.verify,
        branch_id: null,
      });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Sửa thành công");
        history.push("/apps/user/list");
      } else {
        setDisable(false);
      }
    }
  };

  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md="4">
          <FormGroup>
            <Label for="name">
              Tên <span className="text-danger">*</span>
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
            <Label for="username"> </Label>
            Tên đăng nhập <span className="text-danger">*</span>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  disabled
                  className={classnames({
                    "is-invalid": errors["username"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.username && errors.username.message}
            </small>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <div className="d-flex justify-content-between">
              <Label className="form-label" for="login-password">
                Mật khẩu<span className="text-danger">*</span>
              </Label>
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                  className={classnames({
                    "is-invalid": errors["password"],
                  })}
                  {...field}
                />
              )}
            />

            <small className="text-danger">
              {errors?.password && errors.password.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="4">
          <FormGroup>
            <Label>Vai Trò:</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select "
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.role?.message ? "1px solid red" : "",
                    }),
                  }}
                  options={[
                    { value: "STAFF", label: "Nhân viên", number: 1 },
                    {
                      value: "ADMIN",
                      label: "Quản trị viên",
                      number: 2,
                    },
                  ]}
                  value={field.value}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setcheckRole(e?.value);
                  }}
                  menuPortalTarget={document.body}
                />
              )}
            />
            <small className="text-danger">
              {errors?.role && errors.role.message}
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
                  placeholder="Select status"
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

        <Col md="4">
          <FormGroup>
            <Label for="email"> </Label>
            Email <span className="text-danger">*</span>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["email"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.email && errors.email.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="8">
          <FormGroup>
            <Label for="address"> </Label>
            Địa chỉ
            <Controller
              name="address"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormGroup>
        </Col>

        <Col sm="12" style={{ width: isMobile ? "350px" : "100vh" }}>
          <div className="permissions border mt-1">
            <h6 className="py-1 mx-1 mb-0 font-medium-2">
              <Lock size={18} className="mr-25" />
              <span className="align-middle">Phân quyền</span>
            </h6>
            <Table borderless striped responsive>
              <thead className="thead-light ">
                <tr>
                  <th>Quản lí</th>
                  <th>Thêm</th>
                  <th>Cập nhật</th>
                  <th>Xem</th>
                  <th>Xóa</th>
                  <th>Import</th>
                  <th>Export</th>
                </tr>
              </thead>
              <tbody>
                {/* Người dùng */}
                <tr>
                  <td>Người dùng</td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-1"
                      defaultChecked={user?.includes("C") ? true : false}
                      checked={user?.includes("C") ? true : false}
                      label=""
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("C"));
                        } else {
                          setUser((prev) => prev.replace("C", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-2"
                      label=""
                      defaultChecked={user?.includes("U") ? true : false}
                      checked={user?.includes("U") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("U"));
                        } else {
                          setUser((prev) => prev.replace("U", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-3"
                      label=""
                      defaultChecked={user?.includes("R") ? true : false}
                      checked={user?.includes("R") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("R"));
                        } else {
                          setUser((prev) => prev.replace("R", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-4"
                      label=""
                      defaultChecked={user?.includes("D") ? true : false}
                      checked={user?.includes("D") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("D"));
                        } else {
                          setUser((prev) => prev.replace("D", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-5"
                      label=""
                      defaultChecked={user?.includes("I") ? true : false}
                      checked={user?.includes("I") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("I"));
                        } else {
                          setUser((prev) => prev.replace("I", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="admin-6"
                      label=""
                      defaultChecked={user?.includes("E") ? true : false}
                      checked={user?.includes("E") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUser((prev) => prev.concat("E"));
                        } else {
                          setUser((prev) => prev.replace("E", ""));
                        }
                      }}
                    />
                  </td>
                </tr>

                {/* Danh mục */}
                <tr>
                  <td>Danh mục</td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-1"
                      label=""
                      defaultChecked={category?.includes("C") ? true : false}
                      checked={category?.includes("C") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("C"));
                        } else {
                          setCategory((prev) => prev.replace("C", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-2"
                      label=""
                      defaultChecked={category?.includes("U") ? true : false}
                      checked={category?.includes("U") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("U"));
                        } else {
                          setCategory((prev) => prev.replace("U", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-3"
                      label=""
                      defaultChecked={category?.includes("R") ? true : false}
                      checked={category?.includes("R") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("R"));
                        } else {
                          setCategory((prev) => prev.replace("R", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-4"
                      label=""
                      defaultChecked={category?.includes("D") ? true : false}
                      checked={category?.includes("D") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("D"));
                        } else {
                          setCategory((prev) => prev.replace("D", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-5"
                      label=""
                      defaultChecked={category?.includes("I") ? true : false}
                      checked={category?.includes("I") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("I"));
                        } else {
                          setCategory((prev) => prev.replace("I", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="category-6"
                      label=""
                      defaultChecked={category?.includes("E") ? true : false}
                      checked={category?.includes("E") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategory((prev) => prev.concat("E"));
                        } else {
                          setCategory((prev) => prev.replace("E", ""));
                        }
                      }}
                    />
                  </td>
                </tr>

                {/* Báo cáo */}
                <tr>
                  <td>Báo cáo</td>
                  <td>
                    {/* <CustomInput
                      type="checkbox"
                      id="report-1"
                      label=""
                      defaultChecked={
                        report?.includes("C") ? true : false
                      }
                      checked={report?.includes("C") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("C"));
                        } else {
                          setReport((prev) => prev.replace("C", ""));
                        }
                      }}
                    /> */}
                  </td>
                  <td>
                    {/* <CustomInput
                      type="checkbox"
                      id="report-2"
                      label=""
                      defaultChecked={
                        report?.includes("U") ? true : false
                      }
                      checked={report?.includes("U") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("U"));
                        } else {
                          setReport((prev) => prev.replace("U", ""));
                        }
                      }}
                    /> */}
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="report-3"
                      label=""
                      defaultChecked={report?.includes("R") ? true : false}
                      checked={report?.includes("R") ? true : false}
                      // disabled={
                      //   checkRole === "STAFF" || checkRole === "COMPANYADMIN"
                      //     ? false
                      //     : true
                      // }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("R"));
                        } else {
                          setReport((prev) => prev.replace("R", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    {/* <CustomInput
                      type="checkbox"
                      id="report-4"
                      label=""
                      defaultChecked={report?.includes("D") ? true : false}
                      checked={report?.includes("D") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("D"));
                        } else {
                          setReport((prev) => prev.replace("D", ""));
                        }
                      }}
                    /> */}
                  </td>
                  <td>
                    {/* <CustomInput
                      type="checkbox"
                      id="report-5"
                      label=""
                      defaultChecked={
                        report?.includes("I") ? true : false
                      }
                      checked={report?.includes("I") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("I"));
                        } else {
                          setReport((prev) => prev.replace("I", ""));
                        }
                      }}
                    /> */}
                  </td>

                  <td>
                    <CustomInput
                      type="checkbox"
                      id="report-6"
                      label=""
                      defaultChecked={report?.includes("E") ? true : false}
                      checked={report?.includes("E") ? true : false}
                      // disabled={
                      //   checkRole === "STAFF" || checkRole === "COMPANYADMIN"
                      //     ? false
                      //     : true
                      // }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReport((prev) => prev.concat("E"));
                        } else {
                          setReport((prev) => prev.replace("E", ""));
                        }
                      }}
                    />
                  </td>
                </tr>

                {/* Công việc - chi tiết công việc */}
                <tr>
                  <td>Công việc</td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-1"
                      label=""
                      defaultChecked={job?.includes("C") ? true : false}
                      checked={job?.includes("C") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("C"));
                        } else {
                          setJob((prev) => prev.replace("C", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-2"
                      label=""
                      defaultChecked={job?.includes("U") ? true : false}
                      checked={job?.includes("U") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("U"));
                        } else {
                          setJob((prev) => prev.replace("U", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-3"
                      label=""
                      defaultChecked={job?.includes("R") ? true : false}
                      checked={job?.includes("R") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("R"));
                        } else {
                          setJob((prev) => prev.replace("R", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-4"
                      label=""
                      defaultChecked={job?.includes("D") ? true : false}
                      checked={job?.includes("D") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("D"));
                        } else {
                          setJob((prev) => prev.replace("D", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-5"
                      label=""
                      defaultChecked={job?.includes("I") ? true : false}
                      checked={job?.includes("I") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("I"));
                        } else {
                          setJob((prev) => prev.replace("I", ""));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="checkbox"
                      id="job-6"
                      label=""
                      defaultChecked={job?.includes("E") ? true : false}
                      checked={job?.includes("E") ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setJob((prev) => prev.concat("E"));
                        } else {
                          setJob((prev) => prev.replace("E", ""));
                        }
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
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
              "Sửa"
            )}
          </Button.Ripple>
          <Button.Ripple
            outline
            color="secondary"
            onClick={() => {
              history.push("/apps/user/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};
export default EmployeeTab;
