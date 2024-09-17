import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";
import SumaryInquirychart from "./sumaryInquirychart"; // Ensure you have the correct path to DonutChart
import SumaryContractChart from "./sumaryContractchart"; // Ensure you have the correct path to DonutChart
import JobfieldService from "../../../../services/JobfieldService";
import moment from "moment";
import { Col, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import classnames from "classnames";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Link } from "react-router-dom";
const DataTable = ({ data, startDate, endDate }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th rowSpan="2">Nội dung</th>
            <th rowSpan="2">Số lượng</th>
            <th colSpan="6">Tình trạng</th>
          </tr>
          <tr>
            <th>Tiếp xúc</th>
            <th>Khảo sát </th>
            <th>Báo giá</th>
            <th>Đang thương thảo</th>
            <th>Không thực hiện</th>
            <th>Ký HĐ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="namecol">{row?.jobfieldName}</td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
                >
                  {row?.totalProcessingStatus}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"tiepXuc"}`}
                >
                  {row?.processingStatusCounts?.tiepXuc}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"khaoSat"}`}
                >
                  {row?.processingStatusCounts?.khaoSat}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"baoGia"}`}
                >
                  {row?.processingStatusCounts?.baoGia}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"dangThuongThao"}`}
                >
                  {row?.processingStatusCounts?.dangThuongThao}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"khongThucHien"}`}
                >
                  {row?.processingStatusCounts?.khongThucHien}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/inquiry/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"kyHD"}`}
                >
                  {row?.processingStatusCounts?.kyHD}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// table thong ke hopp dong

const DataTableContract = ({ dataContract, startDate, endDate }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th rowSpan="2">Nội dung</th>
            <th rowSpan="2">Số lượng</th>
            <th colSpan="5">Tình trạng</th>
          </tr>
          <tr>
            <th>Đang thực hiện</th>
            <th>Vướng mắc</th>
            <th>Quá hạn</th>
            <th>Hoàn thành</th>
            <th>Đã thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {dataContract.map((row, index) => (
            <tr key={index}>
              <td className="namecol">{row?.jobfieldName}</td>
              <td>
                {" "}
                <Link
                  to={`/apps/contract/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
                >
                  {row?.totalProcessingStatus}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/contract/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTACT"}`}
                >
                  {row?.processingStatusCounts?.CONTACT}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/contract/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"Survey"}`}
                >
                  {row?.processingStatusCounts?.Survey}
                </Link>
              </td>
              <td>
                <Link
                  to={`/apps/contract/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
                >
                  {row?.processingStatusCounts?.NEGOTIATION}
                </Link>
              </td>
              <td>
                {" "}
                <Link
                  to={`/apps/contract/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"SURNOTIMPLEMENTEDVEY"}`}
                >
                  {row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY}
                </Link>
              </td>
              <td>
                {" "}
                <Link
                  to={`/apps/contract/list?jobfield=${
                    row?.jobfieldId
                  }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTRACT"}`}
                >
                  {row?.processingStatusCounts?.CONTRACT}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Sumaryreport = () => {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [data1, setDataStatistical] = useState([]);
  const {
    control,
    formState: { errors },
  } = useForm();
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
      await handleGetlist();
    };
    init();
  }, []);

  useEffect(() => {
    handleGetlist({
      startDate: startDate && moment(startDate).format("YYYY/MM/DD"),
      endDate: endDate && moment(endDate).format("YYYY/MM/DD"),
    });

    // setCurrentPage(0);
  }, [startDate, endDate]);
  const ProcessingStatus = {
    CONTACT: "CONTACT",
    NEGOTIATION: "NEGOTIATION",
    Survey: "Survey",
    SURNOTIMPLEMENTEDVEY: "SURNOTIMPLEMENTEDVEY",
    CONTRACT: "CONTRACT",
  };
  const ProcessingInquiryStatus = {
    tiepXuc: "tiepXuc",
    khaoSat: "khaoSat",
    baoGia: "baoGia",
    dangThuongThao: "dangThuongThao",
    khongThucHien: "khongThucHien",
    kyHD: "kyHD",
  };

  const processStatistics = (data) => {
    const { jobfields, inquiryStatistics, contractStatistics } = data;

    // Sử dụng ProcessingInquiryStatus cho inquiryStatistics
    const totalInquiryCounts = Object?.values(ProcessingInquiryStatus)?.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {}
    );

    inquiryStatistics?.forEach((stat) => {
      totalInquiryCounts[stat.processingStatus] += parseInt(stat.count, 10);
    });

    // Sử dụng ProcessingStatus cho contractStatistics
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

    const inquiryStatisticsProcessed = jobfields?.map((jobfield) => {
      const jobfieldStatistics = inquiryStatistics?.filter(
        (stat) => stat.jobfieldId === jobfield.id
      );

      // Sử dụng ProcessingInquiryStatus cho inquiryStatistics
      const processingStatusCounts = Object.values(
        ProcessingInquiryStatus
      )?.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {});

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
    };
  };

  // Usage
  const processedData = processStatistics(data1);

  return (
    <div className="sumaryreport-table">
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
                  setEndDate(date);
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
        </Col>
      </Row>
      {processedData?.inquiryStatistics?.length > 0 ? (
        <div>
          <h4>Thống kê nhu cầu khách hàng</h4>
          <div className="table-chart-container">
            <DataTable
              data={processedData?.inquiryStatistics}
              startDate={format(startDate, "yyyy/MM/dd")}
              endDate={format(endDate, "yyyy/MM/dd")}
            />
            <SumaryInquirychart data={processedData?.inquiryStatistics} />
          </div>
        </div>
      ) : (
        // <p>No data available for the selected date range.</p>
        <p></p>
      )}

      {/* table contract */}
      {processedData?.contractStatistics?.length > 0 ? (
        <div>
          <h4>Thống kê hợp đồng</h4>
          <div className="table-chart-container">
            <DataTableContract
              dataContract={processedData?.contractStatistics}
              startDate={format(startDate, "yyyy/MM/dd")}
              endDate={format(endDate, "yyyy/MM/dd")}
            />
            <SumaryContractChart data={processedData?.contractStatistics} />
          </div>
        </div>
      ) : (
        // <p>No data available for the selected date range.</p>
        <p></p>
      )}
    </div>
  );
};

export default Sumaryreport;
