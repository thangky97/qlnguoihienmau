import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DoubleColumnChart(props: any) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: props?.chartTitle || "Chart title"
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const data = {
    labels,
    datasets: [
      {
        label: props?.col1Lable || 'Dataset 1',
        data: labels.map(() => randomIntFromInterval(0, 100)),
        backgroundColor: props?.bar1Color || 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: props?.col2Lable || 'Dataset 2',
        data: labels.map(() => randomIntFromInterval(0, 100)),
        backgroundColor: props?.bar2Color || 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return (
    <Bar className='h-full' options={options} data={data} />
  )
}