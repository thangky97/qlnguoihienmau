import React from "react";
import { Doughnut } from "react-chartjs-2";

const SumaryInquiryChart = ({ data }) => {
  // Summing up the values for each category
  const totalValues = data?.reduce(
    (acc, item) => {
      acc.tiepXuc += item?.processingStatusCounts?.tiepXuc;
      acc.khaoSat += item?.processingStatusCounts?.khaoSat;
      acc.baoGia += item?.processingStatusCounts?.baoGia;
      acc.dangThuongThao += item?.processingStatusCounts?.dangThuongThao;
      acc.khongThucHien += item?.processingStatusCounts?.khongThucHien;
      acc.kyHD += item?.processingStatusCounts?.kyHD;
      return acc;
    },
    {
      tiepXuc: 0,
      khaoSat: 0,
      baoGia: 0,
      dangThuongThao: 0,
      khongThucHien: 0,
      kyHD: 0,
    }
  );

  const chartData = {
    labels: [
      "Tiếp xúc",
      "Khảo sát",
      "Báo giá",
      "Đang thương thảo",
      "Không thực hiện",
      "Ký HĐ",
    ],
    datasets: [
      {
        data: [
          totalValues?.tiepXuc,
          totalValues?.khaoSat,
          totalValues?.baoGia,
          totalValues?.dangThuongThao,
          totalValues?.khongThucHien,
          totalValues?.kyHD,
        ],
        backgroundColor: [
          "#FF6384", // Color for "Tiếp xúc"
          "#36A2EB", // Color for "Khảo sát "
          "#7625BE", // Color for "báo giá"
          "#FFCE56", // Color for "Đang thương thảo"
          "#FF9F40", // Color for "Không thực hiện"
          "#4BC0C0", // Color for "Ký HĐ"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#7625BE",
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
          top: "70%",
          left: "50%",
          transform: "translate(-70%, -50%)",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {totalValues.tiepXuc +
          totalValues.khaoSat +
          totalValues.baoGia +
          totalValues.dangThuongThao +
          totalValues.khongThucHien +
          totalValues.kyHD}
      </div>
    </div>
  );
};

export default SumaryInquiryChart;
