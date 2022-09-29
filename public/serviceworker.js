const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

// Now we have to listen for the three different Events

const self = this; //without this line the self will throw error of global variable use

//Install ServiceWorker
self.addEventListener("install", (event) => {
  // this will wait until the event that we are registering is finished
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened Cache");

        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log("error in add caching", err);
      })
  );
}); //self here is indicating the serviceWorker itself

//Listen For request on serviceWorker
// self.addEventListener("fetch", (event) => {
//   //this event.respondWith function will trigger whenever we notice an event and it respond with the following fetch call
//   event.respondWith(
//     caches.match(event.request).then(() => {
//       return fetch(event.request).catch(() => caches.match("offline.html"));
//     })
//   );
// });

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

//Activate the ServiceWorker
self.addEventListener("activate", (event) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
