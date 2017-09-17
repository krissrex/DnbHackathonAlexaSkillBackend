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
    }
}

module.exports = backend;