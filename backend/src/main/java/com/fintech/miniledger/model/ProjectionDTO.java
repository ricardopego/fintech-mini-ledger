package com.fintech.miniledger.model;

import java.math.BigDecimal;

public class ProjectionDTO {
    private BigDecimal projectedIncome;
    private BigDecimal projectedExpense;
    private BigDecimal projectedBalance;
    private String trend;
    private String actionItem; // <-- O campo da inteligência!

    public ProjectionDTO(BigDecimal projectedIncome, BigDecimal projectedExpense, BigDecimal projectedBalance, String trend, String actionItem) {
        this.projectedIncome = projectedIncome;
        this.projectedExpense = projectedExpense;
        this.projectedBalance = projectedBalance;
        this.trend = trend;
        this.actionItem = actionItem;
    }

    // Getters e Setters
    public BigDecimal getProjectedIncome() { return projectedIncome; }
    public void setProjectedIncome(BigDecimal projectedIncome) { this.projectedIncome = projectedIncome; }

    public BigDecimal getProjectedExpense() { return projectedExpense; }
    public void setProjectedExpense(BigDecimal projectedExpense) { this.projectedExpense = projectedExpense; }

    public BigDecimal getProjectedBalance() { return projectedBalance; }
    public void setProjectedBalance(BigDecimal projectedBalance) { this.projectedBalance = projectedBalance; }

    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }

    public String getActionItem() { return actionItem; }
    public void setActionItem(String actionItem) { this.actionItem = actionItem; }
}