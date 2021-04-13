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
  searchContainer[0].insertAdjacentHTML('beforeend', search);

fetch(randomUsersApi)
  .then(results => results.json())
  .then(data => {
    dataArray = Array.from(data.results);
    generateGallery(dataArray);
  })
  .catch(error => {
      personGallery[0].innerHTML = `<h1>There was an issue gathering the data: ${error}.</h1>`
    })

function generateGallery(data) {
  personGallery[0].innerHTML = '';
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

  cardHandlers(data);
};

function cardHandlers(data) {
   for (let i = 0; i < personCards.length; i++) {
     personCards[i].addEventListener('click', () => {
     const personIndex = data.findIndex(function (person) { //Adapted from https://gomakethings.com/how-to-get-the-index-of-an-object-in-an-array-with-vanilla-js/
        if (person.email === data[i].email && person.location.state === data[i].location.state)
        return person.name.first;
      });
      generateModal(data, personIndex);
    });
    }
}

function generateModal(data, index) {
  let phoneNumber = `${data[index].phone.replace(/[^\d]/g, "")}`
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
  modalContainer.style.display = 'flex';
  personGallery[0].insertAdjacentElement('afterend', modalContainer);
  console.log(index);
  console.log(data.length);

  if (index -1 < 0) {
    document.getElementById('modal-prev').classList.add('disabled-btn');
    document.getElementById('modal-prev').classList.remove('btn');
    document.getElementById('modal-prev').disabled = true;
  } else if (index+1 >= data.length) {
    document.getElementById('modal-next').classList.add('disabled-btn');
    document.getElementById('modal-next').classList.remove('btn');
    document.getElementById('modal-next').disabled = true;
  }

  function modalHandler(button) {
    if (button === 'X') {
      modalContainer.style.display = 'none';
    } else if (button === 'Prev') {
      generateModal(data, index-1);
    } else if (button === 'Next') {
      generateModal(data, index+1);
    }
  }

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    modalHandler(event.target.textContent);
  });

  document.getElementById('modal-prev').addEventListener('click', () => {
    modalHandler(event.target.textContent);
  });

 document.getElementById('modal-next').addEventListener('click', () => {
    modalHandler(event.target.textContent);
  });

}

function searchEmployees(input) {
  personGallery.innerHTML = '';
  let filteredResults = [];
  for (let i = 0; i < dataArray.length; i++) {
    let fullName = `${dataArray[i].name.first} ${dataArray[i].name.last}`
    if (fullName.toLowerCase().includes(input.toLowerCase())) {
      searchInput[0].classList.remove('clear');
      filteredResults.push(dataArray[i]);
      generateGallery(filteredResults);
     }
  } if (filteredResults.length === 0) {
      personGallery[0].innerHTML = '<h1>Sorry, no results found.</h1>';
  }
}

searchInput[0].addEventListener('keyup', () => {
  searchEmployees(searchInput[0].value);
});

searchInput[0].addEventListener('search', () => {
  searchEmployees(searchInput[0].value);
});

submitInput[0].addEventListener('click', () => {
  searchEmployees(searchInput[0].value);
});