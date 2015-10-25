import requests
import thread

class WorldPay:

    base_url = 'https://gwapi.demo.securenet.com/api'
    headers = {'content-type': 'application/json', 'accept':'application/json'}

    def __init__(self, securenet_id, secure_key):
        self.securenet_id = securenet_id
        self.secure_key = secure_key


    def collect_payment(self, data, auth):

        def threaded_collect_payment(self, data, auth):
            body = '''{
                amount: %0.2f,
                check: {
                    firstName: "%s",
                    lastName: "%s",
                    routingNumber: 222371863,
                    accountNumber: 123456
                },
                developerApplication: {
                    developerId: 12345678,
                    version: '1.2'
                }
            }''' % (data['amount'], data['firstName'], data['lastName'])

            print body

            r = self._request('/Payments/Charge', body=body, auth=auth)

            print r.content

        thread.start_new_thread(threaded_collect_payment, (self, data, auth))

        return True


    def _request(self, endpoint, body, auth=None):
        url = self.base_url + endpoint

        if auth is None:
            auth = (self.securenet_id, self.secure_key)

        r = requests.post(url,
                headers=self.headers,
                auth=auth,
                data=body)

        return r


if __name__ == '__main__':
    body = '''{
  amount: 10.00,
  check: {
    firstName: REPLACE_ME,
    lastName: REPLACE_ME,
    routingNumber: 222371863,
    accountNumber: 123456
  },
   developerApplication: {
     developerId:12345678,
     version:'1.2'
   }
}'''

    import config

    w = WorldPay(config.securenet_id, config.secure_key)
    r = w._request('/Payments/Charge', body)

    print r.status_code
    print r.content