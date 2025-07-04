# Ethereum Transaction Monitoring System

This project monitors Ethereum blockchain transactions in real-time and stores those that match user-defined configurations into a database.

---

## 🚀 Features

- Monitors Ethereum transactions using Web3 + Infura
- Dynamically configurable rules for filtering transactions
- Stores matched transactions using Sequelize ORM
- RESTful API for configuration and transaction data

---

## 🧱 Tech Stack

- **Node.js** (Express)
- **Web3.js** (Infura WebSocket provider)
- **Sequelize** (ORM)
- **SQLite** (or MySQL)
- **Winston** (For advanced logging)

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/kikoneto/ethereum-ruler
cd ethereum-ruler
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment** Create a `.env` file with:

```env
INFURA_PROJECT_ID=fd9f69ffc13040b48e86694625b98141
PORT=3000
```

4. **Run the app**

```bash
npm run start:dev
```

---

## 🛠️ Configuration Format

Each configuration defines how transactions should be filtered:

Example Configuration Entity:

```json
{
  "id": "6fb72e9c-51cf-41b9-a52a-383761fa8709",
  "name": "Type 2 Recovery 1",
  "minValueEth": null,
  "maxValueEth": null,
  "transactionType": 2,
  "recoveryId": 1,
  "from": null,
  "to": null,
  "blockNumber": null,
  "createdAt": "2025-07-04T07:54:52.811Z",
  "updatedAt": "2025-07-04T07:54:52.812Z"
}
```

- `from`, `to`: Optional Ethereum addresses to filter
- `minValueEth`, `maxValueEth`: Value boundaries in ETH
- `transactionType`: A number representing transaction's transactionType
- `recoveryId`: A number representing transaction's recoveryId
- `blockNumber`: Only match transactions at specific block

Example Transaction Entity:

```json
{
  "createdAt": "2025-07-04T08:49:33.991Z",
  "updatedAt": "2025-07-04T08:49:33.991Z",
  "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "sender": "0xSenderAddress1234567890abcdef",
  "receiver": "0xReceiverAddress1234567890abcdef",
  "blockNumber": "123456",
  "input": "0xabcdef",
  "valueEth": "0.5",
  "recoveryId": 1,
  "transactionType": 2,
  "configurationId": "6fb72e9c-51cf-41b9-a52a-383761fa8709"
}
```

---

## 🧾 API Endpoints

### 🔧 Configurations

- `GET /configurations` - List all configs, comes with 2 default from the dev.sqlite
- `GET /configuration/latest` - Get the latest config
- `GET /configurations/:name` - Get config by name
- `POST /configuration` - Create new config  
  _Body:_ JSON with configuration fields, e.g.
  ```json
  {
    "name": "Type 2 Recovery 1",
    "minValueEth": null,
    "maxValueEth": null,
    "transactionType": 2,
    "recoveryId": 1,
    "from": null,
    "to": null,
    "blockNumber": null
  }
  ```
- `PUT /configuration/:name` - Same input body as POST, optional fields can be either null or not included.
- `DELETE /configuration/:name` - Delete configurations by name
- `DELETE /configurations/clear` - Delete all configurations, transactions related to them as well

### 📄 Transactions

- `GET /transactions` - Get all transactions
- `GET /transactions/:name` - Get transactions by configuration name
- `POST /transaction` - Create new transaction, can be used manually as well.  
   _Body:_ JSON with configuration fields, e.g.
  ```json
  {
    "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "sender": "0xSenderAddress1234567890abcdef",
    "receiver": "0xReceiverAddress1234567890abcdef",
    "blockNumber": 123456,
    "input": "0xabcdef",
    "valueEth": "0.5",
    "recoveryId": 1,
    "transactionType": 2,
    "configurationId": "uuid-of-existing-configuration" // For example: 6fb72e9c-51cf-41b9-a52a-383761fa8709
  }
  ```
- `PUT /transaction/:hash` - Same input body as POST, optional fields can be either null or not included.
- `DELETE /transaction/:hash` - Deletes transaction by hash
- `DELETE /transactions/clear` - Delete all transactions.

---

## 🧪 Testing with Postman

**Important to mention

- `After successfully initializing project, run GET /http://localhost:3000/configurations , to double check available configurations. If the result is empty, create any via the POST method in order to be able to create Transactions.`

**Example Payload For Creating Configuration:**

- `POST /http://localhost:3000/configuration`

_Body:_ JSON with configuration fields, e.g.

```json
{
  "name": "Low Value Transactions",
  "maxValueEth": 1
}
```

**Example Payload For Creating Transaction:**

- `POST /http://localhost:3000/transaction`

  _Body:_ JSON with configuration fields, e.g.

```json
{
  "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "sender": "0xSenderAddress1234567890abcdef",
  "receiver": "0xReceiverAddress1234567890abcdef",
  "blockNumber": 123456,
  "input": "0xabcdef",
  "valueEth": "0.5",
  "recoveryId": 1,
  "transactionType": 2,
  "configurationId": "6fb72e9c-51cf-41b9-a52a-383761fa8709" // Check for Accurate UUID via GET /configurations, and choose an actual UUID
}
```

**Also important to mention

- `After carefully double-checking for existing Configurations, you can now set up the .env if it is not already set up. In the app.js you can see that transactions per block are limited to 10 for testing purposes. You can undo that simply by inceasing the count you want to receive or remove the slice() method in general.`

**Example for testing the Web3 Subscription with Configurations

- `You can now run POST /http://localhost:3000/subscription/start in order to start adding Transactions filtered by our Dynamic Configurations. The server checks each Web3 Transaction for any matches in our Configurations, meaning if the Web3 Transaction matches 3 Configurations at the same time, all of them will be saved in our database under a different configurationId.`

- `After testing the subscription you can either stop the server or run POST /http://localhost:3000/subscription/stop to unsubscribe.`

- `Logging is available all the time so you can follow the proccess during the requests.`

- `You can change all the transactions saved via the GET /transactions method, If you want to check all transactions related to Configuration you can simply do it via the GET /transactions/:name . For example to check all the Transactions matching Configuration Name 'Type 2 Recovery 1', the request will have no body but the following link GET /transactions/Type 2 Recovery 1.`

- `You can then try on different Configurations and also erase all the existing Transactions in order to test easier.`

- `You can even add Configurations during the subscription since Hot Load is available because on every new block, we check for latest date Configurations.`

---

## 🌱 Future Improvements

- Integrate migrations and avoid force updates on the SQLite.
- Real-time dashboard (UI)
- Config testing before deployment

---
