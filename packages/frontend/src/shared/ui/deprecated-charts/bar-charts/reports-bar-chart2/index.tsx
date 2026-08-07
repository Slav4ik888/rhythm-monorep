// /**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// import { FC } from "react";

// // react-chartjs-2 components
// import "chart.js/auto";
// import { Chart } from "react-chartjs-2";

// // @mui material components
// import Divider from "@mui/material/Divider";
// import Icon from "@mui/material/Icon";

// // Material Dashboard 2 React components
// import MDBox from "shared/ui/mui-design-components/md-box";
// import MDTypography from "shared/ui/mui-design-components/md-typography";

// // ReportsBarChart configurations
// import { configs } from "./configs";
// import { ColorName } from 'app/providers/theme';
// import { ChartConfigDatasets } from 'entities/charts';



// interface Props {
//   color?: ColorName
//   title: string
//   description: string | React.ReactNode
//   date: string
//   chart: {
//     labels: any[],
//     datasets: ChartConfigDatasets
//   }
// }

// export const ReportsBarChart2: FC<Props> = ({ color = "dark", title, description = "", date, chart }) => {
//   const { data, options } = configs(chart.labels || [], chart.datasets || {});

//   return (
//     <>
//       <MDBox
//         variant       = "gradient"
//         bgColor       = {"secondary"}
//         borderRadius  = "lg"
//         coloredShadow = {color}
//         height        = "12.5rem"
//         py            = {2}
//         pr            = {0.5}
//       >
//         {/* @ts-ignore */}
//         <Chart type="bar" data={data} options={options} />
//       </MDBox>

//       <MDBox pt={3} pb={1} px={1}>
//         <MDTypography variant="h6" textTransform="capitalize">
//           {title}
//         </MDTypography>
//         <MDTypography component="div" variant="button" color="text" fontWeight="light">
//           {description}
//         </MDTypography>
//         <Divider />
//         <MDBox display="flex" alignItems="center">
//           <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
//             <Icon>schedule</Icon>
//           </MDTypography>
//           <MDTypography variant="button" color="text" fontWeight="light">
//             {date}
//           </MDTypography>
//         </MDBox>
//       </MDBox>
//     </>
//   );
// }
