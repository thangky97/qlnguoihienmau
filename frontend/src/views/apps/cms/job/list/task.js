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
import TaskService from "../../../../../services/TaskService";
import { checkauth, selectThemeColors } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MANAGEMENT } from "../../../../../constants/app";
import JobfieldService from "../../../../../services/JobfieldService";
import JobService from "../../../../../services/JobService";
import moment from "moment";
import DepartmentService from "@services/DepartmentService";
import UserService from "./../../../../../services/UserService";
import XLSX from "xlsx";
import { exportHeaderTask } from "../../../../../constants/export";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./style.scss";

const TaskList = ({ id }) => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedWorkStatus, setSelectedWorkStatus] = useState();
  const userData = useSelector((state) => state?.auth?.userData);
  const [user, setUser] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [jobfieldData, setListJobfield] = useState();
  const [selectedJobfield, setSelectedJobfield] = useState();
  const location = useLocation();
  const [job, setJob] = useState();
  const [selectedJob, setSelectedJob] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await DepartmentService.getAllDepartment({
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
      const { data } = await JobService.getAllJob({});
      setJob(data);
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

  const handleGetlist = async (query, byContact = false) => {
    const result = byContact
      ? await TaskService.getAllTaskByContact({ ...query })
      : await TaskService.getAllTask({ ...query });

    if (result.isSuccess) {
      setData(result.data);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams(location.search);
      const queryId = searchParams.get("id");
      if (queryId) {
        handleGetlist({ id: queryId }, true); // Gọi hàm với byContact là true
      } else {
        handleGetlist({}); // Gọi hàm với byContact là false
      }
      setLoading(false);
    };
    init();
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryId = searchParams.get("id");
    if (queryId) {
      handleGetlist(
        {
          id: queryId,
          status: selectedStatus?.value || undefined,
          workstatus: selectedWorkStatus?.value || undefined,
          jobfield_id: selectedJobfield?.value || undefined,
          job_id: selectedJob?.value || undefined,
          department_id: selectedUser?.value || undefined,
        },
        true
      ); // Gọi hàm với byContact là true
    } else {
      handleGetlist({
        status: selectedStatus?.value || undefined,
        workstatus: selectedWorkStatus?.value || undefined,
        jobfield_id: selectedJobfield?.value || undefined,
        job_id: id ? id : selectedJob?.value || undefined,
        department_id: selectedUser?.value || undefined,
      }); // Gọi hàm với byContact là false
    }
    setCurrentPage(0);
  }, [
    selectedStatus,
    selectedWorkStatus,
    selectedJobfield,
    selectedJob,
    selectedUser,
    id,
    location.search,
  ]);

  const handleClick = () => {
    history.push("/apps/task/add");
  };

  const dataToRender = () => {
    let dataResponse = [...data];
    if (data?.length > 0) {
      dataResponse = data?.filter(
        (item) =>
          formatText(item?.taskname)?.includes(formatText(searchValue)) ||
          formatText(item?.description)?.includes(formatText(searchValue))||
          formatText(item?.job?.contract?.contract_number_information)?.includes(formatText(searchValue))||
          formatText(item?.job?.contract?.name)?.includes(formatText(searchValue))||
          formatText(item?.job?.contract?.customer?.name)?.includes(formatText(searchValue))
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

  const handleDeleteTask = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await TaskService.delete(id).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá chi tiết nhiệm vụ thành công");
          handleGetlist();
        }
      });
    }
  };

  const styleTable = [
    {
      when: (row) => {
        // Lấy ngày hiện tại dưới dạng đối tượng moment
        const currentDate = moment().startOf("day"); // Đảm bảo ngày hiện tại không có thời gian

        // So sánh ngày hoàn thành với ngày hiện tại và trạng thái công việc
        return (
          currentDate.isAfter(moment(row?.endDate).startOf("day")) &&
          (row.workstatus === "NOPROCESS" || row.workstatus === "PROCESSING")
        );
      },
      style: {
        // đỏ
        backgroundColor: "rgb(234 84 85 / 12%)",
      },
    },
    {
      when: (row) => {
        const currentDate = moment().startOf("day"); // Đảm bảo ngày hiện tại không có thời gian

        return (
          moment(row?.endDate).startOf("day").isSameOrAfter(currentDate) &&
          row.workstatus === "COMPLETED"
        );
      },
      style: {
        // xanh
        backgroundColor: "rgb(0 232 20 / 12%)",
      },
    },
    {
      when: (row) => {
        const updateDate = moment(row?.updated_at).startOf("day");

        return (
          updateDate.isAfter(moment(row?.endDate).startOf("day")) &&
          row.workstatus === "COMPLETED"
        );
      },
      style: {
        // đỏ
        backgroundColor: "rgb(234 84 85 / 12%)",
      },
    },
  ];

  const columns = [

    {
      name: "Hợp đồng",
      minWidth: "150px",
      selector: (row) => row?.job,
      sortable: true,
      sortField: "row?.job",
      cell: (row) => (
        <div>
          <div>
            <span
              style={{
                // fontFamily: "Montserrat, Helvetica, Arial, serif",
                // color: "#rgba(0,0,0,0.87)",
              }}
            >
              {row?.job?.contract?.contract_number_information}
            </span>
          </div>
          {row?.job?.contract?.name && (
            <div style={{ paddingTop: "7px" }}>
              <span
                style={{
                  // fontFamily: "Montserrat, Helvetica, Arial, serif",
                  // color: "#rgba(0,0,0,0.87)",
                }}
              >
                Tên HĐ: {row?.job?.contract?.name}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "KH",
      minWidth: "150px",
      selector: (row) => row?.job,
      sortable: true,
      sortField: "row?.job",
      cell: (row) => row?.job?.contract?.customer?.name,
    },

    {
      name: "Nhiệm vụ",
      minWidth: "300px",
      selector: (row) => row?.taskname,
      sortable: true,
      sortField: "taskname",
      cell: (row) => row?.taskname,
    },
    // {
    //   name: "Công việc",
    //   minWidth: "250px",
    //   selector: (row) => row?.job_id,
    //   sortable: true,
    //   cell: (row) => row?.job?.name,
    // },
    {
      name: "Phòng",
      minWidth: "140px",
      selector: (row) => row?.department,
      sortable: true,
      sortField: "department_id",
      cell: (row) => row?.department?.name,
    },
    // {
    //   name: "Trình tự",
    //   minWidth: "50px",
    //   selector: (row) => row?.sequence,
    //   sortable: true,
    //   cell: (row) => row?.sequence,
    // },

    {
      name: "Bắt đầu",
      width: "120px",
      selector: (row) => row?.processDate,
      sortable: true,
      cell: (row) => moment(row?.processDate).format("DD/MM/YYYY").toString(),
    },
    // {
    //   name: "Dealine",
    //   minWidth: "50px",
    //   selector: (row) => row?.dealine,
    //   sortable: true,
    //   cell: (row) => row?.dealine,
    // },
    {
      name: "Kết thúc",
      width: "130px",
      selector: (row) => row?.endDate,
      sortable: true,
      cell: (row) => moment(row?.endDate).format("DD/MM/YYYY"),
    },

    // {
    //   name: "Trạng thái",
    //   minWidth: "150px",
    //   selector: (row) => row?.endDate,
    //   sortable: true,
    //   cell: (row) => {
    //     const deadlineDate = moment(row?.endDate, "YYYY-MM-DD").startOf("day");
    //     const updateDate = moment(row?.updated_at, "YYYY-MM-DD").startOf("day");
    //     const currentDate = moment().startOf("day");

    //     let status = "Bình thường";

    //     if (row.workstatus === "COMPLETED") {
    //       status = updateDate.isAfter(deadlineDate) ? "Quá hạn" : "Đúng hạn";
    //     } else if (currentDate.isAfter(deadlineDate)) {
    //       status = "Quá hạn";
    //     }

    //     return <>{status}</>;
    //   },
    // },

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
    // {
    //   name: "Ghi chú",
    //   minWidth: "150px",
    //   selector: (row) => row?.note,
    //   sortable: true,
    //   cell: (row) => {
    //     const maxLength = 33;
    //     if (row?.note && row.note.length > maxLength) {
    //       return row.note.substring(0, maxLength) + " ...";
    //     } else {
    //       return row?.note;
    //     }
    //   },
    // },
    {
      name: "",
      width: "100px",
      selector: (row) => row.workstatus,
      sortable: true,
      sortField: "workstatus",
      cell: (row) => (
        <Badge
          className="text-capitalize"
          color={workStatusObj[row.workstatus]?.bgr}
          pill
        >
          {workStatusObj[row.workstatus]?.text}
        </Badge>
      ),
    },
    {
      name: "",
      width: "150px",
      cell: (row) => {
        return (
          <div style={{ display: "block", alignItems: "center" }}>
            {(userData?.role === "ADMIN" ||
              userData?.code === row?.user_code) &&
              isAuthUpdate &&
              row?.id && (
                <Badge color="primary"    style={{ width: "80px", display: "inline-block", textAlign: "center" }}>
                  <Link to={`/apps/task/edit/${row.id}`}>Cập nhật</Link>
                </Badge>
              )}
            &nbsp;
            {isAuthDelete &&
              row?.id &&
              (userData?.role === "ADMIN" ||
                userData?.code === row?.user_code) && (
                <Badge  style={{ width: "80px", display: "inline-block", textAlign: "center", marginTop:"5px", cursor: "pointer" }} onClick={() => handleDeleteTask(row?.id)} color="danger">
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
      className="justify-content-between m-2"
      // style={{ "margin-left": "0px" }}
      style={{ position: "fixed", bottom: "2px", width: "75%" }}
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
        A: exportHeaderTask.NAME,
        B: exportHeaderTask.JOB,
        C: exportHeaderTask.USER,
        D: exportHeaderTask.SEQUENCE,
        E: exportHeaderTask.PROCESSDATE,
        F: exportHeaderTask.DEALINE,
        G: exportHeaderTask.DESCRIPTION,
        H: exportHeaderTask.WORKSTATUS,
      },
    ];
    //set giá trị cho mỗi cột
    data.forEach((row) => {
      tableXLSX.push({
        A: row?.taskname,
        B: row?.job?.name,
        C: row?.user?.name + " " + row?.user?.username,
        D: row?.sequence,
        E: moment(row?.processDate).format("DD/MM/YYYY").toString(),
        F: moment(row?.endDate).format("DD/MM/YYYY"),
        G: row?.description,
        H: workStatusObj[row?.workstatus]?.text,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderTask.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderTask.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderTask.EXPORT_WB);
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
                      placeholder="Phòng ban"
                      classNamePrefix="select"
                      options={
                        user?.length > 0 && [
                          {
                            value: null,
                            label: "Phòng ban",
                            number: 0,
                          },
                          ...user?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
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
                  name="job_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Công việc"
                      classNamePrefix="select"
                      options={
                        job?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn công việc",
                            number: 0,
                          },
                          ...job?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedJob}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedJob(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="4" className="mb-1">
                <Controller
                  control={control}
                  name="workstatus"
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
                          value: "NOPROCESS",
                          label: `Chưa xử lý`,
                          number: 1,
                        },
                        {
                          value: "PROCESSING",
                          label: `Đang xử lý`,
                          number: 2,
                        },
                        {
                          value: "COMPLETED",
                          label: `Hoàn thành`,
                          number: 3,
                        },
                        {
                          value: "CANCEL",
                          label: `Huỷ`,
                          number: 4,
                        },
                      ]}
                      {...field}
                      value={selectedWorkStatus}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedWorkStatus(e);
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
                      placeholder="Phòng ban"
                      classNamePrefix="select"
                      options={
                        user?.length > 0 && [
                          {
                            value: null,
                            label: "Phòng ban",
                            number: 0,
                          },
                          ...user?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
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
              <Col md="3" className="mt-1">
                <Controller
                  control={control}
                  name="job_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Công việc"
                      classNamePrefix="select"
                      options={
                        job?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn công việc",
                            number: 0,
                          },
                          ...job?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedJob}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedJob(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="3" className="mt-1 ">
                <Controller
                  control={control}
                  name="workstatus"
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
                          value: "NOPROCESS",
                          label: `Chưa xử lý`,
                          number: 1,
                        },
                        {
                          value: "PROCESSING",
                          label: `Đang xử lý`,
                          number: 2,
                        },
                        {
                          value: "COMPLETED",
                          label: `Hoàn thành`,
                          number: 3,
                        },
                        {
                          value: "CANCEL",
                          label: `Huỷ`,
                          number: 4,
                        },
                      ]}
                      {...field}
                      value={selectedWorkStatus}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedWorkStatus(e);
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
                    <span className="align-middle ms-25">Thêm nhiệm vụ</span>
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
            className="react-dataTable table-task"
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

export default TaskList;
