const axios = require('axios');

axios.defaults.baseURL = 'http://52.59.225.216';

const backend = {
    /**@return {Promise<Number>} Balance of main account as float*/
    balance() {
        return axios.get('/balance')
            .then(response => response.data)
    }

}

module.exports = backend;