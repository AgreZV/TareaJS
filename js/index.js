const formulario = document.querySelector("#formulario-contacto");
const botonEnviar = document.querySelector(".btn-enviar");

const nameContact = document.getElementsByName("name_contact")[0];
const email = document.getElementsByName("email_contact")[0];
const phone = document.getElementsByName("phone_contact")[0];
const topic = document.getElementById("topic_contact");
const commit = document.getElementsByName("commit_contact")[0];

const errorsList = document.getElementById("errors");

function showError(element, message) {
    element.classList.toggle("error");
    errorsList.innerHTML += `<li>${message}</li>`;
}

function cleanErrors() {
    errorsList.innerHTML = "";
}

/*
URL API: https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email
METHOD: POST
ESTRUCTURA BODY: {
	"name": "", 
	"email": "", 
	"phone": "",
	"select": "",
	"comment": ""
}
*/

//Enviar datos a API usando fetch, siguiendo la estructura indicada
async function sendMail(name, email, phone, select, comment) {
    const rawResponse = await fetch('https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, phone, select, comment})
    });
    
    const content = await rawResponse.json();
    if (Object.keys(content.errors).length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: content.message
          })
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Good job!',
            text: content.message
           })
    }
}

/*
Validaciones necesarias:
+ Campo nombre y apellido no debe estar vacío y contener al menos un espacio
+ Campo correo debe tener un correo válido
+ Campo número de teléfono debe tener entre 7 y 15 dígitos, pudiendo tener un + al inicio, ignorando espacios en blanco
+ Campo comentario debe tener al menos 20 caracteres
*/
botonEnviar.addEventListener("click", (event) => {
    event.preventDefault();
    cleanErrors();
    let hasErrors = false;
  
    const sanitizedName = nameContact.value.trim();
    if(sanitizedName.length === 0 || sanitizedName.indexOf(' ') < 0) {
        showError(nameContact, 'El nombre y apellido no debe estar vacio');
        hasErrors = true;
    }

   // const mailRe = /^\w+@\w+\.\w{2,7}$/;
   //se puede validar correo como nombre-apellido.1234@do-mi-nio.info
    const mailRe = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!mailRe.exec(email.value)) {
        showError(email, "El correo debe seguir un formato válido.");
        hasErrors = true;
    }

    const phoneRe = /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(" ", "");
    if (!phoneRe.exec(sanitizedPhone)) {
        showError(phone, "Número de teléfono debe tener entre 7 y 15 dígitos.");
        hasErrors = true;
    }

    const sanitizedCommit = commit.value.trim();
    if(sanitizedCommit.length < 20) {
        showError(commit, 'El comentario debe ser al menos de 20 caracteres');
        hasErrors = true;
    }

    // Enviar consulta a API en caso de que el formulario esté correcto
    if (!hasErrors) {
        sendMail(sanitizedName, email.value, sanitizedPhone, topic.value, sanitizedCommit);
    }
});