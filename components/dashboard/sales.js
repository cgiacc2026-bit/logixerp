import { Bar } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSelector } from "react-redux";

export const Sales = (props) => {
  const theme = useTheme();

  const { data, loading, error } = useSelector((state) => state.data);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const incomeArray =
    Array.isArray(data?.incomeArray) && data.incomeArray.length > 0
      ? data.incomeArray.map((v) => Number(v) || 0)
      : [18, 12, 19, 27, 29, 22, 25];

  const expenseArray =
    Array.isArray(data?.expenseArray) && data.expenseArray.length > 0
      ? data.expenseArray.map((v) => Number(v) || 0)
      : [12, 8, 14, 18, 15, 11, 13];

  const labels =
    Array.isArray(data?.finalDateArray) && data.finalDateArray.length > 0
      ? data.finalDateArray
      : ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 Aug"];

  const data1 = {
    datasets: [
      {
        backgroundColor: "#3F51B5",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: incomeArray,
        label: "Income",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#e53935",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: expenseArray,
        label: "Expense",
        maxBarThickness: 10,
      },
    ],
    labels: labels,
  };

  const options = {
    animation: false,
    layout: { padding: 0 },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        enabled: true,
        footerColor: theme.palette.text.secondary,
        intersect: false,
        mode: "index",
        titleColor: theme.palette.text.primary,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.secondary,
          precision: 0,
        },
        grid: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <Card {...props}>
      <CardHeader
        action={
          <Button endIcon={<ArrowDropDownIcon fontSize="small" />} size="small">
            Last 7 days
          </Button>
        }
        title="Latest Income/Expense "
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data1} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};
