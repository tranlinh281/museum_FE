import Swal from "sweetalert2";
import { API_BASE_URL } from "./Auth";


const request = async options => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
    });

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    const response = await fetch(options.url, options);
    const json = await response.json();
    if (!response.ok) {
        return Promise.reject(json);
    }
    return json;
};


export async function getAllBookingTour(search, page) {
    let fetchData
    if (search == '') {
        fetchData = await fetch(API_BASE_URL + "/api/v1/bookingtours/getAllBookingTour/" + page)
    }
    else {
        fetchData = await fetch(API_BASE_URL + "/api/v1/bookingtours/search/" + search + "/" + page)
    }
    let data = fetchData.json()
    return data
}

export async function getAllGroupTour(searchDate) {
    let fetchData
    fetchData = await fetch(API_BASE_URL + "/api-v1/getGroupsForAssign/" + searchDate)
    let data = fetchData.json()
    return data
}

export async function getAllVisitors(search, page) {
    let fetchData
    if (search == '') {
        fetchData = await fetch(API_BASE_URL + "/api/v1/visitors/getAll/" + page)
    }
    else {
        fetchData = await fetch(API_BASE_URL + "/api/v1/visitors/search/" + search + "/" + page)
    }
    let data = fetchData.json()
    return data
}

export async function checkSW(startTime) {
    let fetchData = await fetch(API_BASE_URL + "/api-v1/check-auto-schedule/" + startTime)
    let data = await fetchData.json()
    return data;
}

export async function findTG(start, end, langId) {
    let fetchData = await fetch(API_BASE_URL + "/api/v1/accounts/find-tg-suitable?end=" + end + "&language=" + langId + "&start=" + start)
    let data = await fetchData.json()
    return data;
}

export async function getAllRequest() {
    let fetchData = await fetch(API_BASE_URL + "/api-v1/get_request_for_staff")
    let data = await fetchData.json()
    return data;
}

//xin nghỉ
export async function changeSttAbsent(username, workingScheduleId) {
    Swal.fire({
        title: 'Đang tiến hành Xin nghỉ....',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
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

//đỏi ngày làm
export async function changeWorkingSchedule(idWsEx, idWs) {
    Swal.fire({
        title: 'Đang tiến hành Đổi....',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
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

//chuyển nhóm
export async function changeTour(groupId, workingScheduleId) {
    Swal.fire({
        title: 'Đang tiến hành Chuyển....',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
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

//đỏi nhóm
export async function swapTour(groupId, groupIdSwap) {
    Swal.fire({
        title: 'Đang tiến hành Đổi....',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
    var fetchData = await fetch(
        "http://localhost:8080/api-v1/change-tour/" + groupId + "/" + groupIdSwap,
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

//chuyển ngày làm
export async function changeDayWS(date, idWs) {
    Swal.fire({
        title: 'Đang tiến hành Chuyển....',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
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
