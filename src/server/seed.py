import config

from app import app, db, models


peers = [{
    "businessName": "Luke's Lobster",
    "ownerName": "Lucas L",
    "image": "/images/bunch/peer-lucas-l.jpg"
},
{
    "businessName": "Cathy's Cookies",
    "ownerName": "Cathy H",
    "image": "/images/bunch/peer-cathy-h.jpg"
},
{
    "businessName": "Doctor David",
    "ownerName": "David L",
    "image": "/images/bunch/peer-david-l.jpg"
},
{
    "businessName": "G's Guavas",
    "ownerName": "Gordon Ramsay",
    "image": "/images/bunch/peer-gordon-r.jpg"
},
{
    "businessName": "Nick's Nicecream",
    "ownerName": "Nick P",
    "image": "/images/bunch/peer-nick-p.jpg"
},
{
    "businessName": "Amy's Avocados",
    "ownerName": "Amy H",
    "image": "/images/bunch/peer-random-g.jpg"
},
{
    "businessName": "Lucy's Lasagna",
    "ownerName": "Lucy H",
    "image": "/images/bunch/peer-random-g.jpg"
}]

vendors = [{
    "name": "John Deere",
    "image": "/images/bunch/vendor-john-deere.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
},
{
    "name": "Caterpillar",
    "image": "/images/bunch/vendor-caterpillar.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
},
{
    "name": "Mitsubishi Heavy Industries",
    "image": "/images/bunch/vendor-mitsubishi-heavy-industries.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
},
{
    "name": "Cuisinart",
    "image": "/images/bunch/vendor-cuisinart.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
},
{
    "name": "KitchenAid",
    "image": "/images/bunch/vendor-kitchenaid.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
},
{
    "name": "Viking",
    "image": "/images/bunch/vendor-viking.jpg",
    "securenetId": config.securenet_id,
    "securenetKey": config.secure_key
}]

print vendors
exit()

for peer in peers:
    db.session.add(models.Peer.fromdict(peer))
    db.session.commit()

for peer in vendors:
    db.session.add(models.Vendor.fromdict(peer))
    db.session.commit()