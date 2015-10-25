import requests

class WorldPay:

    base_url = 'https://gwapi.demo.securenet.com/api'
    headers = {'content-type': 'application/json', 'accept':'application/json'}

    def __init__(self, securenet_id, secure_key):
        self.securenet_id = securenet_id
        self.secure_key = secure_key


    def collect_payment(self, data):
        return True


    def distribute_payment(self, data):
        return True


    def _request(self, endpoint, body):
        url = self.base_url + endpoint
        r = requests.post(url,
                headers=self.headers,
                auth=(self.securenet_id, self.secure_key),                
                data=body)

        return r


if __name__ == '__main__':
    body = '''{
  amount: 11.00,
  card: {
    number: '4444 3333 2222 1111',
    cvv: '999',
    expirationDate: '04/2016',
    address: {
      line1: '123 Main St.',
      city: 'Austin',
      state: 'TX',
      zip: '78759'
    },
    firstname: 'Jack',
    lastname: 'Test'
  },
  extendedInformation: {
    typeOfGoods: 'PHYSICAL'
  },
  developerApplication: {
    developerId: 12345678,
    version: '1.2'
  }
}'''

    import config

    w = WorldPay(config.securenet_id, config.secure_key)
    r = w._request('/Payments/Authorize', body)

    print r.status_code
    print r.content