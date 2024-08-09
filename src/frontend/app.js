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
      .addEventListener("click", () => navigate("cartView"));
    document
      .getElementById("history")
      .addEventListener("click", () => navigate("historyView"));
    const lastView = localStorage.getItem("activeView") || "homeView";
    navigate(lastView);
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
        console.log("Saving profile:", profile);  // Debugging output

        localStorage.setItem("userProfile", JSON.stringify(profile));
        displayProfileInfo(profile);
    }

    // restores profile from local storage
    function restoreProfile() {
        const profile = JSON.parse(localStorage.getItem("userProfile"));
        console.log("Restoring profile:", profile);  // Debugging output

        if (profile) {
            usernameInput.value = profile.username;
            emailInput.value = profile.email;
            displayProfileInfo(profile);
        }
    }

    //clear profile from local storage
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

    // cart managament
    function addToCart(itemName, itemPrice) {
        cartView.addToCart(itemName, itemPrice);
        updateCartView();
    }
    
    function updateCartView() {
        cartContainer.innerHTML = "";
        cartContainer.appendChild(cartView.render());
    }
    
    const cartView = new CartView();
    const cartContainer = document.getElementById("cart-container");
    window.addToCart = addToCart;
});
class CartView {
    constructor(cartItems = []) {
        this.cartItems = cartItems;
    }
  
    addToCart(itemName, itemPrice) {
        const existingItem = this.cartItems.find((item) => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice += itemPrice;
        } else {
            this.cartItems.push({
            name: itemName,
            quantity: 1,
            price: itemPrice,
            totalPrice: itemPrice,
        });
      }
    }
    render() {
        const container = document.createElement("div");
        container.id = "cart-view";
  
        const list = document.createElement("ul");
        this.cartItems.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} (x${item.quantity}) - $${item.totalPrice.toFixed(2)}`;
            list.appendChild(listItem);
        });
  
        const totalPrice = this.cartItems.reduce((sum, item) => sum + item.totalPrice,0);
        const totalPriceElement = document.createElement("h3");
        totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
        container.appendChild(list);
        container.appendChild(totalPriceElement);
        return container;
    }
}