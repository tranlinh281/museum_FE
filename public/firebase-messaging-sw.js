
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')


var config = {
    apiKey: "AIzaSyDEUWyAaLgDcpJdbbRFBwKy_EPF0mor8kk",
    authDomain: "mess-server.firebaseapp.com",
    databaseURL: "https://mess-server.firebaseio.com",
    projectId: "mess-server",
    storageBucket: "mess-server.appspot.com",
    messagingSenderId: "196557922537",
    appId: "1:196557922537:web:1c64183cb0b0dfc0401078",
    measurementId: "G-1C51CGV46B"
}
firebase.initializeApp(config);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});
// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function (payload) {
//   const promiseChain = clients
//     .matchAll({
//       type: "window",
//       includeUncontrolled: true,
//     })
//     .then((windowClients) => {
//       for (let i = 0; i < windowClients.length; i++) {
//         const windowClient = windowClients[i];
//         windowClient.postMessage(payload);
//       }
//     })
//     .then(() => {
//       return registration.showNotification("my notification title");
//     });
//   return promiseChain;
// });
// self.addEventListener("notificationclick", function (event) {
//   console.log(event);
// });

