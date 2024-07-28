"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Invoice
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import random

#JWT Imported
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

# Create the Flask app
app = Flask(__name__)

# Apply CORS to the entire app
CORS(app, origins=['https://glorious-space-barnacle-rwqjwpprjvg3pv96-3000.app.github.dev'])

# Initialize the Blueprint
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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
        "msg": f'Welcome {user.email}!'
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

@api.route('/invoices', methods=['POST'])
@jwt_required()
def add_invoice():
    try:
        user_id = get_jwt_identity()
        invoice_amount = request.json.get('invoice_amount')
        invoice_number = request.json.get('invoice_number')
        invoice_date = request.json.get('invoice_date')

        if not invoice_amount or not invoice_number or not invoice_date:
            return jsonify({"msg": "All invoice fields are required"}), 400

        new_invoice = Invoice(
            invoice_amount=invoice_amount,
            invoice_number=invoice_number,
            invoice_date=invoice_date,
            user_id=user_id
        )

        db.session.add(new_invoice)
        db.session.commit()

        return jsonify({"msg": "Invoice added successfully", "invoice": new_invoice.serialize()}), 201

    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    

quotes = {
    'fantastic': [
        "Keep your face always toward the sunshine—and shadows will fall behind you. —Walt Whitman",
        "The best way to predict your future is to create it. —Abraham Lincoln",
        "Be the best of whatever you are. — Martin Luther King, Jr.",
        "Promise me you’ll always remember: You’re braver than you believe, and stronger than you seem, and smarter than you think. — A. A. Milne",
        "I don’t like to gamble, but if there’s one thing I’m willing to bet on, it’s myself. — Beyoncé",
        "All our dreams can come true, if we have the courage to pursue them.— Walt Disney",
        "Do anything, but let it produce joy. — Henry Miller",
        "A woman is like a tea bag; you never know how strong it is until it’s in hot water. ― Eleanor Roosevelt",
        "We need to take risks. We need to go broke. We need to prove them wrong, simply by not giving up. — Awkwafina"
        
    ],
    'sad': [
        "The way I see it, if you want the rainbow, you gotta put up with the rain. —Dolly Parton",
        "Tough times never last, but tough people do. —Robert H. Schuller",
        "There are wounds that never show on the body that are deeper and more hurtful than anything that bleeds. ― Laurell K. Hamilton",
        "So, this is my life. And I want you to know that I am both happy and sad and I'm still trying to figure out how that could be. — Stephen Chbosky",
        "The only way out of the labyrinth of suffering is to forgive. John Green",
        "If you're my friend I should be able to talk to you but I can't, and if I can't talk to you, well, what is the point of you? Of us ?” David Nicholls"
    ],
    'unknown': [
        "Life is what happens when you're busy making other plans. —John Lennon",
        "Keep calm and carry on. —Winston Churchill"
    ]
}

@api.route('/quotes', methods=['GET'])
def get_quote():
    mood = request.args.get('mood')
    if mood in quotes:
        return jsonify(quote=random.choice(quotes[mood]))
    return jsonify(quote="Stay positive, work hard, make it happen.")

# Register the Blueprint
app.register_blueprint(api, url_prefix='/api')

# Main entry point for the app
if __name__ == '__main__':
    app.run(debug=True, port=3001)
