'use strict';

function hinzufuegen() {
    // Funktion zum Button erstellen
    function myFunction() {
        // Prompt Eingabefeld für die Beschriftung des Buttons
        var eingabe = prompt("Bitte namen eingeben:", "");
        // Testausgabe:
        console.log(eingabe);
        // Neuen Button erstellen (erstmal ohne limit!)
        
        var neuerBtn = document.createElement("Button");
        var newInhalt = document.createTextNode(eingabe);
        neuerBtn.appendChild(newInhalt);
        var aktuellerInhalt = document.getElementById("einfuegen");
        document.body.insertBefore(neuerBtn,aktuellerInhalt);

      };myFunction();

    
};


