import { createServer } from 'http';
import { server } from './serverStart.js';

export const httpServer = createServer(server)

httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})