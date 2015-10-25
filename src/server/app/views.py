from app import app, db, models
from flask import jsonify, request
from util import crossdomain


@app.route('/')
def index():
    return 'Bunch! API'


@app.route('/groups', methods=['GET', 'POST'])
@app.route('/groups/<group_id>', methods=['GET'])
@crossdomain(origin='*')
def groups(group_id=None):
    return _crud('group', models.Group, group_id)


@app.route('/peers', methods=['GET', 'POST'])
@app.route('/peers/<peer_id>', methods=['GET'])
@crossdomain(origin='*')
def peers(peer_id=None):
    return _crud('peer', models.Peer, peer_id)


@app.route('/vendors', methods=['GET', 'POST'])
@app.route('/vendors/<vendor_id>', methods=['GET'])
@crossdomain(origin='*')
def vendors(vendor_id=None):
    return _crud('vendor', models.Vendor, vendor_id)


@app.route('/payments', methods=['GET', 'POST'])
@app.route('/payments/<payment_id>', methods=['GET'])
@crossdomain(origin='*')
def payments(payment_id=None):
    return _crud('payment', models.Payment, payment_id)


@app.route('/cashouts', methods=['GET', 'POST'])
@app.route('/cashouts/<cashout_id>', methods=['GET'])
@crossdomain(origin='*')
def cashouts(cashout_id=None):
    return _crud('cashout', models.Cashout, cashout_id)


@app.route('/cycle', methods=['GET'])
@crossdomain(origin='*')
def cycle():
    ''' Simulates a "cycle" in the system, collecting money from all group
        peers, and distributing to one peer per group. '''

    payments = []
    cashouts = []
    for group in models.Group.query.all():
        for peer in group.peers:
            payments.append(models.Payment.collect(group, peer))

        cashouts.append(models.Cashout.distribute(group, peer))

    return jsonify({'payments': [p.serialize() for p in payments if p is not None],
                    'cashouts': [c.serialize() for c in cashouts if c is not None]})

def _crud(name, model, obj_id):
    return_message = None

    if request.method == 'POST':
        obj = model.fromdict(request.get_json())

        db.session.add(obj)
        db.session.commit()

        obj_id = obj.id

    if obj_id is not None:
        obj = model.query.get(int(obj_id))
        if obj is not None:
            return jsonify(obj.serialize())
        else:
            return_message = '%s does not exist' % (name)

    else:
        objs = model.query.all()
        return jsonify({name: [o.serialize() for o in objs]})

    return jsonify({'error': return_message or 'unknown error'})