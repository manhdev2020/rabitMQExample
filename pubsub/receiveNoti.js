const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const receiveNoti = async () => {
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

        // 4. create queue
        const {
            queue // name queue
        } = await channel.assertQueue('', {
            exclusive: true // xóa hàng đợi khi exist
        })

        console.log(`queueName::::${queue}`)

        // 5. binding
        await channel.bindQueue(queue, exchangeName, '')

        await channel.consume(queue, msg => {
            console.log(msg.content.toString())
        }, {
            noAck: true
        })
    } catch (err) {
        console.log('err:: ', err)  
    }
}

receiveNoti()