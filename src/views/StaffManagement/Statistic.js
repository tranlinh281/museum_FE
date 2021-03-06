import { Card, styled, TextField } from '@material-ui/core';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import React, { useEffect } from 'react'
import '../../assets/css/workingSchedule.css'
import { createBrowserHistory } from "history";
import Button from "components/CustomButtons/Button.js";
import CardFooter from 'components/Card/CardFooter';
import { Add } from '@material-ui/icons';

const Statistic = () => {

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

  // useEffect(() => {
  // async function getAllDate() {
  //   var fetchData = await fetch("http://localhost:8080/api-v1/get-all-date");
  //   var data = await fetchData.json();
  //   return data;
  // }
  // async function dateFrom() {
  //   var data = await getAllDate();
  //   var draw = "";
  //   for (var i = 0; i < data.length; i++) {
  //     var formatDate = data[i].date.split("-");
  //     var format = formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
  //     draw += `<option value='${data[i].date}'>${format}</option>`;
  //   }
  //   document.getElementById("from").innerHTML = draw;
  // }

  // async function dateTo() {
  //   var data = await getAllDate();
  //   var draw = "";
  //   for (var i = 0; i < data.length; i++) {
  //     var formatDate = data[i].date.split("-");
  //     var format = formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
  //     draw += `<option value='${data[i].date}'>${format}</option>`;
  //   }
  //   document.getElementById("to").innerHTML = draw;
  // }

  async function fetchAllStatistic(from, to) {
    var fetchData = await fetch(
      "http://localhost:8080/api/v1/statistics/statisticFromToAll/" +
      from +
      "/" +
      to
    );
    var data = await fetchData.json();
    return data;
  }

  const [from, setFrom] = React.useState()
  const [to, setTo] = React.useState()

  async function checkDate() {
    var dateFrom = new Date(from);
    var dateTo = new Date(to);
    if (dateFrom.getTime() <= dateTo.getTime()) {
      draw(from, to);
    } else if (from == undefined || to == undefined) {
      swal({
        title: "C???nh b??o",
        text: 'Y??u c???u ch???n ng??y ????? xem th???ng k??!',
        icon: "warning",
        timer: 2000,
        buttons: false,
      }).then(() => {
        return;
      })
    }
    else {
      swal({
        title: "C???nh b??o",
        text: 'Th???i gian b???t ?????u ph???i b?? h??n th???i gian k???t th??c!',
        icon: "warning",
        timer: 2000,
        buttons: false,
      }).then(() => {
        return;
      })
    }
  }

  async function draw(from, to) {
    var mapData = await fetchAllStatistic(from, to)
      .then(async function (res) {
        console.log(res)
        var data = await mapData
        var totalComplete = 0, totalCancel = 0, total;
        if (res.message != null) {
          swal({
            title: "Th??ng b??o!",
            text: res.message,
            icon: "warning",
            timer: 2000,
            buttons: false,
          }).then(() => {
            return;
          })
        }
        //kb ????ng hay k, c???n xem laji
        else if (res == undefined) {
          swal({
            title: "Th??ng b??o!",
            text: 'Ng??y kh??ng th???ng k?? kh??ng c?? d??? li???u!',
            icon: "warning",
            timer: 2000,
            buttons: false,
          }).then(() => {
            return;
          })
        } else {
          for (var i = 0; i < res.length; i++) {
            totalComplete = res[i].complete + totalComplete
            totalCancel = res[i].cancel + totalCancel
          }
          var draw = `
                    <tr>
                      <td colspan="2" style="border-color: white; border-right: 1px"></td>
                      <td colspan="2">T???ng ??o??n: ${totalCancel + totalComplete}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="border-color: white; border-right: 1px"></td>
                      <td>T???ng ho??n th??nh: ${totalComplete}</td>
                      <td>T???ng ??o??n h???y: ${totalCancel}</td>
                    </tr>
                    <tr style="background-color: grey">
                        <td>Ng??y</td>
                        <td>H?????ng d???n vi??n</td>
                        <td>Tour ho??n th??nh</td>
                        <td>Tour h???y</td>
                    </tr>`;
          res.reverse();
          for (var i = 0; i < res.length; i++) {
            var date = res[i].dateStatistic.split("-")
            var dateShow = date[2] + " - " + date[1] + " - " + date[0]
            draw += `<tr><td rowspan='${Object.keys(res[i].dataOfDate).length + 1
              }'>${dateShow}</td>`;

            for (var [key, value] of Object.entries(res[i].dataOfDate)) {
              draw += `<tr>`;
              draw += `<td>${key}</td>`;
              for (var [key2, value2] of Object.entries(value)) {
                draw += `<td>${value2}</td>`;
              }
              draw += `</tr>`;
            }
            draw += `</tr>`;
          }
          document.getElementById("table").innerHTML = draw;
        }

      })
    // .catch(e => {
    //   console.log(e)
    //   swal({
    //     title: "C???nh b??o",
    //     text: 'Ng??y kh??ng h???p l???. Vui l??ng ch???n ng??y tr?????c ng??y hi???n t???i!',
    //     icon: "warning",
    //     timer: 2000,
    //     buttons: false,
    //   }).then(() => {
    //     return;
    //   })
    // })


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
        <CardBody style={{ paddingTop: '2rem', paddingRight: '20px', paddingBottom: '0.9375rem', paddingLeft: '15px', height: "80vh", }}>
          <TextField
            label="T??? ng??y"
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value) }}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            marginRight="2px"
          /> &emsp;
            <TextField
            label="?????n ng??y"
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value) }}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button id="check" color="primary" style={{ float: "right" }} onClick={checkDate} >Xem th???ng k??</Button>
          <table id="table" class="table table-bordered" style={{ marginTop: "30px", position: "initial" }}></table>

        </CardBody>
      </body>
    </html>
  )

}

export default Statistic;