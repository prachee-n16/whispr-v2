import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { IamAuthenticator } from 'ibm-watson/auth/index.js';
import LanguageTranslatorV3 from 'ibm-watson/language-translator/v3.js'

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
app.get('/api', async (req, res) => {
  try {
    const languagesResponse = await languageTranslator.listLanguages()
    res.status(200).send({
      languages: languagesResponse
    })
  } catch (err) { console.log(err) }
})

app.post('/api', async (req, res) => {
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

export default app;