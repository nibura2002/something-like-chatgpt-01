from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import os
from dotenv import load_dotenv

# .envファイルの環境変数を読み込む
load_dotenv()

app = Flask(__name__)

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY"),
)

# デフォルトモデルをGPT-4-Turboに設定
default_model = 'gpt-4o'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data.get('prompt')
    model = data.get('model', default_model)
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )
        return jsonify({'response': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/set_model', methods=['POST'])
def set_model():
    global default_model
    data = request.json
    model = data.get('model')
    
    if model not in ['gpt-4o','gpt-4-turbo', 'gpt-3.5-turbo']:
        return jsonify({'error': 'Invalid model specified'}), 400

    default_model = model
    return jsonify({'message': 'Model updated successfully', 'model': default_model})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
