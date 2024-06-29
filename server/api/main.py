from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import keras
import keras_nlp
import numpy as np
import PIL
import requests
import io
import matplotlib
import re
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import google.generativeai as genai
import os
import pathlib
from transformers import AutoProcessor, AutoModelForCausalLM
import json
import re
from question_process import process_question, clean_response, yolo_v8

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/check', methods=['get'])
def check():
    return jsonify({'status': 'Server is running'})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files and 'message' not in request.form:
        return jsonify({'error': 'No files or message found'}), 400
    
    message = request.form.get('message', '')
    files = request.files.getlist('files')
    
    if not files and not message:
        return jsonify({'error': 'No files and message provided'}), 400

    file_paths = []
    for file in files:
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        file_paths.append(file_path)
    print("filepath: ", file_paths)
    answer = process_question(file_paths)
    yolo_v8(file_paths)
    print("file_path: ", file_paths)   
    response = {
        'role': 'AIO_TNTH',
        'message': answer,
        'files': file_paths
    }
    return jsonify(response), 200

@app.route('/api/message', methods=['POST'])
def handle_message():
    message = request.form.get('message', '')
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Process the message as needed
    response = {'message': message, 'status': 'Message received'}
    return jsonify(response), 200

@app.route('/api/files', methods=['GET'])
def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    file_paths = [os.path.join(UPLOAD_FOLDER, f) for f in files]
    
    return jsonify({'files': file_paths}), 200

@app.route('/api/delete', methods=['POST'])
def delete_files():
    files_to_delete = request.json.get('files', [])
    if not files_to_delete:
        return jsonify({'error': 'No files provided for deletion'}), 400

    deleted_files = []
    for file_name in files_to_delete:
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
            deleted_files.append(file_name)
        else:
            return jsonify({'error': f'File {file_name} not found'}), 404

    return jsonify({'deleted_files': deleted_files}), 200

if __name__ == '__main__':
    app.run(debug=True)
