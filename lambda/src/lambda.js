/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const backend = require('./backend')

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Bank bro',
            GET_FACT_MESSAGE: "Here's your fact: ",
            HELP_MESSAGE: 'You can get your balance, invoices, transfer money between accounts, and send money to phone contacts. Or you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        }
    }
};

/**
 * Default required intents that Amazon supply.
 * This gets merged into handlers.
 */
const amazonDefaultHandlers = {
    /* This will short-cut any incoming intent or launch requests and route them to this handler.
     * Use this to eg. verify that the user has everything set up to use the skill, like main account
     * etc.
     * 
    NewSession () {
        
    }, */
    LaunchRequest() {
        this.emit('General_Updates');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
}

/*
Handlers run as Handler<T>

export interface Handler<T> {
    on: any;
    emit(event: string, ...args: any[]): boolean;
    emitWithState: any;
    state: any;
    handler: any;
    event: RequestBody<T>;
    attributes: any;
    context: any;
    name: any;
    isOverriden: any;
    t: (token: string, ...args: any[]) => void;
}

*/

const defaultErrorHandler = err => {
    // TODO log err to backend
    this.emit(':tell', 'Something went wrong.')
}

const handlers = {
    /**
     * Transfer money between your accounts.
     * 
     * Has 3 slots: 
     * 1. `MoneyAmount` (number), 
     * 2. `FromBankAccount` (string), 
     * 3. `ToBankAccount` (string)
     */
    Account_TransferInternal() {
        const amount = parseFloat(this.event.request.intent.slots.MoneyAmount.value)
        const from = this.event.request.intent.slots.FromBankAccount.value
        const to = this.event.request.intent.slots.ToBankAccount.value

        /* backend.accounts()
            .then(accounts => {
                // TODO get names for accounts or something
            }) */
        // FIXME query backend to see if the amount and from/to are valid 
        // A user can have many accounts, so the name should match one of their accounts, or an alias defined in our system (TODO)
        // Just doing some basic "validation" here, but should be done in backend.
        const savingsBalance = 1000
        const currentBalance = 103

        // Assume that from and to are set.

        const recognizedAccount = account => ["MY ACCOUNT", "CURRENT", "SAVINGS"].indexOf(account.toUpperCase()) > -1

        let fromBalance = 0
        if (['CURRENT', 'MY ACCOUNT'].indexOf(from.toUpperCase()) > -1) {
            fromBalance = currentBalance
        } else if (from.toUpperCase() === 'SAVINGS') {
            fromBalance = savingsBalance
        }

        if (amount && amount < fromBalance) {
            this.emit(':tell', `Moving ${amount} kroner from ${from} to ${to} account. Please verify using the Bank Buddy app.`)
        } else {
            this.emit(':tell', `I'm sorry, but you don't have ${amount} available in ${from}`)
        }

    },

    /**
     * Tell recently received money, balance of savings and any pending invoices
     */
    General_Updates() {
        const now = new Date()
        const ONE_DAY_MILLISECONDS = 1000 * 60 * 60 * 24
        const yesterday = new Date(now.getTime() - ONE_DAY_MILLISECONDS)

        const transactions = backend.transactions(yesterday, now)
            .then(transactions => {
                transactions.sort((l, r) => l.timestamp - r.timestamp) // ascending
                transactions = transactions.filter(transaction => transaction.amount > 0)
                return transactions.map(transaction => ({
                    name: transaction.account.name,
                    amount: transaction.amount
                })
                )
            })

        const balance = backend.balance()

        Promise.all([balance, transactions])
            .then(([amount, transactionList]) => {
                let income = '' // Today you got 100 kroner from Lars-Erik.
                if (transactionList.length) {
                    income = `Today you got ${transactionList.length} payments. They are: `
                    transactionList.forEach(item => {
                        income += `${item.amount} from ${item.name}. `
                    })
                }

                this.emit(':tell', `${income}Your balance is ${amount} kroner. There are 3 unpaid invoices, for a total of 1042 kroner.`)
            })
            .catch(defaultErrorHandler)
    },

    /**
     * Show pending invoices.
     * Third party APIs for this are mocked as of now.
     * Could support _eFaktura_ etc.
     */
    Invoice_Pending() {
        this.emit(':tell', 'You have 3 unpaid invoices. They cost a total of 51322 kroner. I see with your income and savings, there is no way you can pay this. Would you like to declare bankrupcy?')
    },

    /**
     * Reads balance of main account, a user specified "favorite".
     * Usually 'Current' account ("brukskonto").
     */
    MainAccount_Balance() {
        backend.balance()
            .then(balance => {
                if (balance == '0') {
                    this.emit(':tell', 'You are broke.')
                } else {
                    this.emit(':tell', `Your balance is ${balance} kroner.`)
                }

            })
            .catch(defaultErrorHandler)
    },

    /**
     * Transfer money to the name of a phone contact.
     * This should instruct the phone for further details (for security reasons).
     * Eg. Vipps (perhaps the app just launches vipps).
     * 
     * Has 2 slots:
     * 1. `MoneyAmount` (number)
     * 2. `PhoneContact` (string, name of a person)
     */
    MainAccount_PayContact() {
        const amount = parseFloat(this.event.request.intent.slots.MoneyAmount.value)
        const contact = this.event.request.intent.slots.PhoneContact.value

        //FIXME doesn't work properly, because two things. WIP.
        const contacts = ['Kristian']
        // TODO use state or something for questions
        //this.handler.state = "pickingContact"
        //this.emit(':ask', 'I found one contact named Kristian with phone number 123-123. Is this correct?', '')

        // TODO get actual user contacts
        // TODO use phone app to verify payment
        backend.payContact(contact, amount)
            .then(success => {
                if (success) {
                    this.emit(':tell', `I found one contact named ${contact} with phone number <say-as interpret-as="telephone">41210381</say-as>.`
                    + ` Creating transfer of ${amount} kroner.`
                    + ' Please verify using the Bank Buddy app.'
                    + ' <amazon:effect name="whispered">Send nudes.</amazon:effect>.')
                } else {
                    this.emit(':tell', 'I was unable to transfer the money.')
                }
            })
            .catch(defaultErrorHandler)

    },

    Help_Faq() {
        this.emit(':tell', "I won't help you. You are simply too poor to be worth my time.")
    },

    /**
     * Default handler for the sample.
     */
    GetFact() {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];

        // Create speech output
        const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(amazonDefaultHandlers, handlers);
    alexa.execute();
};
