document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', () => {
            alert('Button clicked!');
        });
    }
});
