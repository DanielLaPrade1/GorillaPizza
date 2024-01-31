// Retreive Cart Items
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let cart = document.getElementById("cart");

let totalPrice = 0;

// Discount Applied?
let discount = localStorage.getItem("discount") || false;

// Build Cart Item Format And Add Item To List
function buildCartItems () {
    //Reset cart
    cart.innerHTML = "";
    totalPrice = 0;
    //Build the list
    cartItems.forEach(item => {

        let li = document.createElement("li");
        li.classList.add("list-group-item");
        // Item ID is the item name
        li.id = item.id;

        let mainDiv = document.createElement("div");
        mainDiv.classList.add("d-flex", "justify-content-between");

        // Image and pizza name div
        let imgAndNameDiv = document.createElement("div");
        imgAndNameDiv.classList.add("d-flex", "justify-content-between");

        let img = document.createElement("img");
        img.src = item.image;
        img.classList.add('cart-item-image');

        let itemName = document.createElement("h4");
        itemName.classList.add("m-3", 'cart-item-text');
        itemName.textContent = item.itemName;

        // Quantity and price div
        let quantityAndPriceDiv = document.createElement("div");
        quantityAndPriceDiv.classList.add("d-flex", "justify-content-between", "my-3", "mx-2");

        let quantityP = document.createElement("h5");
        quantityP.id = "quantity" + item.id;
        quantityP.classList.add("mx-4", 'cart-item-text');
        quantityP.textContent = item.quantity;

        let priceP = document.createElement("h5");
        priceP.id = "price" + item.id;
        priceP.classList.add('cart-item-text');
        priceP.textContent = dollarRepresentation(item.priceTag);

        // Modal Close Button Functionality
        let submitDeletedItems = document.getElementById("deleteItems");
        function handleDelete() {
            if (deleteCartItems(item)) {
                submitDeletedItems.removeEventListener('click', handleDelete);
            }
        }
        let closeDeleteButtonTop = document.getElementById("closeDeleteButtonTop");
        closeDeleteButtonTop.addEventListener("click", () => submitDeletedItems.removeEventListener('click', handleDelete));
        let closeDeleteButtonBottom = document.getElementById("closeDeleteButtonBottom");
        closeDeleteButtonBottom.addEventListener("click", () => submitDeletedItems.removeEventListener('click', handleDelete));

        // Delete button
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "mx-2", "d-flex", "align-items-center");
        deleteButton.style.height = "2rem";
        deleteButton.style.width = "2rem";
        deleteButton.innerHTML = "X";

        // Delete button functionality
        deleteButton.addEventListener("click", function() {
            let quantityBox = document.getElementById("deleteItemsAmount");
            quantityBox.value = 1;
            
            // Don't show modal if quantity is 1, just delete
            if (item.quantity == 1) {
                let index = cartItems.findIndex(cartItem => cartItem.itemName === item.itemName);
                totalPrice -= cartItems[index].priceTag;
                cartItems.splice(index, 1);
            
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                updateTotal();
                updateBadge();
                // Rebuild cart
                buildCartItems ();
            } else {
                $('#deleteModal').modal('show');
                populateDeleteModal(item);

                let errorMessage = document.getElementById("errorText");
                errorMessage.innerText = "";
                submitDeletedItems.addEventListener("click", handleDelete);
            }
        });

        // Create element structure
        quantityAndPriceDiv.appendChild(quantityP);
        quantityAndPriceDiv.appendChild(priceP);
        imgAndNameDiv.appendChild(deleteButton);
        imgAndNameDiv.appendChild(img);
        imgAndNameDiv.appendChild(itemName);

        mainDiv.appendChild(imgAndNameDiv);
        mainDiv.appendChild(quantityAndPriceDiv);

        li.appendChild(mainDiv);
        cart.appendChild(li);

        // Append total
        totalPrice += item.priceTag;
    })
    updateTotal();
}

// Display Dollar As String
function dollarRepresentation(price) {
    return "$" + price.toFixed(2);
}

// Dynamically render text in modal so it matches the item selected
function populateDeleteModal(item) {
    deleteTitle = document.getElementById("deleteTitle");
    deleteTitle.innerText = "Remove " + item.itemName + " From Your Order?";
}

// Error message functionality
let errorMessage = document.getElementById("errorText");

