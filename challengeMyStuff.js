/*(async () => {

const url = "http://localhost:8080/api/v1/items";
let response;

response = await fetch (url, {method:'GET'});
response = await response.json();
console.log(response);
} ) ()
*/

renderList();

async function renderList() {
  const url = "http://localhost:8080/api/v1/items";
  let response;

  response = await fetch (url, {method: 'GET'});
  response = await response.json();
  console.log (response);

  //dynamisch die HTML-Tabelle aufbauen:
  //zunächst Kopfzeile
  document.body.innerHTML = `
  <h1 align="center">MyStuff Frontend</h1>
  <table class="table">
  <thead class="bg-light text-dark">
  <tr>
  <th>#</th>
  <th>Name</th>
  <th>Location</th>
  <th>Amount</th>
  <th>Description</th>
  <th></th>
  </tr>
  </thead>
  <tbody id="foo">
  </tbody>
  </table>
  `;

  //nun Zeilen für Inhalt
  response.forEach( item => {
    const entry = `
    <tr>
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.location}</td>
    <td>${item.amount}</td>
    <td>${item.description || '-'}</td>
    <td>
    <button type="button" class="btn btn-primary btn-sm" id="btn-r-${item.id}" onClick="read(${item.id})">Read</button>
    <button type="button" class="ml-2 btn btn-warning btn-sm" id="btn-u-${item.id}" onClick="update(${item.id})">Update</button>
    <button type="button" class="ml-2 btn btn-danger btn-sm" id="btn-d-${item.id}" onClick="del(${item.id}, this)">Delete</button>
    </td>
    </tr>
    `;

    document.querySelector( '#foo' ).innerHTML += entry;
    /* old eventListeners
    document.querySelector(  '#btn-r-' + item.id ).addEventListener('click', function() {
    alert ('Id: ' + item.id + '\nName: ' + item.name +
    '\nLocation: ' + item.location + '\nAmount: ' + item.amount +
    '\nDescription: ' + item.description + '\nLast used: ' + item.lastUsed);
    //Anzeige aller item-Daten in separatem Fenster?
    renderList();
  })
  document.querySelector( '#btn-d-' + item.id ).addEventListener( 'click', async function() {
  await fetch ('http://localhost:8080/api/v1/items' + '/' + item.id, {method: 'DELETE'});
  renderList(); //Refresh der Seite, um den neuen Stand der Liste zu zeigen
  //derzeit funktioniert der Löschen-Button nur beim letzten Eintrag der Tabelle!
} );
*/
} );

//abschliessend Button für neues Item anfügen
document.querySelector ( '#foo' ).innerHTML += `
<div class="ml-2 mt-2">
<button type="button" class="btn btn-success btn-sm" id="btn-c" onClick="create()">Create</button>
</div>`
}

async function read(id) {

  response = await fetch ('http://localhost:8080/api/v1/items' + '/' + id, {method: 'GET'});
  response = await response.json();
  const detail = `
  <div class="container-fluid">
    <!-- The Modal -->
    <div id="readModal" class="modal">
      <div class="modal-dialog modal-lg"
      <!-- Modal content -->
        <div class="modal-content">
        <span class="close">&times;</span>
        <br>
            <form id="readform">
            <div class="form-group mr-4 ml-4">
                <label for="id">Id</label>
                <input type="text" class="form-control" id="rId" value="${response.id}" readonly>
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="name">Name</label>
                <input type="text" class="form-control" value="${response.name}" id="rName">
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="location">Location</label>
                <input type="text" class="form-control" value="${response.location}" id="rLocation">
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="amount">Amount</label>
                <input type="number" class="form-control" value="${response.amount}" id="rAmount" >
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="description">Description</label>
                  <textarea class="form-control" id="rDescription" rows="3">
                  ${response.description}
                  </textarea>
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="lastUsed">Last used</label>
                <input type="text" class="form-control" value="${response.lastUsed}" id="rLastUsed">
            </div>
            </form>
            <div class="ml-4 mt-2 mb-2">
            <button type="button" class="btn btn-primary btn-lg" id="btn-ok" onClick="renderList()">OK</button>
            </div>
        </div>
      </div>
    </div>
  </div>
  `;
  document.querySelector ('#foo').innerHTML += detail;
  openReadModal();
}

