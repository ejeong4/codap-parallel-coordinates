let dataset = [];
    let selectedFeatures = Array(5).fill(null);
    const maxFeatures = 5;

    document.getElementById('csvFileInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        const text = event.target.result;
        dataset = d3.csvParse(text);
        const features = dataset.columns;
        renderFeatureButtons(features);
      };
      reader.readAsText(file);
    });

    function renderFeatureButtons(features) {
  const container = document.getElementById('feature-buttons');
  container.innerHTML = '';

  features.forEach(f => {
    const tag = document.createElement('div');
    tag.className = 'feature-tag';
    tag.textContent = f;
    tag.draggable = true;
    tag.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData("text/plain", f);
    });
    container.appendChild(tag);
  });

  setupDropTargets();
}

function setupDropTargets() {
  document.querySelectorAll('.drop-slot').forEach(slot => {
    slot.addEventListener('dragover', e => {
      e.preventDefault();
      slot.classList.add('dragover');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('dragover');
    });

    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('dragover');
      const feature = e.dataTransfer.getData("text/plain");
      const index = parseInt(slot.dataset.index);
      selectedFeatures[index] = feature;
      slot.querySelector('.drop-label').textContent = feature;

      if (selectedFeatures.filter(f => f !== null).length >= 2) {
        drawParallelCoordinates();
      }
    });
  });
}

    function selectFeature(feature) {
      if (selectedFeatures.includes(feature)) return;
      if (selectedFeatures.length >= maxFeatures) return;

      selectedFeatures.push(feature);
      document.getElementById('feature' + selectedFeatures.length).textContent = feature;

      if (selectedFeatures.length >= 2) drawParallelCoordinates();
    }

    function kMeans(data, k, dimensions, maxIter = 100) {
      // Randomly initialize k centroids
      let centroids = Array.from({ length: k }, () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return dimensions.map(dim => +data[randomIndex][dim]);
      });
  
      for (let iter = 0; iter < maxIter; iter++) {
        // Assign clusters
        const clusters = data.map(row => {
          const values = dimensions.map(dim => +row[dim]);
          let minDist = Infinity;
          let clusterIndex = 0;
          centroids.forEach((centroid, i) => {
            const dist = Math.sqrt(centroid.reduce((sum, cVal, j) => {
              return sum + Math.pow(cVal - values[j], 2);
            }, 0));
            if (dist < minDist) {
              minDist = dist;
              clusterIndex = i;
            }
          });
          return clusterIndex;
        });
  
        const newCentroids = Array.from({ length: k }, () =>
          Array(dimensions.length).fill(0)
        );
        const counts = Array(k).fill(0);
        data.forEach((row, i) => {
          const cluster = clusters[i];
          dimensions.forEach((dim, j) => {
            newCentroids[cluster][j] += +row[dim];
          });
          counts[cluster]++;
        });
  
        centroids = newCentroids.map((sum, i) =>
          sum.map(val => val / (counts[i] || 1))
        );
      }
  
      return centroids;
    }

    function drawParallelCoordinates() {
  const svg = d3.select("#parallel-coords");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const dimensions = selectedFeatures.filter(f => f !== null);

  if (dimensions.length < 2) return;

  const y = {};
  for (let dim of dimensions) {
    y[dim] = d3.scaleLinear()
      .domain(d3.extent(dataset, d => +d[dim]))
      .range([height - 20, 20]);
  }

  const x = d3.scalePoint()
    .range([20, width - 20])
    .domain(dimensions);

  const centroid = dimensions.map(dim => {
    const values = dataset.map(d => +d[dim]);
    const mean = d3.mean(values);
    return mean;
  });

  svg.append("path")
    .datum(centroid)
    .attr("class", "line")
    .attr("d", d3.line()(dimensions.map((dim, i) => [x(dim), y[dim](centroid[i])])))
    .style("fill", "none")
    .style("stroke", "#177991")
    .style("stroke-width", 3);

  svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("transform", d => `translate(${x(d)})`)
    .each(function(d) {
      d3.select(this).call(d3.axisLeft(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 10)
    .text(d => d)
    .style("font-size", "12px")
    .style("fill", "#6F6F79");
}