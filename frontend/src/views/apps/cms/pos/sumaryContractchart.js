import React from "react";
import { Doughnut } from "react-chartjs-2";

const SumaryContractChart = ({ data }) => {
  // Summing up the values for each category
  const totalValues = data.reduce(
    (acc, item) => {
      acc.dangThucHien += item?.processingStatusCounts?.CONTACT;
      acc.vuongMac += item?.processingStatusCounts?.Survey;
      acc.quaHan += item?.processingStatusCounts?.NEGOTIATION;
      acc.hoanThanh += item?.processingStatusCounts?.SURNOTIMPLEMENTEDVEY;
      acc.daThanhToan += item?.processingStatusCounts?.CONTRACT;
      return acc;
    },
    {
      dangThucHien: 0,
      vuongMac: 0,
      quaHan: 0,
      hoanThanh: 0,
      daThanhToan: 0,
    }
  );

  const chartData = {
    labels: [
      "Đang thực hiện",
      "Vướng mắc",
      "Quá hạn",
      "Hoàn thành",
      "Đã thanh toán",
    ],
    datasets: [
      {
        data: [
          totalValues.dangThucHien,
          totalValues.vuongMac,
          totalValues.quaHan,
          totalValues.hoanThanh,
          totalValues.daThanhToan,
        ],
        backgroundColor: [
          "#FF6384", // Color for "dangThucHien"
          "#36A2EB", // Color for "vuong mac"
          "#FFCE56", // Color for "Qua han"
          "#FF9F40", // Color for "hoan thanh"
          "#4BC0C0", // Color for "da thanh toan"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className="table-chart"
      style={{ position: "relative", width: "50%", margin: "0 auto" }}
    >
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: "absolute",
          top: "65%",
          left: "50%",
          transform: "translate(-60%, -50%)",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {totalValues.dangThucHien +
          totalValues.vuongMac +
          totalValues.quaHan +
          totalValues.hoanThanh +
          totalValues.daThanhToan}
      </div>
    </div>
  );
};

export default SumaryContractChart;
