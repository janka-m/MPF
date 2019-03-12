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
                internet: ""
            }
        ],

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
            const divNode = document.createElement('div');
            divNode.classList.add('collection');

            for (let index = 0; index < daten.length; index++) {
                const name = daten[index].name;
                // const adresse = daten[index].adresse;
                // const telefon = daten[index].telefon;
                // const internet = daten[index].internet;

                const aNode = document.createElement('a');
                aNode.setAttribute('href', '#!');
                aNode.setAttribute('class', 'collection-item');
                aNode.setAttribute('onclick','window.open(this.href)');

                const aTextNode = document.createTextNode(name);

                aNode.appendChild(aTextNode);
                divNode.appendChild(aNode);
                this.anzeigeNode.appendChild(divNode);
            }

            // Eventhandler
            
        }
    }
    //========================== App ====================================
    presenter.init();
})();