function handleError() {
    errorMessage.innerText = "Please Select A Valid Amount"
    errorMessage.classList.add("error-text");

    setTimeout(hideError, 2800);
}

function hideError() {
    errorMessage.innerText = "";
    errorMessage.classList.remove("error-text");
}

// Delete Specified Items From Cart
function deleteCartItems (item) {
    let amount = document.getElementById("deleteItemsAmount");
    let errorMessage = document.getElementById("errorText");
    
    //Get index for removal
    let index = cartItems.findIndex(cartItem => cartItem.itemName === item.itemName);

    if (amount.value <= 0 || amount.value > item.quantity) {
        handleError();
        return false;
    } else if (amount.value == item.quantity) {
        // Remove item entirely
        totalPrice -= cartItems[index].priceTag;
        cartItems.splice(index, 1);
        
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
        // Rebuild cart
        buildCartItems();

        $('#deleteModal').modal('hide');
    } else {
        // Update specified item
        let priceOfOne = cartItems[index].priceTag / cartItems[index].quantity;
        cartItems[index].priceTag -= amount.value * priceOfOne;
        totalPrice -= amount.value * priceOfOne;
        cartItems[index].quantity -= amount.value;

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCart(item);

        $('#deleteModal').modal('hide');
    }
    updateTotal();
    updateBadge();
    return true;
}

// Update quanitity and price
function updateCart(item) {
    let quantity_id = "#quantity" + item.id;
    let price_id = "#price" + item.id;
    let quantity = document.getElementById(item.id).querySelector(quantity_id);
    let price = document.getElementById(item.id).querySelector(price_id);

    quantity.textContent = item.quantity;
    price.textContent = dollarRepresentation(item.priceTag);
}

// Update badge
function updateBadge () {
    let totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    let cartBadge = document.getElementById('cartNavCounter');
    cartBadge.innerText = totalQuantity;
}

// Update total
function updateTotal () {
    let totalCartPrice = document.getElementById("totalCartPrice");
    totalCartPrice.innerText = dollarRepresentation(totalPrice);
}

// Proceed Modal Functionality
let proceedModalBody = document.getElementById("proceedModalBody");
let finalOrderList = document.getElementById("proceedModalBodyOrderList")

let proceedButton = document.getElementById("proceedButton");

proceedButton.addEventListener("click", function () {
    $('#proceedModal').modal('show');
    for (let item of cartItems) {
        let itemDiv = document.createElement('div');
        itemDiv.style.backgroundColor = "#e1e6e1"
        itemDiv.classList.add("list-group-item");

        let itemDescription = document.createElement('h6');
        itemDescription.style.textDecorationColor = "#49393b";
        itemDescription.innerText = item.quantity + " " + item.itemName + "s: " + dollarRepresentation(item.priceTag);

        itemDiv.appendChild(itemDescription);
        finalOrderList.appendChild(itemDiv);
        
    }
    let total = document.createElement('h4');
    total.classList.add("list-group-item");
    total.style.backgroundColor = "#e1e6e1"
    discount ?
     total.innerText = "Total: " + dollarRepresentation(totalPrice * 0.9) + " (-10%)" 
     : total.innerText = "Total: " + dollarRepresentation(totalPrice);
    finalOrderList.appendChild(total);
});

let closeProceedButtonTop = document.getElementById("closeProceedButtonTop");
closeProceedButtonTop.addEventListener("click", () => finalOrderList.innerText = "");
let closeProceedButtonBottom = document.getElementById("closeProceedButtonBottom");
closeProceedButtonBottom.addEventListener("click", () => finalOrderList.innerText = "");

// Download Order
let download_order_button = document.getElementById("downloadOrder");
download_order_button.addEventListener("click", function () {
    orderData = JSON.stringify(cartItems, null, 2);
    let orderBlob = new Blob([orderData], { type: 'application/octet-stream' });

    let orderLink = document.createElement('a');
    orderLink.href = URL.createObjectURL(orderBlob);
    orderLink.download = 'MyCartItems.json';
    
    orderLink.click();
    URL.revokeObjectURL(orderLink.href);
})

// Initialization
document.addEventListener("DOMContentLoaded", function() {
    buildCartItems();
    updateBadge();
    updateTotal();
});
