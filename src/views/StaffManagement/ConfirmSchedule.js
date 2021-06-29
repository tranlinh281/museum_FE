import CardBody from "components/Card/CardBody";
import React, { useEffect } from "react";
import "../../assets/css/workingSchedule.css";
import { createBrowserHistory } from "history";
import Swal from "sweetalert2";

const ConfirmSchedule = () => {
  const styles = {
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "3vh",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "5px",
      textDecoration: "none",
      "& small": {
        color: "#777",
        fontSize: "65%",
        fontWeight: "400",
        lineHeight: "1",
      },
    },
    selectTag: {
      padding: "8px 12px",
      color: "#333333",
      backgroundColor: "#eeeeee",
      border: "1px solid #dddddd",
      cursor: "pointer",
      borderRadius: "5px",
      marginRight: "5px",
    },
    buttonTag: {
      marginRight: "5px",
      backgroundColor: "#9c27b0"
    },
  };

  useEffect(() => {
    const hist = createBrowserHistory();
    if (sessionStorage.getItem("roleLogin") != 2) {
      Swal.fire({
        title: "Thông báo!",
        text: 'Bạn không có quyền truy cập!',
        icon: "warning",
      }).then(() => {
        hist.push("/login")
        // return;
        location.reload();
      })
    } else {
      async function fetchDataTourNotAssign(date) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/getGroupsForAssign/" + date
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataTourguideForAssign(bookingId) {
        var fetchData = await fetch(
          "http://localhost:8080/api/v1/accounts/getTourGuideForAssign/" +
          bookingId
        );
        var data = await fetchData.json();
        return data;
      }

      async function drawTourNotAssign() {
        var dateData = await fetchDateConfirm();
        var draw = `<tr class="bg bg-secondary text-light"><td>Thời gian bắt đầu</td>
                      <td>Thời gian kết thúc</td>
                      <td>Ngôn ngữ</td>
                      <td>Số lượng khách</td>
                      <td>Đoàn</td>
                      <td>Ghép HDV</td>
                      </tr>`;
        for (var i = 0; i < dateData.length; i++) {
          var data = await fetchDataTourNotAssign(dateData[i].date);
          if (data.length > 0) {
            for (var j = 0; j < data.length; j++) {
              if (data[j].assigned == false) {
                draw += `<tr><td>${data[j].startTime}</td>
            <td>${data[j].endTime}</td>
            <td>${data[j].language}</td>
            <td>${data[j].totalQuantity}</td>
            <td>
            `;
                for (var k = 0; k < data[j].btGroups.length; k++) {
                  draw += `Đoàn ${data[j].btGroups[k].bookingTourIds} <br />`;
                }
                draw += `</td><td><button class='btn' id='assign' data-toggle='modal' style="background-color: #9c27b0; width: 80px"
            data-target='#modalAssign' data-booking='${data[j].btGroups[0].bookingTourIds}'><i class="fa fa-user-plus" style="color:white"></i></button></td></tr>`;
              }
            }
          } else {
            draw = "";
          }
        }
        document.getElementById("tour-not-assign").innerHTML = draw;
      }
      drawTourNotAssign();

      function getHourMinute(time) {
        var date = new Date();
        date.setTime(time);
        var splitTime = date.toString().split(" ");
        var splitHoursMinute = splitTime[4].split(":");
        return splitHoursMinute[0] + ":" + splitHoursMinute[1];
      }

      function drawUsername(tag, username, name, idWs) {
        return `<td id='${tag}' data-toggle='modal' data-target='#modalTG' data-idws='${idWs}'>${name}</td>`;
      }

      function drawSlot1DayOfWeek(dowS1, dowS2, dowS3, dow) {
        var draw = "";
        if((dowS1 + dowS2 + dowS3) != 0) {
          if(dowS1 != 0) {
            draw += `<tr><td rowspan='${dowS1 + dowS2 + dowS3}' class='headcol'>${dow}</td>`;
          } else {
            draw += `<tr><td rowspan='${dowS1 + dowS2 + dowS3 + 1}' class='headcol'>${dow}</td>`
          }
        }
        if(dowS1 != 0) {
          draw += `<td rowspan='${dowS1}'>Ca 1</td>`;
        }
        return draw;
      }

      function drawSlot2DayOfWeek(dowS2) {
        if(dowS2 == 0) {
          return "";
        } else {
          return `<tr><td rowspan='${dowS2}'>Ca 2</td>`;
        }
      }

      function drawSlot3DayOfWeek(dowS3) {
        if (dowS3 == 0) {
          return "";
        } else {
          return `<tr><td rowspan='${dowS3}'>Tăng ca</td>`;
        }
      }

      function checkDayAndSlot(check, tag, username, name, idws) {
        var draw = ``;
        if (check === false) {
          draw += drawUsername(tag, username, name, idws);
          draw += `</tr>`;
        } else {
          draw += `<tr>`;
          draw += drawUsername(tag, username, name, idws);
          draw += `</tr>`;
        }
        return draw;
      }
      async function fetchDataUpdateChangeDayWS(date, idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/change-day/" + date + "/" + idWs,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function postTourguideAssign(username, bookingId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/assignTourGuideForGroupTour/" +
          username +
          "/" +
          bookingId,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function fetchDateConfirm() {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/date-not-confirm"
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchUpdateConfirm() {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/update-confirm-schedule",
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
        // var data = await fetchData.json();
        // return data;
      }
      async function fetchDataCheckTime(idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/check-time-by-ws/" + idWs
        );
        var data = await fetchData.json();
        return data;
      }
      async function fetchDataChangeDayWS(idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/info-change-day/" + idWs
        );
        var data = await fetchData.json();
        return data;
      }
      // confirmSchedule()
      async function fetchDataWS() {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/confirm-schedule"
        );
        var data = await fetchData.json();
        if(data.length != 0) {
          data.sort(function (a, b) {
            return a.idSlot - b.idSlot;
          });
      
          data.sort(function (a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
        }
        return data;
      }

      async function fetchSlot() {
        var fetchData = await fetch("http://localhost:8080/api-v1/find-all-slot");
        var data = await fetchData.json();
        return data;
      }

      async function drawH3Date() {
        var date = await fetchDateConfirm();
        var format =
          "Từ " +
          date[0].date.split("-").reverse().join("-") +
          " Đến " +
          date[date.length - 1].date.split("-").reverse().join("-");
        if (document.getElementById("date") == null) {
          console.log("null");
        }
        document.getElementById("date").innerHTML = format;
      }

      async function drawAddTG() {
        var dataSlot = await fetchSlot();
        var draw = ``;
        for (var i = 0; i < dataSlot.length; i++) {
          draw += `<option value='${dataSlot[i].idSlot}'>${dataSlot[i].name}</option>`;
        }
        var dataDate = await fetchDateConfirm();
        var drawDate = ``;
        for (var i = 0; i < dataDate.length; i++) {
          drawDate += `<option value=${dataDate[i].date}>${dataDate[i].date
            .split("-")
            .reverse()
            .join("-")}</option>`;
        }

        var dataLanguage = await fetchAllLanguage();
        var drawLanguage = ``;
        for (var i = 0; i < dataLanguage.length; i++) {
          drawLanguage += `<option value='${dataLanguage[i].languageId}'>${dataLanguage[i].languageName}</option>`;
        }
        document.getElementById("addTGSlot").innerHTML = draw;
        document.getElementById("addTGDate").innerHTML = drawDate;
        document.getElementById('addTGLanguage').innerHTML = drawLanguage;
      }
      async function fetchAllLanguage() {
        var fetchData = await fetch(
          "http://localhost:8080/api/v1/languages/getAll");
        var data = await fetchData.json();
        return data;
      }
      async function fetchDataFindTourGuide(date, language) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/list-for-add-confirm/" + date + '/' + language
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchAddTG(username, slot, date) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/insert-tour-guide-confirm/" +
          username +
          "/" +
          slot +
          "/" +
          date,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

    //   async function fetchWorkingSchedule(from) {
    //     var fetchData = await fetch(
    //       "http://localhost:8080/api-v1/working-schedule/" + from
    //     );
    //     var data = await fetchData.json();
    // data.sort(function (a, b) {
    //   return a.idSlot - b.idSlot;
    // });

    // data.sort(function (a, b) {
    //   var dateA = new Date(a.date);
    //   var dateB = new Date(b.date);
    //   return dateA.getTime() - dateB.getTime();
    // });
    //     return data;
    //   }

      async function fetchGroupTour(workingScheduleId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/group-tour/" + workingScheduleId
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchCheckHaveTour(workingScheduleId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/checkExist/" + workingScheduleId
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchTGSuitable(workingScheduleId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/tourguide-exchange/" + workingScheduleId
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchUpdateAbsentExchange(username, workingScheduleId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/update-absent-exchange/" +
          username +
          "/" +
          workingScheduleId,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function fetchChangeWorkingSchedule(idWsEx, idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/swap-working/" + idWsEx + "/" + idWs,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function findWSById(idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/find-working-schedule-by/" + idWs
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataFindTGForSwap(idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/find-tourguide-swap/" + idWs
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataForChangeTour(groupId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/group-tour-change/" + groupId
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataCheckTimeGt(idGt) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/check-time-by-gt/" + idGt
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataForSwapTour(groupId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/group-tour-swap/" + groupId
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataUpdateChangeTour(groupId, workingScheduleId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/update-tour/" +
          groupId +
          "/" +
          workingScheduleId,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function fetchDataUpdateSwapTour(groupId, groupIdSwap) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/change-tour/" +
          groupId +
          "/" +
          groupIdSwap,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json, text/plain, */*",
            },
          }
        );
      }

      async function fetchDataForTourGuide(idWs) {
        var fetchData = await fetch(
          "http://localhost:8080/api/v1/accounts/info-tourguide/" + idWs
        );
        var data = await fetchData.json();
        return data;
      }

      async function fetchDataForGroupTour(groupId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/get-info-group-tour/" + groupId
        );
        var data = await fetchData.json();
        return data;
      }

      async function drawTable() {
        var workingSchedule = await fetchDataWS();

        var draw = `<tr><th class='headcol'>Thứ</th><th>Ca</th><th>Hướng dẫn viên</th></tr>`;
        var timeTable = `<tr>`;

        var t2s1 = 0;
        var t2s2 = 0;
        var t3s1 = 0;
        var t3s2 = 0;
        var t4s1 = 0;
        var t4s2 = 0;
        var t5s1 = 0;
        var t5s2 = 0;
        var t6s1 = 0;
        var t6s2 = 0;
        var t7s1 = 0;
        var t7s2 = 0;
        var t8s1 = 0;
        var t8s2 = 0;

        var t2s3 = 0;
        var t3s3 = 0;
        var t4s3 = 0;
        var t5s3 = 0;
        var t6s3 = 0;
        var t7s3 = 0;
        var t8s3 = 0;

        var checkt2s1 = false;
        var checkt2s2 = false;
        var checkt3s1 = false;
        var checkt3s2 = false;
        var checkt4s1 = false;
        var checkt4s2 = false;
        var checkt5s1 = false;
        var checkt5s2 = false;
        var checkt6s1 = false;
        var checkt6s2 = false;
        var checkt7s1 = false;
        var checkt7s2 = false;
        var checkt8s1 = false;
        var checkt8s2 = false;

        var checkt2s3 = false;
        var checkt3s3 = false;
        var checkt4s3 = false;
        var checkt5s3 = false;
        var checkt6s3 = false;
        var checkt7s3 = false;
        var checkt8s3 = false;

        for (var i = 0; i < workingSchedule.length; i++) {
          var date = new Date(workingSchedule[i].date);
          if (date.getDay() === 1 && workingSchedule[i].slot === "Ca 1") {
            t2s1++;
          } else if (date.getDay() === 1 && workingSchedule[i].slot === "Ca 2") {
            t2s2++;
          } else if (date.getDay() === 2 && workingSchedule[i].slot === "Ca 1") {
            t3s1++;
          } else if (date.getDay() === 2 && workingSchedule[i].slot === "Ca 2") {
            t3s2++;
          } else if (date.getDay() === 3 && workingSchedule[i].slot === "Ca 1") {
            t4s1++;
          } else if (date.getDay() === 3 && workingSchedule[i].slot === "Ca 2") {
            t4s2++;
          } else if (date.getDay() === 4 && workingSchedule[i].slot === "Ca 1") {
            t5s1++;
          } else if (date.getDay() === 4 && workingSchedule[i].slot === "Ca 2") {
            t5s2++;
          } else if (date.getDay() === 5 && workingSchedule[i].slot === "Ca 1") {
            t6s1++;
          } else if (date.getDay() === 5 && workingSchedule[i].slot === "Ca 2") {
            t6s2++;
          } else if (date.getDay() === 6 && workingSchedule[i].slot === "Ca 1") {
            t7s1++;
          } else if (date.getDay() === 6 && workingSchedule[i].slot === "Ca 2") {
            t7s2++;
          } else if (date.getDay() === 0 && workingSchedule[i].slot === "Ca 1") {
            t8s1++;
          } else if (date.getDay() === 0 && workingSchedule[i].slot === "Ca 2") {
            t8s2++;
          } else if (
            date.getDay() === 1 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t2s3++;
          } else if (
            date.getDay() === 2 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t3s3++;
          } else if (
            date.getDay() === 3 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t4s3++;
          } else if (
            date.getDay() === 4 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t5s3++;
          } else if (
            date.getDay() === 5 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t6s3++;
          } else if (
            date.getDay() === 6 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t7s3++;
          } else if (
            date.getDay() === 0 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            t8s3++;
          }
        }

        var drawt2s1 = drawSlot1DayOfWeek(t2s1, t2s2, t2s3, "Thứ hai");
        var drawt2s2 = drawSlot2DayOfWeek(t2s2);
        var drawt3s1 = drawSlot1DayOfWeek(t3s1, t3s2, t3s3, "Thứ ba");
        var drawt3s2 = drawSlot2DayOfWeek(t3s2);
        var drawt4s1 = drawSlot1DayOfWeek(t4s1, t4s2, t4s3, "Thứ tư");
        var drawt4s2 = drawSlot2DayOfWeek(t4s2);
        var drawt5s1 = drawSlot1DayOfWeek(t5s1, t5s2, t5s3, "Thứ năm");
        var drawt5s2 = drawSlot2DayOfWeek(t5s2);
        var drawt6s1 = drawSlot1DayOfWeek(t6s1, t6s2, t6s3, "Thứ sáu");
        var drawt6s2 = drawSlot2DayOfWeek(t6s2);
        var drawt7s1 = drawSlot1DayOfWeek(t7s1, t7s2, t7s3, "Thứ bảy");
        var drawt7s2 = drawSlot2DayOfWeek(t7s2);
        var drawt8s1 = drawSlot1DayOfWeek(t8s1, t8s2, t8s3, "Chủ nhật");
        var drawt8s2 = drawSlot2DayOfWeek(t8s2);

        var drawt2s3 = drawSlot3DayOfWeek(t2s3);
        var drawt3s3 = drawSlot3DayOfWeek(t3s3);
        var drawt4s3 = drawSlot3DayOfWeek(t4s3);
        var drawt5s3 = drawSlot3DayOfWeek(t5s3);
        var drawt6s3 = drawSlot3DayOfWeek(t6s3);
        var drawt7s3 = drawSlot3DayOfWeek(t7s3);
        var drawt8s3 = drawSlot3DayOfWeek(t8s3);

        for (let i = 0; i < workingSchedule.length; i++) {
          var date = new Date(workingSchedule[i].date);
          var idWs = workingSchedule[i].id;
          var tag = workingSchedule[i].username + "-" + date.getDay();
          if (date.getDay() === 1 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt2s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt2s1 = true;
            drawt2s1 += tempDraw;
          } else if (date.getDay() === 1 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt2s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt2s2 = true;
            drawt2s2 += tempDraw;
          } else if (date.getDay() === 2 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt3s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt3s1 = true;
            drawt3s1 += tempDraw;
          } else if (date.getDay() === 2 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt3s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt3s2 = true;
            drawt3s2 += tempDraw;
          } else if (date.getDay() === 3 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt4s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt4s1 = true;
            drawt4s1 += tempDraw;
          } else if (date.getDay() === 3 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt4s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt4s2 = true;
            drawt4s2 += tempDraw;
          } else if (date.getDay() === 4 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt5s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt5s1 = true;
            drawt5s1 += tempDraw;
          } else if (date.getDay() === 4 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt5s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt5s2 = true;
            drawt5s2 += tempDraw;
          } else if (date.getDay() === 5 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt6s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt6s1 = true;
            drawt6s1 += tempDraw;
          } else if (date.getDay() === 5 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt6s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt6s2 = true;
            drawt6s2 += tempDraw;
          } else if (date.getDay() === 6 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt7s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt7s1 = true;
            drawt7s1 += tempDraw;
          } else if (date.getDay() === 6 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt7s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt7s2 = true;
            drawt7s2 += tempDraw;
          } else if (date.getDay() === 0 && workingSchedule[i].slot === "Ca 1") {
            var tempDraw = checkDayAndSlot(
              checkt8s1,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt8s1 = true;
            drawt8s1 += tempDraw;
          } else if (date.getDay() === 0 && workingSchedule[i].slot === "Ca 2") {
            var tempDraw = checkDayAndSlot(
              checkt8s2,
              tag,
              workingSchedule[i].username,
              workingSchedule[i].name,
              workingSchedule[i].id
            );
            checkt8s2 = true;
            drawt8s2 += tempDraw;
          } else if (
            date.getDay() === 1 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t2s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt2s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt2s3 = true;
              drawt2s3 += tempDraw;
            }
          } else if (
            date.getDay() === 2 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t3s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt3s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt3s3 = true;
              drawt3s3 += tempDraw;
            }
          } else if (
            date.getDay() === 3 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t4s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt4s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt4s3 = true;
              drawt4s3 += tempDraw;
            }
          } else if (
            date.getDay() === 4 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t5s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt5s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt5s3 = true;
              drawt5s3 += tempDraw;
            }
          } else if (
            date.getDay() === 5 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t6s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt6s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt6s3 = true;
              drawt6s3 += tempDraw;
            }
          } else if (
            date.getDay() === 6 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t7s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt7s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt7s3 = true;
              drawt7s3 += tempDraw;
            }
          } else if (
            date.getDay() === 0 &&
            workingSchedule[i].slot === "Tăng ca"
          ) {
            if (t8s3 !== 0) {
              var tempDraw = checkDayAndSlot(
                checkt8s3,
                tag,
                workingSchedule[i].username,
                workingSchedule[i].name,
                workingSchedule[i].id
              );
              checkt8s3 = true;
              drawt8s3 += tempDraw;
            }
          }
        }

        var dateForCalendar = '2020-12-01';

        var startDate = new Date(dateForCalendar);
        var miliSecond = startDate.getTime();

        var startTime = miliSecond + 1800 * 1000;
        var startFormat = new Date();
        startFormat.setTime(startTime);

        var endTime = miliSecond + 39600 * 1000;
        var endFormat = new Date();
        endFormat.setTime(endTime);

        for (var j = startTime; j <= endTime; j += 600000) {
          var hourMinute = getHourMinute(j);
          timeTable += `<td class='sticky-ht'>${hourMinute}</td>`;
        }

        timeTable += `</tr>`;

        for (var i = 0; i < workingSchedule.length; i++) {
          timeTable += `<tr>`;
          var date = new Date(workingSchedule[i].date);
          var idWs = workingSchedule[i].id;
          for (var j = startTime; j <= endTime; j += 600000) {
            var tagTemp = getHourMinute(j);
            var tag =
              workingSchedule[i].username + "-" + date.getDay() + "-" + tagTemp;
            timeTable += `<td id='${tag}' class='bua'>&nbsp;</td>`;
          }
          timeTable += `</tr>`;
        }

        draw += drawt2s1;
        draw += drawt2s2;
        draw += drawt2s3;
        draw += drawt3s1;
        draw += drawt3s2;
        draw += drawt3s3;

        draw += drawt4s1;
        draw += drawt4s2;
        draw += drawt4s3;

        draw += drawt5s1;
        draw += drawt5s2;
        draw += drawt5s3;

        draw += drawt6s1;
        draw += drawt6s2;
        draw += drawt6s3;

        draw += drawt7s1;
        draw += drawt7s2;
        draw += drawt7s3;

        draw += drawt8s1;
        draw += drawt8s2;
        draw += drawt8s3;

        document.getElementById("table").innerHTML = draw;
        document.getElementById("time").innerHTML = timeTable;

        var groupBooking = [];
        for (var i = 0; i < workingSchedule.length; i++) {
          var dataGroup = await fetchGroupTour(workingSchedule[i].id);
          groupBooking.push(dataGroup);
        }

        for (var i = 0; i < groupBooking.length; i++) {
          for (var j = 0; j < groupBooking[i].length; j++) {
            var username = groupBooking[i][j].username;
            var workingScheduleId = groupBooking[i][j].workingScheduleId;
            var id = groupBooking[i][j].id;

            var sDate = new Date(groupBooking[i][j].startTime);
            var eDate = new Date(groupBooking[i][j].endTime);

            var sDateMili = sDate.getTime();
            var eDateMili = eDate.getTime();

            var colspan = 0;
            for (var k = sDateMili; k < eDateMili; k += 600000) {
              colspan++;
            }

            var day = sDate.getDay();
            var tdTimeTour = getHourMinute(sDateMili);
            var count = 0;
            for (var k = sDateMili + 600000; k < eDateMili; k += 600000) {
              var splitTd = getHourMinute(k);
              document
                .getElementById(username + "-" + day + "-" + splitTd)
                .remove();
            }
            var idTd = username + "-" + day + "-" + tdTimeTour;
            var display = getHourMinute(sDate) + " - " + getHourMinute(eDate);
            document.getElementById(idTd).innerHTML = display;
            document.getElementById(idTd).colSpan = colspan;
            document.getElementById(idTd).style.backgroundColor = "red";
            document.getElementById(idTd).dataset.toggle = "modal";
            document.getElementById(idTd).dataset.target = "#modalGT";
            document.getElementById(idTd).dataset.idGt = groupBooking[i][j].id;
          }
        }
      }

      function modalForTourGuide() {
        document.getElementById("modal-tourguide").innerHTML = `
            <div class="modal fade" id="modalTG" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" style="width: 80%">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Thông tin nhân viên</h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div id="inforTG" style="width: 100%; padding-left: 10%"></div>
                            <div style="float: left; width: 30%; text-align: left">
                                <button class='btn btn-danger' id='absent'>Xin nghỉ</button>
                                <div id='form-exchange' style="text-align: left"></div>
                            </div>
                            <div style="float: left;width: 40%; text-align: center">
                              <button class='btn btn-primary' id='chuyen-ngay-lam'>Chuyển ngày làm</button>
                              <div id='form-chuyen-ngay-lam'></div>
                          </div>
                            <div style="float: right; width: 30%; text-align: right">
                                <button class='btn btn-primary' id='swap-working' style="float: right">Đổi ngày làm</button>
                                <div id='form-swap-working' style="float: right"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
      }

      function modalForGroupTour() {
        document.getElementById("modal-grouptour").innerHTML = `
            <div
                class="modal fade"
                id="modalGT"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                    <div class="modal-dialog" style="width: 80%">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Thông tin đoàn</h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div id="infor" style="width: 100%; padding-left: 10%"></div>
                                <div id="GT"></div>
                                <div style="float: left">
                                    <button class="btn btn-primary" id="change-tour" >Chuyển Tour</button>
                                    <div id="form-change-tour"></div>
                                </div>
                                <div style="float: right">
                                    <button class="btn btn-primary" id="swap-tour" style="float: right">Đổi Tour</button>
                                    <div id="form-swap-tour" ></div>
                                </div>
                            </div>
                    </div>
            </div>`;
      }

      function modalConfirmChangeWorking() {
        document.getElementById("confirm-change-working").innerHTML = `
        <div class="modal fade" id="modalConfirmChangeWorking" tabindex="1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Thay đổi hướng dẫn viên</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Xác nhận thay đổi
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                                Đóng
                        </button>
                        <button type="button" class="btn btn-primary" id='confirm'>
                                Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
      }

      function modalConfirmSwapWorking() {
        document.getElementById("confirm-swap-working").innerHTML = `
        <div class="modal fade" id="modalConfirmSwapWorking" tabindex="1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Thay đổi ngày làm việc</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Xác nhận thay đổi
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                                Đóng
                        </button>
                        <button type="button" class="btn btn-primary" id='confirm-swap'>
                                Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
      }

      function modalConfirmChangeTour() {
        document.getElementById("confirm-change-tour").innerHTML = `
        <div class="modal fade" id="modalConfirmChangeTour" tabindex="1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Chuyển tour cho hướng dẫn viên</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Xác nhận Chuyển
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                                Đóng
                        </button>
                        <button type="button" class="btn btn-primary" id='btn-confirm-change-tour'>
                                Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
      }

      function modalConfirmSwapTour() {
        document.getElementById("confirm-swap-tour").innerHTML = `
        <div class="modal fade" id="modalConfirmSwapTour" tabindex="1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Đổi hướng dẫn viên cho tour</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Xác nhận đổi
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                                Đóng
                        </button>
                        <button type="button" class="btn btn-primary" id='btn-confirm-swap-tour'>
                                Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
      }
      function modalConfirmChuyenNgayLam() {
        document.getElementById("confirm-chuyen-ngay-lam").innerHTML = `
          <div class="modal fade" id="modalConfirmChuyenNgayLam" tabindex="1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Chuyển ngày làm cho hướng dẫn viên</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Xác nhận chuyển
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="button" class="btn btn-primary" id='btn-confirm-chuyen-ngay-lam'>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }

      function modalAssignTour() {
        document.getElementById("modal-assign").innerHTML = `
      <div class="modal fade" id="modalAssign" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Thêm HDV cho nhóm</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="align-self: center">
        <select style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px; float:left"  id='data-assign' ></select>
        <div id='quang-button-vo' style="column-span: all"></div>
      </div>
      
    </div>
  </div>
</div>
      `;
      }

      function modalConfirmAssign() {
        document.getElementById("confirm-assign").innerHTML = `
      <div class="modal fade" id="confirmAssign" tabindex="1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Xác nhận ghép</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Bạn có xác nhận ghép hướng dẫn viên?
          </div>
          <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="button" class="btn btn-primary" id='click-cai-la-assign'>
                  Xác nhận
                </button>
              </div>
        </div>
      </div>
    </div>`;
      }

      modalAssignTour();
      modalConfirmAssign();
      modalConfirmChuyenNgayLam();
      modalConfirmChangeWorking();
      modalConfirmSwapWorking();
      modalConfirmChangeTour();
      modalConfirmSwapTour();
      modalForTourGuide();
      modalForGroupTour();

      $("#modalAssign").on("show.bs.modal", async function (event) {
        let booking = $(event.relatedTarget).data("booking");
        var draw = ``;
        var modal = $(this);
        var data = await fetchDataTourguideForAssign(booking);
        for (var i = 0; i < data.length; i++) {
          draw += `<option value='${data[i].username}'>${data[i].fullname} - ${data[i].username}</option>`;
        }
        var draw2 = `<button class='btn' data-toggle='modal' style="background-color: #9c27b0; color: white"  data-target='#confirmAssign' data-booking='${booking}'>Chọn HDV</button>`;
        document.getElementById("data-assign").innerHTML = draw;
        document.getElementById("quang-button-vo").innerHTML = draw2;
      });
      $("#confirmAssign").on("show.bs.modal", async function (event) {
        var select = getSelectedTourguide();
        var booking = $(event.relatedTarget).data("booking");
        var modal = $(this);
        document.getElementById("click-cai-la-assign").onclick = async function () {
          await postTourguideAssign(select, booking).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Ghép HDV thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalAssign').modal('hide');
              $('#confirmAssign').modal('hide');
              drawTourNotAssign();
            });
          });
        }
      });


      function getSelectedTourguide() {
        var select = document.getElementById("data-assign").value;
        return select;
      }

      function getSelectedUsername() {
        var select = document.getElementById("listTG").value;
        return select;
      }
      function getSelectedDate() {
        var select = document.getElementById("info-chuyen-ngay-lam").value;
        return select;
      }
      function getSelectWorkingScheduleId() {
        var select = document.getElementById("listTGSwap").value;
        return select;
      }

      function getSelectedWSForChangeTour() {
        var select = document.getElementById("select-change-tour").value;
        return select;
      }

      function getSelectedWSForSwapTour() {
        var select = document.getElementById("select-swap-tour").value;
        return select;
      }

      $("#vaodi button").on("click", async function findTG() {
        var selectSlot = document.getElementById("addTGSlot").value;
        var selectDate = document.getElementById("addTGDate").value;
        var selectLanguage = document.getElementById('addTGLanguage').value;

        var data = await fetchDataFindTourGuide(selectDate, selectLanguage);
        var drawMain = `<br/><select style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; float:left; margin-left: 122px" id="showFindTG"></select>
                                <button id="handleAddTG" class="btn" style="background-color: #9c27b0; color: white; float: right; margin-right: 222px">Thêm</button>
                            `;
        document.getElementById("mainShow").innerHTML = drawMain;
        var draw = ``;
        for (var i = 0; i < data.length; i++) {
          draw += `<option value='${data[i].username}'>${data[i].fullname} - ${data[i].username}</option>`;
        }
        document.getElementById("showFindTG").innerHTML = draw;

        //Thêm
        $("#mainShow button").on("click", function () {
          var selectSlot = document.getElementById("addTGSlot").value;
          var selectDate = document.getElementById("addTGDate").value;
          var selectUsername = document.getElementById("showFindTG").value;

          fetchAddTG(selectUsername, selectSlot, selectDate).then(
            Swal.fire({
              title: "Thành công!",
              text: "Thêm hướng dẫn viên thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('addTG').modal('hide');
            })
          );
        });
      });

      $("#addTG").on("hide.bs.modal", function (event) {
        document.getElementById("mainShow").innerHTML = "";
      });

      $("#form-exchange").on("click", "#updateAbsentExchange", function (event) {
        document.getElementById("updateAbsentExchange").dataset.toggle = "modal";
        document.getElementById("updateAbsentExchange").dataset.target =
          "#modalConfirmChangeWorking";
      });

      $("#form-swap-working").on("click", "#buttonSwapWorking", function (event) {
        document.getElementById("buttonSwapWorking").dataset.toggle = "modal";
        document.getElementById("buttonSwapWorking").dataset.target =
          "#modalConfirmSwapWorking";
      });

      $("#form-change-tour").on("click", "#show-modal-confirm-change", function (
        event
      ) {
        document.getElementById("show-modal-confirm-change").dataset.toggle =
          "modal";
        document.getElementById("show-modal-confirm-change").dataset.target =
          "#modalConfirmChangeTour";
      });

      $("#form-swap-tour").on("click", "#show-modal-confirm-swap", function (
        event
      ) {
        document.getElementById("show-modal-confirm-swap").dataset.toggle =
          "modal";
        document.getElementById("show-modal-confirm-swap").dataset.target =
          "#modalConfirmSwapTour";
      });

      $("#form-chuyen-ngay-lam").on("click", "#btn-chuyen-ngay-lam", function (
        event
      ) {
        document.getElementById("btn-chuyen-ngay-lam").dataset.toggle = "modal";
        document.getElementById("btn-chuyen-ngay-lam").dataset.target =
          "#modalConfirmChuyenNgayLam";
      });

      $("#modalTG").on("show.bs.modal", async function (event) {
        let idWs = $(event.relatedTarget).data("idws");
        var modal = $(this);
        var scheduleInfo = await findWSById(idWs);
        var day = scheduleInfo.date.split("-");
        var dayShow = day[2] + "-" + day[1] + "-" + day[0];
        var dateOfWeek;
        var thu = new Date(scheduleInfo.date).getDay();
        if (thu === 1) {
          dateOfWeek = "Thứ 2";
        } else if (thu === 2) {
          dateOfWeek = "Thứ 3";
        } else if (thu === 3) {
          dateOfWeek = "Thứ 4";
        } else if (thu === 4) {
          dateOfWeek = "Thứ 5";
        } else if (thu === 5) {
          dateOfWeek = "Thứ 6";
        } else if (thu === 6) {
          dateOfWeek = "Thứ 7";
        } else {
          dateOfWeek = "Chủ nhật";
        }
        modal.find("#WS").text("Work Id: " + idWs);
        var inforTourGuide = await fetchDataForTourGuide(idWs);
        var languageName = [];
        var draw;
        for (var i = 0; i < inforTourGuide.language.length; i++) {
          languageName += " - " + inforTourGuide.language[i] + `<br/>`;
        }
        draw = `<div class="row">
                <div class="col-25" style="width: 50%">
                  <label for="visitorName">Ngày làm: </label>
                </div>
                <div class="col-75">
                  <p>${dateOfWeek}<br/> Ngày: ${dayShow}<p/>
                </div>
              </div>
              <div class="row">
                        <div class="col-25" style="width: 50%">
                            <label for="visitorName">Họ tên hướng dẫn viên: </label>
                        </div>
                        <div class="col-75">
                            <p><br/>${inforTourGuide.fullname}<p/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25" style="width: 50%">
                            <label for="topicName">Số điện thoại: </label>
                        </div>
                        <div class="col-75">
                            <p><br/>${inforTourGuide.phone}<p/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25" style="width: 50%">
                            <label for="startTime">Ngôn ngữ sử dụng: </label>
                        </div>
                        <div class="col-75">
                            <p><br/>${languageName}<p/>
                        </div>
                    </div>`;
        document.getElementById("inforTG").innerHTML = draw;

        //Xin nghỉ
        document.getElementById("absent").onclick = async function () {
          var draw = `<select style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px" id='listTG' onchange='getSelectedUsername();'><option value='0'>Không thay thế</option>`;
          var listTGSuitable = await fetchTGSuitable(idWs);
          for (var i = 0; i < listTGSuitable.length; i++) {
            draw += `
                                <option value='${listTGSuitable[i].username}'>${listTGSuitable[i].fullname}</option>`;
          }
          draw += `</select><br/>
                                <button class='btn btn-success'
                                id='updateAbsentExchange'
                                onclick='exchange();'
                                data-idWs=${idWs}
                                data-username='0'
                                >Chọn người thay thế</button>`;
          document.getElementById("form-exchange").innerHTML = draw;
        }
        document.getElementById("chuyen-ngay-lam").onclick = async function () {
          var checkHaveTour = await fetchCheckHaveTour(idWs);
          if (!checkHaveTour) {
            Swal.fire({
              title: "Thất bại!",
              text: "Hướng dẫn viên đang có nhóm",
              icon: "error",
            });
          } else {
            var draw = `<select id='info-chuyen-ngay-lam' onchange='getSelectedDate();' style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px">`;
            var data = await fetchDataChangeDayWS(idWs);
            for (var i = 0; i < data.length; i++) {
              draw += `<option style="text-align: center" value='${data[i]}'>${data[i]}</option>`;
            }
            draw += `</select>
          <br/>
          <button class='btn btn-success' style="text-align: center" id='btn-chuyen-ngay-lam' data-idWS='${idWs}'>Chọn ngày chuyển</button>
          `;
            document.getElementById("form-chuyen-ngay-lam").innerHTML = draw;
          }
        };
        //swap working
        document.getElementById("swap-working").onclick = async function () {

          var draw = `<select style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px" id='listTGSwap' onchange='getSelectedUsername();'>`;

          var listTGSwap = await fetchDataFindTGForSwap(idWs);
          for (var i = 0; i < listTGSwap.length; i++) {
            var dayOfWeek = new Date(listTGSwap[i].date);
            var thu;
            if (dayOfWeek.getDay() === 0) {
              thu = "Chủ nhật";
            } else if (dayOfWeek.getDay() === 1) {
              thu = "Thứ hai";
            } else if (dayOfWeek.getDay() === 2) {
              thu = "Thứ ba";
            } else if (dayOfWeek.getDay() === 3) {
              thu = "Thứ tư";
            } else if (dayOfWeek.getDay() === 4) {
              thu = "Thứ năm";
            } else if (dayOfWeek.getDay() === 5) {
              thu = "Thứ sáu";
            } else if (dayOfWeek.getDay() === 6) {
              thu = "Thứ bảy";
            }
            draw += `
                                <option value='${listTGSwap[i].idWs}'>${listTGSwap[i].name} - ${thu}</option>`;
          }
          draw += `</select><br/>
                                <button class='btn btn-success' style="float: right"
                                    id='buttonSwapWorking'
                                    onclick='swapWorking();'
                                    data-idWs=${idWs}
                                    >Chọn người đổi</button>`;
          document.getElementById("form-swap-working").innerHTML = draw;
        };
      });

      $("#modalTG").on("hide.bs.modal", function (event) {
        document.getElementById("form-exchange").innerHTML = "";
        document.getElementById("form-swap-working").innerHTML = "";
        document.getElementById("form-chuyen-ngay-lam").innerHTML = "";
      });

      $("#modalGT").on("show.bs.modal", async function (event) {
        let idGt = $(event.relatedTarget).data("idGt");
        var modal = $(this);
        var inforGroup = await fetchDataForGroupTour(idGt);
        var visitorInf = [];
        var topicName = [];
        var dayStart = inforGroup.startTime.slice(0, 10).split("-");
        var dayEnd = inforGroup.endTime.slice(0, 10).split("-");

        var dayStartShow = dayStart[2] + "-" + dayStart[1] + "-" + dayStart[0];
        var dayEndShow = dayEnd[2] + "-" + dayEnd[1] + "-" + dayEnd[0];

        var dateOfWeek;
        var thu = new Date(dayStart).getDay();
        if (thu === 1) {
          dateOfWeek = "Thứ 2";
        } else if (thu === 2) {
          dateOfWeek = "Thứ 3";
        } else if (thu === 3) {
          dateOfWeek = "Thứ 4";
        } else if (thu === 4) {
          dateOfWeek = "Thứ 5";
        } else if (thu === 5) {
          dateOfWeek = "Thứ 6";
        } else if (thu === 6) {
          dateOfWeek = "Thứ 7";
        } else {
          dateOfWeek = "Chủ nhật";
        }
        var draw;
        for (var i = 0; i < inforGroup.visitors.length; i++) {
          visitorInf +=
            inforGroup.visitors[i].name +
            " - SĐT: " +
            inforGroup.visitors[i].phone +
            `<br/>`;
        }
        for (var i = 0; i < inforGroup.topics.length; i++) {
          topicName += inforGroup.topics[i].topicName + `<br/>`;
        }

        draw = `<p style="text-align: center; font-weight: 400; padding-right: 70px">${dateOfWeek} Ngày: ${dayStartShow}</p>
                <div class="row">
                  <div class="col-25" style="width: 50%">
                    <label for="visitorInf">Khách đại diện đoàn: </label>
                  </div>
                  <div class="col-75">
                    <p>${visitorInf}<p/>
                  </div>
                </div>`
        if (topicName != '') {
          draw += `<div class="row">
                  <div class="col-25" style="width: 50%">
                    <label for="topicName">Chuyên đề tham quan: </label>
                  </div>
                  <div class="col-75">
                    <p>${topicName}<p/>
                  </div>
                </div>`
        } else {
          draw += `<div class="row">
                  <div class="col-25" style="width: 50%">
                    <label for="topicName">Sự kiện tham quan: </label>
                  </div>
                  <div class="col-75">
                    <p>${inforGroup.event}<p/>
                  </div>
                </div>`
        }

        draw += `<div class="row">
                <div class="col-25" style="width: 50%">
                  <label for="topicName">Họ tên hướng dẫn viên: </label>
                </div>
                <div class="col-75">
                  <p>${inforGroup.fullname} - ${inforGroup.username}<p/>
                </div>
              </div>
              <div class="row">
                <div class="col-25" style="width: 50%">
                  <label for="topicName">Số điện thoại hướng dẫn viên: </label>
                </div>
              <div class="col-75">
                <p>${inforGroup.phone}<p/>
              </div>
            </div>
            <div class="row">
              <div class="col-25" style="width: 50%">
                <label for="startTime">Thời gian bắt đầu: </label>
              </div>
              <div class="col-75">${inforGroup.startTime.slice(11)}<p/>
              </div>
            </div>
            <div class="row">
              <div class="col-25" style="width: 50%">
                <label for="endTime">Thời gian kết thúc: </label>
              </div>
              <div class="col-75">${inforGroup.endTime.slice(11)}<p/>
              </div>
            </div>`;
        document.getElementById("infor").innerHTML = draw;

        //đổi tour
        document.getElementById("change-tour").onclick = async function () {
          var check = await fetchDataCheckTimeGt(idGt);
          if (check) {
            var listChangeTour = await fetchDataForChangeTour(idGt);
            if (listChangeTour.length === 0) {
              Swal.fire({
                title: "Thất bại!",
                text: "Không có tour phù hợp để chuyển",
                icon: "warning",
              })
            }
            else {
              var draw = `<select id='select-change-tour' style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px; float: left">`;
              for (var i = 0; i < listChangeTour.length; i++) {
                draw += `<option style="font-size: 1rem" value='${listChangeTour[i].workingScheduleId}'>${listChangeTour[i].name}</option>`;
              }
              draw += `</select>`;
              draw += `<br/><button class="btn btn-success" id="show-modal-confirm-change" data-groupId=${idGt}>Chuyển</button>`;
              document.getElementById("form-change-tour").innerHTML = draw;
            }
          } else {
            Swal.fire({
              title: "Thất bại!",
              text: "Đã quá thời gian chuyển tour",
              icon: "error",
            })
          }
        };

        document.getElementById("swap-tour").onclick = async function () {
          var check = await fetchDataCheckTimeGt(idGt);
          if (check) {
            var listSwapTour = await fetchDataForSwapTour(idGt);
            if (listSwapTour.length === 0) {
              Swal.fire({
                title: "Thất bại!",
                text: "Không có tour phù hợp để đổi",
                icon: "warning",
              })
            } else {
              var draw = `<select id='select-swap-tour' style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px; float: right">`;
              for (var i = 0; i < listSwapTour.length; i++) {
                var date = new Date(listSwapTour[i].startDate);
                var format = getHourMinute(date);
                draw += `<option style="font-size: 1rem" value='${listSwapTour[i].groupId}'>${listSwapTour[i].username} đoàn đi ${format}</option>`;
              }
              draw += `</select>`;
              draw += `<br/><button class="btn btn-success" id="show-modal-confirm-swap" style="float: right" data-groupId=${idGt}>Đổi</button>`;
              document.getElementById("form-swap-tour").innerHTML = draw;
            }
          } else {
            Swal.fire({
              title: "Thất bại!",
              text: "Đã quá thời gian đổi tour",
              icon: "error",
            })
          }
        };
      });

      $("#modalGT").on("hide.bs.modal", function (event) {
        document.getElementById("form-change-tour").innerHTML = "";
        document.getElementById("form-swap-tour").innerHTML = "";
      });

      $("#modalConfirmChangeWorking").on("show.bs.modal", function (event) {
        var username = getSelectedUsername();
        var idWs = $(event.relatedTarget).data("idws");
        var modal = $(this);
        document.getElementById("confirm").onclick = async function () {
          await fetchUpdateAbsentExchange(username, idWs).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Cập nhật thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalTG').modal('hide');
              $('#modalConfirmChangeWorking').modal('hide');
            });
          });
        }
       
      });

      $("#modalConfirmSwapWorking").on("show.bs.modal", function (event) {
        var idWs = getSelectWorkingScheduleId();
        var idWsEx = $(event.relatedTarget).data("idws");
        var modal = $(this);
        document.getElementById("confirm-swap").onclick = async function () {
          await fetchChangeWorkingSchedule(idWsEx, idWs).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Cập nhật thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalTG').modal('hide');
              $('#modalConfirmSwapWorking').modal('hide');
            });
          });
        }
      });

      $("#modalConfirmChangeTour").on("show.bs.modal", function (event) {
        var idWs = getSelectedWSForChangeTour();
        var idGt = $(event.relatedTarget).data("groupid");
        var modal = $(this);
        document.getElementById("btn-confirm-change-tour").onclick = async function () {
          await fetchDataUpdateChangeTour(idGt, idWs).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Cập nhật thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalGT').modal('hide');
              $('#modalConfirmChangeTour').modal('hide');
            });
          });
        }
      });

      $("#modalConfirmSwapTour").on("show.bs.modal", function (event) {
        var idGtEx = getSelectedWSForSwapTour();
        var idGt = $(event.relatedTarget).data("groupid");
        var modal = $(this);
        document.getElementById("btn-confirm-swap-tour").onclick = async function () {
          await fetchDataUpdateSwapTour(idGt, idGtEx).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Cập nhật thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalGT').modal('hide');
              $('#modalConfirmSwapTour').modal('hide');
            });
          });
        }
      });
      $("#modalConfirmChuyenNgayLam").on("show.bs.modal", function (event) {
        var date = getSelectedDate();
        var idWs = $(event.relatedTarget).data("idws");
        var modal = $(this);
        document.getElementById("btn-confirm-chuyen-ngay-lam").onclick = async function () {
          await fetchDataUpdateChangeDayWS(date, idWs).then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Cập nhật thành công",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(async function () {
              var date = await fetchDateConfirm();
              drawTable(date[0].date);
              $('#modalTG').modal('hide');
              $('#modalConfirmChuyenNgayLam').modal('hide');
            });
          });
        }
      });

      async function sendEmailConfirm() {
        var fetchData = fetch("http://localhost:8080/api/v1/email/email-confirm", {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json, text/plain, */*",
          },
        });
      }

      $("#confirmbt").on("click", async function () {
        await fetchUpdateConfirm().then(() => {
          Swal.fire({
            title: "Thành công",
            text: "Xác nhận lịch làm thành công",
            icon: "success",
            timer: 2000,
            buttons: false,
          }).then(async function () {
            // var date = await fetchDateConfirm();
            // drawTable(date[0].date);
             location.reload();
            sendEmailConfirm();
          });
        });
      });

      async function checkNull() {
        var check = await fetchDateConfirm();
        if (check.length === 0) {
          document.getElementById('haha').innerHTML = 'Không có ngày xác nhận';
        } else {
          drawAddTG();
          drawTable();
          drawH3Date();
        }
      }
      checkNull();
    }
  }); //end useEffect

  const hist = createBrowserHistory();
  function logoutHandle() {
    hist.push("/login");
    window.location.reload();
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
      </head>
      <body>
        {/* <Button color="primary" style={{ float: 'right' }} onClick={logoutHandle}>Đăng xuất</Button>
                <br />
                <br />
                <br />
                <Card>
                    <CardHeader color="primary">
                        <h5 style={styles.cardTitleWhite}>Xác nhận lịch làm việc hướng dẫn viên trong tuần</h5>
                        <h6 id="date" style={{paddingLeft: "20px"}}></h6>
                    </CardHeader> */}
        <CardBody
          style={{
            overflowX: "scroll",
            paddingTop: "0m",
            paddingRight: "20px",
            paddingBottom: "0",
            paddingLeft: "0",
            margin: "0",
          }}
        >
          <div id='haha'>
            <div id="check-null">
              <h3 id="date"></h3>
              <div id="schedule" style={{ width: "5000px" }}>
                <table
                  id="table"
                  className="table table-bordered"
                  style={{ width: "450px" }}
                ></table>
                <table
                  id="time"
                  className="table table-bordered"
                  style={{ width: "4500px" }}
                ></table>
              </div>
              <div id="modal-tourguide"></div>
              <div id="modal-grouptour"></div>
              <div id="confirm-change-working"></div>
              <div id="confirm-swap-working"></div>
              <div id="confirm-change-tour"></div>
              <div id="confirm-swap-tour"></div>
              <div id="confirm-chuyen-ngay-lam"></div>
              <div id="modal-assign"></div>
              <div id="confirm-assign"></div>
              <table
                id="tour-not-assign"
                className="table table-bordered"
              ></table>
              <div>
                <button
                  id="button-confirm"
                  data-toggle="modal"
                  data-target="#confirm-schedule"
                  class="btn btn-primary"
                  style={styles.buttonTag}
                >
                  Xác nhận lịch làm
              </button>
                <button
                  id="add-TG"
                  data-toggle="modal"
                  data-target="#addTG"
                  class="btn btn-primary"
                  style={{backgroundColor: "#9c27b0", color: "white"}}
                >
                  Thêm HDV 
              </button>
              </div>
              {/* Modal xác nhận lịch làm */}
              <div
                class="modal fade"
                id="confirm-schedule"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Xác nhận lịch làm việc
                    </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body" style={{ alignSelf: "center" }}>
                      Chắc chắn duyệt lịch làm việc?
                  </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                      >
                        Hủy
                    </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        id="confirmbt"
                      >
                        Đồng ý
                    </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal thêm hdv */}
              <div
                class="modal fade"
                id="addTG"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Thêm hướng dẫn viên
                    </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <div id="vaodi" align="center">
                        <select id="addTGLanguage" style={styles.selectTag}></select>
                        <select id="addTGSlot" style={styles.selectTag}></select>
                        <select id="addTGDate" style={styles.selectTag}></select>
                        <button
                          id="findTG"
                          class="btn"
                          onclick="findTG();"
                          style={{ marginLeft: "50px", backgroundColor: "#9c27b0", color: "white" }}
                        >
                          Tìm hướng dẫn viên
                      </button>
                      </div>
                      <div id="mainShow" style={{ textAlign: "center" }} align="center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        {/* </Card> */}
      </body>
    </html>
  );
};

export default ConfirmSchedule;
