import { Fragment, useEffect, useState } from "react";

import { formatText } from "@utils";
import CustomLoader from "../../../../components/custom/CustomLoader";
import DataTable from "react-data-table-component";
import { ChevronDown, Share } from "react-feather";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import Button from "reactstrap/lib/Button";
import CardBody from "reactstrap/lib/CardBody";
import { Badge, Card, Col, Input, Label, Row } from "reactstrap";
import JobService from "../../../../../services/JobService";
import { checkauth, selectThemeColors } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import UserService from "../../../../../services/UserService";
import JobfieldService from "../../../../../services/JobfieldService";
import moment from "moment";
import { number } from "prop-types";
import ContractService from "./../../../../../services/ContractService";
import XLSX from "xlsx";
import { exportHeaderJob } from "../../../../../constants/export";
import { toast } from "react-toastify";
import "./style.scss";

const JobList = ({ toggleTab }) => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const userData = useSelector((state) => state?.auth?.userData);

  const [user, setUser] = useState();
  const [selectedUser, setSelectedUser] = useState();

  const [jobfieldData, setListJobfield] = useState();
  const [selectedJobfield, setSelectedJobfield] = useState();

  const [contract, setContract] = useState();
  const [selectedContract, setSelectedContract] = useState();

  const handleButtonClick = (id) => {
    // Giá trị id bạn muốn gửi lên
    toggleTab("1", id); // Chuyển sang tab 2 và gửi id
  };

  useEffect(() => {
    (async () => {
      const { data } = await UserService.get_all_operator({
        status: "ACTIVE",
      });
      setUser(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setListJobfield(data);
    })();
    (async () => {
      const { data } = await ContractService.getAllContract({});
      setContract(data);
    })();
  }, []);

  const auth = userData?.authorities.find(
    (item) => item.management === MANAGEMENT.JOB
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthCreate = checkauth(role, auth, "C");
  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");
  let count = 0;

  const handleGetlist = async (query) => {
    const result = await JobService.getAllJob({
      ...query,
    });
    if (result.isSuccess) {
      setData(result.data);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await handleGetlist();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    handleGetlist({
      status: selectedStatus?.value || undefined,
      jobfield_id: selectedJobfield?.value || undefined,
      contract_id: selectedContract?.value || undefined,
      user_code: selectedUser?.value || undefined,
    });
    setCurrentPage(0);
  }, [selectedStatus, selectedJobfield, selectedContract, selectedUser]);

  const handleClick = () => {
    history.push("/apps/job/add");
  };

  const dataToRender = () => {
    let dataResponse = [...data];
    if (data?.length > 0) {
      dataResponse = data?.filter(
        (item) =>
          formatText(item?.name)?.includes(formatText(searchValue)) ||
          formatText(item?.contract?.name)?.includes(formatText(searchValue)) ||
          formatText(item?.contract?.contract_id)?.includes(formatText(searchValue))
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
  const workStatusObj = {
    NOPROCESS: {
      text: "Chưa xử lý",
      bgr: "light-danger",
    },
    PROCESSING: {
      text: "Đang xử lý",
      bgr: "light-info",
    },
    COMPLETED: {
      text: "Hoàn thành",
      bgr: "light-success",
    },
    CANCEL: {
      text: "Huỷ",
      bgr: "light-warning",
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

  const styleTable = [
    {
      when: (row) => {
        return (
          (row?.workstatusJob === "COMPLETED" &&
            new Date(row?.maxdateUpdate) > new Date(row?.maxdate)) ||
          ((row?.workstatusJob === "PROCESSING" ||
            row?.workstatusJob === "NOPROCESS") &&
            new Date(row?.maxdate) < new Date())
        );
      },
      style: {
        // đỏ
        backgroundColor: "rgb(234 84 85 / 12%)",
      },
    },
  ];

  const handleDeleteJob = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await JobService.deleteJob({ id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá công việc thành công");
          handleGetlist();
        }
      });
    }
  };

  const columns = [
    {
      name: "Công việc",
      minWidth: "150px",
      selector: (row) => row?.name,
      sortable: true,
      sortField: "name",
      cell: (row) => (
        <Link to="#" onClick={() => handleButtonClick(row?.id)}>{row?.name}</Link>
      ),
    },
    {
      name: "Hợp đồng",
      minWidth: "150px",
      selector: (row) => row?.contract_id,
      sortable: true,
      cell: (row) => row?.contract?.name,
    },
    {
      name: "Lĩnh vực",
      minWidth: "150px",
      selector: (row) => row?.jobfield_id,
      sortable: true,
      cell: (row) => row?.jobfield?.name,
    },
    // {
    //   name: "Người tạo",
    //   minWidth: "150px",
    //   selector: (row) => row?.user_code,
    //   sortable: true,
    //   cell: (row) => row?.userJob?.name + " " + row?.userJob?.username,
    // },
    {
      name: "Ngày làm",
      width: "150px",
      selector: (row) => row?.jobDate,
      sortable: true,
      cell: (row) => (
        <div>
          <div>
            <span>{moment(row?.jobDate).format("DD/MM/YYYY").toString()}</span>
          </div>
          <div className="status-container">
            <span className="status-label">Tiến độ: </span>
            <span className="status-text">
              {row?.workstatusJob === "COMPLETED" &&
              new Date(row?.maxdateUpdate) > new Date(row?.maxdate) ? (
                <div>Quá hạn</div>
              ) : (row?.workstatusJob === "PROCESSING" ||
                  row?.workstatusJob === "NOPROCESS") &&
                new Date(row?.maxdate) < new Date() ? (
                <div>Quá hạn</div>
              ) : (
                <div>Bình thường</div>
              )}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Trạng thái",
      width: "150px",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <div>
            <span>
              <Badge
                className="text-capitalize"
                color={statusObj[row.status]?.bgr}
                pill
              >
                {statusObj[row.status]?.text}
              </Badge>
            </span>
          </div>
          <div style={{ paddingTop: "7px" }}>
            <span style={{ paddingTop: "2px" }}>
              <Badge
                className="text-capitalize"
                color={workStatusObj[row.workstatusJob]?.bgr}
                pill
              >
                {workStatusObj[row.workstatusJob]?.text}
              </Badge>
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   name: "Trạng thái xử lý",
    //   minWidth: "158px",
    //   selector: (row) => row.workstatusJob,
    //   sortable: true,
    //   sortField: "workstatus",
    //   cell: (row) => (
    //     <Badge
    //       className="text-capitalize"
    //       color={workStatusObj[row.workstatusJob]?.bgr}
    //       pill
    //     >
    //       {workStatusObj[row.workstatusJob]?.text}
    //     </Badge>
    //   ),
    // },
    // {
    //   name: "Tiến độ",
    //   minWidth: "150px",
    //   selector: (row) => row.workstatusJob,
    //   sortable: true,
    //   sortField: "workstatus",
    //   cell: (row) => {
    //     if (
    //       row?.workstatusJob === "COMPLETED" &&
    //       new Date(row?.maxdateUpdate) > new Date(row?.maxdate)
    //     ) {
    //       return <div>Quá hạn</div>;
    //     } else if (
    //       (row?.workstatusJob === "PROCESSING" ||
    //         row?.workstatusJob === "NOPROCESS") &&
    //       new Date(row?.maxdate) < new Date()
    //     ) {
    //       return <div>Quá hạn</div>;
    //     } else {
    //       return <div>Bình thường</div>;
    //     }
    //   },
    // },
    {
      name: "Chức năng",
      width: "150px",
      cell: (row) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  {isAuthUpdate && row?.id && (
    <Badge color="primary" style={{ width: "80px", textAlign: "center", marginBottom: "5px" }}>
      <Link to={`/apps/job/edit/${row.id}`}>Cập nhật</Link>
    </Badge>
  )}
  {(isAuthDelete || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) && row?.id && (
    <Badge
      style={{ width: "80px", textAlign: "center", cursor: "pointer" }}
      onClick={() => handleDeleteJob(row?.id)}
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
      className="d-flex justify-content-between m-2 custom-row"
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
        style={{ marginRight: "1px" }}
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
        A: exportHeaderJob.NAME,
        B: exportHeaderJob.CONTRACT,
        C: exportHeaderJob.JOBFIELD,
        D: exportHeaderJob.USER,
        E: exportHeaderJob.JOBDATE,
        F: exportHeaderJob.DESCRIPTION,
        G: exportHeaderJob.STATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.name,
        B: row?.contract?.name,
        C: row?.jobfield?.name,
        D: row?.userJob?.name + " " + row?.userJob?.username,
        E: moment(row?.jobDate).format("DD/MM/YYYY").toString(),
        F: row?.description,
        G: statusObj[row.status]?.text,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderJob.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderJob.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderJob.EXPORT_WB);
  };

  return (
    <>
      <Fragment>
        <Card>
          <Button
            onClick={() => {
              setIscheck(!isCheck);
            }}
            className="d-lg-none d-flex d-md-none text-center justify-content-center mb-1 text-white"
          >
            <span className="text-center">
              {" "}
              {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
            </span>
          </Button>
          {isCheck && (
            <Row className="mx-0 d-lg-none d-flex d-md-none">
              <Col md="4" className="mb-1">
                <Controller
                  control={control}
                  name="contract_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Hợp đồng"
                      classNamePrefix="select"
                      options={
                        contract?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn hợp đồng",
                            number: 0,
                          },
                          ...contract?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedContract}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedContract(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="4" className="mb-1">
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
              <Col md="4" className="mb-1">
                <Controller
                  control={control}
                  name="user_code"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Người tạo"
                      classNamePrefix="select"
                      options={
                        user?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn người tạo",
                            number: 0,
                          },
                          ...user?.map((item, index) => {
                            return {
                              value: item?.code,
                              label: `${item?.code} - ${item?.name} - ${item?.username}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedUser}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedUser(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="4" className="mb-1">
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
                          label: `Đang tiến hành`,
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
          )}
          <CardBody className="d-lg-flex d-none d-md-flex">
            <Row style={{ width: "100%" }}>
              <Col md="3" className="mt-1">
                <Controller
                  control={control}
                  name="contract_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Hợp đồng"
                      classNamePrefix="select"
                      options={
                        contract?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn hợp đồng",
                            number: 0,
                          },
                          ...contract?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedContract}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedContract(e);
                      }}
                    />
                  )}
                />
              </Col>
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
                  name="user_code"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Người tạo"
                      classNamePrefix="select"
                      options={
                        user?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn người tạo",
                            number: 0,
                          },
                          ...user?.map((item, index) => {
                            return {
                              value: item?.code,
                              label: `${item?.code} - ${item?.name} - ${item?.username}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedUser}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedUser(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mt-1">
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
                          label: `Đang tiến hành`,
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
                  <Button
                    className="cursor-pointer"
                    color="dark"
                    outline
                    tag={Label}
                    size="md"
                    onClick={handleClick}
                  >
                    <span className="align-middle ms-25">Thêm công việc</span>
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
            className="react-dataTable table-job"
            paginationPerPage={5}
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            responsive
            paginationServer
            progressPending={loading}
            conditionalRowStyles={styleTable}
            progressComponent={<CustomLoader />}
            noDataComponent={<div className="my-5">Không có dữ liệu</div>}
            customStyles={customStyles}
          />
        </Card>
      </Fragment>
    </>
  );
};

export default JobList;
