import CardBody from "components/Card/CardBody";
import React, { useEffect } from "react";
import "../../assets/css/workingSchedule.css";
import { createBrowserHistory } from "history";
import Swal from "sweetalert2";

const ConfirmPartTime = () => {
  const styles = {
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "3vh",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
      "& small": {
        color: "#777",
        fontSize: "65%",
        fontWeight: "400",
        lineHeight: "1",
      },
    },
    dateYear: {
      textDecoration: "bold",
      paddingLeft: "1px",
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
      async function fetchDataGTNotAssign() {
        var fetchData = await fetch(
          "http://localhost:8080/api/v1/bookingtours/get-bookings-waitting-confirm"
        );
        var data = await fetchData.json();
        return data;
      }

      async function postAccept(groupId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/confirmGroupBookingTour/" + groupId,
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

      async function postReject(groupId) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/rejectGroupBookingTour/" + groupId,
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

      async function drawTable() {
        var data = await fetchDataGTNotAssign();
        var draw = `<tr class="bg-secondary text-light">
                    <td> Cộng tác viên</td>
                    <td> Thời gian bắt đầu</td>
                    <td> Thời gian kết thúc</td>
                    <td> Thông tin khách</td>
                    <td colspan="2"> Xác nhận</td>
                  </tr>`;
        for (var i = 0; i < data.length; i++) {
          var start = data[i].startTime.split("T");
          var end = data[i].endTime.split("T");
          var startDate = start[0].split("-").reverse().join("-");
          var endDate = end[0].split("-").reverse().join("-");
          draw += `
        
        <tr>
          <td>${data[i].fullname} - ${data[i].username}</td>
          <td>${startDate} ${start[1]}</td>
          <td>${endDate} ${end[1]}</td>`;
          draw += `<td>`;
          for (var j = 0; j < data[i].visitors.length; j++) {
            draw += `${data[i].visitors[j].name} - ${data[i].visitors[j].phone}<br />`;
          }
          draw += `</td>`;
          draw += `<td><button class='btn' style="background-color: #9c27b0; color: white"  data-toggle='modal' data-target='#modalAccept' data-group=${data[i].groupId}>Duyệt</button></td>
                <td><button class='btn btn-danger' data-toggle='modal' data-target='#modalReject' data-group=${data[i].groupId}>Hủy</button></td>`;
          draw += `</tr>`;
        }
        document.getElementById("table").innerHTML = draw;
      }

      async function modalAccept() {
        document.getElementById(
          "modal-accept"
        ).innerHTML = `<div class="modal fade" id="modalAccept" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Phê duyệt</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Bạn có đồng ý phê duyệt
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" id='accept'>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>`;
      }

      async function modalReject() {
        document.getElementById(
          "modal-reject"
        ).innerHTML = `<div class="modal fade" id="modalReject" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Từ chối</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Bạn có chắc chắn từ chối
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" id='reject'>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>`;
      }
      modalAccept();
      modalReject();
      drawTable();

      $("#modalAccept").on("show.bs.modal", function (event) {
        var groupId = $(event.relatedTarget).data("group");
        var modal = $(this);
        document.getElementById('accept').onclick = async function () {
          await postAccept(groupId);
          Swal.fire({
            title: "Thành công!",
            text: "Xác nhận đăng ký thành công",
            icon: "success",
          }).then(() => {
            drawTable();
            $('#modalAccept').modal('hide');
            // location.reload();
          });
        }
      });

      $("#modalReject").on("show.bs.modal", function (event) {
        var groupId = $(event.relatedTarget).data("group");
        var modal = $(this);
        document.getElementById('reject').onclick = async function () {
          await postReject(groupId);
          Swal.fire({
            title: "Thành công!",
            text: "Đã hủy đăng ký thành công",
            icon: "success",
          }).then(() => {
            drawTable();
            $('#modalReject').modal('hide');
             //location.reload();
          });
        }
       
      });

    }
  }); //end useEffect

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
        <CardBody
          style={{
            paddingTop: "0.9375rem",
            paddingRight: "20px",
            paddingBottom: "0.9375rem",
            paddingLeft: "0",
          }}
        >
          <h3>Phê duyệt đăng kí nhóm</h3>
          <table id="table" class="table table-bordered" style={{ position: "initial" }}></table>
          <div id="modal-accept"></div>
          <div id="modal-reject"></div>
        </CardBody>
        {/* </Card> */}
      </body>
    </html>
  );
};

export default ConfirmPartTime;
