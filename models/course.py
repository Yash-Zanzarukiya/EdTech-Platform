from flask import Flask, request, render_template, jsonify
import pickle
from flask_cors import CORS
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
        return self.data.iloc[top_n_indices][['_id','name']]

# Load the recommendation model from the pickle file
try:
    with open('course_recommendation_model.pkl', 'rb') as file:
        course_recommendation_model = pickle.load(file)
except Exception as e:
    print(f"An error occurred: {e}")
    course_recommendation_model = None

# Route for home page with form input
@app.route('/recommend_course', methods=['GET', 'POST'])
def index():
    
    if request.method == 'POST':
        data = request.get_json()  # This handles JSON input
        query = data.get('query')
        print(query)
        
        if course_recommendation_model is None:
            return "Model not loaded properly."
        
        try:
            # Get recommendations
            recommendations = course_recommendation_model.generate_recommendations(query)
            recommendations_list = recommendations.to_dict(orient='records')
            print(recommendations_list)
            #return render_template('courses.html', recommendations=recommendations_list, query=query)
            return jsonify({'recommendation courses': recommendations_list})
        except Exception as e:
            return f"An error occurred: {e}"
    
    return render_template('courses.html', recommendations=None)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
