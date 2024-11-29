import 'reflect-metadata'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {
    mixed_handler, 
    history_handler, 
    store_handler 
} from './handlers'

export const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: false}))

server.get('/fusionados', mixed_handler) 
server.post('/almacenar', store_handler) 
server.get('/historial', history_handler) 