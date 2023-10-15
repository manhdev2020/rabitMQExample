const amqplib = require('amqplib');

const apqpUrl = 'amqp://guest:guest@localhost:5672'

const receiveEmail = async () => {
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

        // 4. create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true // xóa hàng đợi khi exist
        })

        // 5. Binding
        const agrs = process.argv.slice(2)

        /*
            * có nghĩa phù hợp với bất kỳ từ nào
            # khớp với một hoặc nhiều từ bất kỳ
        */
        
        if(!agrs.length) {
            process.exit(0)
        }

        console.log(`watting queue ${queue}:::topic:::${agrs}`)

        agrs.forEach(async key => {
            await channel.bindQueue(queue, exchangeName, key)
        })

        //4. 
        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}:::msg:::${msg.content.toString()}`)
        })
    } catch (err) {
        console.log('err:: ', err)  
    }
}

receiveEmail()