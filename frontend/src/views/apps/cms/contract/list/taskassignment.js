import React, { useEffect } from "react";
import { Table, Badge } from "reactstrap";
import "./TaskAssignment.scss"; // Import the CSS file
import ContractService from "../../../../../services/ContractService";
import moment from "moment";
import DetailTaskAssignment from './DetailTaskAssignment'; // Ensure the correct path to the TaskTable component

const TaskAssignment = ({ jobid }) => {
  const [data, setData] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);

  const [dataJob, setDataJob] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      if (jobid) {
        const result = await ContractService.getJobcontract(jobid);
        if (result.isSuccess) {
          setData(result.data);
        }
      }
    })();
  }, [jobid]);

  useEffect(() => {
    if (data) {
      if (data?.contract?.length > 0) {
        const dataFake = data?.contract;
        setDataJob(dataFake);
      }
      if (dataJob?.length > 0) {
        const processedData = processTasks(dataJob);
        setTableData(processedData);
      }
    }
  }, [data, dataJob?.length]);

  function processTasks(data) {
    const departments = {};

    // Duyệt qua tất cả các contracts trong dữ liệu
    data?.forEach((contract) => {
      // Duyệt qua tất cả các tasks trong mỗi contract
      contract?.task?.forEach((task) => {
        const departmentName = task?.department?.name;

        // Tạo department nếu chưa tồn tại
        if (!departments[departmentName]) {
          departments[departmentName] = [];
        }

        const updateDate = moment(task?.updated_at, "YYYY-MM-DD").startOf(
          "day"
        );
        const currentDate = moment().startOf("day");
        const deadlineDate = moment(task?.endDate, "YYYY-MM-DD").startOf("day");

        let status = "Bình thường";

        // Kiểm tra nếu tác vụ đã hoàn thành
        if (task.workstatus === "COMPLETED") {
          // Nếu ngày hoàn thành sau deadline thì "Quá hạn"
          // Nếu ngày hoàn thành bằng hoặc trước deadline thì "Đúng hạn"
          status = updateDate.isAfter(deadlineDate) ? "Quá hạn" : "Đúng hạn";
        } else if (currentDate.isAfter(deadlineDate)) {
          // Nếu chưa hoàn thành và ngày hiện tại sau deadline thì "Quá hạn"
          status = "Quá hạn";
        } else {
          // Nếu chưa hoàn thành và ngày hiện tại chưa qua deadline thì "Bình thường"
          status = "Bình thường";
        }

        // Chuyển đổi giá trị workstatus thành văn bản tiếng Việt
        let processingStatusText;
        switch (task.workstatus) {
          case "COMPLETED":
            processingStatusText = "Đã hoàn thành";
            break;
          case "PROCESSING":
            processingStatusText = "Đang xử lý";
            break;
          case "NOPROCESS":
            processingStatusText = "Chưa xử lý";
            break;
          case "CANCEL":
            processingStatusText = "Hủy";
            break;
          default:
            processingStatusText = task.workstatus; // giữ nguyên nếu không khớp với bất kỳ giá trị nào
        }

        // Thêm task vào department tương ứng
        departments[departmentName].push({
          content: task?.taskname,
          deadline: moment(task?.endDate).format("DD/MM/YYYY"),
          status,
          note: task?.note,
          processingStatus: processingStatusText,
          sequence: task?.sequence
        });
      });
    });

    // Chuyển đổi object thành mảng
    return Object?.keys(departments)?.map((department) => ({
      department,
      tasks: departments[department],
    }));
  }

  const maxTasks = Math.max(...tableData.map((dept) => dept.tasks.length));

  const getBadgeClass = (status) => {
    switch (status) {
      case "Chưa xử lý":
        return "badge-important";
      case "Đang xử lý":
        return "badge-important processing-status--on-time";
      case "Đã hoàn thành":
        return "badge-important processing-status--completed";
      case "Hủy":
        return "badge-important processing-status--canceled";
      default:
        return "";
    }
  };

   return (
    <DetailTaskAssignment tableData={tableData} />
  );
};

export default TaskAssignment;
