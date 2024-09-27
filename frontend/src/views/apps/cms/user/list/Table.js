import UserService from "@services/UserService";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { selectThemeColors } from "@utils";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Share } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import CustomLoader from "./../../../../components/custom/CustomLoader";

import ReactPaginate from "react-paginate";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";

import XLSX from "xlsx";
import { exportHeaderUser } from "../../../../../constants/export";
import ROLE from "../../../../../constants/role";
import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MANAGEMENT } from "../../../../../constants/app";
import "./style.scss";

const CustomHeader = (props) => {
  const { data, userData } = props;

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthCreate = checkauth(role, auth, "C");

  const statusObj = {
    ACTIVE: {
      text: "Đang hoạt động",
      bgr: "light-success",
    },
    DEACTIVE: {
      text: "Ngừng hoạt động",
      bgr: "light-danger",
    },
  };

  //hàm export sang file xlsx
  const handleExportXLSX = () => {
    if (data?.length <= 0) {
      return;
    }
    //đặt tên cột
    let tableXLSX = [
      {
        A: exportHeaderUser.CODE,
        B: exportHeaderUser.NAME,
        C: exportHeaderUser.USER_NAME,
        D: exportHeaderUser.PASSWORD,
        E: exportHeaderUser.ROLE,
        F: exportHeaderUser.STATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.code,
        B: row?.name,
        C: row?.username,
        D: row?.password,
        E: ROLE[row.role]?.text,
        F: statusObj[row.status]?.text,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderUser.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderUser.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderUser.EXPORT_WB);
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 mt-1 mb-75 d-lg-flex d-md-flex">
      <span className="d-lg-flex d-none d-md-flex">
        {isAuth && (
          <div className="d-flex mt-md-0 mt-1 mr-2">
            <Button
              color="dark"
              outline
              tag={Label}
              size="md"
              onClick={() => handleExportXLSX()}
            >
              <Share size={14} />
              <span className="align-middle ms-25">Export</span>
            </Button>
          </div>
        )}
      </span>
      {isAuthCreate && (
        <Link to="/apps/user/add">
          <Button color="dark" outline tag={Label} size="md">
            <span className="align-middle ms-25">Tạo nhân viên</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

const UsersList = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [total, setTotal] = useState();
  const [params, setParams] = useState({
    page: {
      page: 1,
      limit: 100,
    },
    filter: {
      username: null,
      name: null,
      phone: null,
      status: null,
      role: null,
      gender: null,
      company_id: undefined,
    },
    sort: {
      by: "id",
      type: "desc",
    },
  });
  const [loading, setLoading] = useState();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onSubmit = (data) => {
    setParams((prev) => {
      return {
        ...prev,
        filter: {
          ...data,
          status: data?.status?.value,
          username: data?.username?.trim() || null,
          name: data?.name?.trim() || null,
          role: data?.role?.value,
          company_id: undefined,
        },
        page: {
          ...prev.page,
          page: 1,
        },
      };
    });
    setCurrentPage(1);
  };

  const handleGetlist = async (value) => {
    setLoading(true);
    const result = await UserService.getListUser(params);

    if (result.isSuccess) {
      setData(result.data.list);
      setTotal(
        Number(Math.ceil(result.data.count / (params.page.limit || 10)))
      );
    } else {
    }
    setLoading(false);
  };

  const [params1, setParams1] = useState({
    filter: {},
    sort: {
      by: "id",
      type: "desc",
    },
    page: {
      page: 1,
      limit: 10,
    },
  });

  const handleSort = async (column, sortDirection) => {
    setParams((prev) => {
      return {
        ...prev,
        sort: {
          sortBy: column.sortField,
          sortDirection,
        },
      };
    });
  };

  const customStyles = {
    rows: {
      style: {
        "&:last-of-type": {
          // fontFamily: "Montserrat, Helvetica, Arial, serif",
          // color: "#rgba(0,0,0,0.87)",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#e3e3e3",
        },
      },
    },
  };

  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={total || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => {
          setParams((prev) => {
            return {
              ...prev,
              page: {
                ...prev.page,
                page: page.selected + 1,
              },
            };
          });
          setCurrentPage(page.selected + 1);
        }}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pr-1"
        }
      />
    );
  };
  const [isCheck, setIscheck] = useState(false);

  useEffect(() => {
    handleGetlist();
  }, [params]);

  return (
    <Fragment>
      <Card>
        <Button
          onClick={() => {
            setIscheck(!isCheck);
          }}
          className="d-lg-none d-flex d-md-none text-center justify-content-center  text-white"
        >
          <span className="text-center">
            {" "}
            {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
          </span>
        </Button>
        {isCheck && (
          <CardBody className="d-lg-none d-flex d-md-none">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="4" className="mb-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Tên" {...field} />
                    )}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Tên đăng nhập" {...field} />
                    )}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        classNamePrefix="select"
                        placeholder="Chọn vai trò"
                        options={[
                          { value: null, label: "Chọn vai trò", number: 0 },

                          { value: "STAFF", label: "Nhân viên", number: 1 },
                          {
                            value: "ADMIN",
                            label: "Quản trị viên",
                            number: 2,
                          },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col md="4" className="mb-2">
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
                        options={[
                          { value: null, label: "Chọn trạng thái", number: 0 },
                          {
                            value: "active",
                            label: "Đang hoạt động",
                            number: 2,
                          },
                          {
                            value: "deactive",
                            label: "Ngừng hoạt động",
                            number: 3,
                          },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col md="4">
                  {" "}
                  <Row className="mt-1">
                    <Button.Ripple
                      color="primary"
                      className="mx-1"
                      type="submit"
                    >
                      Tìm kiếm
                    </Button.Ripple>
                  </Row>
                </Col>
              </Row>
            </Form>
          </CardBody>
        )}
        <CardBody className="d-lg-flex d-none d-md-flex flex-grow-1">
          <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
            <Row className="mx-0 my-1 align-items-center d-lg-flex d-none d-md-flex">
              <Col md="2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input placeholder="Tên" {...field} />}
                />
              </Col>
              <Col md="2">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Tên đăng nhập" {...field} />
                  )}
                />
              </Col>

              <Col md="2">
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Chọn vai trò"
                      options={[
                        { value: null, label: "Chọn vai trò", number: 0 },

                        { value: "STAFF", label: "Nhân viên", number: 1 },
                        {
                          value: "ADMIN",
                          label: "Quản trị viên",
                          number: 2,
                        },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col md="2">
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
                      options={[
                        { value: null, label: "Chọn trạng thái", number: 0 },
                        { value: "active", label: "Đang hoạt động", number: 2 },
                        {
                          value: "deactive",
                          label: "Ngừng hoạt động",
                          number: 3,
                        },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col md="2">
                {" "}
                <Row>
                  <Button.Ripple color="primary" className="mx-1" type="submit">
                    Tìm kiếm
                  </Button.Ripple>
                </Row>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <hr></hr>
        <div className="">
          <DataTable
            noHeader
            pagination
            subHeader
            responsive
            paginationServer
            columns={Columns(userData, handleGetlist)}
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            className="react-dataTable table-list-user"
            paginationComponent={CustomPagination}
            data={data}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            subHeaderComponent={
              <CustomHeader
                setParams={setParams}
                setCurrentPage={setCurrentPage}
                data={data}
                userData={userData}
              />
            }
            noDataComponent={<div className="my-5">Không có dữ liệu</div>}
            customStyles={customStyles}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UsersList;
