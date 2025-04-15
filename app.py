from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.cluster import KMeans

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('kmeans.html')

@app.route('/run_kmeans', methods=['POST'])
def run_kmeans():
    file = request.files['csv_file']
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save the file temporarily
    file_path = './uploads/' + file.filename
    file.save(file_path)

    # Load the CSV file
    df = pd.read_csv(file_path)

    # Perform K-Means clustering (example with 3 clusters)
    kmeans = KMeans(n_clusters=3)
    df['cluster'] = kmeans.fit_predict(df)

    # Get the feature names (columns) for dropdowns in the frontend
    feature_names = df.columns.tolist()

    # Format clusters for frontend
    clusters = []
    for cluster_num in range(3):
        cluster_points = df[df['cluster'] == cluster_num].drop('cluster', axis=1).values.tolist()
        centroid = kmeans.cluster_centers_[cluster_num].tolist()
        clusters.append({"points": cluster_points, "centroid": centroid})

    # Check if the model converged (handle missing `converged_` attribute)
    converged = hasattr(kmeans, 'converged_') and kmeans.converged_

    return jsonify({
        "clusters": clusters,
        "centroids": kmeans.cluster_centers_.tolist(),
        "iterations": kmeans.n_iter_,
        "converged": converged,  # Use the check for `converged_` attribute
        "feature_names": feature_names
    })

@app.route('/run_parallel_coordinates', methods=['POST'])
def run_parallel_coordinates():
    file = request.files['csv_file']
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save the file temporarily
    file_path = './uploads/' + file.filename
    file.save(file_path)

    # Load the CSV file
    df = pd.read_csv(file_path)

    # Convert dataframe to a list of dictionaries to pass to D3.js
    data = df.to_dict(orient='records')

    # Send back the data for parallel coordinates
    return jsonify({
        "data": data,
        "feature_names": df.columns.tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)
