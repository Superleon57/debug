/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.2/firebase-messaging-compat.js"
);

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId: "livapis-55a3a",
    apiKey: "AIzaSyCbPC1COVoxpE1Vyu6tHdPKIfoCBUtgAP4",
    messagingSenderId: "477716057173",
    appId: "1:477716057173:web:04a0ee1daf53152c5198dc",
  });
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const promiseChain = self.clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    });
  // .then(() => {
  //   return self.registration.showNotification('mynotification title ');
  // });
  return promiseChain;
});
