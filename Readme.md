# Amazon Echo (Alexa) backend

## Setup
Create the lambda at AWS. Use [this guide](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/1-voice-user-interface.md).  
Feed the `arn` for the lambda into the `Alexa Skill` configuration.

## Deploy
The end goal is to create a zip with `node_modules`, `src` and `package.json`.
The build command assumes 7zip is installed on windows. Fix for your machine if needed.

Upload the file in `dist/build.zip` as *code* in AWS Lambda for the *Function* under the *Code* tab,
when *Code entry type* is _"Upload a .ZIP file"_.

## Things to ask alexa

> Run `npm run docs` to generate the file.

[List of things to ask](dist/docs/usage.md)

## Optimizations

### No account linking

The Alexa Skill should use [Account Linking](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system)
to let Alexa users authorize on the Personal Assistant using OAuth.

 