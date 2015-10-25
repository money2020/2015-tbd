from app import app, db, models

from flask import jsonify, request

@app.route('/')
def index():
    return 'ok'


@app.route('/groups', methods=['GET', 'POST'])
@app.route('/groups/<group_id>', methods=['GET'])
def groups(group_id=None):
    if request.method == 'POST':

        group = models.Group(**request.get_json())

        db.session.add(group)
        db.session.commit()

        group_id = group.id

    if group_id is not None:
        group = models.Group.query.get(int(group_id))
        if group is not None:
            return jsonify(group.serialize())

    else:
        groups = models.Group.query.all()
        return jsonify({'groups': [g.serialize() for g in groups]})

    return jsonify({'error': 'not ok'})


@app.route('/peers', methods=['GET', 'POST'])
@app.route('/peers/<peer_id>', methods=['GET'])
def peers(peer_id=None):
    if request.method == 'POST':

        peer = models.Peer(**request.get_json())

        db.session.add(peer)
        db.session.commit()

        peer_id = peer.id

    if peer_id is not None:
        peer = models.Peer.query.get(int(peer_id))
        if peer is not None:
            return jsonify(peer.serialize())

    else:
        peers = models.Peer.query.all()
        return jsonify({'peers': [p.serialize() for p in peers]})

    return jsonify({'error': 'not ok'})