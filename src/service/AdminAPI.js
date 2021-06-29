import { API_BASE_URL } from "./Auth";


export async function getAllAccount(search, page) {
    var fetchData
    if (search == '') {
        fetchData = await fetch(API_BASE_URL + "/api/v1/accounts/getAll/" + page)

    }
    else {
        fetchData = await fetch(API_BASE_URL + "/api/v1/accounts/search/" + search + "/" + page)

    }
    var data = fetchData.json()
    return data
}

export async function getAllEvent(search, page) {
    var fetchData
    if (search == '') {
        fetchData = await fetch(API_BASE_URL + "/api/v1/events/getAll/" + page)

    }
    else {
        fetchData = await fetch(API_BASE_URL + "/api/v1/events/search/" + search + "/" + page)

    }
    var data = fetchData.json()
    return data
}

export async function getAllTopics(search, page) {
    var fetchData
    if (search == '') {
        fetchData = await fetch(API_BASE_URL + "/api/v1/topics/getAll/" + page)

    }
    else {
        fetchData = await fetch(API_BASE_URL + "/api/v1/topics/search/" + search + "/" + page)

    }
    var data = fetchData.json()
    return data
}