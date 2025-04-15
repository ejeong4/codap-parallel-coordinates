// kmeans.js
const MAX_ITERATIONS = 50;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function calcMeanCentroid(dataSet, start, end) {
  const features = dataSet[0].length;
  const n = end - start;
  let mean = Array(features).fill(0);
  for (let i = start; i < end; i++) {
    for (let j = 0; j < features; j++) {
      mean[j] += dataSet[i][j] / n;
    }
  }
  return mean;
}

function getRandomCentroidsNaiveSharding(dataset, k) {
  const numSamples = dataset.length;
  const step = Math.floor(numSamples / k);
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const start = step * i;
    const end = i + 1 === k ? numSamples : step * (i + 1);
    centroids.push(calcMeanCentroid(dataset, start, end));
  }
  return centroids;
}

function getRandomCentroids(dataset, k) {
  const numSamples = dataset.length;
  const centroidsIndex = [];
  while (centroidsIndex.length < k) {
    const index = randomBetween(0, numSamples);
    if (!centroidsIndex.includes(index)) {
      centroidsIndex.push(index);
    }
  }
  return centroidsIndex.map(i => [...dataset[i]]);
}

function compareCentroids(a, b) {
  return a.every((val, i) => val === b[i]);
}

function shouldStop(oldCentroids, centroids, iterations) {
  if (iterations > MAX_ITERATIONS) return true;
  if (!oldCentroids || !oldCentroids.length) return false;
  return centroids.every((c, i) => compareCentroids(c, oldCentroids[i]));
}

function getDistanceSQ(a, b) {
  return a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0);
}

function getLabels(dataSet, centroids) {
  const labels = {};
  centroids.forEach((c, i) => {
    labels[i] = { points: [], centroid: c };
  });

  dataSet.forEach(a => {
    let closestIndex = 0;
    let minDist = getDistanceSQ(a, centroids[0]);
    for (let j = 1; j < centroids.length; j++) {
      const dist = getDistanceSQ(a, centroids[j]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = j;
      }
    }
    labels[closestIndex].points.push(a);
  });

  return labels;
}

function getPointsMean(pointList) {
  const totalPoints = pointList.length;
  const means = Array(pointList[0].length).fill(0);
  pointList.forEach(point => {
    point.forEach((val, j) => {
      means[j] += val / totalPoints;
    });
  });
  return means;
}

function recalculateCentroids(dataSet, labels, k) {
  const newCentroidList = [];
  for (const key in labels) {
    const group = labels[key];
    const newCentroid = group.points.length > 0
      ? getPointsMean(group.points)
      : getRandomCentroids(dataSet, 1)[0];
    newCentroidList.push(newCentroid);
  }
  return newCentroidList;
}

function kmeans(dataset, k, useNaiveSharding = true) {
  if (!dataset.length || !dataset[0].length || dataset.length <= k) {
    throw new Error('Invalid dataset');
  }

  let iterations = 0;
  let oldCentroids, centroids, labels;

  centroids = useNaiveSharding
    ? getRandomCentroidsNaiveSharding(dataset, k)
    : getRandomCentroids(dataset, k);

  while (!shouldStop(oldCentroids, centroids, iterations)) {
    oldCentroids = [...centroids];
    iterations++;
    labels = getLabels(dataset, centroids);
    centroids = recalculateCentroids(dataset, labels, k);
  }

  return {
    clusters: Object.values(labels),
    centroids,
    iterations,
    converged: iterations <= MAX_ITERATIONS,
  };
}

// Attach to window so HTML can access it
window.kmeans = kmeans;
export default kmeans;