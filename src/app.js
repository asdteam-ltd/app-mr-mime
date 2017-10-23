const $app = angular.module('rezcaster', [
  'ui.router',
  'awesome-angular-swipe',
  'ngStorage'
]);



var headerElement = document.querySelector('header');
var metaTagTheme = document.querySelector('meta[name=theme-color]');

//After DOM Loaded
document.addEventListener('DOMContentLoaded', function(event) {
  //On initial load to check connectivity
  if (!navigator.onLine) {
    updateNetworkStatus();
  }

  window.addEventListener('online', updateNetworkStatus, false);
  window.addEventListener('offline', updateNetworkStatus, false);
});

//To update network status
function updateNetworkStatus() {
  if (navigator.onLine) {
    metaTagTheme.setAttribute('content', '#0288d1');
    document.querySelector('body').classList.remove('app__offline');
  }
  else {
    metaTagTheme.setAttribute('content', '#6b6b6b');
    document.querySelector('body').classList.add('app__offline');
  }
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(function(registration) {
//
//         // Registration was successful
//         console.log('ServiceWorker registration successful with    scope: ', registration.scope);
//       }).catch(function(err) {
//
//         // registration failed :(
//         console.log('ServiceWorker registration failed: ', err);
//       });
//   });
// }
