// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import JobfieldService from "../../../../services/JobfieldService";
// import { Col, Row } from "reactstrap";
// import DataTable from "react-data-table-component";
// import { ChevronDown } from "react-feather";
// import { Doughnut } from "react-chartjs-2";
// import { Link } from "react-router-dom";
// import CustomLoader from "../../../components/custom/CustomLoader";
// const StatisticalJob = ({ startDate, endDate }) => {
//   const [data, setData] = useState(null);

//   const handleGetlist = async () => {
//     const result = await JobfieldService.Statisticaljob({
//       startDate: startDate && moment(startDate).format("YYYY/MM/DD"),
//       endDate: endDate && moment(endDate).format("YYYY/MM/DD"),
//     });
//     if (result.isSuccess) {
//       setData(result?.data);
//     }
//   };

//   useEffect(() => {
//     handleGetlist();
//   }, [startDate, endDate]);
//   console.log(data?.jobfields);

//   const processData = (data) => {
//     const jobStatistics = data?.jobfields?.map((jobfield) => {
//       const workStatusCounts = {
//         NOPROCESS: 0,
//         PROCESSING: 0,
//         COMPLETED: 0,
//       };

//       const progressStatusCounts = {
//         ON_TIME: 0,
//         LATE: 0,
//       };

//       const jobfieldDetails = data?.jobDetails?.filter(
//         (job) => job?.jobfieldId === jobfield?.id
//       );

//       jobfieldDetails?.forEach((job) => {
//         workStatusCounts[job?.workstatusJob] += 1;

//         const maxdate = new Date(job?.maxdate);
//         const maxdateUpdate = new Date(job?.maxdateUpdate);

//         if (job?.workstatusJob === "COMPLETED" && maxdateUpdate > maxdate) {
//           progressStatusCounts.LATE += 1;
//         } else if (
//           (job?.workstatusJob === "PROCESSING" ||
//             job?.workstatusJob === "NOPROCESS") &&
//           maxdate < new Date()
//         ) {
//           progressStatusCounts.LATE += 1;
//         } else {
//           progressStatusCounts.ON_TIME += 1;
//         }
//       });

//       const totalWorkStatus = Object?.values(workStatusCounts).reduce(
//         (acc, count) => acc + count,
//         0
//       );

//       return {
//         jobfieldName: jobfield?.name,
//         jobfieldId: jobfield?.id,
//         totalWorkStatus,
//         workStatusCounts,
//         progressStatusCounts,
//       };
//     });

//     const totalJobCounts = {
//       labels: ["CHƯA XỬ LÝ", "ĐANG XỬ LÝ", "HOÀN THÀNH"],
//       datasets: [
//         {
//           label: "# of Votes",
//           data: [
//             jobStatistics?.reduce(
//               (acc, stat) => acc + stat?.workStatusCounts?.NOPROCESS,
//               0
//             ),
//             jobStatistics?.reduce(
//               (acc, stat) => acc + stat?.workStatusCounts?.PROCESSING,
//               0
//             ),
//             jobStatistics?.reduce(
//               (acc, stat) => acc + stat?.workStatusCounts?.COMPLETED,
//               0
//             ),
//           ],
//           backgroundColor: [
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(106, 90, 205, 0.2)",
//           ],
//           borderColor: [
//             "rgba(75, 192, 192, 1)",
//             "rgba(255, 99, 132, 1)",
//             "rgba(106, 90, 205, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     };

//     const progressCounts = {
//       labels: ["Đúng hạn", "Quá hạn"],
//       datasets: [
//         {
//           label: "# of Tasks",
//           data: [
//             jobStatistics?.reduce(
//               (acc, stat) => acc + stat.progressStatusCounts.ON_TIME,
//               0
//             ),
//             jobStatistics?.reduce(
//               (acc, stat) => acc + stat.progressStatusCounts.LATE,
//               0
//             ),
//           ],
//           backgroundColor: [
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(255, 99, 132, 0.2)",
//           ],
//           borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//           borderWidth: 1,
//         },
//       ],
//     };

//     return {
//       jobStatistics,
//       totalJobCounts,
//       progressCounts,
//     };
//   };

