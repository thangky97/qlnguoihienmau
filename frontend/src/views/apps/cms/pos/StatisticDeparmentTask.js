import moment from "moment";
import React, { useEffect, useState } from "react";
import DepartmentService from "../../../../services/DepartmentService";
import DataTable from "react-data-table-component";
import { Col, Row } from "reactstrap";
import { Doughnut } from "react-chartjs-2";

import { Link } from "react-router-dom";
import { Bold, ChevronDown } from "react-feather";
import CustomLoader from "../../../components/custom/CustomLoader";
import "./style.scss";


const StatisticDeparmentTask = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [totaldepartmenttasks, setTotalDepartmentTasks]= useState(null);
  const [loading, setLoading] = useState();


  const handleGetlist = async () => {
    const result = await DepartmentService.getStatisticDepartmentTask({
      startDate: startDate && moment(startDate).format("YYYY-MM-DD"),
      endDate: endDate && moment(endDate).format("YYYY-MM-DD"),
    });
    if (result.isSuccess) {
      setData(result?.data);
    }
  };

  useEffect(() => {
    setLoading(true);

    handleGetlist();

    setLoading(false);

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

        data?.tasks?.forEach((task) => {
          if (task.department_id === department.id) {
            if (task.workstatus in departmentCounts) {
              departmentCounts[task.workstatus]++;
              totalCounts[task.workstatus]++;
            }
          }
        });

        result.push(departmentCounts);
        setTotalDepartmentTasks(totalCounts) ;
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
              "#FCEAEA",
              "#FF6384",
              "#00A65A",
              "#BB1D09",
            ],
            borderColor: [
              "#FCEAEA",
              "#FF6384",
              "#00A65A",
              "#BB1D09",
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
        <Link to ="#"
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
        <Link to ="#"
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
        <Link to = "#"
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
        <Link to ="#"
        // to={`/apps/contract/list?jobfield=${
        //   row?.jobfieldId
        // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
        >
          {row?.CANCEL}
        </Link>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        textTransform: 'none',  // Disable capitalization
        fontWeight: 'bold',     // Optional: adjust styling as needed
      },
    },
    cells: {
      style: {
        textTransform: 'none',  // Disable capitalization for body cells (optional)
      },
    },
    rows: {
      style: {
        "&:last-of-type": {
          // fontFamily: "Montserrat, Helvetica, Arial, serif",
          // fontFamily: "Helvetica Neue,Helvetica,Arial,serif",          
          // color: "#rgba(0,0,0,0.87)",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#e3e3e3",
        },
      },
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Row>
      <Col md="8" sm="12">
        {/* <h4 style={{ marginBottom: "20px" }}>Nhiệm vụ - Phòng ban</h4> */}

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
          customStyles={customStyles}
        />
      </Col>
      <Col md="4" sm="12">
        {/* <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
          Biểu đồ tổng hợp nhiệm vụ
        </h4> */}
        <Doughnut data={statistics?.totalContractCounts} options={options} />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-60%, -50%)",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {
            (totaldepartmenttasks?.NOPROCESS || 0 )+
            (totaldepartmenttasks?.PROCESSING || 0 )+
            (totaldepartmenttasks?.COMPLETED || 0 )+
            (totaldepartmenttasks?.CANCEL || 0)
          
          // totalValues.tiepXuc +
          //   totalValues.khaoSat +
          //   totalValues.baoGia +
          //   totalValues.dangThuongThao +
          //   totalValues.khongThucHien +
          //   totalValues.kyHD
            }
        </div>   

      </Col>
    </Row>
  );
};

export default StatisticDeparmentTask;
