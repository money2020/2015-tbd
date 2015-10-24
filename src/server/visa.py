import config
import requests

class VisaDirect:

    base_uri = 'https://sandbox.api.visa.com/visadirect/'
    headers = {'content-type': 'application/json', 'accept':'application/json'}

    def __init__(self, user_id, password, client_pem, private_pem):
        self.user_id = user_id
        self.password = password
        self.client_pem = client_pem
        self.private_pem = private_pem


    def multiaft(self, orig_accounts, dest_accounts, amount):
        ''' Pull money from multiple cards at the same time.

            https://developer.visa.com/vpp/documents/json/Multi_Transaction_Account_Funding_Transaction__MULTIAFT_.html
        '''
        pass


    def oct(self, orig_account, dest_account, amount):
        ''' Send money from one individual to another

            https://developer.visa.com/vpp/documents/json/Original_Credit_Transaction__OCT_.html
        '''
        pass


    def _request(self, resource_path, body):
        url = self.base_uri + resource_path
        req = requests.post(url,
            cert=(self.client_pem, self.private_pem),
            headers=self.headers,
            auth=(self.user_id, self.password),
            data=body)

        return req


if __name__ == '__main__':
    resource_path = 'fundstransfer/v1/pullfundstransactions/'

    body='''{
  "businessApplicationId": "AA",
  "merchantCategoryCode": 6012,
  "pointOfServiceCapability": {
    "posTerminalType": "4",
    "posTerminalEntryCapability": "2"
  },
  "feeProgramIndicator": "123",
  "systemsTraceAuditNumber": 300259,
  "retrievalReferenceNumber": "407509300259",
  "foreignExchangeFeeTransaction": "10.00",
  "cardAcceptor": {
    "name": "Acceptor 1",
    "terminalId": "365539",
    "idCode": "VMT200911026070",
    "address": {
      "state": "CA",
      "county": "081",
      "country": "USA",
      "zipCode": "94404"
    }
  },
  "magneticStripeData": {
    "track1Data": "1010101010101010101010101010"
  },
  "senderPrimaryAccountNumber": "4005520000011126",
  "senderCurrencyCode": "USD",
  "surcharge": "2.00",
  "localTransactionDateTime": "2021-10-26T21:32:52",
  "senderCardExpiryDate": "2013-03",
  "pinData": {
    "pinDataBlock": "1cd948f2b961b682",
    "securityRelatedControlInfo": {
      "pinBlockFormatCode": 1,
      "zoneKeyIndex": 1
    }
  },
  "cavv": "0000010926000071934977253000000000000000",
  "pointOfServiceData": {
    "panEntryMode": "90",
    "posConditionCode": "0",
    "motoECIIndicator": "0"
  },
  "acquiringBin": 409999,
  "acquirerCountryCode": "101",
  "amount": "112.00"
}'''

    v = VisaDirect(config.user_id, config.password, config.client_pem, config.private_pem)
    r = v._request(resource_path, body)

    print r.content