window.onload = function () {
    console.log("Checking if codapInterface is defined...");
    if (typeof codapInterface !== "undefined" && codapInterface.init) {
        codapInterface.init();
        console.log("interface loaded.")
    } else {
        console.error("codapInterface is not defined! Make sure codap-helper.js is loaded first.");
    }
};


