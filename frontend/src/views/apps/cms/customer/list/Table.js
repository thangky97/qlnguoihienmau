import CustomerService from "@services/CustomerService";
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
import { exportHeaderCustomer } from "../../../../../constants/export";
import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
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
        A: exportHeaderCustomer.CODE,
        B: exportHeaderCustomer.NAME,
        C: exportHeaderCustomer.PHONE,
        D: exportHeaderCustomer.EMAIL,
        E: exportHeaderCustomer.BIRTHDAY,
        F: exportHeaderCustomer.WEIGHT,
        G: exportHeaderCustomer.HEIGHT,
        H: exportHeaderCustomer.NHOMMAU,
        I: exportHeaderCustomer.HUYETAP,
        J: exportHeaderCustomer.HEMOGLOBIN,
        K: exportHeaderCustomer.LUONGMAUHIEN,
        L: exportHeaderCustomer.TINHTRANGBENHLY,
        M: exportHeaderCustomer.TIENSUSDTHUOC,
        N: exportHeaderCustomer.ADDRESS,
        O: exportHeaderCustomer.STATUS,
        P: exportHeaderCustomer.DUCHITIEUHIEN,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.code,
        B: row?.name,
        C: row?.phone,
        D: row?.email,
        E: row?.date_birthday,
        F: row?.weight,
        G: row?.height,
        H: row?.nhommau,
        I: row?.huyetap,
        J: row?.hemoglobin,
        K: row?.luongmauhien,
        L: row?.tinhtrangbenhly,
        M: row?.tieususdthuoc,
        N: row?.address,
        O: statusObj[row.status]?.text,
        P: row?.duchitieuhien,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderCustomer.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderCustomer.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderCustomer.EXPORT_WB);
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
        <Link to="/apps/customer/add">
          <Button color="dark" outline tag={Label} size="md">
            <span className="align-middle ms-25">Thêm người hiến máu</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

const CustomerList = () => {
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
      name: null,
      phone: null,
      email: null,
      status: null,
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
          name: data?.name?.trim() || null,
          email: data?.email?.trim() || null,
          phone: data?.phone?.trim() || null,
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
    const result = await CustomerService.getListCustomer(params);

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
          <CardBody className="d-lg-none d-flex d-md-none">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="3" className="mb-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Tên" {...field} />
                    )}
                  />
                </Col>
                <Col md="3" className="mb-2">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Số điện thoại" {...field} />
                    )}
                  />
                </Col>
                <Col md="3" className="mb-2">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Email" {...field} />
                    )}
                  />
                </Col>
                <Col md="3">
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
                <Col md="3">
                  <Button.Ripple color="primary" className="mx-1" type="submit">
                    Tìm kiếm
                  </Button.Ripple>
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
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Số điện thoại" {...field} />
                  )}
                />
              </Col>
              <Col md="2">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Email" {...field} />
                  )}
                />
              </Col>
              <Col md="3">
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
                <Button.Ripple color="primary" className="mx-1" type="submit">
                  Tìm kiếm
                </Button.Ripple>
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
            className="react-dataTable table-list-customer"
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

export default CustomerList;
