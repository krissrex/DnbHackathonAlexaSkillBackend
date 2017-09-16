const mkdir = require('mkdirp')
const fs = require('fs')
const intents = require("./alexa-skill/intents.json").intents



const createFolder = folder => new Promise((resolve, reject) => {
  mkdir(folder, err => {
    if (err) {
      console.error("Failed to create docs path: ", error)
      return reject(err)
    } else {
      console.log(`Created docs path: "${folder}"`)
      return resolve(folder)
    }
  })
})


write = (data, path) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, err => {
    if (err) {
      console.error("Failed to create docs: ", err)
      return reject(err)
    } else {
      console.log(`Wrote docs to "${path}"`)
      return resolve(path)
    }
  })
})


docs = 
`# Usage examples


`
const docsDirectory = 'dist/docs/'
const docsFileName = 'usage.md'

createFolder(docsDirectory)
  .then(folder => write(docs, folder + docsFileName))
  .then(() => console.log("Done"))
  .catch(err => console.error(err))