async function create() {

  const detail = `
  <div class="container-fluid">
    <!-- The Modal -->
    <div id="createModal" class="modal">
      <div class="modal-dialog modal-lg"
      <!-- Modal content -->
        <div class="modal-content">
        <span class="close">&times;</span>
        <br>
            <form id="createform" action="saveItem()">
            <div class="form-group mr-4 ml-4">
                <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name">
                </div>
                <div class="form-group">
                <label for="location">Location</label>
                <input type="text" class="form-control" id="location">
                </div>
                <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" class="form-control" id="amount" >
                </div>
                <div class="form-group">
                <label for="description">Description</label>
                  <textarea class="form-control" id="description" rows="3">
                  </textarea>
                </div>
                <div class="form-group">
                <label for="lastUsed">Last used</label>
                <input type="text" class="form-control" id="lastUsed">
            </div>
            </form>
            <div class="ml-4 mt-2 mb-2">
            <button type="button" class="btn btn-success btn-lg" id="btn-save" value="Save" onclick="saveItem()">Save</button>
            <button type="button" class="btn btn-danger btn-lg" id="btn-cancel" onClick="renderList()">Cancel</button>
            </div>
        </div>
      </div>
    </div>
  </div>
  `;
  document.querySelector ('#foo').innerHTML += detail;
  openCreateModal();
}

async function update(id) {

  response = await fetch ('http://localhost:8080/api/v1/items' + '/' + id, {method: 'GET'});
  response = await response.json();
  const detail = `
  <div class="container-fluid">
    <!-- The Modal -->
    <div id="updateModal" class="modal">
      <div class="modal-dialog modal-lg"
      <!-- Modal content -->
        <div class="modal-content">
        <span class="close">&times;</span>
        <br>
            <form id="readform">
            <div class="form-group mr-4 ml-4">
                <label for="id">Id</label>
                <input type="text" class="form-control" id="rId" value="${response.id}" readonly>
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="name">Name</label>
                <input type="text" class="form-control" value="${response.name}" id="rName">
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="location">Location</label>
                <input type="text" class="form-control" value="${response.location}" id="rLocation">
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="amount">Amount</label>
                <input type="number" class="form-control" value="${response.amount}" id="rAmount" >
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="description">Description</label>
                  <textarea class="form-control" id="rDescription" rows="3">
                  ${response.description}
                  </textarea>
                </div>
                <div class="form-group mr-4 ml-4">
                <label for="lastUsed">Last used</label>
                <input type="text" class="form-control" value="${response.lastUsed}" id="rLastUsed">
            </div>
            </form>
            <div class="ml-4 mt-2 mb-2">
            <button type="button" class="btn btn-success btn-lg" id="btn-update" value="Update" onclick="updateItem()">Update</button>
            <button type="button" class="btn btn-danger btn-lg" id="btn-cancel" onClick="renderList()">Cancel</button>
            </div>
        </div>
      </div>
    </div>
  </div>
  `;
  document.querySelector ('#foo').innerHTML += detail;
  openUpdateModal();
}

function openReadModal (detail) {
  var modal = document.getElementById("readModal");
  modal.style.display = "inline";
  //modal.style.maxWidth = "80%";
  //modal.style.backgroundColor ="LightGrey";
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    renderList();
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      renderList();
    }
  }
}

function openCreateModal (detail) {
  var modal = document.getElementById("createModal");
  modal.style.display = "inline";
  //modal.style.maxWidth = "80%";
  //modal.style.backgroundColor ="LightGrey";
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    renderList();
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      renderList();
    }
  }
}

function openUpdateModal (detail) {
  var modal = document.getElementById("updateModal");
  modal.style.display = "inline";
  //modal.style.maxWidth = "80%";
  //modal.style.backgroundColor ="LightGrey";
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    renderList();
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      renderList();
    }
  }
}

async function saveItem(){

    let id = null;
    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let amount = document.getElementById("amount").value;
    let description = document.getElementById("description").value;
    let lastUsed = document.getElementById("lastUsed").value;

    const item = {
          id:          id,
          name:        name,
          location:    location,
          amount:      amount,
          description: description,
          lastUsed:    lastUsed
    	};
    console.log('name: '+ item.name );
    console.log('location: '+ item.location );

    fetch ('http://localhost:8080/api/v1/items', {
      method: 'POST',
      headers:     {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', item);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  renderList();
}

async function updateItem(){

    debugger;
    let id = document.getElementById("rId").value;
    let name = document.getElementById("rName").value;
    let location = document.getElementById("rLocation").value;
    let amount = document.getElementById("rAmount").value;
    let description = document.getElementById("rDescription").value;
    let lastUsed = document.getElementById("rLastUsed").value;

    const item = {
          id:          id,
          name:        name,
          location:    location,
          amount:      amount,
          description: description,
          lastUsed:    lastUsed
    	};

    fetch ('http://localhost:8080/api/v1/items/'+id, {
      method: 'PUT',
      headers:     {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', item);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  renderList();
}

async function del(id, button) {
  button.disabled = true;
  await fetch ('http://localhost:8080/api/v1/items' + '/' + id, {method: 'DELETE'});
  renderList();
  button.disabled = false;
}
