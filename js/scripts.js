//Declaring global variables to be used in the following code.
const randomUsersApi = 'https://randomuser.me/api?results=12&&nat=us';
const personGallery = document.getElementsByClassName('gallery');
const personCards = document.getElementsByClassName('card');
const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.style.display = 'none';
let dataArray;
let searchContainer = document.getElementsByClassName('search-container');
let search = `<form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search by name...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>`;
let searchInput = document.getElementsByClassName('search-input');
let submitInput = document.getElementsByClassName('search-submit');
  searchContainer[0].insertAdjacentHTML('beforeend', search); //Adding the search feature to the page.
/*
This fetches data from the Random Users API, then:
* Parses the results to JSON
* Creates an array from that data and passes that array to the generateGallery and cardHandlers functions.
* Catches errors and returns an error message if one is encountered.
*/
fetch(randomUsersApi) 
  .then(results => results.json())
  .then(data => {
    dataArray = Array.from(data.results);
    generateGallery(dataArray);
    cardHandlers(dataArray);
  })
  .catch(error => {
      personGallery[0].innerHTML = `<h1>There was an issue gathering the data: ${error}.</h1>`
      console.log(error);
    })

//The generateGallery function generates the gallery of people and displays it on the page.
function generateGallery(data) {
  let divCard = data.map(person => `<div class="card">
                   <div class="card-img-container">
                        <img class="card-img" src="${person.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="card-text">${person.email}</p>
                        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                    </div>
                    </div>`
  ).join('');
  
  personGallery[0].innerHTML = divCard;
};
//The cardHandlers function adds an event listener to the employee cards.
function cardHandlers(data) {
   for (let i = 0; i < personCards.length; i++) {
     personCards[i].addEventListener('click', () => {
     const personIndex = data.findIndex(function (person) { //Adapted from https://gomakethings.com/how-to-get-the-index-of-an-object-in-an-array-with-vanilla-js/
        //Checks the email *and* state location (to account for potential duplicate emails) of selected person against email and location in dataArray.
        if (person.email === data[i].email && person.location.state === data[i].location.state)
        //Returns the employee name to the findIndex function to retrieve the index position of the employee.
        return person.name.first;
      });
      generateModal(data, personIndex);//Passes the data and index of the selected employee to the generateModal function.
    });
    }
}
//The generateModal function accepts two arguments (data and index) and creates a modal with that information.
function generateModal(data, index) {
  let phoneNumber = `${data[index].cell.replace(/[^\d]/g, "")}`
  let reformattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); //Adapted from https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
  let dob = new Date(data[index].dob.date);
  let birthday = `${dob.getMonth()+1}/${dob.getDate()}/${dob.getFullYear()}`
  let personModal = `
                    <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${data[index].picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${data[index].name.first} ${data[index].name.last}</h3>
                        <p class="modal-text">${data[index].email}</p>
                        <p class="modal-text cap">${data[index].location.city}</p>
                        <hr>
                        <p class="modal-text">${reformattedPhone}</p>
                        <p class="modal-text">${data[index].location.street.number} ${data[index].location.street.name} ${data[index].location.city} ${data[index].location.state} ${data[index].location.postcode}</p>
                        <p class="modal-text">Birthday: ${birthday}</p>
                    </div>
                  <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;

  modalContainer.innerHTML = personModal;
  modalContainer.style.display = 'flex'; //Updating the modal style from 'none' to 'flex'.
  personGallery[0].insertAdjacentElement('afterend', modalContainer); //Inserting the modal so it displays.
  //Disabling the Prev button at the beginning of the array.
  if (index -1 < 0) { 
    document.getElementById('modal-prev').classList.add('disabled-btn');
    document.getElementById('modal-prev').classList.remove('btn');
    document.getElementById('modal-prev').disabled = true;
  }
  //Disabling the Next button at the end of the array.
  if (index + 1 === data.length) { 
    document.getElementById('modal-next').classList.add('disabled-btn');
    document.getElementById('modal-next').classList.remove('btn');
    document.getElementById('modal-next').disabled = true;
  }
  //modalHandler accepts buttonText as an argument and calls generateModal or closes the modal accordingly..
  function modalHandler(buttonText) {
    if (buttonText === 'X') {
      modalContainer.style.display = 'none';
    } else if (buttonText === 'Prev') {
      generateModal(data, index-1);
    } else if (buttonText === 'Next') {
      generateModal(data, index+1);
    }
  }
  //The event listeners below call the modalHandler function and pass it the text content of the selected button.
  document.getElementById('modal-close-btn').addEventListener('click', (event) => {
    modalHandler(event.target.textContent);
  });

  document.getElementById('modal-prev').addEventListener('click', (event) => {
    modalHandler(event.target.textContent);
  });

 document.getElementById('modal-next').addEventListener('click', (event) => {
    modalHandler(event.target.textContent);
  });

}

//Adds a function so clicking anywhere outside of the modal closes it.
window.onclick = function(event) {
  if (event.target.className == 'modal-container') {
    document.getElementsByClassName('modal-container')[0].style.display = "none";
  }
}

/*
The searchEmployees function accepts an input parameter to search the directory.
If the full name of the employee matches with the search input, the person is passed to the filterResults array.
If there are no matching results, an appropriate message is displayed.
*/
function searchEmployees(input) {
  personGallery.innerHTML = '';
  let filteredResults = [];
  dataArray.forEach(person => {
    let fullName = `${person.name.first} ${person.name.last}`
    if (fullName.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
      filteredResults.push(person);
      generateGallery(filteredResults);
      cardHandlers(filteredResults);
    }
  });
  if (filteredResults.length === 0) {
      personGallery[0].innerHTML = '<h1>Sorry, no results found.</h1>';
  }
}
//Event listeners for the search function.
searchInput[0].addEventListener('keyup', () => {
  searchEmployees(searchInput[0].value);
});

searchInput[0].addEventListener('search', () => {
  searchEmployees(searchInput[0].value);
});

submitInput[0].addEventListener('click', () => {
  searchEmployees(searchInput[0].value);
});