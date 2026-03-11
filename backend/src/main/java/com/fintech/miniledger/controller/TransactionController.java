package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.Transaction;
import com.fintech.miniledger.model.Terminal;
import com.fintech.miniledger.repository.TransactionRepository;
import com.fintech.miniledger.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionRepository repository;

    @Autowired
    private TerminalRepository terminalRepository;

    @GetMapping
    public List<Transaction> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Transaction create(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction();

        // Salva a descrição (pode ser null para vendas, mas o record deve aceitar)
        transaction.setDescription(request.description());
        transaction.setAmount(request.amount());
        transaction.setCreatedAt(LocalDateTime.now());

        // CRÍTICO: Se o terminalId vier no JSON, temos de procurar e associar
        if (request.terminalId() != null) {
            Terminal terminal = terminalRepository.findById(request.terminalId())
                    .orElse(null);
            transaction.setTerminal(terminal);

            // Se for venda e a descrição for nula, podemos setar um padrão
            if (transaction.getDescription() == null && terminal != null) {
                transaction.setDescription("Venda via " + terminal.getName());
            }
        }

        return repository.save(transaction);
    }

    public record TransactionRequest(String description, BigDecimal amount, UUID terminalId) {}
}