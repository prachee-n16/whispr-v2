import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { IamAuthenticator } from 'ibm-watson/auth';
import LanguageTranslatorV3 from 'ibm-watson/language-translator/v3'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_SERVICE_API_KEY,
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL,
  disableSslVerification: true,
});

// Get all languages
app.get('/language', async (req, res) => {
  try {
    const languagesResponse = await languageTranslator.listLanguages()
    res.status(200).send({
      languages: languagesResponse
    })
  } catch (err) { console.log(err) }
})

app.post('/translate', async (req, res) => {
  try {
    const params = req.body.translateParams
    const translateResponse = await languageTranslator.translate(params)
    res.status(200).send({
      message: translateResponse
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/', async (req, res) => {
  try {
    res.status(200).send({
      message: 'Hello from Whispr!'
    })
  } catch (error) {
    console.log(error)
  }
})

app.listen(5000, () => console.log('Server started on http://localhost:5000'))