const axios = require('axios');

axios.defaults.baseURL = 'http://52.59.225.216';

/**
 * @typedef Account
 * @prop {number} accountNumber
 * @prop {string} type `Current` or `Savings`
 * @prop {float} balance 
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
                }) )
            )
    },

    /**
     * 
     * @param {string} from `ddMMyyyy`
     * @param {string} to `ddMMyyyy`
     */
    transactions(from, to) {
        return axios.get(`/transactions?dateFrom=${from}&dateTo=${to}`)
            .then(response => response.data)
    }
}

module.exports = backend;