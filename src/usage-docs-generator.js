const mkdir = require('mkdirp')
const fs = require('fs')
const intents = require("alexa-skill.json").intents

const docFileFolder = '../dist/docs/'
const docFilePath = docFileFolder + 'usage.md'

mkdir(docFileFolder, err => {
  if (err) {
    console.error("Failed to create dosc path: ", error)
  } else {
    console.log(`Created docs path: "${docFileFolder}"`)
  }
})


docs = ``

fs.writeFile(docFilePath, docs, err => {
  if (err) {
    console.error("Failed to create docs: ", err)
  } else {
    console.log(`Wrote docs to "${docFilePath}"`)
  }
})