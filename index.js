//http://chatdoc.eastus.cloudapp.azure.com:8000/api/form

//Mostrar elementos de la api en la tabla
//Metodo GET de api
function displayElements() {

    const table = document.getElementById('components-table');
    const tbody = table.getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    fetch('http://chatdoc.eastus.cloudapp.azure.com:8000/api/form',{
        method:"GET",
        headers:{"Content-Type":"application/json"},
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {

            const id = element.id;
            const name = element.name;
            const description = element.description;
            const code = element.code;

            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${code}</td>
            <td>${name}</td>
            <td>${description}</td>
            <td>
                <button class="btn-edit" data-id="${id}">Edit</button>
                <button class='btn-delete' data-id="${id}">Delete</button>
            </td>`
            tbody.appendChild(row);
            
        });
        addDeleteListeners();
        addEditListeners();
    })
    .catch((error) => {
        console.log(error);
        addErrorListener(error);
    });

}


function deleteElement(id) {
    fetch(`http://chatdoc.eastus.cloudapp.azure.com:8000/api/form/${id}`,{method:"DELETE"})
    .then((response) => {
        console.log("Elemento eliminado "+ id);
        displayElements();
    })
    .catch((error) => {
        console.log(error);
    });
}

function addDeleteListeners() {

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteElement(id);
        });
    }); 
}

function editElement(id) {
    const code = prompt('Ingrese el nuevo codigo del elemento');
    const name = prompt('Ingrese el nuevo nombre del elemento');
    const descripcion = prompt('Ingrese la nueva descripcion del elemento');

    const data= {
        name: name,
        description: descripcion,
        code: code
    };

    fetch(`http://chatdoc.eastus.cloudapp.azure.com:8000/api/form/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok){
            displayElements();
            console.log('Elemento editado de id: ' + id);
        }
        else{
            console.log('Error al editar el elemento de id '+ id);
        }
    })
    .catch((error) => {
        console.log(error);
    });
}
function addEditListeners() {

    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            editElement(id);
        });
    })
}

function addElement(){
    const code = prompt('Ingrese el codigo del elemento');
    const name = prompt('Ingrese el nombre del elemento');
    const description = prompt('Ingrese la descripcion del elemento');

    const data = {
        code: code,
        name: name,
        description: description
    };

    fetch('http://chatdoc.eastus.cloudapp.azure.com:8000/api/form',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok){
            displayElements();
            console.log('Elemento agregado');
        }
        else{
            console.log('Error al agregar el elemento');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

function addErrorListener(error){
    console.log("Estoy intentando agregar un elemento");
    const errorPop = document.getElementById('error-pop');
    errorPop.value = error;
    errorPop.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
    displayElements();
    const addButton = document.getElementById('add-Element');
    addButton.addEventListener('click', addElement);
});