from app import db


class Peer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(64))
    owner_name = db.Column(db.String(64))
    image = db.Column(db.String(64))
    paid = db.Column(db.Boolean)

    def serialize(self):
        return {
            'id': self.id,
            'business_name': self.business_name,
            'owner_name': self.owner_name,
            'image': self.image,
            'paid': self.paid
        }


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


    def __repr__(self):
        return '<Group "%r">' % (self.name)