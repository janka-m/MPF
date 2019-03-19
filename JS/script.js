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
            this.buttonNode = document.getElementById('button');
        },
        //========================== loeschen ====================================
        loeschen: function (node) {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        },
        //========================== render List ====================================
        renderList: function (daten) {
            //========================== Alles löschen ====================================
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);
            //========================== Neue Liste erzeugen ====================================
            for (let index = 0; index < daten.length; index++) {
                const name = daten[index].name;

                const aNodeList = document.createElement('a');
                aNodeList.setAttribute('href', '#!');
                aNodeList.setAttribute('class', 'collection-item');
                //========================== Eventhandler Liste ====================================
                aNodeList.addEventListener('click', function () {
                    presenter.listElementClick(index)
                });
                const ListTextNode = document.createTextNode(name);
                //========================== Liste zusammensetzen ====================================
                aNodeList.appendChild(ListTextNode);
                this.anzeigeNode.appendChild(aNodeList);
            }
            //========================== Button Add erzeugen ====================================
            const aNodeButtonAdd = document.createElement('a');
            aNodeButtonAdd.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2')
            aNodeButtonAdd.setAttribute('id', 'add');

            const iNodeButtonAdd = document.createElement('i');
            iNodeButtonAdd.setAttribute('class', 'material-icons');
            //========================== Eventlistener Button ====================================
            iNodeButtonAdd.addEventListener('click', function () {
                console.log('Button Add');
            });
            const iNodeButtonAddText = document.createTextNode('+');
            //========================== Button zusammensetzen ====================================
            iNodeButtonAdd.appendChild(iNodeButtonAddText);
            aNodeButtonAdd.appendChild(iNodeButtonAdd);
            this.buttonNode.appendChild(aNodeButtonAdd);
        },
        //========================== render One ====================================
        renderOne: function (daten) {
            //========================== Alles löschen ====================================
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);
            //========================== Personendetails ausgeben ====================================

            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const internetTextNode = document.createTextNode(daten.internet);


            this.anzeigeNode.appendChild(nameTextNode);
            this.anzeigeNode.appendChild(adresseTextNode);
            this.anzeigeNode.appendChild(telefonTextNode);
            this.anzeigeNode.appendChild(internetTextNode);


        }
    }
    //========================== App ====================================
    presenter.init();
})();