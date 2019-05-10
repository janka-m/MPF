(function () {
    'use strict';
    //================================================================================================
    //======================================== Service Worker ========================================
    //================================================================================================

    //======================================== serviceWorker.regServiceWorker ========================================
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

    //=======================================================================================
    //======================================== Model ========================================
    //=======================================================================================
    const model = {
        datenArray: [],
        //======================================== model.init ========================================
        init: function () {
            this.datenArray = dao.lesen();
        },
        //======================================== model.Create ========================================
        create: function (eintrag) {
            this.datenArray.push(eintrag);
            dao.schreiben(this.datenArray);
        },
        //======================================== model.readAll ========================================
        readAll: function () {
            return this.datenArray;
        },
        //======================================== model.readOne ========================================
        readOne: function (index) {
            return this.datenArray[index];
        },
        //======================================== model.update ========================================
        update: function (eintrag, index) {
            this.datenArray[index] = eintrag;
            dao.schreiben(this.datenArray);
        },
        //======================================== model.delete ========================================
        delete: function (index) {
            this.datenArray.splice(index, 1);
            dao.schreiben(this.datenArray);
        },
        //======================================== model.getDatum ========================================
        getDatum: function () {
            if (this.datenArray[this.datenArray.length - 1] != undefined && this.datenArray[this.datenArray.length - 1].datum != "") {
                return this.datenArray[this.datenArray.length - 1].datum;
            } else {
                return 'Keine Daten vorhanden!';
            }
        }
    };

    //===========================================================================================
    //======================================== Presenter ========================================
    //===========================================================================================
    const presenter = {
        //======================================== presenter.init ========================================
        init: function () {
            // Daten vom LocalStorage aktualisieren
            model.init();
            let daten = model.readAll();
            // Daten (Restaurants) ausgeben
            view.init();
            view.renderList(daten);
            view.renderDatum(model.getDatum());


        },
        //======================================== presenter.listElementClick ========================================
        listElementClick: function (index) {
            let daten = model.readOne(index);
            view.renderOne(daten, index);
        },
        //======================================== presenter.btnBackClick ========================================
        btnBackClick: function () {
            let daten = model.readAll();
            view.renderList(daten);
            view.renderDatum(model.getDatum());
        },
        //======================================== presenter.btnAddClick ========================================
        btnAddClick: function () {
            view.renderNew();
        },
        //======================================== presenter.btnAddSpeichernClick ========================================
        btnAddSpeichernClick: function () {
            // Daten aus dem Formular holen
            let name = view.getName();
            let adresse = view.getAdresse();
            let telefon = view.getTelefon();
            let url = presenter.checkEingabe(view.getURL());
            let datum = view.getDatum();

            // Neue Daten der Liste hinzufügen
            model.create({
                'name': name,
                'adresse': adresse,
                'telefon': telefon,
                'url': url,
                'datum': datum
            });

            // Daten erneut holen
            let daten = model.readAll();

            // Liste erneut anzeigen mit neuen Daten;
            view.renderList(daten);
            view.renderDatum(model.getDatum());
        },
        //======================================== presenter.btnEditClick ========================================
        btnEditClick: function (daten, index) {
            view.renderEdit(daten, index);
        },
        //======================================== presenter.btnEditSpeichernClick ========================================
        btnEditSpeichernClick: function (index) {
            // Daten aus dem Formular holen
            let eintrag = {};
            eintrag.name = view.getName();
            eintrag.adresse = view.getAdresse();
            eintrag.telefon = view.getTelefon();
            eintrag.url = presenter.checkEingabe(view.getURL());
            eintrag.datum = view.getDatum();

            // alten Datensatz überschreiben
            model.update(eintrag, index);

            // Daten erneut holen
            let daten = model.readAll();

            // Liste erneut anzeigen mit neuen Daten;
            view.renderList(daten);
            view.renderDatum(model.getDatum());

        },
        //======================================== presenter.btnDelClick ========================================
        btnDelClick: function (index) {
            // Datensatz löschen
            model.delete(index);
            let daten = model.readAll();
            view.renderList(daten);
            view.renderDatum(model.getDatum());
        },
        //======================================== presenter.buttonSpeichernNeuEinAus 
        buttonSpeichernNeuEinAus: function () {
            const textString = view.getName();
            if (textString == "") {
                view.buttonSpeichernNeu.ausblenden();
                return;
            };
            view.buttonSpeichernNeu.einblenden();
        },
        //======================================== presenter.buttonSpeichernNeuEinAus ========================================
        buttonSpeichernEditEinAus: function () {
            const textString = view.getName();
            if (textString == "") {
                view.buttonSpeichernEdit.ausblenden();
                return;
            };
            view.buttonSpeichernEdit.einblenden();
        },
        //======================================== presenter.checkEingabe ========================================
        checkEingabe: function (string) {
            const eingabe = string;
            const subStringHttp = eingabe.substring(0, 7);
            const subStringHttps = eingabe.substring(0, 8);

            switch (true) {
                case (subStringHttp === 'http://'):
                    return eingabe;
                    //break;
                case (subStringHttps === 'https://'):
                    return eingabe;
                    //break;
                default:
                    return 'https://' + eingabe;
                    //break;
            };
        }
    };

    //======================================================================================
    //======================================== View ========================================
    //======================================================================================
    const view = {
        anzeigeNode: null,
        buttonNode: null,
        datumsNode: null,
        //======================================== view.init ========================================
        init: function () {
            this.anzeigeNode = document.getElementById('anzeige');
            this.buttonNode = document.getElementById('button');
            this.datumsNode = document.getElementById('datumDatenstand');
        },
        //======================================== view.loeschen ========================================
        loeschen: function (node) {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            node.removeAttribute('class');
            node.removeAttribute('style');
        },
        //======================================== view.renderDatum ========================================
        renderDatum: function (datum) {
            view.loeschen(this.datumsNode);
            const datumsTextNode = document.createTextNode(datum);
            this.datumsNode.appendChild(datumsTextNode);
        },
        //======================================== view.renderList ========================================
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
            view.erzeugeAddButton();
        },
        //======================================== view.renderOne ========================================
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

            const aNodeTelefon = document.createElement('a');
            aNodeTelefon.setAttribute('href', 'tel:' + daten.telefon);

            const liNodeURL = document.createElement('li');
            liNodeURL.setAttribute('class', 'collection-item grey lighten-4');

            const aNodeURL = document.createElement('a');
            aNodeURL.setAttribute('rel', 'external');
            aNodeURL.setAttribute('href', daten.url);

            const nameTextNode = document.createTextNode(daten.name);
            const adresseTextNode = document.createTextNode(daten.adresse);
            const telefonTextNode = document.createTextNode(daten.telefon);
            const urlTextNode = document.createTextNode(daten.url);

            aNodeTelefon.appendChild(telefonTextNode);

            liNodeName.appendChild(nameTextNode);
            liNodeAdresse.appendChild(adresseTextNode);
            liNodeURL.appendChild(urlTextNode);
            liNodeTelefon.appendChild(aNodeTelefon);

            aNodeURL.appendChild(liNodeURL);

            ulNode.appendChild(liNodeName);

            // wenn leere Einträge im Model vorhanden sind werden diese nicht angezeigt
            if (daten.adresse != undefined && daten.adresse != "") {
                ulNode.appendChild(liNodeAdresse);
            };
            if (daten.telefon != undefined && daten.telefon != "") {
                ulNode.appendChild(liNodeTelefon);
            };
            if (daten.url != undefined && daten.url != "https://") {
                ulNode.appendChild(aNodeURL);
            };

            this.anzeigeNode.appendChild(ulNode);

            // Edit Button erzeugen
            view.erzeugeEditButton(daten, index);
            // Del Button erzeugen
            view.erzeugeDelButton(index);
            // Back Button erzeugen
            view.erzeugeBackButton();
        },
        //======================================== view.renderNew ========================================
        renderNew: function () {
            // gesamte View löschen
            view.loeschen(this.anzeigeNode);
            view.loeschen(this.buttonNode);

            // Attribut für Anzeige DIV setzten
            this.anzeigeNode.setAttribute('class', 'row');
            this.anzeigeNode.setAttribute('style', 'margin:0 10%');

            // FormNode erzeugen:            
            const formNode = document.createElement('form');
            formNode.setAttribute('class', 'col s12');

            // Felder erzeugen
            const namenFeld = view.erzeugeNamenFeld();
            const adressFeld = view.erzeugeAdressFeld();
            const telefonFeld = view.erzeugeTelefonFeld();
            const urlFeld = view.erzeugeURLFeld();

            // Einzelne Felder zur FormNode hinzufügen
            formNode.appendChild(namenFeld);
            formNode.appendChild(adressFeld);
            formNode.appendChild(telefonFeld);
            formNode.appendChild(urlFeld);

            // FormNode der Anzeige hinzufügen
            this.anzeigeNode.appendChild(formNode);

            // FocusIn auf InputName
            this.inputName.focus();

            // Event bei Input auf InputName
            this.inputName.addEventListener("input", function () {
                presenter.buttonSpeichernNeuEinAus()
            }, true);

            // ButtonSpeichernNeu erzeugen
            view.buttonSpeichernNeu.erzeugen();
            // Back Button erzeugen
            view.erzeugeBackButton();
        },
        //======================================== view.renderEdit ========================================
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

            // Felder erzeugen
            const namenFeld = view.erzeugeNamenFeld();
            const adressFeld = view.erzeugeAdressFeld();
            const telefonFeld = view.erzeugeTelefonFeld();
            const urlFeld = view.erzeugeURLFeld();

            // Felder da Edit mit Werten befüllen
            // Namenfeld
            view.setNameValue(daten);
            // Addressfeld
            view.setAdresseValue(daten);
            // Telefonfeld
            view.setTelefonValue(daten);
            // URLFeld
            view.setURLValue(daten);

            // Einzelne Felder zur FormNode hinzufügen
            formNode.appendChild(namenFeld);
            formNode.appendChild(adressFeld);
            formNode.appendChild(telefonFeld);
            formNode.appendChild(urlFeld);

            // FormNode der Anzeige hinzufügen
            this.anzeigeNode.appendChild(formNode);

            // Focus auf InputName
            inputName.focus();

            // FocusIn auf InputName
            this.inputName.focus();

            // Event bei Input auf InputName
            this.inputName.addEventListener("input", function () {
                presenter.buttonSpeichernEditEinAus()
            }, true);

            // EditSpeichern Button Index setzen und erzeugen
            view.buttonSpeichernEdit.erzeugen(index);

            // Back Button erzeugen
            view.erzeugeBackButton();
        },
        //======================================== view.getNamefromForm ========================================
        inputName: null,
        getName: function () {
            let name = this.inputName.value.trim();
            return name;
        },
        //======================================== view.setNameinForm ========================================
        setNameValue: function (daten) {
            this.inputName.value = daten.name;
        },
        //======================================== view.getAdressefromForm ========================================
        inputAdresse: null,
        getAdresse: function () {
            let adresse = this.inputAdresse.value.trim();
            return adresse;
        },
        //======================================== view.setAdresseinForm ========================================
        setAdresseValue: function (daten) {
            if (daten.adresse != undefined) {
                this.inputAdresse.value = daten.adresse;
            } else {
                this.inputAdresse.value = "";
            };
        },
        //======================================== view.getTelefonfromForm ========================================
        inputTelefon: null,
        getTelefon: function () {
            let telefon = this.inputTelefon.value.trim();
            return telefon;
        },
        //======================================== view.setTelefoninForm ========================================
        setTelefonValue: function (daten) {
            if (daten.telefon != undefined) {
                this.inputTelefon.value = daten.telefon;
            } else {
                this.inputTelefon.value = "";
            };
        },
        //======================================== view.getURLfromForm ========================================
        inputURL: null,
        getURL: function () {
            let url = this.inputURL.value.trim();
            return url;
        },
        //======================================== view.setURLinForm ========================================
        setURLValue: function (daten) {
            if (daten.url != undefined) {
                this.inputURL.value = daten.url;
            } else {
                this.inputURL.value = "";
            };
        },
        //======================================== view.getDatum - Wird immer automatisch erzeugt ========================================
        getDatum: function () {
            const datum = new Date();
            return datum.toLocaleString();
        },
        //======================================== view.erzeugeNamenFeld für New und Edit ========================================
        erzeugeNamenFeld: function () {
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

            return divNodeRowName;
        },
        //======================================== view.erzeugeAdressFeld für New und Edit ========================================
        erzeugeAdressFeld: function () {
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

            return divNodeRowAdresse;
        },
        //======================================== view.erzeugeTelefonFeld für New und Edit ========================================
        erzeugeTelefonFeld: function (daten) {
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

            return divNodeRowTelefon;
        },
        //======================================== view.erzeugeURLFeld  für New und Edit ========================================
        erzeugeURLFeld: function (daten) {
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

            return divNodeRowURL;
        },
        //======================================== view.erzeugeAddButton ========================================
        erzeugeAddButton: function () {
            const aNodeButtonAdd = document.createElement('a');
            aNodeButtonAdd.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2')
            aNodeButtonAdd.setAttribute('id', 'add');
            const iNodeButtonAdd = document.createElement('i');
            iNodeButtonAdd.setAttribute('class', 'material-icons');
            const iNodeButtonAddText = document.createTextNode('\uFF0B');
            // Eventlistener Add Button
            iNodeButtonAdd.addEventListener('click', function () {
                presenter.btnAddClick();
            });
            // Add Button zusammensetzen
            iNodeButtonAdd.appendChild(iNodeButtonAddText);
            aNodeButtonAdd.appendChild(iNodeButtonAdd);
            this.buttonNode.appendChild(aNodeButtonAdd);
        },
        //======================================== view.erzeugeBackButton ========================================
        erzeugeBackButton: function () {
            const aNodeButtonBack = document.createElement('a');
            aNodeButtonBack.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue-grey')
            aNodeButtonBack.setAttribute('id', 'back');
            aNodeButtonBack.setAttribute('style', 'float:left');
            const iNodeButtonBack = document.createElement('i');
            iNodeButtonBack.setAttribute('class', 'material-icons');
            const iNodeButtonBackText = document.createTextNode('\u2B05');
            // Eventlistener Back Button
            iNodeButtonBack.addEventListener('click', function () {
                presenter.btnBackClick();
            });
            // Back Button Del zusammensetzen
            iNodeButtonBack.appendChild(iNodeButtonBackText);
            aNodeButtonBack.appendChild(iNodeButtonBack);
            this.buttonNode.appendChild(aNodeButtonBack);
        },
        //======================================== view.erzeugeEditButton ========================================
        erzeugeEditButton: function (daten, index) {
            const aNodeButtonEdit = document.createElement('a');
            aNodeButtonEdit.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2')
            aNodeButtonEdit.setAttribute('id', 'edit');
            const iNodeButtonEdit = document.createElement('i');
            iNodeButtonEdit.setAttribute('class', 'material-icons');
            const iNodeButtonEditText = document.createTextNode('\u270E');
            // Eventlistener Edit Button
            iNodeButtonEdit.addEventListener('click', function () {
                presenter.btnEditClick(daten, index);
            });
            // Edit Button zusammensetzen
            iNodeButtonEdit.appendChild(iNodeButtonEditText);
            aNodeButtonEdit.appendChild(iNodeButtonEdit);
            this.buttonNode.appendChild(aNodeButtonEdit);
        },
        //======================================== view.erzeugeDelButton ========================================
        erzeugeDelButton: function (index) {
            const aNodeButtonDel = document.createElement('a');
            aNodeButtonDel.setAttribute('class', 'btn-floating btn-large waves-effect waves-light red lighten-2')
            aNodeButtonDel.setAttribute('id', 'del');
            const iNodeButtonDel = document.createElement('i');
            iNodeButtonDel.setAttribute('class', 'material-icons');
            const iNodeButtonDelText = document.createTextNode('\u2716');
            // Eventlistener Del Button
            iNodeButtonDel.addEventListener('click', function () {
                presenter.btnDelClick(index);
            });
            // Del Button Del zusammensetzen
            iNodeButtonDel.appendChild(iNodeButtonDelText);
            aNodeButtonDel.appendChild(iNodeButtonDel);
            this.buttonNode.appendChild(aNodeButtonDel);
        },
        //======================================== view.buttonSpeichernNeu ========================================
        buttonSpeichernNeu: {
            aNodeButtonSpeichernNeu: document.createElement('a'),
            erzeugen: function () {
                this.aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating disabled btn-large waves-effect waves-light green lighten-2')
                this.aNodeButtonSpeichernNeu.setAttribute('id', 'speichernNew');
                const iNodeButtonSpeichernNeu = document.createElement('i');
                iNodeButtonSpeichernNeu.setAttribute('class', 'material-icons');
                const iNodeButtonSpeichernNeuText = document.createTextNode('\u2714');
                // Eventlistener NeuSpeichernButton
                iNodeButtonSpeichernNeu.addEventListener('click', function () {
                    presenter.btnAddSpeichernClick();
                });
                // NeuSpeichernButton zusammensetzen
                iNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeuText);
                this.aNodeButtonSpeichernNeu.appendChild(iNodeButtonSpeichernNeu);
                view.buttonNode.appendChild(this.aNodeButtonSpeichernNeu);
            },
            ausblenden: function () {
                this.aNodeButtonSpeichernNeu.removeAttribute('class');
                this.aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating disabled btn-large');
            },
            einblenden: function () {
                this.aNodeButtonSpeichernNeu.removeAttribute('class');
                this.aNodeButtonSpeichernNeu.setAttribute('class', 'btn-floating btn-large waves-effect waves-light green lighten-2');
            }
        },
        //======================================== view.buttonSpeichernEdit ========================================
        buttonSpeichernEdit: {
            index: null,
            aNodeButtonSpeichernEdit: document.createElement('a'),
            erzeugen: function (index) {
                this.index = index;
                this.aNodeButtonSpeichernEdit.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2')
                this.aNodeButtonSpeichernEdit.setAttribute('id', 'speichernEdit');
                const iNodeButtonSpeichernEdit = document.createElement('i');
                iNodeButtonSpeichernEdit.setAttribute('class', 'material-icons');
                const iNodeButtonSpeichernEditText = document.createTextNode('\u2714');
                // Eventlistener EditSpeichernButton
                iNodeButtonSpeichernEdit.addEventListener('click', function () {
                    presenter.btnEditSpeichernClick(view.buttonSpeichernEdit.index);
                });
                // EditSpeichernButton zusammensetzen
                iNodeButtonSpeichernEdit.appendChild(iNodeButtonSpeichernEditText);
                this.aNodeButtonSpeichernEdit.appendChild(iNodeButtonSpeichernEdit);
                view.buttonNode.appendChild(this.aNodeButtonSpeichernEdit);
            },
            ausblenden: function () {
                this.aNodeButtonSpeichernEdit.removeAttribute('class');
                this.aNodeButtonSpeichernEdit.setAttribute('class', 'btn-floating disabled btn-large');
            },
            einblenden: function () {
                this.aNodeButtonSpeichernEdit.removeAttribute('class');
                this.aNodeButtonSpeichernEdit.setAttribute('class', 'btn-floating btn-large waves-effect waves-light blue lighten-2');
            }
        }
    };

    //==================================================================================
    //========================== Data Access Object ====================================
    //==================================================================================
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
    //===================================================================
    //========================== App ====================================
    //===================================================================
    // presenter.init();
    regServiceWorker();

})();