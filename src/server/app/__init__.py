from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from worldpay import WorldPay

import config

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
worldpay = WorldPay(config.securenet_id, config.secure_key)

from app import views