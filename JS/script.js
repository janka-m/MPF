(function () {
    'use strict';
    //======================================== Service Worker ========================================
    //------------------------------ serviceWorker.regServiceWorker ------------------------------
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
    //======================================== Model ========================================
    const model = {
        datenArray: [{
                name: "Metzgerwirt",
                adresse: "Poststraße 10, 86857 Hurlach",
                telefon: "08248 7676",
                internet: "https://www.beim-metzgerwirt.de"
            },
            {
                name: "Martha Pizzarei",
                adresse: "Hauptstraße 11, 82256 Fürstenfeldbruck",
                telefon: "08141 3566747",
                internet: "https://www.martha-pizzarei.de"
            },
            {
                name: "Gasthof Alter Wirt",
                adresse: "Moorenweiser Straße 5, 82269 Geltendorf",
                telefon: "08193 7454",
                internet: ""
            }
        ],
        //------------------------------ model.readAll ------------------------------
        readAll: function () {
            return this.datenArray;
        },
        //------------------------------ model.readOne ------------------------------
        readOne: function (index) {
            return this.datenArray[index];
        }
    };

    //======================================== Presenter ========================================
    const presenter = {
        //------------------------------ presenter.init ------------------------------
        init: function () {
            // Daten (Restaurants) ausgeben
            let daten = model.readAll();
            view.init();
            view.renderList(daten);
        },
        //------------------------------ presenter.listElementClick ------------------------------
        listElementClick: function (index) {
            let daten = model.readOne(index);
            view.renderOne(daten);
        },
        //------------------------------ presenter.backButtonClick ------------------------------
        backButtonClick: function () {
            let daten = model.readAll();
            view.renderList(daten);
        }
    };

    //======================================== View ========================================
    const view = {
        anzeigeNode: null,
        buttonNode: null,
        //------------------------------ view.init ------------------------------
        init: function () {
            this.anzeigeNode = document.getElementById('anzeige');
            this.buttonNode = document.getElementById('button');
        },
        //------------------------------ view.loeschen ------------------------------
        loeschen: function (node) {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        },
        //------------------------------ view.renderList ------------------------------
        renderList: function (daten) {
            // Gesamte View löschen 
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);
            // Neue Liste erzeugen 
            for (let index = 0; index < daten.length; index++) {
                const name = daten[index].name;

                const aNodeList = document.createElement('a');
                aNodeList.setAttribute('href', '#!');
                aNodeList.setAttribute('class', 'collection-item  grey lighten-4');
                // Eventhandler Liste
                aNodeList.addEventListener('click', function () {
                    presenter.listElementClick(index)
                });
                const ListTextNode = document.createTextNode(name);
                // Liste zusammensetzen
                aNodeList.appendChild(ListTextNode);
                this.anzeigeNode.appendChild(aNodeList);
            }
            // Add Button erzeugen
            const aNodeButtonAdd = document.createElement('a');
            aNodeButtonAdd.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2')
            aNodeButtonAdd.setAttribute('id', 'add');
            const iNodeButtonAdd = document.createElement('i');
            iNodeButtonAdd.setAttribute('class', 'material-icons');
            const iNodeButtonAddText = document.createTextNode('+');
            // Eventlistener Add Button
            iNodeButtonAdd.addEventListener('click', function () {
                console.log('Button Add');
            });
            // Add Button zusammensetzen
            iNodeButtonAdd.appendChild(iNodeButtonAddText);
            aNodeButtonAdd.appendChild(iNodeButtonAdd);
            this.buttonNode.appendChild(aNodeButtonAdd);
        },
        //------------------------------ view.renderOne ------------------------------
        renderOne: function (daten) {
            // gesamte View löschen
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);
            // Personendetails ausgeben
            const ulNode = document.createElement('ul');
            ulNode.setAttribute('class', 'collection with-header');
            ulNode.setAttribute('style', 'margin:0');

            const liNodeName = document.createElement('li');
            liNodeName.setAttribute('class', 'collection-header grey lighten-2');
            liNodeName.setAttribute('style', 'font-weight:bold;back');

            const liNodeAdresse = document.createElement('li');
            liNodeAdresse.setAttribute('class', 'collection-item grey lighten-4');

            const liNodeTelefon = document.createElement('li');
            liNodeTelefon.setAttribute('class', 'collection-item grey lighten-4');

            const liNodeInternet = document.createElement('li');
            liNodeInternet.setAttribute('class', 'collection-item grey lighten-4');

            const aNodeInternet = document.createElement('a');
            aNodeInternet.setAttribute('href', daten.internet);

            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const internetTextNode = document.createTextNode(daten.internet);

            aNodeInternet.appendChild(internetTextNode);

            liNodeName.appendChild(nameTextNode);
            liNodeAdresse.appendChild(adresseTextNode);
            liNodeTelefon.appendChild(telefonTextNode);
            liNodeInternet.appendChild(aNodeInternet);

            ulNode.appendChild(liNodeName);
            ulNode.appendChild(liNodeAdresse);
            ulNode.appendChild(liNodeTelefon);
            ulNode.appendChild(liNodeInternet);

            this.anzeigeNode.appendChild(ulNode);

            // Edit Button erzeugen
            const aNodeButtonEdit = document.createElement('a');
            aNodeButtonEdit.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2')
            aNodeButtonEdit.setAttribute('id', 'edit');
            const iNodeButtonEdit = document.createElement('i');
            iNodeButtonEdit.setAttribute('class', 'material-icons');
            const iNodeButtonEditText = document.createTextNode('edit');
            // Eventlistener Edit Button
            iNodeButtonEdit.addEventListener('click', function () {
                console.log('Button Edit');
            });
            // Edit Button zusammensetzen
            iNodeButtonEdit.appendChild(iNodeButtonEditText);
            aNodeButtonEdit.appendChild(iNodeButtonEdit);
            this.buttonNode.appendChild(aNodeButtonEdit);

            // Del Button erzeugen
            const aNodeButtonDel = document.createElement('a');
            aNodeButtonDel.setAttribute('class', 'btn-floating btn-large waves-effect waves-light red lighten-2')
            aNodeButtonDel.setAttribute('id', 'del');
            const iNodeButtonDel = document.createElement('i');
            iNodeButtonDel.setAttribute('class', 'material-icons');
            const iNodeButtonDelText = document.createTextNode('del');
            // Eventlistener Del Button
            iNodeButtonDel.addEventListener('click', function () {
                console.log('Button Del');
            });
            // Del Button Del zusammensetzen
            iNodeButtonDel.appendChild(iNodeButtonDelText);
            aNodeButtonDel.appendChild(iNodeButtonDel);
            this.buttonNode.appendChild(aNodeButtonDel);

            // Back Button erzeugen
            const aNodeButtonBack = document.createElement('a');
            aNodeButtonBack.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue-grey lighten-4')
            aNodeButtonBack.setAttribute('id', 'back');
            aNodeButtonBack.setAttribute('style', 'float:left');
            const iNodeButtonBack = document.createElement('i');
            iNodeButtonBack.setAttribute('class', 'material-icons');
            const iNodeButtonBackText = document.createTextNode('back');
            // Eventlistener Back Button
            iNodeButtonBack.addEventListener('click', function () {
                presenter.backButtonClick();
            });
            // Back Button Del zusammensetzen
            iNodeButtonBack.appendChild(iNodeButtonBackText);
            aNodeButtonBack.appendChild(iNodeButtonBack);
            this.buttonNode.appendChild(aNodeButtonBack);
        }
    }
    //========================== App ====================================
    presenter.init();
})();