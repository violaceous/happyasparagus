from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import MySQLdb
import keyring

app = Flask(__name__)


password = keyring.get_password('happyasparagus','violaceous')
db = MySQLdb.connect(host="localhost", user="root", passwd=password, db="happyasparagus")
cur = db.cursor()

def check_auth(email, password):
	isValid = False
	cur.execute("SELECT id, password FROM happyasparagus.user WHERE email = %s", (email))
	if cur.rowcount > 0:
		result = cur.fetchone()
		if check_password_hash(result[1], password):
			isValid = result[0]
	return isValid
	
def register(first, last, email, password):
	isValid = False
	cur.execute("INSERT INTO happyasparagus.user (first, last, email, password) VALUES(%s, %s, %s, %s)", (first, last, email, generate_password_hash(password)))
	db.commit()
	if cur.rowcount > 0:
		isValid = True
	if isValid:
		cur.execute("SELECT id FROM happyasparagus.user WHERE email = %s", (email))
		result = cur.fetchone()
		resp = jsonify({'message': 'Registration okay.','id':result[0]})
		resp.status_code = 200
		return resp
	else:
		resp = jsonify({'message': 'oh no!'})
		resp.status_code = 400
		return resp

def authenticate():
    message = {'message': "Authenticate."}
    message['flash'] = "Incorrect email address or password. Please try again."
    resp = jsonify(message)

    resp.status_code = 418
    resp.headers['WWW-Authenticate'] = 'Basic realm="Example"'

    return resp

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth: 
			return authenticate()

        elif not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)

    return decorated
    
def create_user(email, password, first, last):
	cur.execute("INSERT INTO happyasparagus.user (email, password, first, last) VALUES (%s, %s, %s, %s)", (email, password, first, last))

def create_purchase(ingredient, amount, purchased, lasts, expires, userid):
	cur.execute("INSERT INTO purchase")


@app.route('/')
def hello_world():
    return str("Hello! Friend!")
    
@app.route("/login", methods=["GET", "POST"])
def login():
	email = request.json.get('email')
	password = request.json.get('password')
	csrf_token = request.json.get('csrf_token')
	
	auth = check_auth(email, password)
	if auth:
		data = {}
		data['message'] = "login okay."
		data['id'] = auth	
		response = jsonify(data)
		response.status_code = 200
		return response
	else:
		return authenticate()
		
@app.route("/logout", methods=["GET"])
def logout():
	return authenticate()		
	
@app.route("/user", methods=["POST"])
def user():
	email = request.json.get('email')
	password = request.json.get('password')
	first = request.json.get('first')
	last = request.json.get('last')	
	return register(first, last, email, password)

@app.route("/purchase", methods=["GET", "POST"])
def purchase():
	purchase = request.json.get('purchase')
	userid = request.json.get('userid')
	
	data = {}
	data['message'] = "login okay."	
	response = jsonify(data)
	response.status_code = 200
	return response


@app.route("/purchases", methods=["GET", "POST"])
def purchases():
	data = {}
	data['message'] = "login okay."	
	response = jsonify(data)
	response.status_code = 200
	return response

	
""" sample with auth
@app.route('/recommendations/<path:user_ids>')
@requires_auth
def example():
    return response
"""    

if __name__ == '__main__':
    app.run(debug = True)
