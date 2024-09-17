import CompanyService from "@services/CompanyService";
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
import { Button, Card, Col, Form, Label, Row } from "reactstrap";

import XLSX from "xlsx";
import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MANAGEMENT } from "../../../../../constants/app";
import "./style.scss";

const CustomHeader = (props) => {
  const { data, userData } = props;

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.ADMIN
  )?.action;
  const role = userData?.role;

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

  const typeObj = {
    1: {
      text: "Chung",
    },
    2: {
      text: "Nhân viên",
    },
    3: {
      text: "Khách hàng",
    },
  };

  return (
    <div
      className="invoice-list-table-header w-100 mr-1 mb-75 d-lg-flex d-md-flex"
      style={{ marginLeft: "-0.7rem" }}
    >
      {/* {isAuth && (
        <div className="d-flex mt-md-0 mt-1 mr-2 ">
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
      )} */}
      {isAuthCreate && (
        <Link to="/apps/cms/company/add">
          <Button
            color="dark"
            outline
            tag={Label}
            size="md"
            style={{ lineHeight: "23px !important" }}
          >
            <span className="align-middle ms-25">Tạo công ty</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

const CompanyList = () => {
  const userData = useSelector((state) => state?.auth?.userData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [total, setTotal] = useState();
  const [params, setParams] = useState({
    page: {
      page: 1,
      limit: 10,
    },
    filter: {
      title: null,
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
          title: data?.title ? data?.title?.trim() : null,
          status: data?.status?.value,
          code: data?.code ? data?.code?.trim() : null,
          type: data?.type ? data?.type?.value : null,
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
    const result = await CompanyService.getListCompany(params);

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
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mx-0 mt-2 d-flex align-items-center justify-content-between d-lg-none d-flex d-md-none">
              <Col md="3" className="mb-1">
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
              <Col md="3">
                {" "}
                <Row>
                  <Button.Ripple color="primary" className="mx-1" type="submit">
                    Tìm kiếm
                  </Button.Ripple>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mx-0 my-1 align-items-center d-lg-flex d-none d-md-flex">
            <Col md="3" className="mb-1">
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
            <Col md="3" className="mt-1">
              {" "}
              <Row>
                <Button.Ripple color="primary" className="mx-1" type="submit">
                  Tìm kiếm
                </Button.Ripple>
              </Row>
            </Col>
          </Row>
        </Form>
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
            className="react-dataTable table-list-company"
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

export default CompanyList;
