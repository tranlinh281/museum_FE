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
// import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Admin layout
import AccountManagement from "views/AdminManagement/AccountManagement";
import StaffManagement from "views/AdminManagement/StaffManagement";
import TopicManagement from "views/Topic/TopicManagement";
import { Settings, Event,  Book, AccountCircle, RecentActors, PermIdentity } from "@material-ui/icons";
import EventManagement from "views/Event/EventManagement";
import userProfile from "views/UserProfile/UserProfile"
import ManualSchedule from "views/AdminManagement/ManualSchedule";

const dashboardRoutes = [
  {
    path: "/account",
    name: "Quản lý tài khoản",
    icon: AccountCircle,
    component: AccountManagement,
    layout: "/admin"
  },
  {
    path: "/infor",
    name: "Quản lý nhân viên",
    icon: RecentActors,
    component: StaffManagement,
    layout: "/admin"
  },
  {
    path: "/topic",
    name: "Quản lý chuyên đề",
    icon: Book,
    component: TopicManagement,
    layout: "/admin"
  },
  {
    path: "/event",
    name: "Quản lý sự kiện",
    icon: Event,
    component: EventManagement,
    layout: "/admin"
  },
  {
    path: "/userProfile",
    name: "Thông tin cá nhân",
    icon: PermIdentity,
    component: userProfile,
    layout: "/admin"
  },
  {
    path: "/manualSchedule",
    name: "Xếp lịch thủ công",
    icon: Settings,
    component: ManualSchedule,
    layout: "/admin"
  }
];

export default dashboardRoutes;
