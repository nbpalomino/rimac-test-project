import { createLogger, format, transports } from 'winston'

export type Pagination = {
    size: number,
    page: number
}

export const logger = createLogger({
    format: format.combine(
        format.splat(),
        format.timestamp(),
        format.prettyPrint(),
        format.colorize({
            level: true
        }),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'application.log', level: 'info' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ]
  })