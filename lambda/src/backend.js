const axios = require('axios');
const dateFormat = require('dateformat')

axios.defaults.baseURL = 'http://52.59.225.216';

/**
 * @typedef Account
 * @prop {number} accountNumber
 * @prop {string} type `Current` or `Savings`
 * @prop {float} balance 
 */

/**
 * @typedef Account2
 * @prop {number} number
 * @prop {string} name
 */

/**
 * @typedef Transaction
 * @prop {number} id
 * @prop {number} type enum ish. 1 to 5
 * @prop {Date} timestamp
 * @prop {number} amount float. positive or negative
 * @prop {string} message
 * @prop {Account2} account
 */


const backend = {
    /** @return {Promise<Number>} Balance of main account as float*/
    balance() {
        return axios.get('/balance')
            .then(response => response.data)
    },

    /** @return {Promise<Account[]>} */
    accounts() {
        return axios.get('/accounts')
            .then(response => response.data.accounts
                .map(account => ({
                    accountNumber: account.accountNumber,
                    /** "Savings"|"Current" */
                    type: account.accountType,
                    balance: parseFloat(account.availableBalance)
                }))
            )
    },

    /**
     * Returns stuff like
     *  
     * ```
     {
    "message": "10 kr sendt fra 12084059280 til 12084941549",
    "timeStamp": "2017-9-17, 01:17",
    "paymentStatus": "SUCCESS",
    "debitAccountNumber": 12084059280,
    "creditAccountNumber": 12084941549,
    "amount": "10.00",
    "paymentIDNumber": 6250000280
    }```
     * @param {string} contact 
     * @param {number} amount 
     * @return {Promise<boolean>} true if payload's `paymentStatus` is `SUCCESS`
     */
    payContact(contact, amount) {
        return axios.post('/payment', {receiver: contact, amount})
            .then(response => response.data.paymentStatus === 'SUCCESS')
    },

    /**
     * 
     * @param {Date} from
     * @param {Date} to
     * @return {Promise<Transaction[]>}
     */
    transactions(from, to) {
        from = dateFormat(from, "ddmmyyyy")
        to = dateFormat(to, "ddmmyyyy")

        // Test data has no recent stuff. This `from` works:
        from = '20072017'

        return axios.get(`/transactions?dateFrom=${from}&dateTo=${to}`)
            .then(response => response.data.transactions
                .map(transaction => ({
                    id: transaction.transactionID,
                    type: transaction.transactionType,
                    timestamp: new Date(transaction.timeStamp) /*2017-06-26, 19:58*/,
                    amount: parseFloat(transaction.amount),
                    message: transaction["message/KID"],
                    account: {
                        number: transaction.transactionAccountNumber,
                        name: transaction.transactionAccountName
                    }
                })
                )
            )
    },

    /**
     * @param {string} question
     * @return {Promise<string>}
     */
    getFaq(question) {
        return axios.get('/faq', { params: { string: question } })
            .then(response => response.data)
        // return resolve("I won't help you. You are simply too poor to be worth my time.")
        
    }
}

module.exports = backend;