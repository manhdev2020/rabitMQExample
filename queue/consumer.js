const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const receiveQueue = async () => {
    try {
        // 1. create connect
        const conn = await amqplib.connect(apqpUrl)

        // 2. create channel
        const channel = await conn.createChannel()

        // 3. create queue name
        const queueName = 'q2'

        // 4. create queue
        await channel.assertQueue(queueName, {
            durable: true // Nếu false, khi máy chủ crash thì data trong queue bị mất
        })

        // 5. receive to queue
        await channel.consume(queueName, msg => {
            console.log(`MSG:::`, msg.content.toString())
        }, {
            noAck: true // Khi false có nghĩa client xác định là chưa nhận
        })

        // 6. close conn and channel
        // await channel.close()
        // await conn.close()
    } catch (err) {
        console.log('err:: ', err)
    }
}

receiveQueue()

