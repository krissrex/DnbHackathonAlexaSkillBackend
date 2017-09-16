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

const sectionList = intents
  .filter(intent => !intent.name.startsWith("AMAZON"))
  .map(intent => {
    const header = intent.name.replace("_", " ")
    const statements = intent.samples.map(statement => "Alexa, ask Bank Buddy [to/for] " + statement)
    return { header, statements }
  })

const body = sectionList.map(section => {
  let statementString = ""
  for (let index in section.statements) {
    let statement = section.statements[index]
    statementString += `\n* ${statement}`
  }
  return `\n## ${section.header}
  ${statementString}`
})
  .join("\n")


docs =
  `# Usage examples
${body}
`
const docsDirectory = 'dist/docs/'
const docsFileName = 'usage.md'

createFolder(docsDirectory)
  .then(folder => write(docs, folder + docsFileName))
  .then(() => console.log("Done"))
  .catch(err => console.error(err))