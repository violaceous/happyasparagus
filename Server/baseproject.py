from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import MovieWalrus
import MySQLdb
app = Flask(__name__)

db = MySQLdb.connect(host="localhost", user="root", passwd="one4all", db="movie_walrus")
cur = db.cursor()

def check_auth(email, password):
	isValid = False
	cur.execute("SELECT id, password FROM wilard.user WHERE email = %s", (email))
	if cur.rowcount > 0:
		result = cur.fetchone()
		if check_password_hash(result[1], password):
			isValid = result[0]
	return isValid
	
def register(first, last, email, password):
	isValid = False
	cur.execute("INSERT INTO wilard.user (first, last, email, password) VALUES(%s, %s, %s, %s)", (first, last, email, generate_password_hash(password)))
	db.commit()
	if cur.rowcount > 0:
		isValid = True
	if isValid:
		cur.execute("SELECT id FROM wilard.user WHERE email = %s", (email))
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
	cur.execute("INSERT INTO wilard.user (email, password, first, last) VALUES (%s, %s, %s, %s)", (email, password, first, last))
	    
    
"""
class User():
    id = 1
    nickname = 'violaceous'
    email = 'conormaguire@yahoo.com'

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.nickname)
"""


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

@app.route('/recommendations/<path:user_ids>')
@requires_auth
def hello(user_ids):
    users = user_ids.split('/')
    movielens = []
    for user in users:
		cur.execute("SELECT movielens FROM wilard.user WHERE id = %s", (user))
		if cur.rowcount > 0:
			result = cur.fetchone()
			movielens.append(result[0])    
    movies = MovieWalrus.getCombinedMovies(movielens)
#    response = jsonify(movies)
    response = ""
#    response.status_code = 400
    return response

if __name__ == '__main__':
    app.run(debug = True)
