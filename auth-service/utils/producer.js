const { connectRabbitMQ } = require('../configs/rabbitmq.connection');

const sendQueue1 = async ({ userId }) => {
  try {
    const channel = await connectRabbitMQ(); // Lấy channel đã kết nối
    console.log(channel)
    const nameQueue = 'signup_queue';

    await channel.assertQueue(nameQueue, { durable: false });
    await channel.sendToQueue(nameQueue, Buffer.from(userId));
    console.log(`Message sent to queue: ${userId}`);
  } catch (error) {
    console.error('Error sending to queue:', error.message);
  }
};

const sendQueue = async ({ sender, receiver, noteId }, nameQueue) => {
  try {
    const channel = await connectRabbitMQ(); // Lấy channel đã kết nối
    await channel.assertQueue(nameQueue, { durable: false });

    const message = JSON.stringify({ sender, receiver, noteId });
    await channel.sendToQueue(nameQueue, Buffer.from(message));
    console.log(`Message sent to queue: ${message}`);
  } catch (error) {
    console.error('Error sending to queue:', error.message);
  }
};

module.exports = { sendQueue1, sendQueue };
