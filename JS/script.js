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
        buttonNode: null,
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
            //========================== Eventlistener Button Add ====================================
            iNodeButtonAdd.addEventListener('click', function () {
                console.log('Button Add');
            });
            const iNodeButtonAddText = document.createTextNode('+');
            //========================== Button Add zusammensetzen ====================================
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
            const ulNode = document.createElement('ul');
            ulNode.setAttribute('class', 'collection with-header');

            const liNodeName = document.createElement('li');
            liNodeName.setAttribute('class', 'collection-header');

            const liNodeAdresse = document.createElement('li');
            liNodeAdresse.setAttribute('class', 'collection-item');

            const liNodeTelefon = document.createElement('li');
            liNodeTelefon.setAttribute('class', 'collection-item');

            const liNodeInternet = document.createElement('li');
            liNodeInternet.setAttribute('class', 'collection-item');

            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const internetTextNode = document.createTextNode(daten.internet);

            liNodeName.appendChild(nameTextNode);
            liNodeAdresse.appendChild(adresseTextNode);
            liNodeTelefon.appendChild(telefonTextNode);
            liNodeInternet.appendChild(internetTextNode);

            ulNode.appendChild(liNodeName);
            ulNode.appendChild(liNodeAdresse);
            ulNode.appendChild(liNodeTelefon);
            ulNode.appendChild(liNodeInternet);

            this.anzeigeNode.appendChild(ulNode);

            //========================== Button Edit erzeugen ====================================
            const aNodeButtonEdit = document.createElement('a');
            aNodeButtonEdit.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2')
            aNodeButtonEdit.setAttribute('id', 'edit');
            const iNodeButtonEdit = document.createElement('i');
            iNodeButtonEdit.setAttribute('class', 'material-icons');
            //========================== Eventlistener Button Edit ====================================
            iNodeButtonEdit.addEventListener('click', function () {
                console.log('Button Edit');
            });
            const iNodeButtonEditText = document.createTextNode('edit');
            //========================== Button Edit zusammensetzen ====================================
            iNodeButtonEdit.appendChild(iNodeButtonEditText);
            aNodeButtonEdit.appendChild(iNodeButtonEdit);
            this.buttonNode.appendChild(aNodeButtonEdit);

            //========================== Button Del erzeugen ====================================
            const aNodeButtonDel = document.createElement('a');
            aNodeButtonDel.setAttribute('class', 'btn-floating btn-large waves-effect waves-light red lighten-2')
            aNodeButtonDel.setAttribute('id', 'del');
            const iNodeButtonDel = document.createElement('i');
            iNodeButtonDel.setAttribute('class', 'material-icons');
            //========================== Eventlistener Button Del ====================================
            iNodeButtonDel.addEventListener('click', function () {
                console.log('Button Del');
            });
            const iNodeButtonDelText = document.createTextNode('del');
            //========================== Button Del zusammensetzen ====================================
            iNodeButtonDel.appendChild(iNodeButtonDelText);
            aNodeButtonDel.appendChild(iNodeButtonDel);
            this.buttonNode.appendChild(aNodeButtonDel);
        }
    }
    //========================== App ====================================
    presenter.init();
})();