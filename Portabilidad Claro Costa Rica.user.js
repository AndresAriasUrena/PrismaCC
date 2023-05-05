// ==UserScript==
// @name         Portabilidad Claro Costa Rica
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatizacion para Prisma Contact Center
// @author       AndresAriasUrena
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
      (async () => {
    // function that displays the popup form and returns the array of numbers
    const numeros = await displayPopupForm();

    // async function that processes the array of numbers
    async function portabilidad5(numeros) {
      let telefono = document.getElementById('telefono');
      let ingresar = document.getElementById('ingresar');
      let table = document.createElement('table');
      let headerRow = table.insertRow();
      let numeroHeader = headerRow.insertCell();
      numeroHeader.innerHTML = "<b>Número</b>";
      let respuestaHeader = headerRow.insertCell();
      respuestaHeader.innerHTML = "<b>Respuesta</b>";
      //styling
      numeroHeader.classList.add('cell');
      respuestaHeader.classList.add('cell');
      //let respuesta = [];
      let progress = document.createElement('h1');
      progress.style.margin = '40px 50px';
      progress.style.color = 'green';

      document.body.appendChild(progress);

      for (let i = 0; i < numeros.length; i++) {
        progress.innerText = `Consultando ${i+1} de ${numeros.length}`;
        const numero = numeros[i];
        let row = table.insertRow();
        let numeroCell = row.insertCell();
        numeroCell.innerHTML = numero;
        let respuestaCell = row.insertCell();
        await ingresarNumero(numero, telefono, ingresar);
        let alerta = await leerAlerta();
        guardarStatus(alerta, respuestaCell);
        console.log(respuestaCell.innerHTML);
        //styling
        numeroCell.classList.add('cell');
        respuestaCell.classList.add('cell');
      }

        document.body.appendChild(table);
        //styling table
        table.style.tableLayout = 'fixed';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '40px 50px';
        table.style.border = '2px solid green';
        table.style.textAlign = 'center';
        let cells = document.querySelectorAll('.cell');

        cells.forEach(cell =>{
            cell.style.border = '1px solid green';
            cell.style.padding = '2px 4px';
        });

    }

    // function to display the popup form and get the array of numbers
    function displayPopupForm() {
      return new Promise((resolve) => {
        // create popup form
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');
        input.classList.add('form-control');
        input.placeholder = `Ingresa los numeros de telefono separados por un espacio ejemplo: 61353127 83042202 61112716`;
        input.style.maxWidth = '95%';
        input.style.margin = '10px 20px';
        button.classList.add('btn');
        button.classList.add('btn-danger');
        button.innerText = 'Generar consulta multiple';
                  button.style.margin = '10px 20px';
        form.appendChild(input);
        form.appendChild(button);
        document.body.appendChild(form);

        // submit form when button is clicked
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const numeros = input.value.split(' ');
          resolve(numeros);
          document.body.removeChild(form);
        });
      });
    }

    function ingresarNumero(numero, telefono, ingresar) {
      return new Promise((resolve) => {
        telefono.value = numero;
        ingresar.click();
        console.log('click!');
        resolve();
      });
    }

    function leerAlerta(index) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('funcion alerta ejecutada');
          let alerta = document.querySelector('.alert');
          console.log(alerta);
          resolve(alerta);
        }, 3000);
      });
    }

    function guardarStatus(alerta, respuestaCell) {
      if (alerta.classList.contains('alert-success')) {
        respuestaCell.innerHTML = 'SI';
      } else {
        respuestaCell.innerHTML = 'NO';
      }
    }

    let respuesta3 = await portabilidad5(numeros);
    console.log(respuesta3);
  })();
})();