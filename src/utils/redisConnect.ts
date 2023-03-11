import Redis, { createClient} from 'redis';
import util from 'util'
const redisURL: string = process.env.redisURL as string;

const client = createClient({url: redisURL})


client.connect().then(() => {
  console.log("Redis is connected")
})
.catch(err => console.log(err.message))

export default client;


