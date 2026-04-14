package com.capstone.meerkatai.chatbot.service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.UUID;

@Service
public class DialogflowService {

    @Value("${dialogFlow.projectId}")
    private String projectId;

    private SessionsClient sessionsClient;
    private String sessionId = UUID.randomUUID().toString(); // For simplicity, using a single session ID

    @PostConstruct
    public void init() {
        try {
            GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
            SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();
            sessionsClient = SessionsClient.create(sessionsSettings);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize DialogflowService: Could not load credentials.", e);
        }
    }

    public QueryResult detectIntent(String text) {
        SessionName session = SessionName.of(projectId, sessionId);
        TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode("ko-KR"); // Assuming Korean language
        QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

        DetectIntentRequest request = DetectIntentRequest.newBuilder()
                .setSession(session.toString())
                .setQueryInput(queryInput)
                .build();

        DetectIntentResponse response = sessionsClient.detectIntent(request);
        return response.getQueryResult();
    }
}