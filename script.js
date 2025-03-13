// window.onload = function () {
//     console.log("Checking if codapInterface is defined...");
//     if (typeof codapInterface !== "undefined" && codapInterface.init) {
//         codapInterface.init();
//         console.log("interface loaded.")
//     } else {
//         console.error("codapInterface is not defined! Make sure codap-helper.js is loaded first.");
//     }
// };

/**
 * This gets called from the html when the window is loaded.
 * We set everything up, make all our connections.
 *
 * @returns {Promise<void>}
 */
export async function initialize() {
    console.log(`initializing demographics plugin`);

    // Initialize CODAP connection
    await codapInterface.init(iFrameDescription);
    await pluginHelper.initDataSet(datasetSetupObject);
    // getDataButton.addEventListener("click", doGetData);
    // cycle();
}

// async function cycle() {
//     statusDIV.innerHTML = statusGuts;
// }

// async function doGetData() {
//     const data = await codapInterface.getData("years");
//     console.log(data);
//     statusGuts = `Retrieved data: ${JSON.stringify(data)}`;
//     cycle();
// }

const datasetSetupObject = {
    name: "demogg",
    title: "ML4K12 Plugin",
    collections: [
        {
            name: "years",
            attrs: [
                { name: "country", type: "categorical" },
                { name: "year", type: "numeric" },
                { name: "age", type: "numeric" },
                { name: "females", type: "numeric" },
                { name: "males", type: "numeric" },
                { name: "total", type: "numeric" }
            ]
        }
    ]
};

const iFrameDescription = {
    name: "demogg",
    title: "ML4K12 Plugin",
    version: "0.002",
    dimensions: { width: 450, height: 550 }
};

// const options = document.querySelectorAll('.option');
// const descriptionText = document.querySelector('.descript p');
// options.forEach(option => {
//     option.addEventListener('mouseover', () => {
//         const description = option.getAttribute('data-description');
//         descriptionText.textContent = description;
//     });

//     option.addEventListener('click', () => {
//         options.forEach(o => o.classList.remove('selected'));
//         option.classList.add('selected');
//     });
// });

// const startButton = document.getElementById('startButton');
// startButton.addEventListener('click', async () => {
//     await codapInterface.sendRequest({
//         action: 'create',
//         resource: 'component',
//         values: {
//             type: 'text',
//             name: 'Popup Text',
//             title: 'Pattern Observation',
//             dimensions: { width: 400, height: 200 },
//             content: 'Hello! This is your text component created in CODAP.'
//         }
//     });
// });
