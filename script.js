window.onload = function () {
    if (typeof codapInterface !== "undefined" && codapInterface.init) {
        codapInterface.init();
    } else {
        console.error("codapInterface is not defined! Make sure codap-helper.js is loaded first.");
    }
};


