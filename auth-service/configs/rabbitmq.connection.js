// rabbitmq.connection.js
const amqplib = require('amqplib');
require('dotenv').config();

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    if (!connection) {
      connection = await amqplib.connect(process.env.RABBITMQ_URL);
      console.log('Connected to RabbitMQ successfully');
    }

    if (!channel) {
      channel = await connection.createChannel();
      console.log('Channel created successfully');
    }

    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    // Đợi 5 giây và thử lại kết nối
    setTimeout(() => {
      console.log('Retrying RabbitMQ connection...');
      connectRabbitMQ();
    }, 5000);
    throw error;
  }
};

// Hàm này đảm bảo rằng luôn lấy ra được channel đã kết nối sẵn
const getChannel = async () => {
  if (!channel) {
    await connectRabbitMQ();
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };
