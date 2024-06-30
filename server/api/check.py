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
import openpyxl
from openpyxl import Workbook



keras.config.set_floatx("bfloat16")

genai.configure(api_key="AIzaSyDLdORNkYX-Xy_DwgrAUetBsDzgaKR1pTw")
model = genai.GenerativeModel('gemini-1.5-pro')

def clean_response(response):
    """
    Làm sạch phần ghi chú hoặc các câu tiếng Anh không mong muốn trong phản hồi.
    """
    lines = response.split("\n")
    cleaned_lines = [line for line in lines if not line.startswith("Note:") and "apologized" not in line]
    cleaned_lines = [line for line in cleaned_lines if not (line.startswith("(Tiếng Anh") or "We are" in line or "Note:" in line)]
    return "".join(cleaned_lines).strip()

def process_question(file_paths, number_img):
    image = {
    'mime_type': 'image/jpeg',
    'data': pathlib.Path(f'{file_paths[number_img]}').read_bytes()
    }
    prompt = """
    {
    "tasks": [
        {
        "task_id": 1,
        "description": "Determine the number of people drinking Heineken beers in the image.",
        "output": "people_drink_message"
        },
        {
        "task_id": 2,
        "description": "Analyze the mood and tone of the image. Possible options: [Happy, Angry, Enjoyable, Relaxed, Neutral].",
        "output": "mood_message"
        },
        {
        "task_id": 3,
        "description": "Count the number of marketing staff present in the image.",
        "output": "number_of_marketing_staff_message"
        },
        {
        "task_id": 4,
        "description": "Identify the location of the scene. Possible options: [bar, pub, restaurant, grocery store, supermarket, party, celebration, gathering, happy hour, fun time].",
        "output": "location_message"
        },
        {
        "task_id": 5,
        "description": "Provide an array of JSON bounding boxes for detected objects. Include people drinking and staff, location. The structure should be as follows:",
        "output": "bounding_boxes",
        "format": "json",
        "structure": [
            {
            "object": "people_drinking",
            "bounding_box": {
                "xmin": 0,
                "xmax": 0,
                "ymin": 0,
                "ymax": 0
            }
            },
            {
            "object": "staff",
            "bounding_box": {
                "xmin": 0,
                "xmax": 0,
                "ymin": 0,
                "ymax": 0
            }
            }
        ]
        }, {
        "task_id": 6,
        "description": "How many Heineken beers, Heineken logo, Heineken beer caton are in the image? ANSWER: total number",
        "output": Number
        }
    ],
    "instructions": "If the scene does not contain the elements requested, please state that there are no such things in the photo."
    }
    """
    response = model.generate_content([image, prompt])
    answer = clean_response(response.text)
    json_file  = json.loads(answer)
    return json_file

# file_paths = ['uploads/he.jpg', 'uploads/hi.png']
file_paths = ['uploads/haha.png']

text = []
for number_img in range(len(file_paths)):
    print(file_paths[number_img])
    result = process_question(file_paths, number_img)
    heineken_status = 'yes' if int(result['tasks'][5]['output']) > 0 else 'no'
    results_ex = (f'{file_paths[number_img]}',heineken_status,f'''{result}''')
    text.append(results_ex)


# Tên file Excel
excel_file = 'product_status.xlsx'
list_files = ['image_predict_1.png', 'image_predict_5.png']



try:
    wb = openpyxl.load_workbook(excel_file)
    ws = wb.active
    print(f"File '{excel_file}' đã tồn tại. Đang cập nhật...")
except FileNotFoundError:
    wb = Workbook()
    ws = wb.active
    ws.append(['image_path', 'status_exist_heneiken', 'chat_description'])
    print(f"Tạo file '{excel_file}' mới...")
for row_data in text:
    ws.append(row_data)
wb.save(excel_file)
print(f"Đã lưu dữ liệu vào file '{excel_file}'.")
