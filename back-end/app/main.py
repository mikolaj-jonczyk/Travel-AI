from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
import google.cloud.aiplatform as aiplatform
from vertexai.preview.language_models import ChatModel
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
import vertexai
import json  # add this line

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
origins = ["http://localhost", "http://localhost:8080", "http://localhost:3000"]
origin_regex = r"https://(.*\.)?alexsystems\.ai"
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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



@app.post("/chat")
async def handle_chat(city: str, relax_value: int = None, group_value: int = None, daytime_value: int = None):
    """
    Endpoint to handle chat.
    Receives a message from the user, processes it, and returns a response from the model.
    """
    chat_model = ChatModel.from_pretrained("chat-bison@001")
    params = {
        "relax" : 0,
        "daytime": 0,
        "number_of_people": 0
    }
    relax_dict = {
        0: "a lot of relax",
        25: "some relax",
        50: "a little bit of relax and active",
        75: "some active",
        100: "full active"
    }
    chat = chat_model.start_chat(
        context="Imagine you're a tour guide, that recommends at least 5 attractions for cities specified by user."
                " Respond with only json containing list of attractions in following format: "
                "{data: [{name: name}]}"
    )
    parameters = {
        "temperature": 0.8,
        "max_output_tokens": 1024,
        "top_p": 0.8,
        "top_k": 40,
    }


    message = f"I'm planning vacations in {city}, can you give me some tour recommendations."
    # Send the human message to the model and get a response
    response = chat.send_message(message, **parameters)
    # Return the model's response
    coords = json.loads(response.text)

    names = [f"{place['name']} in {city}" for place in coords["data"]]

    # import requests
    # import googlemaps
    #
    # maps_api = googlemaps.Client(key=api_key)
    #
    # response_dict = {"data" :[]}
    # for name in names:
    #     place_search = maps_api.find_place(
    #                 {name},
    #                 "textquery",
    #                 fields=["place_id"],
    #                 language='en-US',
    #             )
    #
    #     print(place_search)
    #     place_id = place_search['candidates'][0]['place_id']
    #     print(place_id)
    #     url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name&key={api_key}"
    #
    #     payload={}
    #     headers = {}
    #     response = requests.request("GET", url, headers=headers, data=payload)
    #
    #     place_details = response.text
    #     place_dict = json.loads(place_details)["result"]
    #     response_dict["data"].append(place_dict)
    #     response_json = json.dumps(response_dict)
    #     print(place_dict)

    return {"response": names}

