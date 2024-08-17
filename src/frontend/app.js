document.addEventListener("DOMContentLoaded", () => {
    function navigate(viewId) {
        localStorage.setItem("activeView", viewId);
        document.querySelectorAll(".view").forEach((view) => {
            view.style.display = "none";
        });
        document.getElementById(viewId).style.display = "block";
    }
    // event listeners for all the views
    document
        .getElementById("home")
        .addEventListener("click", () => navigate("homeView"));
    document
        .getElementById("dashboard")
        .addEventListener("click", () => navigate("dashboardView"));
    document
        .getElementById("menu")
        .addEventListener("click", () => navigate("menuView"));
    document
        .getElementById("cart")
        .addEventListener("click", () => {
            navigate("cartView");
            getCartItems(); // Refresh the cart view when navigating to the cart
        });
    // document
    //     .getElementById("history")
    //     .addEventListener("click", () => navigate("historyView"));
    // const lastView = localStorage.getItem("activeView") || "homeView";
    // navigate(lastView);
    // event listener to save profile
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const profileForm = document.getElementById("profileForm");
    const profileInfo = document.getElementById("profileInfo");
    const clearProfileButton = document.getElementById("clearProfile");
    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveProfile();
    });

    clearProfileButton.addEventListener("click", clearProfile);

    // restores profile on page load
    restoreProfile();

    // saves profile
    function saveProfile() {
        const profile = {
            username: usernameInput.value,
            email: emailInput.value
        };
        console.log("Saving profile:", profile); // Debugging output

        localStorage.setItem("userProfile", JSON.stringify(profile));
        displayProfileInfo(profile);
    }

    // restores profile from local storage
    function restoreProfile() {
        const profile = JSON.parse(localStorage.getItem("userProfile"));
        console.log("Restoring profile:", profile); // Debugging output

        if (profile) {
            usernameInput.value = profile.username;
            emailInput.value = profile.email;
            displayProfileInfo(profile);
        }
    }

    // clear profile from local storage
    function clearProfile() {
        localStorage.removeItem("userProfile");
        usernameInput.value = "";
        emailInput.value = "";
        profileInfo.textContent = "";
    }

    // displays profile 
    function displayProfileInfo(profile) {
        profileInfo.textContent = `Username: ${profile.username}, Email: ${profile.email}`;
    }

    // add to cart
    async function addToCart(itemName, itemPrice) {
        try {
            const response = await fetch(`/cartItem?name=${encodeURIComponent(itemName)}&quantity=1&price=${encodeURIComponent(itemPrice)}`, {
                method: 'POST',
            });
    
            if (response.ok) {
                console.log("Item added to cart");
                getCartItems();  // Refresh the cart view after adding
            } else {
                const errorData = await response.json();
                console.error("Error adding item to cart:", errorData.error);
            }
        } catch (error) {
            console.error("Network error occurred while adding item to cart:", error);
        }
    }
    

    // get cart items
    async function getCartItems() {
        try {
            const response = await fetch('/cartItems', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                updateCartView(data); // Update the UI with the cart items
            } else {
                const errorData = await response.json();
                console.error("Error retrieving cart items:", errorData.error);
            }
        } catch (error) {
            console.error("Network error occurred while retrieving cart items:", error);
        }
    }

    // update cart view
    function updateCartView(cartItems) {
        const cartContainer = document.getElementById("cart-container");
        cartContainer.innerHTML = '';  // Clear previous items
    
        cartItems.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} (x${item.quantity}) - $${(item.quantity * item.price).toFixed(2)}`;
    
            // Add update and delete buttons
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.addEventListener("click", () => {
                const newQuantity = prompt("Enter new quantity:", item.quantity);
                if (newQuantity) {
                    updateCartItem(item.name, parseInt(newQuantity));
                }
            });
    
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                if (confirm(`Remove ${item.name} from cart?`)) {
                    deleteCartItem(item.name);
                }
            });
    
            listItem.appendChild(updateButton);
            listItem.appendChild(deleteButton);
            cartContainer.appendChild(listItem);
        });
    
        // Display total price
        const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const totalPriceElement = document.createElement("h3");
        totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
        cartContainer.appendChild(totalPriceElement);
    }
    

    // update cart item
    async function updateCartItem(itemName, newQuantity) {
        try {
            const response = await fetch(`/cartItem?name=${encodeURIComponent(itemName)}&quantity=${encodeURIComponent(newQuantity)}`, {
                method: 'PUT',
            });

            if (response.ok) {
                console.log("Cart item updated");
                getCartItems(); // Refresh the cart view after updating
            } else {
                const errorData = await response.json();
                console.error("Error updating cart item:", errorData.error);
            }
        } catch (error) {
            console.error("Network error occurred while updating cart item:", error);
        }
    }

    // delete cart item
    async function deleteCartItem(itemName) {
        try {
            const response = await fetch(`/cartItem?name=${encodeURIComponent(itemName)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Cart item deleted");
                getCartItems(); // Refresh the cart view after deleting
            } else {
                const errorData = await response.json();
                console.error("Error deleting cart item:", errorData.error);
            }
        } catch (error) {
            console.error("Network error occurred while deleting cart item:", error);
        }
    }
    window.addToCart = addToCart;
});

// class CartView {
//     constructor(cartItems = []) {
//         this.cartItems = cartItems;
//     }

//     addToCart(itemName, itemPrice) {
//         const existingItem = this.cartItems.find((item) => item.name === itemName);
//         if (existingItem) {
//             existingItem.quantity += 1;
//             existingItem.totalPrice += itemPrice;
//         } else {
//             this.cartItems.push({
//                 name: itemName,
//                 quantity: 1,
//                 price: itemPrice,
//                 totalPrice: itemPrice,
//             });
//         }
//     }
//     render() {
//         const container = document.createElement("div");
//         container.id = "cart-view";

//         const list = document.createElement("ul");
//         this.cartItems.forEach((item) => {
//             const listItem = document.createElement("li");
//             listItem.textContent = `${item.name} (x${item.quantity}) - $${item.totalPrice.toFixed(2)}`;
//             list.appendChild(listItem);
//         });

//         const totalPrice = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
//         const totalPriceElement = document.createElement("h3");
//         totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
//         container.appendChild(list);
//         container.appendChild(totalPriceElement);
//         return container;
//     }
// }