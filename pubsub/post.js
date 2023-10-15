const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const postVideo = async ({ msg }) => {
    try {
        // 1. create connect
        const conn = await amqplib.connect(apqpUrl)

        // 2. create channel
        const channel = await conn.createChannel()

        // 3.create exchange
        const exchangeName = 'video'

        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        })

        //4. public video
        await channel.publish(exchangeName, '', Buffer.from(msg))

        console.log(`[x] Send OK:::${msg}`)

        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 2000)
    } catch (err) {
        console.log('err:: ', err)  
    }
}

postVideo({ msg: 'hello' })