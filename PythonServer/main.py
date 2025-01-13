from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

import requests
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"])

# Replace with your Unsplash API access key
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_API_KEY")

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "listining on port 5000"})

@app.route('/random', methods=['GET'])
def get_random_photo():
    """
    Fetch a random photo from Unsplash's API and return the response.
    """
    url = "https://api.unsplash.com/photos/random"
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search-photos', methods=['POST'])
def search_photos():
    """
    Search photos on Unsplash using a query term and return up to 25 results.
    """
    data = request.get_json()  # Get the JSON body of the request
    query = data.get('term')  # Get the search term from query parameters
    if not query:
        return jsonify({"error": "Please enter a search term"}), 400

    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "per_page": 25  # Limit the results to 25
    }
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an error for bad status codes
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)