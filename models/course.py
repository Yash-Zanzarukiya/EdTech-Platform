from flask import Flask, request, render_template,jsonify
import pandas as pd
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# CSV file URLs
collection_url = 'https://raw.githubusercontent.com/Yash-Zanzarukiya/EdTech-Platform/main/server/public/datasets/courses.csv'

# Pre-fetch and process data at app startup
def fetch_and_prepare_data():
    # Load data from CSV instead of MongoDB
    df = pd.read_csv(collection_url).drop_duplicates(subset='name').reset_index(drop=True)

    df = df[['_id','name','description']]
    df['description'] = df['description'].fillna('')
    df['combined'] = df['name'] + " " + df['description']
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined'])

    return df, tfidf_vectorizer, tfidf_matrix

df, tfidf_vectorizer, tfidf_matrix = fetch_and_prepare_data()

# Precompute cosine similarity matrix
cosine_similarities_precomputed = cosine_similarity(tfidf_matrix)

# Recommendation Model
class RecommendationModel:
    def __init__(self, vectorizer, matrix, data):
        self.vectorizer = vectorizer
        self.matrix = matrix
        self.data = data

    def generate_recommendations(self, query, top_n=10):
        query_tfidf = self.vectorizer.transform([query])
        cosine_similarities = cosine_similarity(query_tfidf, self.matrix).flatten()
        top_n_indices = cosine_similarities.argsort()[-top_n:][::-1]
        return self.data.iloc[top_n_indices][['_id', 'name']]

recommendation_model = RecommendationModel(tfidf_vectorizer, tfidf_matrix, df)

# Flask Route
@app.route('/recommend_course', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()  # This handles JSON input
        query = data.get('query')

        recommendations = recommendation_model.generate_recommendations(query)
        recommendations_list = recommendations.to_dict(orient='records')

        #return render_template('courses.html', recommendations=recommendations_list, query=query)
        return jsonify({'recommendation courses': recommendations_list})

    return render_template('courses.html', recommendations=None)

if __name__ == '__main__':
    app.run(debug=True, port=8000)