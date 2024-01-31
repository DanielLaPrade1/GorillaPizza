// Display Cart Counter Badge
let ci = JSON.parse(localStorage.getItem('cartItems'))
let totalQuantity = ci.reduce((total, item) => total + item.quantity, 0)
let cartBadge = document.getElementById('cartNavCounter')
cartBadge.innerText = totalQuantity

// Form Validation
function validateName () {
    let name = document.getElementById('customerName').value;
    let errorDiv = document.getElementById('invalidName');

    if (name == "") {
        errorDiv.innerText = "Please Enter Your Name";
        return null;
    } else {
        errorDiv.innerText = "";
        return name;
    }
}
function validateEmail () {
    let email = document.getElementById('customerEmail').value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorDiv = document.getElementById('invalidEmail');

    if (!emailRegex.test(email)) {
        errorDiv.innerText = "Please Enter A Valid Email";
        return null;
    } else {
        errorDiv.innerText = "";
        return email;
    }
}
function validatePhoneNumber () {
    let phoneNumber = document.getElementById('customerPhoneNumber').value;
    let pnRegex = /^\d{10}$/;
    let errorDiv = document.getElementById('invalidPN');

    if (!pnRegex.test(phoneNumber)) {
        errorDiv.innerText = "Please enter a 10-digit phone number (no dashes)";
        return null;
    } else {
        errorDiv.innerText = "";
        return phoneNumber;
    }
}

function validateContactInfo () {
    let contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        let name = validateName();
        let email = validateEmail();
        let phoneNumber = validatePhoneNumber();
        if (name != null && email != null && phoneNumber != null) {
            let success = document.getElementById('formSumbitSuccess');
            success.innerText = "Discount Added";
            localStorage.setItem("discount", true);
        }
        
    });
}

document.addEventListener("DOMContentLoaded", function() {
    validateContactInfo();
});