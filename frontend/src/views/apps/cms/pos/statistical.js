import { Badge, Card, CardBody, Col, Input, h2, Row } from "reactstrap";
import Button from "reactstrap/lib/Button";
import classnames from "classnames";
import { Fragment, useEffect, useState } from "react";
// ** Styles
import React from "react";
import "@styles/react/apps/app-tour.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./style.scss";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Doughnut } from "react-chartjs-2";
import moment from "moment";
import CustomLoader from "../../../components/custom/CustomLoader";
import { Link } from "react-router-dom";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import JobfieldService from "../../../../services/JobfieldService";
import { startOfMonth, endOfMonth } from "date-fns";
import MyPieChart from "../../../components/char/Chart";
const Statistical = () => {
  const [data1, setDataStatistical] = useState([]);

  const [loading, setLoading] = useState();

  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setendDate] = useState(endOfMonth(new Date()));

  const columns1 = [
    {
      name: "LĨNH VỰC",
      minWidth: "20px",
      selector: (row) => row?.jobfieldName,
      sortable: true,
      sortField: "taskname",
      cell: (row) => row?.jobfieldName,
    },
    {
      name: "SL HỢP ĐỒNG",
      minWidth: "20px",
      selector: (row) => row?.totalProcessingStatus,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
        >
          {row?.totalProcessingStatus}
        </Link>
      ),
    },
    {
      name: "Đang thực hiện",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.CONTACT,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTACT"}`}
        >
          {row?.processingStatusCounts?.CONTACT}
        </Link>
      ),
    },
    {
      name: "Vướng mắc",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.Survey,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"Survey"}`}
        >
          {row?.processingStatusCounts?.Survey}
        </Link>
      ),
    },
    {
      name: "Quá hạn",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.NEGOTIATION,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
        >
          {row?.processingStatusCounts?.NEGOTIATION}
        </Link>
      ),
    },
    {
      name: "Hoàn thành",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"SURNOTIMPLEMENTEDVEY"}`}
        >
          {row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY}
        </Link>
      ),
    },
    {
      name: "Đã thanh toán",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.CONTRACT,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/contract/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTRACT"}`}
        >
          {row?.processingStatusCounts?.CONTRACT}
        </Link>
      ),
    },
  ];

  const columns = [
    {
      name: "LĨNH VỰC",
      minWidth: "20px",
      selector: (row) => row?.jobfieldName,
      sortable: true,
      sortField: "taskname",
      cell: (row) => row?.jobfieldName,
    },
    {
      name: "SL NHU CẦU",
      minWidth: "20px",
      selector: (row) => row?.totalProcessingStatus,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
        >
          {row?.totalProcessingStatus}
        </Link>
      ),
    },
    {
      name: "Đang thực hiện",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.CONTACT,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTACT"}`}
        >
          {row?.processingStatusCounts?.CONTACT}
        </Link>
      ),
    },
    {
      name: "Vướng mắc",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.Survey,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"Survey"}`}
        >
          {row?.processingStatusCounts?.Survey}
        </Link>
      ),
    },
    {
      name: "Quá hạn",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.NEGOTIATION,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
        >
          {row?.processingStatusCounts?.NEGOTIATION}
        </Link>
      ),
    },
    {
      name: "Hoàn thành",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"SURNOTIMPLEMENTEDVEY"}`}
        >
          {row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY}
        </Link>
      ),
    },
    {
      name: "Đã thanh toán",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.CONTRACT,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
          to={`/apps/inquiry/list?jobfield=${
            row?.jobfieldId
          }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTRACT"}`}
        >
          {row?.processingStatusCounts?.CONTRACT}
        </Link>
      ),
    },
  ];

  const handleGetlist = async (query) => {
    const result = await JobfieldService.Statistical({
      ...query,
      startDate: startDate && moment(startDate).format("YYYY/MM/DD"),
      endDate: endDate && moment(endDate).format("YYYY/MM/DD"),
    });
    if (result.isSuccess) {
      setDataStatistical(result.data);
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

  //validate dữ liệu
  const {
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    handleGetlist({
      startDate: startDate && moment(startDate).format("YYYY/MM/DD"),
      endDate: endDate && moment(endDate).format("YYYY/MM/DD"),
    });

    // setCurrentPage(0);
  }, [startDate, endDate]);
  const [isCheck, setIscheck] = useState(false);

  let count = 0;
  const ProcessingStatus = {
    CONTACT: "CONTACT",
    NEGOTIATION: "NEGOTIATION",
    Survey: "Survey",
    SURNOTIMPLEMENTEDVEY: "SURNOTIMPLEMENTEDVEY",
    CONTRACT: "CONTRACT",
  };

  const processStatistics = (data) => {
    const { jobfields, inquiryStatistics, contractStatistics } = data;

    const totalInquiryCounts = Object?.values(ProcessingStatus)?.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {}
    );

    inquiryStatistics?.forEach((stat) => {
      totalInquiryCounts[stat.processingStatus] += parseInt(stat.count, 10);
    });

    const totalInquiryProcessingStatus = Object.values(
      totalInquiryCounts
    )?.reduce((acc, count) => acc + count, 0);

    const totalContractCounts = Object.values(ProcessingStatus)?.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {}
    );

    contractStatistics?.forEach((stat) => {
      totalContractCounts[stat.processingStatus] += parseInt(stat.count, 10);
    });

    const totalContractProcessingStatus = Object.values(
      totalContractCounts
    )?.reduce((acc, count) => acc + count, 0);

    const inquiryStatisticsProcessed = jobfields?.map((jobfield) => {
      const jobfieldStatistics = inquiryStatistics?.filter(
        (stat) => stat.jobfieldId === jobfield.id
      );

      const processingStatusCounts = Object.values(ProcessingStatus)?.reduce(
        (acc, status) => {
          acc[status] = 0;
          return acc;
        },
        {}
      );

      jobfieldStatistics.forEach((stat) => {
        processingStatusCounts[stat.processingStatus] = parseInt(
          stat.count,
          10
        );
      });

      const totalProcessingStatus = Object.values(
        processingStatusCounts
      )?.reduce((acc, count) => acc + count, 0);

      return {
        jobfieldName: jobfield.name,
        jobfieldId: jobfield.id,
        totalProcessingStatus,
        processingStatusCounts,
      };
    });

    const contractStatisticsProcessed = jobfields?.map((jobfield) => {
      const jobfieldStatistics = contractStatistics?.filter(
        (stat) => stat.jobfieldId === jobfield.id
      );

      const processingStatusCounts = Object.values(ProcessingStatus)?.reduce(
        (acc, status) => {
          acc[status] = 0;
          return acc;
        },
        {}
      );

      jobfieldStatistics?.forEach((stat) => {
        processingStatusCounts[stat.processingStatus] = parseInt(
          stat.count,
          10
        );
      });

      const totalProcessingStatus = Object.values(
        processingStatusCounts
      )?.reduce((acc, count) => acc + count, 0);

      return {
        jobfieldName: jobfield.name,
        jobfieldId: jobfield.id,
        totalProcessingStatus,
        processingStatusCounts,
      };
    });

    return {
      inquiryStatistics: inquiryStatisticsProcessed,
      contractStatistics: contractStatisticsProcessed,
      totakInqueryCounts: {
        labels: [
          "ĐANG THỰC HIỆN",
          "VƯỚNG MẮC",
          "QUÁ HẠN",
          "HOÀN THÀNH",
          "ĐÃ THANH TOÁN",
          "SL NHU CẦU",
        ],
        data: [
          ...Object.values(totalInquiryCounts),
          totalInquiryProcessingStatus,
        ],
      },
      totalContractCounts: {
        labels: [
          "ĐANG THỰC HIỆN",
          "VƯỚNG MẮC",
          "QUÁ HẠN",
          "HOÀN THÀNH",
          "ĐÃ THANH TOÁN",
          "SL HỢP ĐỒNG",
        ],
        data: [
          ...Object.values(totalContractCounts),
          totalContractProcessingStatus,
        ],
      },
    };
  };

  // Usage
  const processedData = processStatistics(data1);

  return (
    <div className="app-user-list">
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
                <Col sm="4" className="mt-1 d-flex flex-column">
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
                <Col sm="4" className="mt-1 d-flex flex-column">
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
              <Col sm="4" className="mt-1 d-flex flex-column">
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
              <Col sm="4" className="mt-1 d-flex flex-column">
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

            <Row className="mt-2">
              <Col md="8" sm="12">
                <h2>Thống kê nhu cầu khách hàng</h2>

                <DataTable
                  noHeader
                  // pagination
                  fixedHeader
                  highlightOnHover
                  selectableRowsNoSelectAll
                  columns={columns}
                  className="react-dataTable"
                  paginationPerPage={5}
                  sortIcon={<ChevronDown size={10} />}
                  // paginationComponent={CustomPagination}
                  data={processedData?.inquiryStatistics}
                  responsive
                  paginationServer
                  progressPending={loading}
                  progressComponent={<CustomLoader />}
                  noDataComponent={<div className="my-5">Không có dữ liệu</div>}
                />
              </Col>
              <Col md="4" sm="12">
                {processedData?.totakInqueryCounts && (
                  <MyPieChart data={processedData?.totakInqueryCounts} />
                )}
              </Col>
            </Row>
            <Row style={{ paddingTop: "113px" }}>
              <Col md="8" sm="12">
                <h2>Thống kê hợp đồng</h2>

                <DataTable
                  noHeader
                  // pagination
                  fixedHeader
                  highlightOnHover
                  selectableRowsNoSelectAll
                  columns={columns1}
                  className="react-dataTable"
                  paginationPerPage={5}
                  sortIcon={<ChevronDown size={10} />}
                  // paginationComponent={CustomPagination}
                  data={processedData?.contractStatistics}
                  responsive
                  paginationServer
                  progressPending={loading}
                  progressComponent={<CustomLoader />}
                  noDataComponent={<div className="my-5">Không có dữ liệu</div>}
                />
              </Col>
              <Col md="4" sm="12">
                <MyPieChart data={processedData?.totalContractCounts} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    </div>
  );
};

export default Statistical;
