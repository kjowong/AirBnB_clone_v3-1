#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template, url_for
from models import storage
import uuid
import os

# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False

host = os.getenv("HBNB_API_HOST", "0.0.0.0")
port = os.getenv("HBNB_API_PORT", "5000")


# begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/3-hbnb/')
def hbnb_filters(the_id=None):
    """
    handles request to custom template with states, cities & amentities
    """
    state_objs = storage.all('State').values()
    states = dict([state.name, state] for state in state_objs)
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    cache_id = str(uuid.uuid4())
    return render_template('3-hbnb.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users, cache_id=cache_id)

if __name__ == "__main__":
    app.run(host=host, port=port)
