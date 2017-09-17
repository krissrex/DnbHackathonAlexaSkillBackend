# Amazon Echo (Alexa) backend

## Setup
Create the lambda at AWS. Use [this guide](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/1-voice-user-interface.md).  
Feed the `arn` for the lambda into the `Alexa Skill` configuration.

## Deploy
The end goal is to create a zip with `node_modules`, `src` and `package.json`.
The `build` command in [lambda](lambda/package.json) assumes 7zip is installed on windows. Fix for your machine if needed.

Upload the file in `lambda/dist/build.zip` as *code* in AWS Lambda for the *Function* under the *Code* tab,
when *Code entry type* is _"Upload a .ZIP file"_.

In configuration handler, pick `src/lambda.handler`

## Things to ask alexa

> Run `npm run docs` to generate the file.

[List of things to ask](alexa/dist/docs/usage.md)

### Demo questions

> Alexa, ask Bank Buddy what's up.

> Alexa, ask Bank Buddy: what do I do if I have forgotten my password?

> Alexa, ask Bank Buddy for my balance

> Alexa, ask Bank Buddy to transfer 100 kroner to Kevin

## Optimizations

### No account linking

The Alexa Skill should use [Account Linking](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system)
to let Alexa users authorize on the Personal Assistant using OAuth.

 