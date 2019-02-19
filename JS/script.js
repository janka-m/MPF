'use strict';

if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('./service-worker.js')
    .then(function(){
        console.log('Service Worker wurde registriert');
    });
} else {
    console.log('Browser bietet keine Unterstützung für Service Worker');
}