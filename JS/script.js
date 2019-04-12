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
        //------------------------------ model.Create ------------------------------
        create: function (eintrag) {
            this.datenArray.push(eintrag);
        },
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
        //------------------------------ presenter.btnBackClick ------------------------------
        btnBackClick: function () {
            let daten = model.readAll();
            view.renderList(daten);
        },
        //------------------------------ presenter.btnAddClick ------------------------------
        btnAddClick: function () {
            view.renderNew();
        },
        //------------------------------ presenter.btnAddNeuClick ------------------------------
        btnAddNeuClick: function () {
            // Daten aus dem Formular holen
            let name = view.getName();
            let adresse = view.getAdresse();
            let telefon = view.getTelefon();
            let internet = view.getInternet();

            // Neue Daten der Liste hinzufügen
            model.create({
                'name': name,
                'adresse': adresse,
                'telefon': telefon,
                'internet': internet
            });

            // Daten erneut holen
            let daten = model.readAll();

            // Liste erneut anzeigen mit neuen Daten;
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
            node.removeAttribute('class');
        },
        //------------------------------ view.renderList ------------------------------
        renderList: function (daten) {
            // Gesamte View löschen 
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);

            // Attribut für Anzeige  DIV setzten
            this.anzeigeNode.setAttribute('class', 'collection');

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
                presenter.btnAddClick();
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

            liNodeName.appendChild(nameTextNode);
            liNodeAdresse.appendChild(adresseTextNode);
            liNodeTelefon.appendChild(telefonTextNode);
            liNodeInternet.appendChild(internetTextNode);

            aNodeInternet.appendChild(liNodeInternet);

            ulNode.appendChild(liNodeName);
            ulNode.appendChild(liNodeAdresse);
            ulNode.appendChild(liNodeTelefon);
            ulNode.appendChild(aNodeInternet);

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
                presenter.btnBackClick();
            });
            // Back Button Del zusammensetzen
            iNodeButtonBack.appendChild(iNodeButtonBackText);
            aNodeButtonBack.appendChild(iNodeButtonBack);
            this.buttonNode.appendChild(aNodeButtonBack);
        },
        //------------------------------ view.renderNew ------------------------------
        renderNew: function () {
            // gesamte View löschen
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);

            // Attribut für Anzeige  DIV setzten
            this.anzeigeNode.setAttribute('class', 'row');

            // FormNode erzeugen:            
            const formNode = document.createElement('form');
            formNode.setAttribute('class', 'col s12');

            // Name: Elemente erzeugen
            const divNodeRowName = document.createElement('div');
            divNodeRowName.setAttribute('class', 'row');
            const divNodeInputName = document.createElement('div');
            divNodeInputName.setAttribute('class', 'input-field col s12');
            this.inputName = document.createElement('input');
            this.inputName.setAttribute('id', 'inputName');
            this.inputName.setAttribute('type', 'text');
            this.inputName.setAttribute('class', 'validate');
            const inputLabelName = document.createElement('label');
            inputLabelName.setAttribute('for', 'inputName');
            inputLabelName.setAttribute('class', 'active');
            const textNodeName = document.createTextNode('Name');
            //Name: Elemente zusammensetzen
            inputLabelName.appendChild(textNodeName);
            divNodeInputName.appendChild(this.inputName);
            divNodeInputName.appendChild(inputLabelName);
            divNodeRowName.appendChild(divNodeInputName);

            // Adresse: Elemente erzeugen
            const divNodeRowAdresse = document.createElement('div');
            divNodeRowAdresse.setAttribute('class', 'row');
            const divNodeInputAdresse = document.createElement('div');
            divNodeInputAdresse.setAttribute('class', 'input-field col s12');
            this.inputAdresse = document.createElement('input');
            this.inputAdresse.setAttribute('placeholder', 'Musterstraße 1, 81818 Musterstadt')
            this.inputAdresse.setAttribute('id', 'inputAdresse');
            this.inputAdresse.setAttribute('type', 'text');
            this.inputAdresse.setAttribute('class', 'validate');
            const inputLabelAdresse = document.createElement('label');
            inputLabelAdresse.setAttribute('for', 'inputAdresse');
            inputLabelAdresse.setAttribute('class', 'active');
            const textNodeAdresse = document.createTextNode('Adresse');
            //Adresse: Elemente zusammensetzen
            inputLabelAdresse.appendChild(textNodeAdresse);
            divNodeInputAdresse.appendChild(this.inputAdresse);
            divNodeInputAdresse.appendChild(inputLabelAdresse);
            divNodeRowAdresse.appendChild(divNodeInputAdresse);

            // Telefon: Elemente erzeugen
            const divNodeRowTelefon = document.createElement('div');
            divNodeRowTelefon.setAttribute('class', 'row');
            const divNodeInputTelefon = document.createElement('div');
            divNodeInputTelefon.setAttribute('class', 'input-field col s12');
            this.inputTelefon = document.createElement('input');
            this.inputTelefon.setAttribute('placeholder', '+49 1234 56789')
            this.inputTelefon.setAttribute('id', 'inputTelefon');
            this.inputTelefon.setAttribute('type', 'tel');
            this.inputTelefon.setAttribute('class', 'validate');
            const inputLabelTelefon = document.createElement('label');
            inputLabelTelefon.setAttribute('for', 'inputTelefon');
            inputLabelTelefon.setAttribute('class', 'active');
            const textNodeTelefon = document.createTextNode('Telefon');
            //Telefon: Elemente zusammensetzen
            inputLabelTelefon.appendChild(textNodeTelefon);
            divNodeInputTelefon.appendChild(this.inputTelefon);
            divNodeInputTelefon.appendChild(inputLabelTelefon);
            divNodeRowTelefon.appendChild(divNodeInputTelefon);

            // Internet: Elemente erzeugen
            const divNodeRowInternet = document.createElement('div');
            divNodeRowInternet.setAttribute('class', 'row');
            const divNodeInputInternet = document.createElement('div');
            divNodeInputInternet.setAttribute('class', 'input-field col s12');
            this.inputInternet = document.createElement('input');
            this.inputInternet.setAttribute('placeholder', 'https://www.google.de')
            this.inputInternet.setAttribute('id', 'inputInternet');
            this.inputInternet.setAttribute('type', 'url');
            this.inputInternet.setAttribute('class', 'validate');
            const inputLabelInternet = document.createElement('label');
            inputLabelInternet.setAttribute('for', 'inputInternet');
            inputLabelInternet.setAttribute('class', 'active');
            const textNodeInternet = document.createTextNode('Internet');
            //Internet: Elemente zusammensetzen
            inputLabelInternet.appendChild(textNodeInternet);
            divNodeInputInternet.appendChild(this.inputInternet);
            divNodeInputInternet.appendChild(inputLabelInternet);
            divNodeRowInternet.appendChild(divNodeInputInternet);

            // Einzelne Elemente zur FormNode hinzufügen
            formNode.appendChild(divNodeRowName);
            formNode.appendChild(divNodeRowAdresse);
            formNode.appendChild(divNodeRowTelefon);
            formNode.appendChild(divNodeRowInternet);

            // FormNode der Anzeige hinzufügen
            this.anzeigeNode.appendChild(formNode);

            // Focus auf InputName
            inputName.focus();

            // SpeichernNeu Button erzeugen
            const aNodeButtonSpeichernNeu = document.createElement('a');
            aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2')
            aNodeButtonSpeichernNeu.setAttribute('id', 'speichernNew');
            const iNodeButtonSpeichernNeu = document.createElement('i');
            iNodeButtonSpeichernNeu.setAttribute('class', 'material-icons');
            const iNodeButtonSpeichernNeuText = document.createTextNode('+');
            // Eventlistener Edit Button
            iNodeButtonSpeichernNeu.addEventListener('click', function () {
                presenter.btnAddNeuClick();
            });
            // Edit Button zusammensetzen
            iNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeuText);
            aNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeu);
            this.buttonNode.appendChild(aNodeButtonSpeichernNeu);

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
                presenter.btnBackClick();
            });
            // Back Button Del zusammensetzen
            iNodeButtonBack.appendChild(iNodeButtonBackText);
            aNodeButtonBack.appendChild(iNodeButtonBack);
            this.buttonNode.appendChild(aNodeButtonBack);
        },
        //------------------------------ view.getName ------------------------------
        inputName: null,
        getName: function () {
            let name = this.inputName.value;
            return name;
        },
        //------------------------------ view.getAdresse ------------------------------
        inputAdresse: null,
        getAdresse: function () {
            let adresse = this.inputAdresse.value;
            return adresse;
        },
        //------------------------------ view.getTelefon ------------------------------
        inputTelefon: null,
        getTelefon: function () {
            let telefon = this.inputTelefon.value;
            return telefon;
        },
        //------------------------------ view.getInternet ------------------------------
        inputInternet: null,
        getInternet: function () {
            let internet = this.inputInternet.value;
            return internet;
        }
    };
    //========================== App ====================================
    presenter.init();
})();