# from flask import Flask, request, jsonify, render_template
# import pickle
# import pandas as pd
# from sklearn.metrics.pairwise import cosine_similarity
# import dill as pickle

# app = Flask(__name__)

# class RecommendationModel:
#     def __init__(self, vectorizer, matrix, data):
#         self.vectorizer = vectorizer
#         self.matrix = matrix
#         self.data = data

#     # The recommendation function needs access to the vectorizer and matrix
#     def generate_recommendations(self, query, top_n=5):
#         query_tfidf = self.vectorizer.transform([query])
#         cosine_similarities = cosine_similarity(query_tfidf, self.matrix).flatten()
#         top_n_indices = cosine_similarities.argsort()[-top_n:][::-1]
#         return self.data.iloc[top_n_indices][['title', 'description', 'transcript']]

# # Load the pickled recommendation model
# try:
#     with open('./recommendation_model.pkl', 'rb') as file:
#         recommendation_model = pickle.load(file)
# except FileNotFoundError:
#     print("The file was not found.")
#     recommendation_model = None
# except pickle.UnpicklingError:
#     print("The file could not be unpickled.")
#     recommendation_model = None
# except Exception as e:
#     print(f"An error occurred: {e}")
#     recommendation_model = None

#  # Use dill instead of pickle

# # try:
# #     with open('./recommendation_model.pkl', 'rb') as file:
# #         recommendation_model = pickle.load(file)
# # except FileNotFoundError:
# #     print("The file was not found.")
# # except pickle.UnpicklingError:
# #     print("The file could not be unpickled.")
# # except Exception as e:
# #     print(f"An error occurred: {e}")


# # Route for generating recommendations
# @app.route('/recommend', methods=['POST'])
# def recommend():
#     if recommendation_model is None:
#         return jsonify({'error': 'Recommendation model not loaded'}), 500

#     data = request.get_json()
#     query = data.get('query', '')

#     if not query:
#         return jsonify({'error': 'No query provided'}), 400

#     try:
#         recommendations = recommendation_model.generate_recommendations(query)
#         recommendations_list = recommendations.to_dict(orient='records')
#         return jsonify({'recommendations': recommendations_list})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Route for serving the HTML template
# @app.route('/')
# def index():
#     return render_template('index.html')

# if __name__ == '__main__':
#     app.run(debug=True)





from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Define the RecommendationModel class (necessary for unpickling)
class RecommendationModel:
    def __init__(self, vectorizer, matrix, data):
        self.vectorizer = vectorizer
        self.matrix = matrix
        self.data = data

    def generate_recommendations(self, query, top_n=10):
        query_tfidf = self.vectorizer.transform([query])
        cosine_similarities = cosine_similarity(query_tfidf, self.matrix).flatten()
        top_n_indices = cosine_similarities.argsort()[-top_n:][::-1]
        return self.data.iloc[top_n_indices][['_id','title']]

# Load the recommendation model from the pickle file
try:
    with open('recommendation_model.pkl', 'rb') as file:
        recommendation_model = pickle.load(file)
except Exception as e:
    print(f"An error occurred: {e}")
    recommendation_model = None

# Route for home page with form input
@app.route('/recommend', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()  # This handles JSON input
        query = data.get('query')
        print(query)
        if recommendation_model is None:
            return "Model not loaded properly."

        try:
            # Get recommendations
            recommendations = recommendation_model.generate_recommendations(query)
            recommendations_list = recommendations.to_dict(orient='records')
            # return render_template('index.html', recommendations=recommendations_list, query=query)
            return jsonify({'recommendations': recommendations_list})
        except Exception as e:
            return f"An error occurred: {e}"

    return render_template('index.html', recommendations=None)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
