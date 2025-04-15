const FeatureSelection = {
    selectedFeatures: [],

    async init() {
        let data = await codapInterface.getData();
        console.log("Fetched data for feature selection:", data);
    
        if (data.length > 0) {
            let featureNames = Object.keys(data[0].values);
            this.createFeatureCheckboxes(featureNames);
        } else {
            console.warn("No data available for feature selection.");
        }
    },

    createFeatureCheckboxes(features) {
        let container = document.getElementById("features-container");
        if (!container) {
            console.error("Feature container not found!");
            return;
        }
    
        container.innerHTML = "";  
    
        features.forEach(feature => {
            let label = document.createElement("label");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = feature;
            checkbox.addEventListener("change", (event) => {
                this.updateSelectedFeatures(event.target.value, event.target.checked);
            });
    
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${feature}`));
            container.appendChild(label);
            container.appendChild(document.createElement("br")); // Line break for readability
        });
    
        console.log("Feature checkboxes created:", features);
    },
    

    updateSelectedFeatures(feature, isChecked) {
        if (isChecked) {
            this.selectedFeatures.push(feature);
        } else {
            this.selectedFeatures = this.selectedFeatures.filter(f => f !== feature);
        }

        // Update visualization when selection changes
        Visualization.update(this.selectedFeatures);
    }
};

export default FeatureSelection;
