"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Invoice
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

#JWT Imported
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Token Post
# this route is for when the user already exist and need an access token
# create a user query with a conditional to see if the user exists, or return None
#test on postman

@api.route('/token', methods=['POST'])
def generate_token():

    # receiving the request and converting the body of
    #the request into json format
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query the user table to check if the user exists
    email = email.lower()
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        response ={
            "msg": "Email or Password does not match."
        }
        return jsonify(response), 401
    
    access_token= create_access_token(identity=user.id)
    response ={
        "access_token": access_token,
        "user_id": user.id,
        "msg": f'Welcome {user.email}! This worked!'
    }
    return jsonify(response), 200

#create a route for /signup that will add the user's email and password to the database
#POST
#Test on Postman

@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    #query to check if the email already exists
    email = email.lower()
    user = User.query.filter_by(email=email).first()

    if user is not None and user.email == email:
        response ={
            'msg': 'User already exists.'
        }

        return jsonify(response), 403
    
    # if email does not exist, make a new record in the DB
    #sign this person in

    user = User()
    user.email = email
    user.password = password
    user.is_active = True
    db.session.add(user)
    db.session.commit()

    response ={
        'msg': f'Congratulations {user.email}. You have successfully signed up'
    }

    return jsonify(response), 200


#create a route for invoices that will retrieve and return the users invoices in json format
#GET

@api.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    
    #retrieve the user_id of the current user from the access_token
    #you do that with get_jwt_identity

    user_id = get_jwt_identity()

    #for test purposes
    #return jsonify(logged_in_as=user_id), 200    
    
    user = User.query.filter_by(id = user_id).first()
    #query and retrieve any invoices that are in the DB
    user_invoices = Invoice.query.filter_by(user_id=user_id).all()
    
    #use a list comprehension (for loop) that will:
    # 1. Get each object Invoice object and serialize() it
    # 2. Put them in the processed_invoices array
    processed_invoices = [each_invoice.serialize() for each_invoice in user_invoices]

    response ={
        'msg': f'Hello {user.email}, here are your invoices.',
        'invoices': processed_invoices
    }

    return jsonify(response), 200

#work on the front end
#1. create 3 new pages: /Signup, /Login, /Private
     #uodate layout.js as well
#2. create the necessary inputs needed for signup and login.js
#3. make sure that they are controlled inputs (useState)
#4. include useContext and Context for flux applications
#5. update flux.js to have token, message, invoices in the store\
#6. update and test actions to be able to retrieve a token and save it in localstorage