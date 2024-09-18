import CategoryPostService from "@services/CategoryPostService";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { selectThemeColors } from "@utils";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Share } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import CustomLoader from "../../../../components/custom/CustomLoader";

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
import GENDER from "../../../../../constants/gender";
import ROLE from "../../../../../constants/role";
import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MANAGEMENT } from "../../../../../constants/app";
import "./style.scss";
import UserService from "../../../../../services/UserService";

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
        C: exportHeaderUser.PHONE,
        D: exportHeaderUser.USER_NAME,
        E: exportHeaderUser.PASSWORD,
        F: exportHeaderUser.GENDER,
        G: exportHeaderUser.ROLE,
        H: exportHeaderUser.STATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row.code,
        B: row.name,
        C: row.phone,
        D: row.username,
        E: row.password,
        F: GENDER[row.gender]?.text,
        G: ROLE[row.role]?.text,
        H: statusObj[row.status]?.text,
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
      {/* <span className="d-lg-flex d-none d-md-flex">
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
      </span> */}
    </div>
  );
};

const DepartmentList = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthCreate = checkauth(role, auth, "C");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [total, setTotal] = useState();
  const [params, setParams] = useState({
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
  const [loading, setLoading] = useState();

  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await UserService.get_all_operator({
        status: "ACTIVE",
      });
      setUser(data);
    })();
  }, []);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onSubmit = (data) => {
    setParams((prev) => {
      return {
        ...prev,
        filter: {
          ...data,
          status: data?.status?.value,
          name: data?.name?.trim() || null,
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
    const result = await CategoryPostService.getListCategoryPost(params);

    if (result.isSuccess) {
      setData(result.data.list);
      setTotal(
        Number(Math.ceil(result.data.count / (params.page.limit || 10)))
      );
    } else {
    }
    setLoading(false);
  };

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
          <CardBody className="d-flex align-items-center justify-content-between d-lg-none d-flex d-md-none">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm="4" className="mb-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Tên danh mục" {...field} />
                    )}
                  />
                </Col>
                <Col sm="4">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        placeholder="Trạng thái"
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
                  <Row className="mt-2">
                    <Button.Ripple
                      color="primary"
                      className="mx-1"
                      type="submit"
                    >
                      Tìm kiếm
                    </Button.Ripple>
                    {isAuthCreate && (
                      <Link to="/apps/category-post/add">
                        <Button color="dark" outline tag={Label} size="md">
                          <span className="align-middle ms-25">
                            Tạo danh mục
                          </span>
                        </Button>
                      </Link>
                    )}
                  </Row>
                </Col>
              </Row>
            </Form>
          </CardBody>
        )}
        <CardBody className="d-lg-flex d-none d-md-flex flex-grow-1">
          <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
            <Row className="mx-0 my-1 align-items-center d-lg-flex d-none d-md-flex">
              <Col md="3" className="mb-2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Tên danh mục" />
                  )}
                />
              </Col>
              <Col md="3" className="mb-2">
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
              <Col md="3" className="mb-2">
                <Button.Ripple color="primary" className="mx-1" type="submit">
                  Tìm kiếm
                </Button.Ripple>
                {isAuthCreate && (
                  <Link to="/apps/category-post/add">
                    <Button.Ripple color="secondary" className="mx-1">
                      Tạo danh mục
                    </Button.Ripple>
                  </Link>
                )}
              </Col>
            </Row>
          </Form>
        </CardBody>

        <div className="table-department">
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

export default DepartmentList;
