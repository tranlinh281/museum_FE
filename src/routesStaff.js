/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Staff layout
import Visitor from "views/StaffManagement/VisitorManagement"
import BookingTour from "views/StaffManagement/BookingTourManagement"
import { PermIdentity, CalendarToday, Equalizer } from "@material-ui/icons";
import WorkingScheduleWithTour from "views/StaffManagement/WorkingSchedule";
import TabForStatistic from 'views/StaffManagement/TabForStatistic'
import TabForConfirm from 'views/StaffManagement/TabForConfirm'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import UserProfile from "views/UserProfile/UserProfile";
import GroupTour from "views/StaffManagement/GroupTourManagement";
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ConfirmRequest from "views/StaffManagement/ConfirmRequest";
// core components/views for RTL layout

const staffRoutes = [
  {
    path: "/workingSchedule",
    name: "Lịch làm hướng dẫn viên",
    icon: CalendarToday,
    component: WorkingScheduleWithTour,
    layout: "/staff"
  },
  {
    path: "/visitor",
    name: "Khách tham quan",
    icon: TransferWithinAStationIcon,
    component: Visitor,
    layout: "/staff"
  },
  {
    path: "/bookingtour",
    name: "Quản lý đoàn",
    icon: DirectionsBusIcon,
    component: BookingTour,
    layout: "/staff",
  },
  {
    path: "/grouptour",
    name: "Quản lý nhóm",
    icon: SupervisedUserCircleIcon,
    component: GroupTour,
    layout: "/staff"
  },
  {
    path: "/confirm",
    name: "Xác nhận lịch làm",
    icon: AssignmentTurnedInIcon,
    component: TabForConfirm,
    layout: "/staff"
  },
  // {
  //   path: "/request",
  //   name: "Yêu cầu từ HDV",
  //   icon: ContactSupportIcon,
  //   component: ConfirmRequest,
  //   layout: "/staff"
  // },
  {
    path: "/allStatistic",
    name: "Thống kê",
    icon: Equalizer,
    component: TabForStatistic,
    layout: "/staff"
  },
  {
    path: "/userProfile",
    name: "Thông tin cá nhân",
    icon: PermIdentity,
    component: UserProfile,
    layout: "/staff"
  },
];

export default staffRoutes;
