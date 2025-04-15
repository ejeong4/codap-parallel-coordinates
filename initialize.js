import FeatureSelection from "./featureselection.js";

export async function initialize() {
    console.log(`Initializing ML4K12 Plugin`);

    await codapInterface.init(iFrameDescription);
    await pluginHelper.initDataSet(datasetSetupObject);

    // Delay Feature Selection Initialization to Ensure Data is Loaded
    setTimeout(async () => {
        await FeatureSelection.init();
    }, 1000); // Allow time for data to be available

    getDataButton.addEventListener("click", doGetData);
    cycle();
}

async function cycle() {
    statusDIV.innerHTML = statusGuts;
}

async function doGetData() {
    const data = await codapInterface.getData("years");
    console.log(data);
    statusGuts = `Retrieved data: ${JSON.stringify(data)}`;
    cycle();
}

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

const options = document.querySelectorAll('.option');
const descriptionText = document.querySelector('.descript p');
options.forEach(option => {
    option.addEventListener('mouseover', () => {
        const description = option.getAttribute('data-description');
        descriptionText.textContent = description;
    });

    option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', async () => {
    await codapInterface.sendRequest({
        action: 'create',
        resource: 'component',
        values: {
            type: 'text',
            name: 'Popup Text',
            title: 'Pattern Observation',
            dimensions: { width: 400, height: 200 },
            content: 'Hello! This is your text component created in CODAP.'
        }
    });
});

