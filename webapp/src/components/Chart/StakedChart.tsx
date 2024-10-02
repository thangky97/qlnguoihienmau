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


export default function StakedChart(props: any) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: props?.chartTitle || ""
      },
    },
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  function randomIntFromInterval() { // min and max included 
    return Math.floor(Math.random() * (1000 - 0 + 1) + 0)
  }
  const data = {
    labels,
    datasets: [
      {
        label: props?.stake1Title || 'Dataset 1',
        data: labels.map(() => randomIntFromInterval()),
        backgroundColor: props?.bar1Color || 'rgb(255, 99, 132)',
        stack: 'Stack 0',
      },
      {
        label: props?.stake2Title || 'Dataset 2',
        data: labels.map(() => randomIntFromInterval()),
        backgroundColor: props?.bar2Color || 'rgb(75, 192, 192)',
        stack: 'Stack 0',
      }
    ],
  };
  return <Bar className='h-full' options={options} data={data} />;
}
