import { Fragment, useEffect, useState } from "react";

import { formatText } from "@utils";
import CustomLoader from "../../../../components/custom/CustomLoader";
import DataTable from "react-data-table-component";
import { ChevronDown, Download, Share } from "react-feather";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import Button from "reactstrap/lib/Button";
import CardBody from "reactstrap/lib/CardBody";
import { Badge, Card, Col, Input, Label, Row } from "reactstrap";
import ContractService from "../../../../../services/ContractService";
import { checkauth, selectThemeColors } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MANAGEMENT } from "../../../../../constants/app";
import CustomerService from "../../../../../services/CustomerService";
import JobfieldService from "../../../../../services/JobfieldService";
import UserService from "../../../../../services/UserService";
import OpportunityService from "../../../../../services/OpportunityService";
import moment from "moment";
import XLSX from "xlsx";
import { exportHeaderContract } from "../../../../../constants/export";
import importContract from "./IMPORT_CONTRACT.xlsx";
import { toast } from "react-toastify";
import { format } from "date-fns";

const ContractList = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const userData = useSelector((state) => state?.auth?.userData);

  const [customer, setCustomerData] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();

  const [user, setUserData] = useState();
  const [selectedUser, setSelectedUser] = useState();

  const [jobfieldData, setListJobfield] = useState();
  const [selectedJobfield, setSelectedJobfield] = useState();
  const location = useLocation();
  const [inquiry, setListInquiry] = useState();
  const [selectedInquiry, setSelectedInquiry] = useState();

  const searchParams = new URLSearchParams(location.search);
  const jobfield = searchParams.get("jobfield");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const processingStatusCounts = searchParams.get("processingStatusCounts");

  const processingStatusObject = {
    CONTACT: {
      value: "CONTACT",
      label: "Đang thực hiện",
      bgr: "light-success",
    },
    Survey: {
      value: "Survey",
      label: "Vướng mắc",
      bgr: "light-success",
    },
    NEGOTIATION: {
      value: "NEGOTIATION",
      label: "Quá hạn",
      bgr: "light-success",
    },
    SURNOTIMPLEMENTEDVEY: {
      value: "SURNOTIMPLEMENTEDVEY",
      label: "Hoàn thành",
      bgr: "light-success",
    },
    CONTRACT: {
      value: "CONTRACT",
      label: "Đã thanh toán",
      bgr: "light-success",
    },
  };

  useEffect(() => {
    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setCustomerData(data);
    })();
    (async () => {
      const { data } = await UserService.get_all_operator({
        status: "ACTIVE",
      });
      setUserData(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setListJobfield(data);
    })();
    (async () => {
      const { data } = await OpportunityService.getAll({
        status: "ACTIVE",
      });
      setListInquiry(data);
    })();
  }, []);

  const auth = userData?.authorities.find(
    (item) => item.management === MANAGEMENT.CONTRACT
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthimport = checkauth(role, auth, "I");
  const isAuthCreate = checkauth(role, auth, "C");
  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");
  let count = 0;

  const handleGetlist = async (query) => {
    const result = await ContractService.getAllContract({
      ...query,
    });
    if (result.isSuccess) {
      setData(result.data);
    }
  };

  useEffect(() => {
    handleGetlist({
      status: selectedStatus?.value || undefined,
      jobfield_id: jobfield || selectedJobfield?.value || undefined,
      inquiry_id: selectedInquiry?.value || undefined,
      customer_code: selectedCustomer?.value || undefined,
      user_code: selectedUser?.value || undefined,
      startDate: startDate ? format(startDate, "yyyy/MM/dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy/MM/dd") : undefined,
      processingStatus: processingStatusCounts || undefined,
    });
    setCurrentPage(0);
  }, [
    selectedStatus,
    selectedJobfield,
    selectedInquiry,
    selectedCustomer,
    selectedUser,
    startDate,
    endDate,
    processingStatusCounts,
    jobfield,
  ]);

  const handleClick = () => {
    history.push("/apps/contract/add");
  };

  const dataToRender = () => {
    let dataResponse = [...data];
    if (data?.length > 0) {
      dataResponse = data?.filter(
        (item) =>
          formatText(item?.name)?.includes(formatText(searchValue)) ||
          formatText(item?.amis_code)?.includes(formatText(searchValue)) ||
          formatText(item?.code)?.includes(formatText(searchValue)) ||
          formatText(item?.type)?.includes(formatText(searchValue)) ||
          formatText(item?.category)?.includes(formatText(searchValue)) ||
          formatText(item?.departure)?.includes(formatText(searchValue))
      );

      count = Number(Math.ceil(dataResponse.length / rowsPerPage));
      let dataPaginate = dataResponse.slice(
        currentPage * rowsPerPage,
        rowsPerPage * (currentPage + 1)
      );
      let dataHasTotal = [...dataPaginate];

      return dataHasTotal;
    } else {
      return [];
    }
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

  const statusObj = {
    NEW: {
      text: "Mới",
      bgr: "light-info",
    },
    INPROCESS: {
      text: "Đang tiến hành",
      bgr: "light-warning",
    },
    COMPLETED: {
      text: "Hoàn thành",
      bgr: "light-success",
    },
  };

  const handleDeleteContract = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await ContractService.deleteContract({ id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá hợp đồng thành công");
          handleGetlist();
        }
      });
    }
  };

  const columns = [
    {
      name: "Hợp đồng",
      minWidth: "200px",
      selector: (row) => row?.name,
      sortable: true,
      sortField: "name",
      cell: (row) => (
        <Link to={`/apps/job/list?id=${row?.id}`}>{row?.name}</Link>
      ),
    },
    {
      name: "Lĩnh vực",
      minWidth: "150px",
      selector: (row) => row?.jobfield_id,
      sortable: true,
      cell: (row) => row?.jobfield?.name,
    },
    {
      name: "Nhu cầu",
      minWidth: "150px",
      selector: (row) => row?.inquiry_id,
      sortable: true,
      cell: (row) => row?.inquiry?.name,
    },
    {
      name: "Khách hàng",
      minWidth: "150px",
      selector: (row) => row?.customer_code,
      sortable: true,
      cell: (row) => row?.customer?.name,
    },
    {
      name: "Người tạo",
      minWidth: "150px",
      selector: (row) => row?.user_code,
      sortable: true,
      cell: (row) =>
        row?.contractUser?.name + " " + row?.contractUser?.username,
    },
    // {
    //   name: "Mô tả",
    //   minWidth: "150px",
    //   selector: (row) => row?.description,
    //   sortable: true,
    //   cell: (row) => {
    //     const maxLength = 33;
    //     if (row?.description && row.description.length > maxLength) {
    //       return row.description.substring(0, maxLength) + " ...";
    //     } else {
    //       return row?.description;
    //     }
    //   },
    // },
    {
      name: "Ngày tạo",
      minWidth: "150px",
      selector: (row) => row?.createDate,
      sortable: true,
      cell: (row) => moment(row?.createDate).format("DD/MM/YYYY").toString(),
    },
    {
      name: "Tình trạng xử lí",
      minWidth: "158px",
      selector: (row) => row.processingStatus,
      sortable: true,
      sortField: "processingStatus",
      cell: (row) => (
        <Badge
          className="text-capitalize"
          color={processingStatusObject[row.processingStatus]?.bgr}
          pill
        >
          {processingStatusObject[row.processingStatus]?.label}
        </Badge>
      ),
    },
    {
      name: "Trạng thái",
      minWidth: "158px",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <Badge
          className="text-capitalize"
          color={statusObj[row?.status]?.bgr}
          pill
        >
          {statusObj[row.status]?.text}
        </Badge>
      ),
    },
    {
      name: "Chức năng",
      minWidth: "250px",
      cell: (row) => {
        return (
          <div>
            {isAuthUpdate && row?.id && (
              <Badge color="primary">
                <Link to={`/apps/contract/edit/${row.id}`}>Cập nhật</Link>
              </Badge>
            )}
            &nbsp;
            {isAuthCreate && row?.id && (
              <Badge
                color="success"
                onClick={() =>
                  history.push({
                    pathname: "/apps/job/add",
                    state: {
                      contractId: row?.id,
                      jobfieldId: row?.jobfield_id,
                    },
                  })
                }
              >
                Tạo công việc
              </Badge>
            )}
            &nbsp;
            {isAuthDelete && row?.id && userData?.role === "ADMIN" && (
              <Badge
                onClick={() => handleDeleteContract(row?.id)}
                color="danger"
              >
                Xoá
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  const CustomPagination = () => (
    <Row
      className="d-flex justify-content-between m-2"
      style={{ "margin-left": "0px" }}
    >
      <Col sm="2" className="d-flex align-items-center">
        <div style={{ width: "70px" }}>Hiển thị</div>
        <div style={{ width: "70px" }}>
          <Input
            type="select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </Input>
        </div>
      </Col>

      <Col
        sm="1"
        className="d-flex align-items-center justify-content-end  "
        style={{ "margin-right": "1px" }}
      >
        <ReactPaginate
          previousLabel={<Fragment />}
          nextLabel={<Fragment />}
          forcePage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page.selected);
          }}
          pageCount={count || 1}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName={"active"}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName={
            "pagination react-paginate pagination-sm justify-content-end pr-1 mt-1"
          }
        />
      </Col>
    </Row>
  );

  const {
    control,
    formState: { errors },
  } = useForm();

  const [isCheck, setIscheck] = useState(false);

  //hàm export sang file xlsx
  const handleExportXLSX = () => {
    if (data?.length <= 0) {
      return;
    }
    //đặt tên cột
    let tableXLSX = [
      {
        A: exportHeaderContract.NAME,
        B: exportHeaderContract.JOBFIELD,
        C: exportHeaderContract.INQUIRY,
        D: exportHeaderContract.CUSTOMER,
        E: exportHeaderContract.USER,
        F: exportHeaderContract.CREATEDATE,
        G: exportHeaderContract.DESCRIPTION,
        H: exportHeaderContract.STATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.name,
        B: row?.jobfield?.name,
        C: row?.inquiry?.name,
        D: row?.customer?.name,
        E: row?.contractUser?.name + " " + row?.contractUser?.username,
        F: moment(row?.createDate).format("DD/MM/YYYY").toString(),
        G: row?.description,
        H: statusObj[row.status]?.text,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderContract.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderContract.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderContract.EXPORT_WB);
  };

  // import
  const onChangeUpload = (e) => {
    let files = e.target.files;
    const imageData = new FormData();
    imageData.append("file", files[0]);
    handleImport(imageData);
    e.target.value = null;
  };

  const handleImport = (imageData) => {
    ContractService.UpLoadExcel(imageData).then((res) => {
      if (res.isSuccess) {
        toast.success("Tải lên thành công");
        handleGetlist();
      }
    });
  };

  return (
    <>
      <Fragment>
        <Card>
          <Button
            onClick={() => {
              setIscheck(!isCheck);
            }}
            className="d-lg-none d-flex d-md-none text-center justify-content-center text-white"
          >
            <span className="text-center">
              {" "}
              {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
            </span>
          </Button>
          {isCheck && (
            <CardBody className="d-lg-none d-flex d-md-none">
              <Row>
                <Col md="3" className="mb-1">
                  <Controller
                    control={control}
                    name="jobfield_id"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        placeholder="Lĩnh vực"
                        classNamePrefix="select"
                        options={
                          jobfieldData?.length > 0 && [
                            {
                              value: null,
                              label: "Chọn lĩnh vực",
                              number: 0,
                            },
                            ...jobfieldData?.map((item, index) => {
                              return {
                                value: item?.id,
                                label: `${item?.code} - ${item?.name}`,
                                number: index + 1,
                              };
                            }),
                          ]
                        }
                        {...field}
                        value={selectedJobfield}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedJobfield(e);
                        }}
                      />
                    )}
                  />
                </Col>
                <Col md="3" className="mb-1">
                  <Controller
                    control={control}
                    name="customer_code"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        placeholder="Khách hàng"
                        classNamePrefix="select"
                        options={
                          customer?.length > 0 && [
                            {
                              value: null,
                              label: "Chọn khách hàng",
                              number: 0,
                            },
                            ...customer?.map((item, index) => {
                              return {
                                value: item?.code,
                                label: `${item?.code} - ${item?.name}`,
                                number: index + 1,
                              };
                            }),
                          ]
                        }
                        {...field}
                        value={selectedCustomer}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedCustomer(e);
                        }}
                      />
                    )}
                  />
                </Col>
                <Col sm="3" className="mt-1 ">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        placeholder="Chọn trạng thái"
                        classNamePrefix="select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            background: field?.value?.bg,
                          }),
                        }}
                        options={[
                          {
                            value: null,
                            label: `Chọn trạng thái`,
                            number: 0,
                          },
                          {
                            value: "NEW",
                            label: `Mới`,
                            number: 1,
                          },
                          {
                            value: "INPROCESS",
                            label: `Đang tiến hàng`,
                            number: 2,
                          },
                          {
                            value: "COMPLETED",
                            label: `Hoàn thành`,
                            number: 3,
                          },
                        ]}
                        {...field}
                        value={selectedStatus}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedStatus(e);
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>
            </CardBody>
          )}
          <CardBody className="d-lg-flex d-none d-md-flex">
            <Row style={{ width: "100%" }}>
              <Col md="3" className="mt-1">
                <Controller
                  control={control}
                  name="jobfield_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Lĩnh vực"
                      classNamePrefix="select"
                      options={
                        jobfieldData?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn lĩnh vực",
                            number: 0,
                          },
                          ...jobfieldData?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedJobfield}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedJobfield(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="3" className="mt-1">
                <Controller
                  control={control}
                  name="customer_code"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Khách hàng"
                      classNamePrefix="select"
                      options={
                        customer?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn khách hàng",
                            number: 0,
                          },
                          ...customer?.map((item, index) => {
                            return {
                              value: item?.code,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedCustomer}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCustomer(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mt-1 ">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      placeholder="Chọn trạng thái"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          background: field?.value?.bg,
                        }),
                      }}
                      options={[
                        {
                          value: null,
                          label: `Chọn trạng thái`,
                          number: 0,
                        },
                        {
                          value: "NEW",
                          label: `Mới`,
                          number: 1,
                        },
                        {
                          value: "INPROCESS",
                          label: `Đang tiến hàng`,
                          number: 2,
                        },
                        {
                          value: "COMPLETED",
                          label: `Hoàn thành`,
                          number: 3,
                        },
                      ]}
                      {...field}
                      value={selectedStatus}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedStatus(e);
                      }}
                    />
                  )}
                />
              </Col>
            </Row>
          </CardBody>
          <hr></hr>
          <Row className="mx-0 mb-1 d-flex align-items-center justify-content-between">
            <Col
              sm="8"
              className="d-lg-flex d-md-flex align-items-center mt-md-0"
            >
              <div
                className="d-lg-flex d-md-flex align-items-center mt-md-0"
                sm="12"
              >
                <span className="d-lg-flex d-none d-md-flex">
                  {isAuth && (
                    <div className="d-flex mt-md-0 mt-1">
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

                  {isAuthimport && (
                    <div
                      className="d-lg-flex d-none d-md-flex align-items-center mt-md-0 mt-1"
                      sm="12"
                    >
                      <Button
                        color="dark"
                        outline
                        tag={Label}
                        size="md"
                        className="ml-1"
                      >
                        <Download size={14} />
                        <span className="align-middle ms-25">
                          Import
                          <Input
                            type="file"
                            onChange={onChangeUpload}
                            hidden
                            accept="xlsx/*"
                          />
                        </span>
                      </Button>

                      <Link
                        to={importContract}
                        className="align-middle ms-25 pl-2 pt-0 mr-1 text-secondary "
                        target="_blank"
                        download
                      >
                        {" "}
                        <Download size={14} /> Download template
                      </Link>
                    </div>
                  )}
                </span>
                {isAuthCreate && (
                  <Button
                    className="cursor-pointer"
                    color="dark"
                    outline
                    tag={Label}
                    size="md"
                    onClick={handleClick}
                  >
                    <span className="align-middle ms-25">Tạo hợp đồng</span>
                  </Button>
                )}
              </div>
            </Col>

            <Col
              className="d-flex align-items-center justify-content-end mt-1"
              md="4"
              sm="12"
            >
              <Input
                className="dataTable-filter mb-50"
                type="text"
                bsSize="sm"
                id="search-input-1"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Tìm kiếm"
              />
            </Col>
          </Row>
          <DataTable
            noHeader
            pagination
            fixedHeader
            highlightOnHover
            selectableRowsNoSelectAll
            columns={columns}
            className="react-dataTable"
            paginationPerPage={5}
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            responsive
            paginationServer
            progressPending={loading}
            progressComponent={<CustomLoader />}
            noDataComponent={<div className="my-5">Không có dữ liệu</div>}
            customStyles={customStyles}
          />
        </Card>
      </Fragment>
    </>
  );
};

export default ContractList;
