package com.ikehunter.kafkaapi.kafka;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Message {
    public String topic;
    public Object message;

    public String getMessageJson() {
        try {

            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(message);
        } catch (JsonProcessingException e) {
            return "";
        }
    }
}