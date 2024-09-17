import XLSX from "xlsx";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Share } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import CustomLoader from "../../../../../components/custom/CustomLoader";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { Button, Card, CardBody, Col, Form, Label, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import DepartmentService from "@services/DepartmentService";
import moment from "moment";
import { exportHeaderReport } from "../../../../../../constants/export";
import { endOfMonth, startOfMonth } from "date-fns";
const JobfieldList = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setendDate] = useState(endOfMonth(new Date()));
  const {
    register,
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

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const processUsers = (users) => {
    return users.map((user) => {
      const userTaskCounts = {
        userName: user.userName,
        departmentName: user.departmentName,
        total: 0,
        overdue: 0,
        normal: 0,
        overduePercentage: 0,
        normalPercentage: 0,
        tasks: user.tasks,
      };

      user.tasks.forEach((task) => {
        if (task.status === "Quá hạn") {
          userTaskCounts.overdue++;
        } else if (task.status === "Bình thường") {
          userTaskCounts.normal++;
        }

        userTaskCounts.total++;
      });

      if (userTaskCounts.total > 0) {
        userTaskCounts.overduePercentage = parseFloat(
          ((userTaskCounts.overdue / userTaskCounts.total) * 100).toFixed(2)
        );
        userTaskCounts.normalPercentage = parseFloat(
          ((userTaskCounts.normal / userTaskCounts.total) * 100).toFixed(2)
        );
      }

      return userTaskCounts;
    });
  };

  const [department, setListDepartment] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  console.log(selectedDepartment);

  const handleGetlist = async () => {
    const result = await DepartmentService.ReportTask({
      id: selectedDepartment?.value ? selectedDepartment?.value : undefined,
      startDate: startDate && moment(startDate).format("YYYY-MM-DD"),
      endDate: endDate && moment(endDate).format("YYYY-MM-DD"),
    });
    if (result.isSuccess) {
      setData(result.data);
    }
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
    const init = async () => {
      setLoading(true);

      await handleGetlist();
      setLoading(false);
    };
    init();
  }, [startDate, endDate, selectedDepartment]);
  useEffect(() => {
    (async () => {
      const result = await DepartmentService.getListDepartment({
        filter: {},
        sort: {
          by: "id",
          type: "desc",
        },
        page: {
          page: 1,
          limit: 100000000,
        },
      });

      if (result.isSuccess) {
        setListDepartment(result.data.list);
      }
    })();
  }, []);
  const handleExportXLSX = () => {
    if (processUsers(data)?.length <= 0) {
      return;
    }
    //đặt tên cột
    let tableXLSX = [
      {
        A: exportHeaderReport.NAME,
        B: exportHeaderReport.DEPARTMENT_NAME,
        C: exportHeaderReport.TOTAL,
        D: exportHeaderReport.NORMAL,
        E: exportHeaderReport.OVERDUE,
        F: exportHeaderReport.NORMAL_PERCENTAGE,
        G: exportHeaderReport.OVERDUE_PERCENTAGE,
      },
    ];
    //set giá trị cho mỗi cột
    processUsers(data).forEach((row) => {
      tableXLSX.push({
        A: row?.name,
        B: row?.departmentName,
        C: row?.total,
        D: row?.normal,
        E: row?.overdue,
        F: `${row?.normalPercentage} %`,
        G: `${row?.overduePercentage} %`,
      });
    });

    //title cho bảng
    tableXLSX = [{ A: exportHeaderReport.EXPORT_TITLE }].concat(tableXLSX);
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(tableXLSX, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, exportHeaderReport.EXPORT_WS);

    XLSX.writeFile(wb, exportHeaderReport.EXPORT_WB);
  };
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
            <Row style={{ width: "100%" }}>
              <Col md="4">
                <Label>Phòng ban:</Label>
                <Controller
                  control={control}
                  name="department_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Phòng ban"
                      classNamePrefix="select"
                      options={
                        department?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn phòng ban",
                            number: 0,
                          },
                          ...department?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: `${item?.code} - ${item?.name}`,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedDepartment}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedDepartment(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="4" className=" d-flex flex-column">
                <Label>Ngày phải hoàn thành từ ngày:</Label>
                <Controller
                  control={control}
                  name="startDate"
                  className={classnames({
                    "is-invalid": errors["startDate"],
                  })}
                  render={() => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        setStartDate(date);
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={startDate}
                      value={startDate}
                      selectsStart
                      placeholderText="Từ ngày"
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
                <small className="text-danger pt-1">
                  {errors.startDate?.message}
                </small>
              </Col>
              <Col sm="4" className=" d-flex flex-column">
                <Label>Ngày phải hoàn thành đến ngày:</Label>
                <Controller
                  control={control}
                  name="endDate"
                  className={classnames({
                    "is-invalid": errors["startDate"],
                  })}
                  render={() => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        setendDate(date);
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={endDate}
                      value={endDate}
                      selectsStart
                      minDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Đến ngày"
                    />
                  )}
                />
                <small className="text-danger pt-1">
                  {errors.endDate?.message}
                </small>
              </Col>
            </Row>
          </CardBody>
        )}
        <CardBody>
          <Row style={{ width: "100%" }}>
            <Col md="4">
              <Label>Phòng ban:</Label>
              <Controller
                control={control}
                name="department_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Phòng ban"
                    classNamePrefix="select"
                    options={
                      department?.length > 0 && [
                        {
                          value: null,
                          label: "Chọn phòng ban",
                          number: 0,
                        },
                        ...department?.map((item, index) => {
                          return {
                            value: item?.id,
                            label: `${item?.code} - ${item?.name}`,
                            number: index + 1,
                          };
                        }),
                      ]
                    }
                    {...field}
                    value={selectedDepartment}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedDepartment(e);
                    }}
                  />
                )}
              />
            </Col>
            <Col sm="4" className=" d-flex flex-column">
              <Label>Ngày phải hoàn thành từ ngày:</Label>
              <Controller
                control={control}
                name="startDate"
                className={classnames({
                  "is-invalid": errors["startDate"],
                })}
                render={() => (
                  <DatePicker
                    className="datepicker"
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={startDate}
                    value={startDate}
                    selectsStart
                    placeholderText="Từ ngày"
                    dateFormat="dd/MM/yyyy"
                  />
                )}
              />
              <small className="text-danger pt-1">
                {errors.startDate?.message}
              </small>
            </Col>
            <Col sm="4" className=" d-flex flex-column">
              <Label>Ngày phải hoàn thành đến ngày:</Label>
              <Controller
                control={control}
                name="endDate"
                className={classnames({
                  "is-invalid": errors["startDate"],
                })}
                render={() => (
                  <DatePicker
                    className="datepicker"
                    onChange={(date) => {
                      setendDate(date);
                    }}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={endDate}
                    value={endDate}
                    selectsStart
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Đến ngày"
                  />
                )}
              />
              <small className="text-danger pt-1">
                {errors.endDate?.message}
              </small>
            </Col>
          </Row>
        </CardBody>
        <hr></hr>
        <Row>
          <Col>
            <div className="d-flex mt-md-0 mt-1 ml-2">
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
          </Col>
        </Row>

        <div className="">
          <DataTable
            noHeader
            pagination
            subHeader
            responsive
            paginationServer
            columns={Columns()}
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            className="react-dataTable table-list-branch"
            paginationComponent={CustomPagination}
            data={processUsers(data)}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            noDataComponent={<div className="my-5">Không có dữ liệu</div>}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default JobfieldList;
