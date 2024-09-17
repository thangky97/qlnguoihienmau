import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const DonutChart = ({ data }) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  const options = {
    series: data?.data,
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "", // Ẩn chữ "total"
              formatter: (w) => {
                // Hiển thị tổng số lượng
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    labels: data?.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  return (
    <div id="chart">
      <ApexCharts options={options} series={options.series} type="donut" />
    </div>
  );
};

export default DonutChart;
