// Class to build cards for ordering food
function buildCard (id, imageSrc, imageAlt, titleText, price, cardText) {
    
    // Create Tags
    let colDiv = document.createElement("div");
    colDiv.classList.add("col-lg-3");
    colDiv.classList.add("col-md-4");
    colDiv.classList.add("col-sm-6");
    colDiv.classList.add("p-3");

    let cardDiv = document.createElement("div");
    cardDiv.id = id + "card";
    cardDiv.classList.add("card");
    cardDiv.classList.add("menu-card");

    let topImg = document.createElement("img");
    topImg.classList.add("card-img-top");
    topImg.classList.add("menu-image");
    topImg.src = imageSrc;
    topImg.alt = imageAlt;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    
    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = titleText;

    let cardBodyText = document.createElement("p");
    cardBodyText.classList.add("card-text", "my-1");
    cardBodyText.innerHTML = cardText + " | $" + price.toFixed(2);
    cardBodyText.style.height = "5.5rem";

    // Modal Close Button Functionality
    let addItems = document.getElementById("addItems");
    function handleAdd() {
        // Add the item to cart, if successful, reset event listener
        if (addItemToCart(id, titleText, price, imageSrc, imageAlt)) {
            addItems.removeEventListener('click', handleAdd);
        }
    }
    let closeDeleteButtonTop = document.getElementById("closeDeleteButtonTop");
    closeDeleteButtonTop.addEventListener("click", () => addItems.removeEventListener('click', handleAdd));
    let closeDeleteButtonBottom = document.getElementById("closeDeleteButtonBottom");
    closeDeleteButtonBottom.addEventListener("click", () => addItems.removeEventListener('click', handleAdd));

    // Add Button
    let addToCart = document.createElement("button");
    addToCart.classList.add("order-button", "my-1");
    addToCart.innerHTML = "Add To Cart";

    // Add Button Functionality
    addToCart.addEventListener("click", function () {
        let quantityBox = document.getElementById("addItemsAmount");
        quantityBox.value = 1;

        $('#orderModal').modal('show');

        let errorMessage = document.getElementById("errorText");
        errorMessage.innerText = "";

        addItems.addEventListener('click', handleAdd);
    });

    // Nest Elements
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardBodyText);
    cardBody.appendChild(addToCart);
    
    cardDiv.appendChild(topImg);
    cardDiv.appendChild(cardBody);

    colDiv.appendChild(cardDiv);

    return colDiv;
}

// Build Food and Drink Cards

//Fetch Data From Website
const pizzaData = './Menu/pizza.json';
const appetizerData = './Menu/appetizer.json';
const drinkData = './Menu/drink.json';

async function buildSection(data) {
	const dataFetch = await fetch(data);
	const menuData = await dataFetch.json();

    let resultOptions = [];
    for (let item of menuData) {
        let optionCard = buildCard(item.id, item.image, item.name, item.altName, item.price, item.description);
        resultOptions.push(optionCard);
    }
    return resultOptions;
}

async function buildMenu() {
    // Pizza 
    let pizzaDiv = document.getElementById("pizza");
    let pizzaCards = await (buildSection(pizzaData));
    for (let pizza of pizzaCards) {
        pizzaDiv.appendChild(pizza);
    }
    // Appetizers 
    let appetizerDiv = document.getElementById("appetizers");
    let appetizerCards = await (buildSection(appetizerData));
    for (let appetizer of appetizerCards) {
        appetizerDiv.appendChild(appetizer);
    }
    // Drinks 
    let drinkDiv = document.getElementById("drinks");
    let drinkCards = await (buildSection(drinkData));
    for (let drink of drinkCards) {
        drinkDiv.appendChild(drink);
    }
}


// Error message functionality
let errorMessage = document.getElementById("errorText");

function handleError() {
    errorMessage.innerText = "Please Select A Valid Amount"
    errorMessage.classList.add("error-text");

    setTimeout(hideError, 3000);
}

function hideError() {
    errorMessage.innerText = "";
    errorMessage.classList.remove("error-text");
}

// Get cart items from local storage
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

let totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
let cartBadge = document.getElementById('cartNavCounter');
cartBadge.innerText = totalQuantity;


// Add Items to Cart
function addItemToCart (id, item, price, imageSrc, imageAlt) {

    let amount = document.getElementById("addItemsAmount");
    amount_value = parseInt(amount.value, 10);

    if (amount_value < 1 || amount.value == undefined || amount.value == "") {
        handleError()
        return false;
    } else {
        // Check for existing item
        let existingItem = cartItems.find(cartItem => cartItem.itemName === item);

        if (existingItem) {
            existingItem.quantity += amount_value;
            existingItem.priceTag += price * amount_value;
        } else {
            // Add items to localstorage
            let itemToAdd = {id: id, itemName: item, priceTag: price * amount_value, quantity: amount_value, image: imageSrc, imageAltText: imageAlt};
            cartItems.push(itemToAdd);
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Update total quantity
        totalQuantity += amount_value;
        cartBadge.innerText = totalQuantity;
        $('#orderModal').modal('hide');
        return true;
    }
}

// Initialization
document.addEventListener("DOMContentLoaded", function() {
    buildMenu();
    // Scroll to referenced element (if there is one) after small timeout
    let hash = window.location.hash;
    if (hash) {
        setTimeout(function() {
            document.querySelector(hash).scrollIntoView({
                behavior: 'smooth'
            });
        }, 200);
    }
});