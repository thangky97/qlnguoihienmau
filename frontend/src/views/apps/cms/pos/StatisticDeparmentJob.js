import moment from "moment";
import React, { useEffect, useState } from "react";
import DepartmentService from "../../../../services/DepartmentService";
import DataTable from "react-data-table-component";
import { Col, Row } from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { ChevronDown } from "react-feather";
import CustomLoader from "../../../components/custom/CustomLoader";
const StatisticDeparmentJob = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const handleGetlist = async () => {
    const result = await DepartmentService.getStatisticDepartmentJob({
      startDate: startDate && moment(startDate).format("YYYY/MM/DD"),
      endDate: endDate && moment(endDate).format("YYYY/MM/DD"),
    });
    if (result.isSuccess) {
      setData(result?.data);
    }
  };

  useEffect(() => {
    handleGetlist();
  }, [startDate, endDate]);

  useEffect(() => {
    const calculateStatistics = () => {
      const result = [];
      const totalCounts = {
        NOPROCESS: 0,
        COMPLETED: 0,
        PROCESSING: 0,
        CANCEL: 0,
      };

      data?.departments?.forEach((department) => {
        const departmentCounts = {
          departmentName: department.name,
          NOPROCESS: 0,
          COMPLETED: 0,
          PROCESSING: 0,
          CANCEL: 0,
        };

        department.department.forEach((user) => {
          data?.tasks?.forEach((task) => {
            if (task.user_code === user.code) {
              if (task.workstatusJob in departmentCounts) {
                departmentCounts[task.workstatusJob]++;
                totalCounts[task.workstatusJob]++;
              }
            }
          });
        });

        result.push(departmentCounts);
      });

      // Create totalContractCounts object for the doughnut chart
      const totalContractCounts = {
        labels: ["CHƯA XỬ LÝ", "ĐANG XỬ LÝ", "HOÀN THÀNH", "HỦY"],
        datasets: [
          {
            label: "# of Votes",
            data: [
              totalCounts.NOPROCESS,
              totalCounts.PROCESSING,
              totalCounts.COMPLETED,
              totalCounts.CANCEL,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(120, 120, 120, 0.2)",
              "rgba(106, 90, 205, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(120, 120, 120, 1)",
              "rgba(106, 90, 205, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      setStatistics({ result, totalContractCounts });
    };

    if (data?.departments?.length > 0 && data?.tasks?.length > 0) {
      calculateStatistics();
    }
  }, [data]);

  const columns = [
    {
      name: "Phòng ban",
      minWidth: "20px",
      selector: (row) => row?.departmentName,
      sortable: true,
      sortField: "taskname",
      cell: (row) => row?.departmentName,
    },
    {
      name: "Chưa xử lý",
      minWidth: "20px",
      selector: (row) => row?.processingStatusCounts?.NOPROCESS,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
        // to={`/apps/contract/list?jobfield=${
        //   row?.jobfieldId
        // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTACT"}`}
        >
          {row?.NOPROCESS}
        </Link>
      ),
    },
    {
      name: "Đang xử lý",
      minWidth: "20px",
      selector: (row) => row?.PROCESSING,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
        // to={`/apps/contract/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
        >
          {row?.PROCESSING}
        </Link>
      ),
    },

    {
      name: "Hoàn thành",
      minWidth: "20px",
      selector: (row) => row?.COMPLETED,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
        // to={`/apps/contract/list?jobfield=${
        //   row?.jobfieldId
        // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"Survey"}`}
        >
          {row?.COMPLETED}
        </Link>
      ),
    },
    {
      name: "Hủy",
      minWidth: "20px",
      selector: (row) => row?.CANCEL,
      sortable: true,
      sortField: "taskname",
      cell: (row) => (
        <Link
        // to={`/apps/contract/list?jobfield=${
        //   row?.jobfieldId
        // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
        >
          {row?.CANCEL}
        </Link>
      ),
    },
  ];

  return (
    <Row style={{ paddingTop: "113px" }}>
      <Col md="8" sm="12">
        <h2>Tổng hợp công việc</h2>

        <DataTable
          noHeader
          fixedHeader
          highlightOnHover
          selectableRowsNoSelectAll
          columns={columns}
          className="react-dataTable"
          paginationPerPage={5}
          sortIcon={<ChevronDown size={10} />}
          data={statistics?.result}
          responsive
          paginationServer
          progressComponent={<CustomLoader />}
          noDataComponent={<div className="my-5">Không có dữ liệu</div>}
        />
      </Col>
      <Col md="4" sm="12">
        <h2 style={{ textAlign: "center" }}>Biểu đồ tổng hợp công việc</h2>
        <Doughnut data={statistics?.totalContractCounts} />
      </Col>
    </Row>
  );
};

export default StatisticDeparmentJob;