//   const result = processData({
//     jobfields: [
//       {
//         id: 6,
//         code: "LV00012",
//         name: "LTD",
//         description: "",
//         status: "ACTIVE",
//         created_at: "2024-07-09T09:31:25.229Z",
//         updated_at: "2024-08-09T05:16:17.000Z",
//       },
//       {
//         id: 7,
//         code: "DTM",
//         name: "DTM",
//         description: "",
//         status: "ACTIVE",
//         created_at: "2024-07-10T08:57:45.365Z",
//         updated_at: "2024-08-08T03:19:00.000Z",
//       },
//       {
//         id: 8,
//         code: "GPMT",
//         name: "Giấy phép môi trường",
//         description: "",
//         status: "ACTIVE",
//         created_at: "2024-07-31T03:17:05.497Z",
//         updated_at: "2024-07-31T03:17:05.497Z",
//       },
//     ],
//     jobDetails: [
//       {
//         jobId: 46,
//         jobfieldId: 6,
//         workstatusJob: "NOPROCESS",
//         maxdate: "2024-08-26T00:00:00.000Z",
//         maxdateUpdate: "2024-08-09T03:36:29.204Z",
//       },
//       {
//         jobId: 43,
//         jobfieldId: 7,
//         workstatusJob: "PROCESSING",
//         maxdate: "2024-08-02T00:00:00.000Z",
//         maxdateUpdate: "2024-07-31T03:20:25.474Z",
//       },
//       {
//         jobId: 47,
//         jobfieldId: 8,
//         workstatusJob: "NOPROCESS",
//         maxdate: "2024-08-09T00:00:00.000Z",
//         maxdateUpdate: "2024-08-08T05:02:37.878Z",
//       },
//     ],
//   });
//   console.log(result);

//   const columns = [
//     {
//       name: "LĨNH VỰC",
//       minWidth: "20px",
//       selector: (row) => row?.jobfieldName,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => row?.jobfieldName,
//     },
//     {
//       name: "Đang xử lý",
//       minWidth: "20px",
//       selector: (row) => row?.totalProcessingStatus,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => (
//         <Link
//         // to={`/apps/contract/list?jobfield=${row?.jobfieldId}&startDate=${startDate}&endDate=${endDate}`}
//         >
//           {row?.workStatusCounts?.PROCESSING}
//         </Link>
//       ),
//     },
//     {
//       name: "Chưa xử lý",
//       minWidth: "20px",
//       selector: (row) => row?.processingStatusCounts?.CONTACT,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => (
//         <Link
//         // to={`/apps/contract/list?jobfield=${
//         //   row?.jobfieldId
//         // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"CONTACT"}`}
//         >
//           {row?.workStatusCounts?.NOPROCESS}
//         </Link>
//       ),
//     },
//     {
//       name: "Hoàn thành",
//       minWidth: "20px",
//       selector: (row) => row?.processingStatusCounts?.Survey,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => (
//         <Link
//         // to={`/apps/contract/list?jobfield=${
//         //   row?.jobfieldId
//         // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"Survey"}`}
//         >
//           {row?.workStatusCounts?.COMPLETED}
//         </Link>
//       ),
//     },
//     {
//       name: "Đúng hạn",
//       minWidth: "20px",
//       selector: (row) => row?.processingStatusCounts?.NEGOTIATION,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => (
//         <Link
//         // to={`/apps/contract/list?jobfield=${
//         //   row?.jobfieldId
//         // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"NEGOTIATION"}`}
//         >
//           {row?.progressStatusCounts?.LATE}
//         </Link>
//       ),
//     },
//     {
//       name: "Quá hạn",
//       minWidth: "20px",
//       selector: (row) => row?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY,
//       sortable: true,
//       sortField: "taskname",
//       cell: (row) => (
//         <Link
//         // to={`/apps/contract/list?jobfield=${
//         //   row?.jobfieldId
//         // }&startDate=${startDate}&endDate=${endDate}&processingStatusCounts=${"SURNOTIMPLEMENTEDVEY"}`}
//         >
//           {row?.progressStatusCounts?.ON_TIME}
//         </Link>
//       ),
//     },
//   ];
//   return (
//     <>
//       {result && (
//         <Row style={{ paddingTop: "113px" }}>
//           <Col md="6" sm="12">
//             <h2>Tổng hợp công việc</h2>

//             <DataTable
//               noHeader
//               fixedHeader
//               highlightOnHover
//               selectableRowsNoSelectAll
//               columns={columns}
//               className="react-dataTable"
//               paginationPerPage={5}
//               sortIcon={<ChevronDown size={10} />}
//               data={result?.jobStatistics}
//               responsive
//               paginationServer
//               progressComponent={<CustomLoader />}
//               noDataComponent={<div className="my-5">Không có dữ liệu</div>}
//             />
//           </Col>
//           <Col md="3" sm="12">
//             <h2 style={{ textAlign: "center" }}>
//               Biểu đồ tổng hợp trạng thái xử lý
//             </h2>
//             <Doughnut data={result?.totalJobCounts} />
//           </Col>
//           <Col md="3" sm="12">
//             <h2 style={{ textAlign: "center" }}>
//               Biểu đồ tổng hợp tiến độ xử lý
//             </h2>
//             <Doughnut data={result?.progressCounts} />
//           </Col>
//         </Row>
//       )}
//     </>
//   );
// };

// export default StatisticalJob;
