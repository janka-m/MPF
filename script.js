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
        presenter.init();
    };
    //======================================== Model ========================================
    const model = {
        datenArray: [],
        //------------------------------ model.init ------------------------------
        init: function () {
            this.datenArray = dao.lesen();
        },
        //------------------------------ model.Create ------------------------------
        create: function (eintrag) {
            this.datenArray.push(eintrag);
            dao.schreiben(this.datenArray);
        },
        //------------------------------ model.readAll ------------------------------
        readAll: function () {
            return this.datenArray;
        },
        //------------------------------ model.readOne ------------------------------
        readOne: function (index) {
            return this.datenArray[index];
        },
        //------------------------------ model.update ------------------------------
        update: function (eintrag, index) {
            this.datenArray[index] = eintrag;
            dao.schreiben(this.datenArray);
        },
        //------------------------------ model.delete ------------------------------
        delete: function (index) {
            this.datenArray.splice(index, 1);
            dao.schreiben(this.datenArray);
        }
    };

    //======================================== Presenter ========================================
    const presenter = {
        //------------------------------ presenter.init ------------------------------
        init: function () {
            // Daten vom LocalStorage aktuallisieren
            model.init();
            let daten = model.readAll();
            // Daten (Restaurants) ausgeben
            view.init();
            view.renderList(daten);
        },
        //------------------------------ presenter.listElementClick ------------------------------
        listElementClick: function (index) {
            let daten = model.readOne(index);
            view.renderOne(daten, index);
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
        //------------------------------ presenter.btnAddSpeichernClick ------------------------------
        btnAddSpeichernClick: function () {
            // Daten aus dem Formular holen
            let name = view.getName();
            let adresse = view.getAdresse();
            let telefon = view.getTelefon();
            let url = view.getURL();

            // Neue Daten der Liste hinzufügen
            model.create({
                'name': name,
                'adresse': adresse,
                'telefon': telefon,
                'url': url
            });

            // Daten erneut holen
            let daten = model.readAll();

            // Liste erneut anzeigen mit neuen Daten;
            view.renderList(daten);
        },
        //------------------------------ presenter.btnEditClick ------------------------------
        btnEditClick: function (daten, index) {
            view.renderEdit(daten, index);
        },
        //------------------------------ presenter.btnEditSpeichernClick ------------------------------
        btnEditSpeichernClick: function (index) {
            // Daten aus dem Formular holen
            let eintrag = {};
            eintrag.name = view.getName();
            eintrag.adresse = view.getAdresse();
            eintrag.telefon = view.getTelefon();
            eintrag.url = view.getURL();

            // alten Datensatz überschreiben
            model.update(eintrag, index);

            // Daten erneut holen
            let daten = model.readAll();

            // Liste erneut anzeigen mit neuen Daten;
            view.renderList(daten);
        },
        //------------------------------ presenter.btnDelClick ------------------------------
        btnDelClick: function (index) {
            // Datensatz löschen
            model.delete(index);
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
            node.removeAttribute('class');
            node.removeAttribute('style');
        },
        //------------------------------ view.renderList ------------------------------
        renderList: function (daten) {
            // Gesamte View löschen 
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);

            // Attribut für Anzeige DIV setzten
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
        renderOne: function (daten, index) {
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

            const liNodeURL = document.createElement('li');
            liNodeURL.setAttribute('class', 'collection-item grey lighten-4');

            const aNodeURL = document.createElement('a');
            aNodeURL.setAttribute('href', daten.url);

            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const urlTextNode = document.createTextNode(daten.url);

            liNodeName.appendChild(nameTextNode);
            liNodeAdresse.appendChild(adresseTextNode);
            liNodeTelefon.appendChild(telefonTextNode);
            liNodeURL.appendChild(urlTextNode);

            aNodeURL.appendChild(liNodeURL);

            ulNode.appendChild(liNodeName);
            ulNode.appendChild(liNodeAdresse);
            ulNode.appendChild(liNodeTelefon);
            ulNode.appendChild(aNodeURL);

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
                presenter.btnEditClick(daten, index);
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
                presenter.btnDelClick(index);
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
            this.anzeigeNode.setAttribute('style', 'margin:0 10%');

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

            // URL: Elemente erzeugen
            const divNodeRowURL = document.createElement('div');
            divNodeRowURL.setAttribute('class', 'row');
            const divNodeInputURL = document.createElement('div');
            divNodeInputURL.setAttribute('class', 'input-field col s12');
            this.inputURL = document.createElement('input');
            this.inputURL.setAttribute('placeholder', 'https://www.google.de')
            this.inputURL.setAttribute('id', 'inputURL');
            this.inputURL.setAttribute('type', 'url');
            this.inputURL.setAttribute('class', 'validate');
            const inputLabelURL = document.createElement('label');
            inputLabelURL.setAttribute('for', 'inputURL');
            inputLabelURL.setAttribute('class', 'active');
            const textNodeURL = document.createTextNode('Webadresse');
            //URL: Elemente zusammensetzen
            inputLabelURL.appendChild(textNodeURL);
            divNodeInputURL.appendChild(this.inputURL);
            divNodeInputURL.appendChild(inputLabelURL);
            divNodeRowURL.appendChild(divNodeInputURL);

            // Einzelne Elemente zur FormNode hinzufügen
            formNode.appendChild(divNodeRowName);
            formNode.appendChild(divNodeRowAdresse);
            formNode.appendChild(divNodeRowTelefon);
            formNode.appendChild(divNodeRowURL);

            // FormNode der Anzeige hinzufügen
            this.anzeigeNode.appendChild(formNode);

            // Focus auf InputName
            inputName.focus();

            // NeuSpeichern Button erzeugen
            const aNodeButtonSpeichernNeu = document.createElement('a');
            aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2')
            aNodeButtonSpeichernNeu.setAttribute('id', 'speichernNew');
            const iNodeButtonSpeichernNeu = document.createElement('i');
            iNodeButtonSpeichernNeu.setAttribute('class', 'material-icons');
            const iNodeButtonSpeichernNeuText = document.createTextNode('+');
            // Eventlistener NeuSpeichernButton
            iNodeButtonSpeichernNeu.addEventListener('click', function () {
                presenter.btnAddSpeichernClick();
            });
            // NeuSpeichernButton zusammensetzen
            iNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeuText);
            aNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeu);
            this.buttonNode.appendChild(aNodeButtonSpeichernNeu);

            // BackButton erzeugen
            const aNodeButtonBack = document.createElement('a');
            aNodeButtonBack.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue-grey lighten-4')
            aNodeButtonBack.setAttribute('id', 'back');
            aNodeButtonBack.setAttribute('style', 'float:left');
            const iNodeButtonBack = document.createElement('i');
            iNodeButtonBack.setAttribute('class', 'material-icons');
            const iNodeButtonBackText = document.createTextNode('back');
            // EventlistenerBack Button
            iNodeButtonBack.addEventListener('click', function () {
                presenter.btnBackClick();
            });
            // BackButton Del zusammensetzen
            iNodeButtonBack.appendChild(iNodeButtonBackText);
            aNodeButtonBack.appendChild(iNodeButtonBack);
            this.buttonNode.appendChild(aNodeButtonBack);
        },
        //------------------------------ view.renderEdit ------------------------------
        renderEdit: function (daten, index) {
            // gesamte View löschen
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);

            // Attribut für Anzeige  DIV setzten
            this.anzeigeNode.setAttribute('class', 'row');
            this.anzeigeNode.setAttribute('style', 'margin:0 10%');

            // FormNode erzeugen:            
            const formNode = document.createElement('form');
            formNode.setAttribute('class', 'col s12');

            // Name: Elemente erzeugen
            const divNodeRowName = document.createElement('div');
            divNodeRowName.setAttribute('class', 'row');
            const divNodeInputName = document.createElement('div');
            divNodeInputName.setAttribute('class', 'input-field col s12');
            this.inputName = document.createElement('input');
            this.inputName.value = daten.name;
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
            this.inputAdresse.value = daten.adresse;
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
            this.inputTelefon.value = daten.telefon;
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

            // URL: Elemente erzeugen
            const divNodeRowURL = document.createElement('div');
            divNodeRowURL.setAttribute('class', 'row');
            const divNodeInputURL = document.createElement('div');
            divNodeInputURL.setAttribute('class', 'input-field col s12');
            this.inputURL = document.createElement('input');
            this.inputURL.value = daten.url;
            this.inputURL.setAttribute('placeholder', 'https://www.google.de')
            this.inputURL.setAttribute('id', 'inputURL');
            this.inputURL.setAttribute('type', 'url');
            this.inputURL.setAttribute('class', 'validate');
            const inputLabelURL = document.createElement('label');
            inputLabelURL.setAttribute('for', 'inputURL');
            inputLabelURL.setAttribute('class', 'active');
            const textNodeURL = document.createTextNode('Webadresse');
            //URL: Elemente zusammensetzen
            inputLabelURL.appendChild(textNodeURL);
            divNodeInputURL.appendChild(this.inputURL);
            divNodeInputURL.appendChild(inputLabelURL);
            divNodeRowURL.appendChild(divNodeInputURL);

            // Einzelne Elemente zur FormNode hinzufügen
            formNode.appendChild(divNodeRowName);
            formNode.appendChild(divNodeRowAdresse);
            formNode.appendChild(divNodeRowTelefon);
            formNode.appendChild(divNodeRowURL);

            // FormNode der Anzeige hinzufügen
            this.anzeigeNode.appendChild(formNode);

            // Focus auf InputName
            inputName.focus();

            // EditSpeichern Button erzeugen
            const aNodeButtonSpeichernNeu = document.createElement('a');
            aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2')
            aNodeButtonSpeichernNeu.setAttribute('id', 'speichernNew');
            const iNodeButtonSpeichernNeu = document.createElement('i');
            iNodeButtonSpeichernNeu.setAttribute('class', 'material-icons');
            const iNodeButtonSpeichernNeuText = document.createTextNode('+');
            // Eventlistener EditSpeichernButton
            iNodeButtonSpeichernNeu.addEventListener('click', function () {
                presenter.btnEditSpeichernClick(index);
            });
            // EditSpeichernButton zusammensetzen
            iNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeuText);
            aNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeu);
            this.buttonNode.appendChild(aNodeButtonSpeichernNeu);

            // BackButton erzeugen
            const aNodeButtonBack = document.createElement('a');
            aNodeButtonBack.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue-grey lighten-4')
            aNodeButtonBack.setAttribute('id', 'back');
            aNodeButtonBack.setAttribute('style', 'float:left');
            const iNodeButtonBack = document.createElement('i');
            iNodeButtonBack.setAttribute('class', 'material-icons');
            const iNodeButtonBackText = document.createTextNode('back');
            // Eventlistener BackButton
            iNodeButtonBack.addEventListener('click', function () {
                presenter.btnBackClick();
            });
            // BackButton zusammensetzen
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
        //------------------------------ view.getURL ------------------------------
        inputURL: null,
        getURL: function () {
            let url = this.inputURL.value;
            return url;
        }
    };
    //========================== Data Access Object ====================================
    const dao = {
        lesen: function () {
            if (localStorage.getItem('myPersonalFavorites')) {
                let text = localStorage.getItem('myPersonalFavorites');
                let daten = JSON.parse(text);
                return daten;
            } else {
                return [];
            }
        },
        schreiben: function (daten) {
            let text = JSON.stringify(daten);
            localStorage.setItem('myPersonalFavorites', text);
        }
    };

    //========================== App ====================================
    // presenter.init();
    regServiceWorker();
})();