from app import db, worldpay
from dateutil.relativedelta import relativedelta

import datetime


peers_groups = db.Table('peers_to_groups',
    db.Column('peer_id', db.Integer, db.ForeignKey('peers.id')),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'))
)

vendors_groups = db.Table('vendors_to_groups',
    db.Column('vendor_id', db.Integer, db.ForeignKey('vendors.id')),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'))
)

class SuperModel:

    @classmethod
    def fromdict(cls, d):
        allowed_keys = [v for v in dir(cls) if not callable(getattr(cls, v)) and not v.startswith('_')]
        df = {k : v for k, v in d.iteritems() if k in allowed_keys}

        # ugh...
        if 'peers' in df:
            df['peers'] = [x for x in Peer.query.filter(Peer.id.in_(df['peers'])).all()]

        # ugh...
        if 'peer' in df:
            df['peer'] = Peer.query.get(df['peer']).id

        # ugh...
        if 'group' in df:
            df['group'] = Peer.query.get(df['group']).id

        # ugh...
        if 'vendor' in df:
            df['vendor'] = [v for v in Vendor.query.filter(Vendor.id.in_(df['vendor'])).all()]

        # ugh...
        if 'timestamp' in df:
            df['timestamp'] = datetime.datetime.fromtimestamp(int(df['timestamp']))

        # ugh...
        if 'timestamp' in df:
            df['timestamp'] = datetime.datetime.fromtimestamp(int(df['timestamp']))

        return cls(**df)


class Peer(db.Model, SuperModel):

    __tablename__ = 'peers'

    id = db.Column(db.Integer, primary_key=True)
    businessName = db.Column(db.String(64))
    ownerName = db.Column(db.String(64))
    image = db.Column(db.String(256))
    groups = db.relationship('Group', secondary=peers_groups)
    payments = db.relationship('Payment', backref="peer_orig")
    cashouts = db.relationship('Cashout', backref="peer_orig")

    def serialize(self, deep_link=2):
        serialize = {
            'id': self.id,
            'businessName': self.businessName,
            'ownerName': self.ownerName,
            'image': self.image
        }

        if deep_link > 0:
            serialize['groups'] = [g.serialize(deep_link - 1) for g in self.groups]

        return serialize

    def __repr__(self):
        return '<Peer "%r">' % (self.id)


class Vendor(db.Model, SuperModel):

    __tablename__ = 'vendors'

    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(256))
    logoImage = db.Column(db.String(256))
    name = db.Column(db.String(64))
    securenetId = db.Column(db.String(64))
    securenetKey = db.Column(db.String(64))

    def serialize(self, deep_link=2):
        serialize = {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'logoImage': self.logoImage
        }

        if deep_link > 0:
            pass

        return serialize

    def __repr__(self):
        return '<Vendor "%r">' % (self.name)


class Group(db.Model, SuperModel):

    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    image = db.Column(db.String(256))
    amountPerInterval = db.Column(db.Integer)
    payoutPerInterval = db.Column(db.Integer)
    peers = db.relationship('Peer', secondary=peers_groups)
    vendor = db.relationship('Vendor', secondary=vendors_groups)
    payments = db.relationship('Payment', backref="group_orig")
    cashouts = db.relationship('Cashout', backref="group_orig", lazy='dynamic')

    def serialize(self, deep_link=2):
        serialize =  {
            'id': self.id,
            'name': self.name,
            # 'image': self.image,
            'image': '/images/placeholder/1-square.jpg',
            'amountPerInterval': self.amountPerInterval,
            'payoutPerInterval': self.payoutPerInterval,
            'nextTimestamp': self._next_cashout().isoformat()
        }

        if deep_link > 0:
            serialize['peers'] = [p.serialize(deep_link - 1) for p in self.peers]
            serialize['vendor'] = [v.serialize(deep_link - 1) for v in self.vendor]
            serialize['payments'] = [p.serialize(deep_link - 1) for p in self.payments]
            serialize['cashouts'] = [c.serialize(deep_link - 1) for c in self.cashouts]

        return serialize

    def _next_cashout(self):
        base_time = datetime.datetime.now()

        cashout = self.cashouts.order_by('-id').first()
        if cashout:
            base_time = cashout.timestamp

        return base_time + relativedelta(days=28)

    def __repr__(self):
        return '<Group "%r">' % (self.name)


class Payment(db.Model, SuperModel):

    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime)
    peer = db.Column(db.Integer, db.ForeignKey('peers.id'))
    group = db.Column(db.Integer, db.ForeignKey('groups.id'))

    @classmethod
    def collect(cls, group, peer):
        payment = {
            'amount': group.amountPerInterval,
            'timestamp': datetime.datetime.now(),
            'peer': peer.id,
            'group': group.id
        }

        wp_request = {
            'amount': payment['amount'],
            'firstName': peer.ownerName,
            'lastName': peer.businessName
        }

        auth = (group.vendor[0].securenetId, group.vendor[0].securenetKey) # TODO: Clean this up

        if worldpay.collect_payment(wp_request, auth):
            payment = cls(**payment)

            db.session.add(payment)
            db.session.commit()

            return payment

    def serialize(self, deep_link=2):
        serialize = {
            'id': self.id,
            'amount': self.amount,
            'timestamp': self.timestamp.isoformat()
        }

        if deep_link > 0:
            serialize['peer'] = Peer.query.get(self.peer).serialize(deep_link - 1)
            serialize['group'] = Group.query.get(self.group).serialize(deep_link - 1)

        return serialize


    def __repr__(self):
        return '<Payment %r>' % (self.id)


class Cashout(db.Model, SuperModel):

    __tablename__ = 'cashouts'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime)
    peer = db.Column(db.Integer, db.ForeignKey('peers.id'))
    group = db.Column(db.Integer, db.ForeignKey('groups.id'))

    @classmethod
    def distribute(cls, group, peer):
        cashout = {
            'amount': group.payoutPerInterval,
            'timestamp': datetime.datetime.now(),
            'peer': peer.id,
            'group': group.id
        }

        cashout = cls(**cashout)

        db.session.add(cashout)
        db.session.commit()

        return cashout

    def serialize(self, deep_link=2):
        serialize = {
            'id': self.id,
            'amount': self.amount,
            'timestamp': self.timestamp.isoformat()
        }

        if deep_link > 0:
            serialize['peer'] = Peer.query.get(self.peer).serialize(deep_link - 1)
            serialize['group'] = Group.query.get(self.group).serialize(deep_link - 1)

        return serialize

    def __repr__(self):
        return '<Cashout %r>' % (self.id)
