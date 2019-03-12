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
        //========================== readAll ===============================
        readAll: function () {
            return this.datenArray;
        },
        //========================== readOne ===============================
        readOne: function (index) {
            return this.datenArray[index];
        }
    };

    //========================== Presenter ===============================
    const presenter = {
        //========================== init ===============================
        init: function () {
            // Daten (Restaurants) ausgeben
            let daten = model.readAll();
            view.init();
            view.renderList(daten);
        },
        //========================== listElementClick ===============================
        listElementClick: function (index) {
            let daten = model.readOne(index);
            view.renderOne(daten);
        }
    };

    //========================== View ====================================
    const view = {
        anzeigeNode: null,
        ausgabeNode: null,
        //========================== init ====================================
        init: function () {
            this.anzeigeNode = document.getElementById('anzeige');
        },
        //========================== render List ====================================
        renderList: function (daten) {
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
                // Eventhandler
                aNode.addEventListener('click', function () {
                    presenter.listElementClick(index)
                });
                aNode.setAttribute('href', '#!');
                aNode.setAttribute('class', 'collection-item');

                const aTextNode = document.createTextNode(name);

                aNode.appendChild(aTextNode);
                divNode.appendChild(aNode);
                this.anzeigeNode.appendChild(divNode);
            }
        },
        //========================== render One ====================================
        renderOne: function (daten) {
            //Alles löschen
            while (this.anzeigeNode.firstChild) {
                this.anzeigeNode.removeChild(this.anzeigeNode.firstChild);
            }
            //Neue Liste hinzufügen
            const divNode = document.createElement('div');
            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const internetTextNode = document.createTextNode(daten.internet);


            divNode.appendChild(nameTextNode);
            divNode.appendChild(adresseTextNode);
            divNode.appendChild(telefonTextNode);
            divNode.appendChild(internetTextNode);
            this.anzeigeNode.appendChild(divNode);

        }
    }
    //========================== App ====================================
    presenter.init();
})();