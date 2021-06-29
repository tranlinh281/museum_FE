import { Card, styled } from "@material-ui/core";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useEffect } from "react";
import "../../assets/css/workingSchedule.css";
import { createBrowserHistory } from "history";
import Button from "components/CustomButtons/Button.js";
import Axios from "axios";
import Swal from "sweetalert2";
import { checkSW } from "service/StaffAPI";

const ConfirmWP = () => {
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
      async function fetchConfirmWorkingPlan(month, year) {
        var fetchData = await fetch(
          "http://localhost:8080/api-v1/working-plan?month=" +
          month +
          "&year=" +
          year
        );
        var data = await fetchData.json();
        return data;
      }

      async function confirmWorkingPlan(username, day, status) {
        await Axios.post("http://localhost:8080/api-v1/working-plan/update?date=" + day + "&update=" + status + "&username=" + username)

      }

      async function getTGForAddWP(date) {
        var dataUsername = await fetch("http://localhost:8080/api/v1/accounts/getUsernameForAddWorkingPlan/" + date)
        var data = await dataUsername.json();
        return data;
      }

      async function checkCondition(username, date) {
        let isCheck = await fetch("http://localhost:8080/api-v1/check-condition-wp/" + username + "/" + date);
        var data = isCheck.json();
        return data;
      }


      async function drawWorkingPlan(month, year) {
        var month = parseInt(month);
        var year = parseInt(year);
        var dateData = await fetchConfirmWorkingPlan(month, year);
        dateData.sort(function (a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        var draw = `<tr>
                              <td class="bg-secondary text-light">Thứ hai</td>
                              <td class="bg-secondary text-light">Thứ ba</td>
                              <td class="bg-secondary text-light">Thứ tư</td>
                              <td class="bg-secondary text-light">Thứ năm</td>
                              <td class="bg-secondary text-light">Thứ sáu</td>
                              <td class="bg-secondary text-light">Thứ bảy</td>
                              <td class="bg-secondary text-light">Chủ nhật</td>
                            </tr>`;
        var count = 0;
        for (var i = 0; i < dateData.length; i++) {
          var date = new Date(dateData[i].date);
          var formatDate = dateData[i].date.split("-");
          var format = formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
          if (count === 0) {
            draw += `<tr>`;
            if (date.getMonth() + 1 === month) {
              draw += `<td id='${dateData[i].date}'><b>${formatDate[2]}</b> </br>`;

              draw += `${dateData[i].listTourguides.length} Hướng dẫn viên`;

              draw += `</td>`;
              count++;
            } else {
              draw += `<td id='${dateData[i].date}'></td>`;
              count++;
            }
          } else {
            if (date.getMonth() + 1 === month) {
              draw += `<td id='${dateData[i].date}'><b>${formatDate[2]}</b><br />`;

              draw += `${dateData[i].listTourguides.length} Hướng dẫn viên`;

              draw += `</td>`;
              count++;
            } else {
              draw += `<td id='${dateData[i].date}'></td>`;
              count++;
            }

            if (count == 7) {
              draw += `</tr>`;
              count = 0;
            }
          }
        }

        document.getElementById("main").innerHTML = draw;
        for (var i = 0; i < dateData.length; i++) {
          var date = new Date(dateData[i].date);
          if (date.getMonth() + 1 === month) {
            if (dateData[i].statusWarning === true) {
              document.getElementById(`${dateData[i].date}`).classList =
                "bg-danger text-white";
              document.getElementById(`${dateData[i].date}`).dataset.toggle =
                "modal";
              document.getElementById(`${dateData[i].date}`).dataset.target =
                "#myModalInforTG";
              document.getElementById(`${dateData[i].date}`).value = dateData[i];
            } else if (dateData[i].statusWarning === false) {
              document.getElementById(`${dateData[i].date}`).value = dateData[i];
              document.getElementById(`${dateData[i].date}`).classList =
                "bg-light text-dark";
              document.getElementById(`${dateData[i].date}`).dataset.toggle =
                "modal";
              document.getElementById(`${dateData[i].date}`).dataset.target =
                "#myModalInforTG";
            }
          }
        }
      }

      async function fetchMonthYear() {
        var fetchData = await fetch("http://localhost:8080/api-v1/list-week");
        var data = await fetchData.json();
        return data;
      }

      async function drawSelect() {
        var data = await fetchMonthYear();
        var draw = ``;
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        var currentYear = currentDate.getFullYear();
        var current =
          currentDate.getMonth() + 1 + "-" + currentDate.getFullYear();
        for (var i = 0; i < data.length; i++) {
          draw += `<option value='${data[i]}'>${data[i]}</option>`;
        }
        document.getElementById("select-month").innerHTML = draw;
        document.getElementById("select-month").value = current;
        document.getElementById(
          "ptag"
        ).innerHTML = ` Tháng ${currentMonth} Năm ${currentYear}`;
        drawWorkingPlan(currentMonth, currentYear);
      }

      $("#select-month").on("change", async function (event) {
        console.log($(event));
        var select = document.getElementById("select-month").value;
        var split = select.split("-");
        document.getElementById(
          "ptag"
        ).innerHTML = `Tháng ${split[0]} Năm ${split[1]}`;
        console.log(split[0]);
        await drawWorkingPlan(split[0], split[1]).then(function (result) {
          console.log(result);
          return result;
        });
      });

      drawSelect();

      function drawModalTourGuide() {
        document.getElementById("modalInforTG").innerHTML = `
          <div class="modal fade" id="myModalInforTG" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Thông tin chi tiết</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div id="ifTG" style="margin-left: 5%"></div>
                </div>
                <div class="modal-footer">
                  
                </div>
              </div>
            </div>
          </div>`;
      }
      drawModalTourGuide();

      // $("#modalInforTG").on("hide.bs.modal", function (event) {
      //   document.getElementById("ifTG").innerHTML = "";
      //   // document.getElementById("sgTourguide").innerHTML = "";
      //   // document.getElementById("form-chuyen-ngay-lam").innerHTML = "";
      // });

      //thông tin hdv(có xóa)
      $("#modalInforTG").on("show.bs.modal", async function (event) {
        var draw;
        var dateOfWeek;
        var thu = new Date($(event.relatedTarget)[0].id).getDay()
        if (thu === 1) {
          dateOfWeek = 'Thứ 2'
        } else if (thu === 2) {
          dateOfWeek = 'Thứ 3'
        } else if (thu === 3) {
          dateOfWeek = 'Thứ 4'
        } else if (thu === 4) {
          dateOfWeek = 'Thứ 5'
        } else if (thu === 5) {
          dateOfWeek = 'Thứ 6'
        } else if (thu === 6) {
          dateOfWeek = 'Thứ 7'
        } else {
          dateOfWeek = 'Chủ nhật'
        }

        var day = $(event.relatedTarget)[0].id
        var cutDay = $(event.relatedTarget)[0].id.split("-")
        var dayShow = cutDay[2] + "-" + cutDay[1] + "-" + cutDay[0]
        var listUsernameSg = $(event.relatedTarget)[0].value.listUsernameSuggest
        var listTourguide = $(event.relatedTarget)[0].value.listTourguides
        var modal = $(this);
        var userNameForAdd = await getTGForAddWP(day);
        var valueForAdd;
        draw = `
            <p style="text-align: center; font-weight: bold; padding-right: 70px">${dateOfWeek} Ngày: ${dayShow}</p>
                <div class="row" >
                    <div class="col-md-4" style="width: 100%;" >
                        <i class="fa fa-info-circle" data-toggle="tooltip" title="Những HDV có lịch làm trong ngày ${dayShow} "></i>
                        <label for="visitorName" style="font-weight: bold; color: black">
                        HDV trong ngày: </label>
                    </div>
                    <div class="col-md-4" style="width: 100%;">
                    <i class="fa fa-info-circle" data-toggle="tooltip" title="Những HDV gợi ý trong ngày ${dayShow} "></i>
                        <label for="topicName" style="font-weight: bold; color: black">HDV gợi ý: </label>
                    </div>
                    <div class="col-md-4" style="width: 100%;">
                    <i class="fa fa-info-circle" data-toggle="tooltip" title="Những HDV đủ điều kiện thêm vào ngày ${dayShow} " ></i>
                        <label for="topicName" style="font-weight: bold; color: black">Thêm HDV cho ngày: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4" style="padding-left: 25px">`
        if (listTourguide.length === 0) {
          draw += `<p>Không có HDV</p>`
        } else {
          for (var i in listTourguide) {
            valueForAdd = listTourguide[i].username + "-" + listTourguide[i].fullname + ":" + day;
            var check = await checkCondition(listTourguide[i].username, day);
            if (check) {
              draw += `<p style="padding: 0; margin: 0" >${listTourguide[i].username} - ${listTourguide[i].fullname} 
              <button data-toggle="modal" data-target="#changeSttModal" id="changeStatusTG" value="${valueForAdd}" style=" border: none; color: red; padding: 0; margin-bottom: 15px; font-size: 15px; cursor: pointer;" class="btn">
                  <i class="fa fa-user-times" data-toggle="tooltip" modal-dismiss="modal" title="Xóa HDV!"></i>
              </button>
          </p>
          `
            } else {
              draw += `<p style="padding: 0; margin: 0" >${listTourguide[i].username} - ${listTourguide[i].fullname} 
                                <button data-toggle="modal" data-target="#changeSttModal" id="changeStatusTG" value="${valueForAdd}" style=" border: none; color: red; padding: 0; margin-bottom: 15px; font-size: 15px; cursor: pointer;" class="btn">
                                    <i class="fa fa-user-times" data-toggle="tooltip" modal-dismiss="modal" title="Xóa HDV!"></i>
                                </button>
                            </p>
                            `

            }

          }
        }

        //HDV gọi ý
        draw += `
                    </div>
                    <div class="col-md-4" style="padding-left: 25px">`
        if (listUsernameSg.length === 0) {
          draw += `<p>Không có HDV</p>`
        } else {
          for (var i in listUsernameSg) {
            draw += `<p>${listUsernameSg[i]}</p>`
          }
        }

        //hdv để add
        draw += `
                    </div>
                    <div class="col-md-4" style="padding-left: 25px">
                        <select style="padding: 8px 12px; color: #333333; background-color: #eeeeee; border: 1px solid #dddddd; cursor: pointer; border-radius: 5px; margin-right: 5px" id="sgTourguide" style>`
        if (userNameForAdd.length === 0) {
          draw += `<p>Không có HDV</p>`
        } else {

          for (var i in userNameForAdd) {
            draw += `<option value=${userNameForAdd[i]}>${userNameForAdd[i]}</option>`
          }
        }
        draw +=
          `</select>
                    </div>
                </div>`
        modal.find('.modal-footer').html(`
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
      <button type="button" class="btn btn-primary" data-target='#confirm-save-tourguide' data-toggle='modal' data-day='${day}'>Lưu</button>`)
        document.getElementById("ifTG").innerHTML = draw;
      });
      //thêm

      function drawModalChangeStt() {
        document.getElementById("modalChangeSttTG").innerHTML = `
            <div id="changeSttModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"> 
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Xóa hướng dẫn viên </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-lable="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div id="in4TG"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" id="delete">Đồng ý xóa</button>
                        </div>
                    </div>
                </div>
            </div>`
      }
      drawModalChangeStt();

      //show modal change stt
      $("#modalChangeSttTG").on("show.bs.modal", async function (event) {
        let modal = $(this)
        let draw, val, valname, username, date, fullname;
        val = $(event.relatedTarget)[0].value.split(":")
        valname = val[0].split("-")
        username = valname[0]
        fullname = valname[1]
        date = val[1]
        let wait = false
        var check = await checkCondition(username, date)
        if (check) {
          document.getElementById("in4TG").innerHTML = `<p>Bạn có chắc muốn xóa HDV: ${fullname} - ${username}`
          modal.find('.modal-footer').html(`
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" id="delete">Đồng ý xóa</button>`)
          modal.find("#delete").on("click", async function () {
            // console.log('xóa oke')
            let timeCheck = await checkSW(date)
            if (!timeCheck) {
              await confirmWorkingPlan(username, date, true)
                .then(res => {
                  Swal.fire({
                    title: "Thành công",
                    text: "Xóa hướng dẫn viên thành công",
                    icon: "success",
                  }).then(() => {
                    $('#myModalInforTG').modal('hide');
                    drawSelect()
                    // location.reload();
                  })
                })//end then delete
                .catch(e => {
                  Swal.fire({
                    title: "Thất bại",
                    text: "Không xóa được hướng dẫn viên",
                    icon: "error",
                  }).then(() => {
                    return;
                  })
                })//end catch delete
            } else {

              Swal.fire({
                title: "Thất bại",
                text: "Ngày đã có lịch làm, không xóa được HDV",
                icon: "error",
              }).then(() => {
                return;
              })
            }

          })

        } else {
          document.getElementById("in4TG").innerHTML = `<p>HDV không được xóa</p>`
          modal.find('.modal-footer').html(`
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>`)
        }
      })

      function drawModal() {
        document.getElementById("modalAddTG").innerHTML = `
          <div class="modal fade" id="confirm-save-tourguide" tabindex="1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" size="lg">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Xác nhận thêm HDV</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div id="addTG" style="margin-left: 10%">
                  <p>Bạn có chắc muốn thêm HDV?
                  </div>
                </div>
                <div class="modal-footer">
                  
                </div>
              </div>
            </div>
          </div>`;
      }
      drawModal();

      $("#confirm-save-tourguide").on("show.bs.modal", async function (event) {
        var modal = $(this);
        var day = $(event.relatedTarget).data('day');
        modal.find('.modal-footer').html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
      <button type="button" class="btn btn-primary" id="btn-confirm-save-tourguide" data-dismiss="modal">Lưu</button>`);
        $("#btn-confirm-save-tourguide").click(async function () {
          var username = $('#sgTourguide').find(":selected").text();
          // var day = $(event.relatedTarget)[0].id
          let time = await checkSW(day)
          if (!time) {
            await confirmWorkingPlan(username, day, false)
              .then(res => {
                Swal.fire({
                  title: "Thành công",
                  text: "Thêm hướng dẫn viên thành công",
                  icon: "success",
                }).then(() => {
                  // drawWorkingPlan(month, year)
                  $('#myModalInforTG').modal('hide');
                  drawSelect()
                  // window.location.reload();
                })
              })
              .catch(e => {
                let errMes = '';
                if (e.response.status === 400) {
                  errMes = e.response.data.message
                } else if (e.response.status === 404) {
                  errMes = e.response.data.message
                } else {
                  errMes = 'Không thêm được hướng dẫn viên'
                }
                Swal.fire({
                  title: "Thất bại",
                  text: errMes,
                  icon: "error",
                }).then(() => {

                  return;
                })
              })

          } else {
            Swal.fire({
              title: "Thất bại",
              text: 'Ngày chọn đã có lịch làm, không thêm được HDV',
              icon: "error",
            }).then(() => {

              return;
            })
          }

        })
      })

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
        <CardBody style={{ paddingTop: '0.9375rem', paddingRight: '20px', paddingBottom: '0.9375rem', paddingLeft: '0' }}>
          Chọn tháng:
                        <select style={styles.selectTag} id="select-month" onChange='selectMonth()'></select>
          <h3 id="ptag"></h3>
          <table id="main" class="table table-bordered"></table>

          <div id="modalInforTG"></div>
          <div id="modalAddTG"></div>
          <div id="modalChangeSttTG"></div>
        </CardBody>
        {/* </Card> */}
      </body>
    </html>
  )
}


export default ConfirmWP;
