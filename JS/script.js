(function () {
    'use strict';
    //========================== Service Worker ==================
    const regServiceWorker = function () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./service-worker.js')
                .then(function () {
                    console.log('Service Worker wurde registriert');
                });
        } else {
            console.log('Browser bietet keine Unterstützung für Service Worker');
        }
    };
    //========================== Model ==================


    //========================== Presenter ==================
    const presenter = {
        init: function () {
            //Eventhandler registieren
            const btnAdd = document.getElementById('add');
            const btnEdit = document.getElementById('edit');
            const btnDel = document.getElementById('del');
        }
    };

    //========================== View ==================

    //========================== App ==================
    presenter.init();
})();









