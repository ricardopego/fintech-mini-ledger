package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.ProjectionDTO;
import com.fintech.miniledger.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private TransactionRepository repository;

    @GetMapping("/projection")
    public ProjectionDTO getProjection() {
        BigDecimal income3M = repository.sumIncomeLast3Months();
        BigDecimal expense3M = repository.sumExpenseLast3Months();

        if (income3M == null) income3M = BigDecimal.ZERO;
        if (expense3M == null) expense3M = BigDecimal.ZERO;

        BigDecimal divisor = new BigDecimal("3");
        BigDecimal projectedIncome = income3M.divide(divisor, 2, RoundingMode.HALF_UP);
        BigDecimal projectedExpense = expense3M.divide(divisor, 2, RoundingMode.HALF_UP);
        BigDecimal projectedBalance = projectedIncome.add(projectedExpense);

        String trend = projectedBalance.compareTo(BigDecimal.ZERO) >= 0 ? "ALTA" : "BAIXA";

        // --- AQUI ESTÁ A INTELIGÊNCIA ---
        String actionItem = "";
        if (projectedBalance.compareTo(BigDecimal.ZERO) < 0) {
            actionItem = "ALERTA CRÍTICO: Risco de fechar no vermelho. Congele gastos não essenciais.";
        } else if (projectedBalance.compareTo(new BigDecimal("500")) < 0) {
            actionItem = "ATENÇÃO: Margem de lucro muito baixa. Tente antecipar recebíveis.";
        } else {
            actionItem = "SAUDÁVEL: O caixa está positivo. Considere investir o excedente.";
        }

        // Retorna tudo para o React, incluindo a mensagem (actionItem)
        return new ProjectionDTO(projectedIncome, projectedExpense, projectedBalance, trend, actionItem);
    }
}