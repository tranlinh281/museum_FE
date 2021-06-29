import { Card, Table, TextField } from '@material-ui/core';
import CardBody from 'components/Card/CardBody';
import React, { useEffect } from 'react'
import '../../assets/css/workingSchedule.css'
import { createBrowserHistory } from "history";
import Button from "components/CustomButtons/Button.js";
import Swal from 'sweetalert2';

const StatisticTopic = () => {

  const [from, setFrom] = React.useState()
  const [to, setTo] = React.useState()

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
        lineHeight: "1"
      }
    },
    dateYear: {
      textDecoration: "bold",
      paddingLeft: "1px",
    },
  };

  async function fetchDataOfTopic(from, to) {

    var fetchData = await fetch(
      "http://localhost:8080/api/v1/statistics/statisticTopic/" +
      from +
      "/" +
      to
    )
    var data = await fetchData.json();
    return data;
  }

  async function fetchDataOfEvent(from, to) {
    var fetchData = await fetch(
      "http://localhost:8080/api/v1/statistics/statisticEvent/" +
      from +
      "/" +
      to
    );
    var data = await fetchData.json();
    return data;
  }

  async function checkDate() {
    var dateFrom = new Date(from);
    var dateTo = new Date(to);
    if (dateFrom.getTime() <= dateTo.getTime()) {
      chartTopic(from, to)
      console.log(from)
      chartEvent(from, to);
    } else if (from == undefined || to == undefined) {
      Swal.fire({
        title: "Thông báo!",
        text: 'Yêu cầu chọn ngày để xem thống kê!',
        icon: "warning",
      }).then(() => {
        return;
      })
    }
    else {
      Swal.fire({
        title: "Thông báo!",
        text: 'Thời gian bắt đầu phải bé hơn thời gian kết thúc!',
        icon: "warning",
      }).then(() => {
        return;
      })
    }
  }

  async function chartTopic(from, to) {
    var topic = [];
    var quantity = [];
    var draw = ``
    var complete = 0, cancel = 0, total = 0, totalCom = 0, totalCan = 0;
    var showTitle = []
    var data = await fetchDataOfTopic(from, to)
      .then(async function (res) {
        console.log(res)
        if (res.message != null) {
          Swal.fire({
            title: "Thông báo!",
            text: res.message,
            icon: "warning",
          }).then(() => {
            return;   
          })
         } else if(res == undefined) {
            console.log(res)
          } else {
          for (var i = 0; i < res.length; i++) {
            total += res[i].quantity
            totalCom += res[i].complete
            totalCan += res[i].cancel
          }

          for (var i = 0; i < res.length; i++) {
            topic.push(res[i].name);
            quantity.push(res[i].quantity);
            complete = res[i].complete
            cancel = res[i].cancel
            //% được tính theo tổng số đoàn
            var eventWithPer = Math.round(res[i].quantity / total * 100) + "%"
            var comPer = Math.round(totalCom / total * 100) + "%"
            var canPer = Math.round(totalCan / total * 100) + "%"

            showTitle
              .push(res[i].name + " - " + res[i].quantity + " đoàn => " + eventWithPer)

            //table topic

          }
          draw = `<p style="font-weight: bold">Chuyên đề</p>`
          draw +=
            `<table style="width: 400px">
          <tr style="background-color: grey">
          <td></td>
          <td>Số đoàn</td>
          <td>Tỷ lệ</td>
          </tr>
          <tr>
            <td>Đoàn hoàn thành</td>
            <td>${totalCom}</td>
            <td>${comPer}</td>
          </tr>
          <tr>
            <td>Đoàn hủy</td>
            <td>${totalCan}</td>
            <td>${canPer}</td>
          </tr>
          </table>`

          document.getElementById("tbTopic").innerHTML = draw;
          //Chart cho topic
          var ctx = document.getElementById("pieTopic").getContext("2d");
          var myChart = new Chart(ctx, {
            type: "pie",
            data: {
              labels: showTitle,
              datasets: [
                {
                  data: quantity,
                  backgroundColor: ['#FB3640', '#EFCA08', '#43AA8B', '#253D5B', "pink", "#FFCC66", "#66CC33", "#FFCCCC", "#0099FF", "#3300FF", "#33FF00", "#33CCFF", "#6666CC", "#008800"],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              reposive: true,
              legend: {
                position: 'right'
              },
              plugins: {
                datalables: {
                  color: "#fff",
                  fontSize: "12px"
                }
              }
            }
          });
        }
      })
  }




  //Event
  async function chartEvent(from, to) {
    var event = [];
    var quantity = [];
    var draw = ``
    var complete = 0, cancel = 0, total = 0, totalCom = 0, totalCan = 0;
    var showTitle = []
    var data = await fetchDataOfEvent(from, to)
      .then(async function (res) {
        if (res.message != null) {
          Swal.fire({
            title: "Thông báo!",
            text: res.message,
            icon: "warning",
            timer: 2000,
            buttons: false,
          }).then(() => {
            return;
          })
        } else if(res == undefined) {
          console.log(res)
        }else { 
          for (let i = 0; i < res.length; i++) {
            total += res[i].quantity
            totalCom += res[i].complete
            totalCan += res[i].cancel
          }

          for (var i = 0; i < res.length; i++) {
            event.push(res[i].name);
            quantity.push(res[i].quantity);
            complete = res[i].complete
            cancel = res[i].cancel
            //% được tính theo tổng số đoàn
            var eventWithPer = Math.round(res[i].quantity / total * 100) + "%"
            var comPer = Math.round(totalCom / total * 100) + "%"
            var canPer = Math.round(totalCan / total * 100) + "%"

            showTitle
              .push(res[i].name + " - " + res[i].quantity + " đoàn => " + eventWithPer)

            //table event

          }
          draw = `<p style="font-weight: bold">Sự kiện</p>`
          draw +=
            `<table style="width: 400px">
          <tr style="background-color: grey">
          <td></td>
          <td>Số đoàn</td>
          <td>Tỷ lệ</td>
          </tr>
          <tr>
            <td>Đoàn hoàn thành</td>
            <td>${totalCom}</td>
            <td>${comPer}</td>
          </tr>
          <tr>
            <td>Đoàn hủy</td>
            <td>${totalCan}</td>
            <td>${canPer}</td>
          </tr>
          </table>`

          document.getElementById("tbEvent").innerHTML = draw;
          //Chart cho event
          var ctx = document.getElementById("pieEvent").getContext("2d");
          var myChart = new Chart(ctx, {
            type: "pie",
            data: {
              labels: showTitle,
              datasets: [
                {
                  data: quantity,
                  backgroundColor: ['#FB3640', '#EFCA08', '#43AA8B', '#253D5B', "pink"],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              reposive: true,
              legend: {
                position: 'right'
              },
              plugins: {
                datalables: {
                  color: "#fff"
                }
              }
            },
            hover: false
          });
        }
      })
  }

  const hist = createBrowserHistory();
  function logoutHandle() {
    hist.push('/login')
    window.location.reload();
  }

  const reloadPie = () => {
    document.getElementById("pieTopic").innerHTML = ''
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
        <CardBody style={{ paddingTop: '2rem', paddingRight: '20px', paddingBottom: '2rem', paddingLeft: '15px', height: "80vh" }}>
          <TextField
            label="Từ ngày"
            variant="outlined"
            value={from}
            onChange={(e) => { setFrom(e.target.value) }}
            InputLabelProps={{
              shrink: true
            }}
            type="date"
            required
          />&emsp;
            <TextField
            label="Đến ngày"
            variant="outlined"
            value={to}
            onChange={(e) => { setTo(e.target.value) }}
            InputLabelProps={{
              shrink: true
            }}
            type="date"
            required
          />
          <Button id="check" color="primary" style={{ float: "right" }}
            onClick={() =>
              reloadPie,
              checkDate

            }>
            Xem thống kê
            </Button>
          <br />
          <div style={{ width: "100%" }}>
            <div id="tbTopic" style={{ width: "400px", }}></div>
            <br />

            <canvas id="pieTopic" style={{ maxWidth: "1000px", height: "250px", }} ></canvas>
          </div>
          <br />

          <div style={{ width: "100%", height: "250px",  }}>
            <div id="tbEvent" style={{ width: "400px", }}></div>
            <br />
            <canvas id="pieEvent" style={{ maxWidth: "1000px", height: "250px" }}></canvas>
          </div>
          {/* <div class="chart-wrapper">
            <canvas id="myChart"></canvas>
          </div> */}
          <br />
        </CardBody>
        {/* </Card> */}
      </body>
    </html>
  )
}

export default StatisticTopic;