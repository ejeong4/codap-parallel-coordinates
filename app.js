let rawData = [];
let rawHeaders = [];
let k = 2;

// Handle file upload
document.getElementById('csvInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const result = csvToArray(evt.target.result);
    rawData = result.data;
    rawHeaders = result.headers;

    alert("Dataset loaded! You can now explore different features.");
    renderFeatureSelection();
  };
  reader.readAsText(file);
});

// Collapse/expand sections
function toggleSection(id) {
  const section = document.getElementById(id);
  section.classList.toggle('active');
  
  const arrow = document.getElementById('arrow-' + id);
  arrow.classList.toggle('open');
  
  if (section.classList.contains('active')) {
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

// Utility function
function csvToArray(str) {
  const [headerLine, ...rows] = str.trim().split('\n');
  const headers = headerLine.split(',');
  const data = rows.map(row => row.split(',').map(parseFloat));
  return { headers, data };
}

// =========== Feature Selection ==========
function renderFeatureSelection() {
  if (!rawData.length) return;
  drawParallelCoordinatesD3("#parallel-coords-feature", rawData, rawHeaders);
}

// =========== Clustering ==========
document.getElementById('clusterCount').addEventListener('change', function() {
  k = parseInt(this.value);
});

function renderClusters() {
  if (!rawData.length) return alert('Upload data first!');
  const clusters = kMeans(rawData, k);

  const container = document.getElementById('charts');
  container.innerHTML = '';

  clusters.forEach((cluster, index) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 400);
    svg.setAttribute("height", 200);
    svg.classList.add("cluster-svg");
    svg.setAttribute("id", `parallel-coords-${index}`);
    container.appendChild(svg);

    drawParallelCoordinatesD3(`#parallel-coords-${index}`, cluster, rawHeaders);
  });
}

// (You can paste your kMeans() and drawParallelCoordinatesD3() functions here too, same as before)
