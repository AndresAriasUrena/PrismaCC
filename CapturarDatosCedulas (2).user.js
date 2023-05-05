// ==UserScript==
// @name         CapturarDatosCedulasCRM5deMayo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  recolectar datos de codigo de cliente y cobranza a usuarios asociados a Claro.
// @author       Andres Arias Urena
// @match        http://172.17.224.60/Beesion.CrmAmxCenam.Cr/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=224.60
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    (async () => {
        // let numCedulas = ['116560054', '700900782','115590267','116560054'];
const numCedulas = await displayPopupForm();


async function consultarDatosIdCliente(numCedulas){

    let identificador = document.getElementById('ext-comp-1183');//this can be dynamic
    let botones = document.querySelectorAll('button.x-btn-text.ImageSearch');
    let numColumns = 9;
    let datos = [];

    let progress = document.createElement('h1');
    progress.style.position = 'absolute';
    progress.style.top = '50%';
    progress.style.right = '50%';
    progress.style.fontSize = 'xxx-large';
    progress.style.color = 'rgba(0,0,0,0.8)';
    progress.style.transform = 'translate(50%, 50%)';

    document.body.appendChild(progress);

    for(let i =0; i < numCedulas.length; i++){
        progress.innerText = `Consultando ${i+1} de ${numCedulas.length}`;
        await ingresarCedula(identificador, numCedulas[i],botones);
        let idCliente = await capturarDatos(datos, numColumns);
        console.log(`Cliente ${i+1}: ${idCliente}`);
    }
    document.body.removeChild(progress);

     let date = new Date();
     let fileName = `datos_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.csv`;


     let csvContent = "data:text/csv;charset=utf-8,";
    // Add header row
    csvContent += "Num. Cedula, Id. de Cliente, Nombre, Identificador, Nit, Estado, Segmento de Cobranza, Deuda Gestionable, Facturas Vencidas, Fec. Nacimiento\r\n";
    // Add data rows
    for(let i = 0; i < numCedulas.length; i++) {
        let datosCedula = false;
        for(let j = 0; j < datos.length; j++){
            if (datos[j][2].includes(numCedulas[i])){ //pending validation
                csvContent += numCedulas[i]+ "," + datos[j].join(",") + "\r\n";
                datosCedula = true;
            }
        }
        if (!datosCedula){
            csvContent += numCedulas[i]+ ", , , , , , , , , \r\n";
        }
    }

    // Create a link and click it to download the file
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('CSV file downloaded successfully!');


    return datos;

}


function ingresarCedula(identificador, numCedula, botones){
    return new Promise((resolve) => {
        identificador.value = numCedula;
        botones[1].click();
        console.log(numCedula + ' success!');
        resolve();
    });
}
function capturarDatos(datos, numColumns){
    return new Promise((resolve) =>{
        setTimeout(()=>{
            let fila0 = document.querySelectorAll('td.x-grid3-col.x-grid3-cell');
            let celdaIdCliente = document.querySelector('div.x-grid3-cell-inner.x-grid3-col-CustomerId.x-unselectable');
           for(let i=0; i<fila0.length; i++) {
                console.log(i)
                // Check if the index is divisible by the number of columns
                // if (i % numColumns == 0) {
                if (i % 9 == 0) {
                  // Push a new array for the row
                  datos.push([]);
                  console.log(`push : ${i % 9 }`);
                //   continue;
                }
                // Add the cell value to the current row array
                datos[datos.length - 1].push(fila0[i].innerText);
              }
            resolve(celdaIdCliente.innerText);
        },3000);
    });
}
//function to diplay the popup form and get the array of cedulas
function displayPopupForm(){
    return new Promise((resolve) =>{
        //create popup form
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');
        //Configure and style elements
        form.style.position = 'absolute';
        form.style.top ='0';
        form.style.right = '0';
        form.style.width = '85vw';
        form.style.minHeight = '5vh';
        form.style.zIndex = '10';
        form.style.backgroundColor = 'rgba(0,0,0,0.7)';


        input.classList.add('x-form-text');
        input.classList.add('x-form-field');
        input.placeholder = `Ingresa los numeros de cedula separados por un espacio, ejemplo: 116560054 700900782 115590267`;
        input.style.maxWidth = '95%';
        input.style.margin = '10px 20px';
        input.style.width = '85%';

        button.classList.add('x-btn-text');
        button.classList.add('ImageParty');
        button.innerText = 'Consultar Datos';
        button.style.margin = '22pxpx';
        button.style.padding = '0 0.3rem 0 1.5rem';
        button.style.transform = 'trnslateX(75vw)';


        form.appendChild(input);
        form.appendChild(button);
        document.body.appendChild(form);

        //Submit form when button is clicked
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const numCedulas = input.value.split(' ');
            resolve(numCedulas);
            document.body.removeChild(form);
          });

    });
}

let datos = await consultarDatosIdCliente(numCedulas);
console.log(datos);
    })();
})();