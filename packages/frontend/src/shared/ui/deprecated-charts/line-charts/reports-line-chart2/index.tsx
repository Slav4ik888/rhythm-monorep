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

// import { FC, memo, ReactNode } from "react";
// import Divider from "@mui/material/Divider";
// import { MDBox, MDTypography } from "shared/ui/mui-design-components";
// import { GradientColorName, GreyColor } from 'app/providers/theme';
// import { ChartConfig } from '../../../../../entities/charts/model/types';
// import { DashboardStatisticItem, ResultChanges } from 'entities/dashboard';
// import { TimeUpdated } from './time-updated';
// import { LineChartContainer } from './line-chart';
// import { ReportsLineChartConfig } from './config-type';
// import { DashboardConditionType } from 'entities/condition-type';
// import { ChipsContainer } from 'entities/dashboard/ui/items/chips-container';



// interface Props {
//   bgColor?    : GradientColorName | GreyColor
//   item        : DashboardStatisticItem
//   description : string | ReactNode
//   date        : string
//   chart       : ChartConfig
//   condition?  : DashboardConditionType
//   light?      : boolean // Не понял для чего это, но в Navbar также
//   config      : ReportsLineChartConfig
// }


// export const ReportsLineChart2: FC<Props> = memo(({ bgColor, item, description = "", config, light = false, condition, date, chart }) => {
//   const { title } = item;


//   return (
//     <>
//       <LineChartContainer bgColor={bgColor} chart={chart} />

//       <MDBox pt={3} pb={1} px={1}>
//         <MDBox sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <ChipsContainer item={item} config={config} condition={condition} />
//         <ResultChanges item={item} config={config} />
//       </MDBox>

//         <MDTypography variant="h6" textTransform="none">
//           {title}
//         </MDTypography>
//         <MDTypography component="div" variant="button" color="text" fontWeight="light">
//           {description}
//         </MDTypography>
//         <Divider />
//         <TimeUpdated date={date} light={light} />
//       </MDBox>
//     </>
//   );
// });
