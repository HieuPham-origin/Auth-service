// const { connectRabbitMQ } = require('../configs/rabbitmq.connection');
const { connectRabbitMQ } = require('../configs/rabbitmq.connection');
const sendSharingNoteEmail = require('./sendMail');

const receiveQueue = async () => {
    try {
        const channel = await connectRabbitMQ();
        const inviteQueue = "invite_queue"
        await channel.assertQueue(inviteQueue, { durable: false });

        channel.consume('invite_queue', async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();

                // Chuyển từ string về JSON
                const { email, noteId, ownerId } = JSON.parse(content);

                console.log('Received message:', content);

                // Gọi hàm gửi email với dữ liệu đã parse
                await sendSharingNoteEmail(ownerId, email, noteId);

            } else {
                throw new Error('Message is null');
            }
        });
    } catch (error) {
        console.error('Error receiving from queue:', error.message);
        throw error;
    }
};

module.exports = { receiveQueue };