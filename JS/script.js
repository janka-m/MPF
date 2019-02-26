(function () {
    'use strict';
    //========================== Service Worker =========================
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
    //========================== Model ==================================
    const model = {
        datenArray: [{
            Restaurants: [{
                    name: "Metzgerwirt",
                    adresse: "Poststraße 10, 86857 Hurlach",
                    telefon: "08248 7676",
                    internet: "www.beim-metzgerwirt.de"
                },
                {
                    name: "Martha Pizzarei",
                    adresse: "Hauptstraße 11, 82256 Fürstenfeldbruck",
                    telefon: "08141 3566747",
                    internet: "martha-pizzarei.de"
                },
                {
                    name: "Gasthof Alter Wirt",
                    adresse: "Moorenweiser Straße 5, 82269 Geltendorf",
                    telefon: "08193 7454",
                    internet: null
                }
            ]
        }],

        // READ
        readAll: function () {
            return this.datenArray;
        }
    };

    //========================== Presenter ===============================
    const presenter = {
        init: function () {
            // Daten (Restaurants) ausgeben
            let daten = model.readAll();
            view.init();
            view.renderRead(daten);

        }
    };

    //========================== View ====================================
    const view = {
        anzeigeNode: null,
        ausgabeNode: null,

        init: function () {
            this.anzeigeNode = document.getElementById('anzeige');
            this.ausgabeNode = document.getElementById('ausgabe');
        },
        renderRead: function (daten) {
            //Alles löschen
            while (this.anzeigeNode.firstChild) {
                this.anzeigeNode.removeChild(this.anzeigeNode.firstChild);
            }
            //Neue Liste hinzufügen
        }
    }
    //========================== App ====================================
    presenter.init();
})();