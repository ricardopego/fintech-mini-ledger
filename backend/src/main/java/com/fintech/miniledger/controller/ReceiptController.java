package com.fintech.miniledger.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class ReceiptController {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @PostMapping("/extract-receipt")
    public ResponseEntity<?> extractReceipt(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Converte a imagem que veio do React para Base64 (formato que a IA entende)
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String mimeType = file.getContentType() != null ? file.getContentType() : "image/jpeg";

            // 2. Monta a requisição para a OpenAI
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            // Instrução para a IA
            String prompt = "Leia este cupom fiscal. Retorne APENAS um JSON estrito no formato {\"descricao\": \"Nome do Local\", \"valor\": 150.50}. O valor deve ser numérico, com ponto para decimais. Não retorne blocos de código markdown, apenas as chaves do JSON direto.";

            Map<String, Object> textContent = Map.of("type", "text", "text", prompt);
            Map<String, Object> imageContent = Map.of("type", "image_url", "image_url", Map.of("url", "data:" + mimeType + ";base64," + base64Image));

            Map<String, Object> message = Map.of("role", "user", "content", List.of(textContent, imageContent));
            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o", // Voltando para o modelo correto da OpenAI
                    "messages", List.of(message),
                    "max_tokens", 300
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // 3. Dispara para a URL oficial da OpenAI
            ResponseEntity<String> response = restTemplate.postForEntity("https://api.openai.com/v1/chat/completions", request, String.class);

            // 4. Lê a resposta, pega o texto limpo e devolve para o React
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            String jsonRespostaDaIA = rootNode.path("choices").get(0).path("message").path("content").asText().trim();

            // Retorna o JSON exato que o seu Front-end está esperando
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(jsonRespostaDaIA);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao processar imagem com a IA: " + e.getMessage()));
        }
    }
}