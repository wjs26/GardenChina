
// event listener to save profile
document.addEventListener('DOMContentLoaded', () => {
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
        localStorage.setItem("userProfile", JSON.stringify(profile));
        displayProfileInfo(profile);
    }

    // restores profile from local storage
    function restoreProfile() {
        const profile = JSON.parse(localStorage.getItem("userProfile"));
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


});
