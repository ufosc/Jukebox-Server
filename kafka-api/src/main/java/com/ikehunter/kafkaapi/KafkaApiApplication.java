package com.ikehunter.kafkaapi;

import com.ikehunter.kafkaapi.kafka.Message;
import com.ikehunter.kafkaapi.producer.MessageProducer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;


@SpringBootApplication
@RestController
public class KafkaApiApplication {

    private final MessageProducer messageProducer;

    public static void main(String[] args) {
        SpringApplication.run(KafkaApiApplication.class, args);
    }

    public KafkaApiApplication(MessageProducer messageProducer) {
        this.messageProducer = messageProducer;
    }

    @RequestMapping("/")
    public String home() {
        return "Kafka API is running.";
    }

    @PostMapping(value="/send", consumes = "application/json")
    public String sendMessage(@RequestBody Message body) {
        messageProducer.sendMessage(body.topic, body.getMessageJson());
        return "Message \"" + body.message + "\" sent to topic \"" + body.topic + "\".";
    }

}