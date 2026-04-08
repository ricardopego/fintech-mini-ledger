package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.Transaction;
import com.fintech.miniledger.model.Terminal;
import com.fintech.miniledger.repository.TransactionRepository;
import com.fintech.miniledger.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    // ==========================================
    // NOVO GET COM FILTROS DE DATA
    // ==========================================
    @GetMapping
    public List<Transaction> getAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Chama a nova query inteligente que criamos no repositório
        return repository.findByDateBetween(startDate, endDate);
    }

    @PostMapping
    public Transaction create(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction();

        transaction.setDescription(request.description());
        transaction.setAmount(request.amount());
        transaction.setCreatedAt(LocalDateTime.now());

        if (request.terminalId() != null) {
            Terminal terminal = terminalRepository.findById(request.terminalId())
                    .orElse(null);
            transaction.setTerminal(terminal);

            if (transaction.getDescription() == null && terminal != null) {
                transaction.setDescription("Venda via " + terminal.getName());
            }
        }

        if (transaction.getAmount() != null
                && transaction.getAmount().compareTo(BigDecimal.ZERO) > 0
                && transaction.getTerminal() != null
                && transaction.getTerminal().getFeePercentage() > 0) {

            BigDecimal feePercentage = BigDecimal.valueOf(transaction.getTerminal().getFeePercentage());
            BigDecimal fee = feePercentage.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
            BigDecimal discount = transaction.getAmount().multiply(fee);
            BigDecimal netValue = transaction.getAmount().subtract(discount);

            transaction.setNetAmount(netValue);
        } else {
            transaction.setNetAmount(transaction.getAmount());
        }

        return repository.save(transaction);
    }

    public record TransactionRequest(String description, BigDecimal amount, UUID terminalId) {}
}