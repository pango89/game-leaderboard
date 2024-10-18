import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'origami',
      brokers: [process.env.KAFKA_BROKER],
    });
  }

  getClient() {
    return this.kafka;
  }
}
