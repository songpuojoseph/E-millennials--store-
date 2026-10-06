const productsGrid = document.getElementById("productsGrid");
const productCount = document.getElementById("productCount");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");
const closeCartButton = document.getElementById("closeCartButton");
const continueShopping = document.getElementById("continueShopping");

const cartItems = document.getElementById("cartItems");
const modalCartCount = document.getElementById("modalCartCount");
const cartTotal = document.getElementById("cartTotal");

const customerForm = document.getElementById("customerForm");
const checkoutButton = document.getElementById("checkoutButton");

const summaryModal = document.getElementById("summaryModal");
const summarySuccessIcon = document.getElementById("summarySuccessIcon");
const summaryEyebrow = document.getElementById("summaryEyebrow");
const summaryName = document.getElementById("summaryName");
const summaryMessage = document.getElementById("summaryMessage");
const summaryReference = document.getElementById("summaryReference");
const summaryList = document.getElementById("summaryList");
const summaryTotalLabel = document.getElementById("summaryTotalLabel");
const summaryTotal = document.getElementById("summaryTotal");
const summaryReviewActions = document.getElementById("summaryReviewActions");
const summaryBack = document.getElementById("summaryBack");
const summaryPay = document.getElementById("summaryPay");
const summaryOk = document.getElementById("summaryOk");

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const toast = document.getElementById("toast");


function formatMoney(amount) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2
    }).format(amount);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(function() {
        toast.classList.add("hidden");
    }, 3000);
}


function displayProducts() {

    productsGrid.innerHTML = "";

    STORE_PRODUCTS.forEach(function(product) {

        const productCard = document.createElement("article");

        productCard.className = "product-card";

        const productIsInCart = Cart.find(product.id);
        const buttonText = productIsInCart
            ? "Remove from Cart"
            : "Add to Cart";

        const buttonClass = productIsInCart
            ? "remove-from-cart"
            : "add-to-cart";

        productCard.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            </div>

            <h3>${product.name}</h3>

            <p class="product-price">
                ${formatMoney(product.price)}
            </p>

            <button
                class="${buttonClass}"
                type="button"
                data-product-id="${product.id}"
            >
                ${buttonText}
            </button>
        `;

        productsGrid.appendChild(productCard);
    });

    productCount.textContent = `${STORE_PRODUCTS.length} products`;
}


function displayCart() {

    cartItems.innerHTML = "";

    if (Cart.items.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty.</h3>
                <p>Add a product to continue.</p>
            </div>
        `;

    } else {

        Cart.items.forEach(function(item, index) {

            const cartRow = document.createElement("div");

            cartRow.className = "cart-row";

            cartRow.innerHTML = `
                <div class="cart-product">
                    <span class="serial-number">${index + 1}</span>

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>
                        <h3>${item.name}</h3>
                        <p>${formatMoney(item.price)} each</p>
                    </div>
                </div>

                <div class="quantity-control">
                    <button
                        type="button"
                        class="quantity-button"
                        data-action="decrease"
                        data-product-id="${item.id}"
                        aria-label="Decrease ${item.name} quantity"
                    >
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-button"
                        data-action="increase"
                        data-product-id="${item.id}"
                        aria-label="Increase ${item.name} quantity"
                    >
                        +
                    </button>
                </div>

                <strong class="cart-row-price">
                    ${formatMoney(item.price * item.quantity)}
                </strong>

                <button
                    type="button"
                    class="remove-button"
                    data-action="remove"
                    data-product-id="${item.id}"
                >
                    Remove
                </button>
            `;

            cartItems.appendChild(cartRow);
        });
    }

    updateCartInformation();
}


function updateCartInformation() {
    const numberOfProducts = Cart.itemCount();

    cartCount.textContent = numberOfProducts;
    modalCartCount.textContent =
        `${numberOfProducts} ${numberOfProducts === 1 ? "item" : "items"}`;

    cartTotal.textContent = formatMoney(Cart.total());
}


function openCart() {
    cartModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeCart() {
    cartModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

function openSummary() {
    summaryModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeSummary() {
    summaryModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
}


function getCustomerDetails() {

    return {
        name: document.getElementById("customerName").value.trim(),
        email: document.getElementById("customerEmail").value.trim(),
        phone: document.getElementById("customerPhone").value.trim()
    };
}


function showOrderSummary(customer, transaction, items, total) {

    summarySuccessIcon.classList.remove("hidden");
    summaryEyebrow.textContent = "PAYMENT SUCCESSFUL";
    summaryName.textContent = customer.name;
    document.getElementById("summaryTitle").firstChild.textContent = "Thank you, ";
    summaryMessage.textContent = "Your order has been received.";

    summaryReference.textContent =
        `Payment Reference: ${transaction.reference}`;
    summaryReference.classList.remove("hidden");

    summaryTotalLabel.textContent = "Total Paid";
    summaryTotal.textContent = formatMoney(total);
    summaryReviewActions.classList.add("hidden");
    summaryOk.classList.remove("hidden");

    summaryList.innerHTML = "";

    items.forEach(function(item) {

        const summaryRow = document.createElement("div");

        summaryRow.className = "summary-row";

        summaryRow.innerHTML = `
            <span>${item.name}</span>
            <strong>Qty: ${item.quantity}</strong>
        `;

        summaryList.appendChild(summaryRow);
    });

    openSummary();
}

function showCheckoutSummary(customer, items, total) {

    summarySuccessIcon.classList.add("hidden");
    summaryEyebrow.textContent = "ORDER SUMMARY";
    summaryName.textContent = customer.name;
    document.getElementById("summaryTitle").firstChild.textContent = "Review your order, ";
    summaryMessage.textContent = "Confirm your items and total before making payment.";
    summaryReference.classList.add("hidden");
    summaryTotalLabel.textContent = "Total";
    summaryTotal.textContent = formatMoney(total);
    summaryReviewActions.classList.remove("hidden");
    summaryOk.classList.add("hidden");

    summaryList.innerHTML = "";

    items.forEach(function(item) {
        const summaryRow = document.createElement("div");

        summaryRow.className = "summary-row";
        summaryRow.innerHTML = `
            <span>${item.name}</span>
            <strong>Qty: ${item.quantity}</strong>
        `;

        summaryList.appendChild(summaryRow);
    });

    openSummary();
}


productsGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-to-cart, .remove-from-cart");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.productId);

    const product = STORE_PRODUCTS.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    if (button.classList.contains("remove-from-cart")) {
        Cart.remove(productId);
        displayProducts();
        displayCart();
        showToast(`${product.name} removed from cart.`);
        return;
    }

    Cart.add(product);

    displayProducts();
    displayCart();

    showToast(`${product.name} added to cart.`);
});


cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.productId);
    const action = button.dataset.action;

    if (action === "increase") {
        Cart.increase(productId);
    }

    if (action === "decrease") {
        Cart.decrease(productId);
    }

    if (action === "remove") {
        Cart.remove(productId);
    }

    displayCart();
});


checkoutButton.addEventListener("click", function() {

    if (Cart.items.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    const customer = getCustomerDetails();

    if (!Validation.validate(customer)) {
        return;
    }

    const itemsForSummary = Cart.items.map(function(item) {
        return {
            ...item
        };
    });

    const total = Cart.total();

    showCheckoutSummary(customer, itemsForSummary, total);
});

summaryBack.addEventListener("click", function() {
    closeSummary();
    openCart();
});

summaryPay.addEventListener("click", function() {
    const customer = getCustomerDetails();
    const itemsForSummary = Cart.items.map(function(item) {
        return { ...item };
    });
    const total = Cart.total();

    const paymentStarted = Payment.start(customer, total, function(transaction) {
        showOrderSummary(customer, transaction, itemsForSummary, total);
    });

    if (paymentStarted) {
        closeSummary();
    }
});


summaryOk.addEventListener("click", function() {

    Cart.clear();

    customerForm.reset();

    Validation.clearErrors();

    closeSummary();

    displayCart();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showToast("Thank you. Your order has been completed.");
});


cartButton.addEventListener("click", function() {
    displayCart();
    openCart();
});

closeCartButton.addEventListener("click", closeCart);

continueShopping.addEventListener("click", closeCart);


cartModal.addEventListener("click", function(event) {

    if (event.target === cartModal) {
        closeCart();
    }
});


document.addEventListener("keydown", function(event) {

    if (event.key !== "Escape") {
        return;
    }

    closeCart();
    closeSummary();
});


menuToggle.addEventListener("click", function() {

    const isOpen = mainNav.classList.toggle("show");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});


mainNav.addEventListener("click", function(event) {

    if (event.target.tagName !== "A") {
        return;
    }

    mainNav.classList.remove("show");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
});


displayProducts();
displayCart();
