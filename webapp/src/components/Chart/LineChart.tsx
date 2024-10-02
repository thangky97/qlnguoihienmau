import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart(props: any) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: props?.chartTitle || ""
      },
    },
  };

  function randomIntFromInterval() { // min and max included 
    return Math.floor(Math.random() * (1000 - 0 + 1) + 0)
  }

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: props?.lineLable || "line label",
        data: labels.map(() => randomIntFromInterval()),
        borderColor: props?.lineColor || '#037ddc',
        backgroundColor: props?.lineColor || '#037ddc',
      }
    ],
  };
  return <Line className='h-full' options={options} data={data} />;
}
