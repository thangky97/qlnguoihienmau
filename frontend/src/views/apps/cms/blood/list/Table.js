import BloodDetailService from "../../../../../services/BloodDetailService";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { selectThemeColors } from "@utils";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Download, FileText, Share } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import CustomLoader from "./../../../../components/custom/CustomLoader";
// import importMaterial from "./IMPORT_MATERIAL.xlsx";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Label,
  Row,
  FormGroup,
} from "reactstrap";

import XLSX from "xlsx";
import { exportHeaderBlood } from "../../../../../constants/export";
import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";

import HospitalService from "../../../../../services/HospitalService";
import { MANAGEMENT } from "../../../../../constants/app";
import "./style.scss";

const CustomHeader = (props) => {
  const { data, userData } = props;

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.MATERIALTRANSACTION
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthCreate = checkauth(role, auth, "C");
  // const isAuthimport = checkauth(role, auth, "I");

  const statusObj = {
    ACTIVE: { text: "Hoạy động" },
    DEACTIVE: { text: "Ngừng hoạt động" },
  };

  const typeObj = {
    1: {
      text: "Nhập kho",
    },
    2: {
      text: "Xuất kho",
    },
    // 3: {
    //   text: "Chuyển kho",
    // },
  };

  //hàm export sang file xlsx
  const handleExportXLSX = () => {
    if (data?.length <= 0) {
      return;
    }
    //đặt tên cột
    let tableXLSX = [
      {
        A: exportHeaderBlood.TRANSACTIONCODE,
        B: exportHeaderBlood.TRANSACTIONDATE,
        C: exportHeaderBlood.BLOODTYPE,
        D: exportHeaderBlood.BLOODNAME,
        E: exportHeaderBlood.QTY,
        F: exportHeaderBlood.HOSPITAL,
        G: exportHeaderBlood.STATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.transactionCode,
        B: row?.blood?.transactionDate,
        C: typeObj[row?.blood?.bloodtype].text,
        D: row?.bloodName,
        E: row?.qty,
        F: row?.blood?.hospital?.name,
        G: statusObj[row?.status].text,
      });
    });
    //title cho bảng
    tableXLSX = [{ A: exportHeaderBlood.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, exportHeaderBlood.EXPORT_WS);
    XLSX.writeFile(wb, exportHeaderBlood.EXPORT_WB);
  };

  return (
    <div
      className="invoice-list-table-header w-100 mr-1 mb-75 d-lg-flex d-md-flex"
      style={{ marginLeft: "-0.7rem" }}
    >
      <span className="d-lg-flex d-md-flex d-none">
        {isAuth && (
          <div className="d-flex mt-md-0 mt-1 mr-1">
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
        <div className="d-flex">
          <Link to="/apps/blood/add_blood_in">
            <Button color="dark" outline tag={Label} size="md">
              Tạo nhập kho
            </Button>
          </Link>
          <Link to="/apps/blood/add_blood_out">
            <Button color="dark" outline tag={Label} size="md" className="ml-1">
              Tạo xuất kho
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const BloodList = () => {
  const userData = useSelector((state) => state?.auth?.userData);

  const [hospitals, setHospital] = useState([]);

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

  useEffect(() => {
    (async () => {
      const data = await HospitalService.getAllHospital({
        status: "ACTIVE",
      });
      setHospital(data?.data || []);
    })();
  }, []);

  const onSubmit = (data) => {
    setParams((prev) => {
      return {
        ...prev,
        filter: {
          ...data,
          transactionCode: data?.transactionCodes?.trim() || null,
          supplierCode: data?.supplier?.value || null,
          materialCode: data?.material?.value || null,
          bloodtype: data?.bloodtype ? data?.bloodtype?.value : null,
          status: data?.status?.value,
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
    const result = await BloodDetailService.getListBloodDetail(params);

    if (result.isSuccess) {
      setData(result?.data?.list || []);
      setTotal(
        Number(Math.ceil(result.data.count / (params.page.limit || 10)))
      );
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
              <Col md="4" className="mb-1">
                <Controller
                  name="transactionCodes"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Mã giao dịch" {...field} />
                  )}
                />
              </Col>

              <Col md="4" className="mb-1">
                <Controller
                  control={control}
                  name="bloodtype"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Loại giao dịch"
                      classNamePrefix="select"
                      options={[
                        { value: null, label: "Chọn loại", number: 0 },
                        { value: 1, label: "Nhập kho", number: 1 },
                        {
                          value: 2,
                          label: "Xuất kho",
                          number: 2,
                        },
                        // {
                        //   value: 3,
                        //   label: "Chuyển kho",
                        //   number: 3,
                        // },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      {...field}
                    />
                  )}
                />
              </Col>

              <Col md="4" className="">
                <FormGroup>
                  <Controller
                    control={control}
                    name="supplier"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        placeholder="Bệnh viện"
                        classNamePrefix="select"
                        options={
                          hospitals?.length > 0
                            ? [
                                {
                                  value: null,
                                  label: "Chọn bệnh viện",
                                  number: 0,
                                },
                                ...hospitals?.map((item, index) => {
                                  return {
                                    value: item?.code,
                                    label: `${item?.name}`,
                                    number: index + 1,
                                  };
                                }),
                              ]
                            : []
                        }
                        value={field.value}
                        onChange={field.onChange}
                        {...field}
                      />
                    )}
                  />
                </FormGroup>
              </Col>

              <Col md="4" className="mb-1">
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

              <Col md="4" className="">
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
          <Row className="mx-0 mb-1 mt-2 align-items-center d-lg-flex d-none d-md-flex">
            <Col md="2" className="mb-1">
              <Controller
                name="transactionCodes"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Mã giao dịch" {...field} />
                )}
              />
            </Col>

            <Col md="2" className="mb-1">
              <Controller
                control={control}
                name="bloodtype"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Giao dịch"
                    classNamePrefix="select"
                    options={[
                      { value: null, label: "Chọn loại", number: 0 },
                      { value: 1, label: "Nhập kho", number: 1 },
                      {
                        value: 2,
                        label: "Xuất kho",
                        number: 2,
                      },
                      // {
                      //   value: 3,
                      //   label: "Chuyển kho",
                      //   number: 3,
                      // },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
            </Col>

            <Col md="2" className="mb-1">
              <Controller
                control={control}
                name="supplier"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Bệnh viện"
                    classNamePrefix="select"
                    options={
                      hospitals?.length > 0
                        ? [
                            {
                              value: null,
                              label: "Chọn bệnh viện",
                              number: 0,
                            },
                            ...hospitals?.map((item, index) => {
                              return {
                                value: item?.code,
                                label: `${item?.name}`,
                                number: index + 1,
                              };
                            }),
                          ]
                        : []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
            </Col>

            <Col md="2" className="mb-1">
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

            <Col md="2" className="mb-1">
              {" "}
              <Row>
                <Button.Ripple color="primary" className="ml-1" type="submit">
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
            columns={Columns(userData)}
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            className="react-dataTable table-list-warehouse-operation"
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

export default BloodList;
