const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const sendEmail = async () => {
    try {
        // 1. create connect
        const conn = await amqplib.connect(apqpUrl)

        // 2. create channel
        const channel = await conn.createChannel()

        // 3.create exchange
        const exchangeName = 'send_email'

        await channel.assertExchange(exchangeName, 'topic', {
            durable: false
        })

        const agrs = process.argv.slice(2)
        const msg = agrs[1] || 'Fixed!'
        const topic = agrs[0];

        console.log({ msg, topic })

        //4. public email
        await channel.publish(exchangeName, topic, Buffer.from(msg))

        console.log(`[x] Send OK:::${msg}`)

        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 2000)
    } catch (err) {
        console.log('err:: ', err)  
    }
}

sendEmail()