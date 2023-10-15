const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const sendQueue = async ({ msg }) => {
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

        // 5. send to queue
        await channel.sendToQueue(queueName, Buffer.from(msg), {
            persistent: true // true: tin nhắn này được lưu vào ổ đĩa hoặc cache
        })

        // 6. close conn and channel
        await channel.close()
        await conn.close()
    } catch (err) {
        console.log('err:: ', err)
    }
}

sendQueue({ msg: 'Hello' })

