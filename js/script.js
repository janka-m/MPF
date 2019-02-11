'use strict';

// HTML-Elemente
const btnAdd = document.getElementById('btnAdd');
const txtName = document.getElementById('name');
let name;

// Dialog-Fenster erstellen
function toggleDialog() {
	var dialog = document.querySelector('dialog'),
		closebutton = document.getElementById('close-dialog'),
		pagebackground = document.querySelector('body');

	if (!dialog.hasAttribute('open')) {
		// show the dialog 
		dialog.setAttribute('open', 'open');
		// after displaying the dialog, focus the closebutton inside it
		closebutton.focus();
		closebutton.addEventListener('click', function () {
			name = txtName.value;
			txtName.value = "";
			console.log(name);
			toggleDialog();
		});

	}
	else {
		dialog.removeAttribute('open');
		var div = document.querySelector('#backdrop');

	}
}


//Event-Listener
btnAdd.addEventListener('click', toggleDialog);








