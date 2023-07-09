import hashlib
import json
import logging
import os

import google.cloud.aiplatform as aiplatform
import googlemaps
import vertexai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import FileResponse
from google.oauth2 import service_account
from vertexai.preview.language_models import ChatModel

from example import example_response

logger = logging.getLogger("main")
ConsoleOutputHandler = logging.StreamHandler()

logger.addHandler(ConsoleOutputHandler)

DEBUG_MODE = False


# Load the service account json file
# Update the values in the json file with your own
with open(
    "service_account.json"
) as f:  # replace 'serviceAccount.json' with the path to your file if necessary
    service_account_info = json.load(f)

with open(
    "secrets.json"
) as f:  # replace 'serviceAccount.json' with the path to your file if necessary
    secrets = json.load(f)
api_key = secrets["google_maps_api_key"]

my_credentials = service_account.Credentials.from_service_account_info(
    service_account_info
)

# Initialize Google AI Platform with project details and credentials
aiplatform.init(
    credentials=my_credentials,
)

with open("service_account.json", encoding="utf-8") as f:
    project_json = json.load(f)
    project_id = project_json["project_id"]


# Initialize Vertex AI with project and location
vertexai.init(project=project_id, location="us-central1")

# Initialize the FastAPI application
app = FastAPI()

# Configure CORS for the application
origins = ["http://localhost(.*)", "http://localhost:8000"]
origin_regex = r"https://(.*\.)?alexsystems\.ai"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint that returns available endpoints in the application"""
    return {
        "Endpoints": {
            "chat": "/chat",
        }
    }


@app.get("/docs")
async def get_documentation():
    """Endpoint to serve Swagger UI for API documentation"""
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.get("/redoc")
async def get_documentation():
    """Endpoint to serve ReDoc for API documentation"""
    return get_redoc_html(openapi_url="/openapi.json", title="redoc")


@app.get("/places")
async def get_places_data(
    city: str, active_value: int = 0, group_value: int = 0, nature_value: int = 0
):
    """
    Endpoint to handle chat.
    Receives a message from the user, processes it, and returns a response from the model.
    """
    relax_attractions = "Botanical Gardens, Art Museums, Rooftop Bars and Restaurants, Spa Retreats, Café Culture, Picnic Parks, Meditation Centers, River Cruises, Libraries, Wellness Retreats, Monuments, Historical Sites"
    active_attractions = "active recreation, outdoor activities and doing sports"
    city_prompt = f"I'm planning vacations in {city}, can you give me some tour recommendations within 100 km from {city}."
    relax_prompt = f"{100-active_value}% of recommended attractions should be related to {relax_attractions} which are relaxed and {active_value}% should be related to {active_attractions} which are active and not related to any of the {relax_attractions} and sightseeing."
    # TODO: implement solo/group and nature/urban prompts
    group_prompt = ""
    nature_prompt = ""
    json_prompt = "Respond with json compliant with RFC7159 containing list of attractions in following format: {data: [{name: name, location: [city|area], category: [active|relaxed], description: description}]}"

    parameters = {
        "temperature": 0.8,
        "max_output_tokens": 1024,
        "top_p": 0.8,
        "top_k": 40,
    }

    message = " ".join([city_prompt, relax_prompt, json_prompt])

    # Don't use vertexai and google maps api for faster prototyping
    if not DEBUG_MODE:
        while True:
            # In some cases vertexai doesn't return json compliant with RFC7159
            # that's used by python. In these cases just send the request again.
            chat_model = ChatModel.from_pretrained("chat-bison@001")
            chat = chat_model.start_chat(context="Imagine you're a tour guide.")
            response = chat.send_message(message, **parameters)

            try:
                response_dict = json.loads(response.text)
            except Exception as _:
                logger.warning(
                    "There was an error parsing json from vertex, retrying..."
                )
            else:
                break

        maps_api = googlemaps.Client(key=api_key)
        assert "data" in response_dict

        for place in response_dict["data"]:
            place_search = maps_api.find_place(
                f"{place['name']}",
                "textquery",
                fields=["place_id"],
                language="en-US",
            )

            place_id = place_search["candidates"][0]["place_id"]
            fields = ["name", "photo"]
            place_details = maps_api.place(place_id, fields=fields)["result"]
            place["name"] = place_details["name"]
            place["photo_reference"] = (
                place_details["photos"][0]["photo_reference"]
                if place_details["photos"]
                else ""
            )

        for place in response_dict["data"]:
            existing_photos = os.listdir("photos")
            photo_file_name = hashlib.md5(place["name"].encode("utf-8")).hexdigest()
            if photo_file_name not in existing_photos:
                if place.get("photo_reference", None):
                    with open(os.path.join("photos", f"{photo_file_name}"), "wb") as f:
                        for chunk in maps_api.places_photo(
                            place["photo_reference"], max_width=1600, max_height=1600
                        ):
                            if chunk:
                                f.write(chunk)
                    place["photo"] = photo_file_name
                else:
                    place["photo"] = ""
            else:
                logger.warning(f"File for place {place['name']} already exists.")
            response_dict.pop("photo_reference", None)
        return response_dict
    else:
        return example_response


@app.get("/image/")
async def get_image(file_name: str = None):
    files = os.listdir("photos")
    if file_name not in files:
        return "File not found"

    path = os.path.join(".", "photos", file_name)
    return FileResponse(path, media_type="image/png")
