import 'reflect-metadata'
import 'dotenv/config'
import serverless from 'serverless-http'
import { server as App } from '../http/server'

export const server = serverless(App)
