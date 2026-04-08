package com.fintech.miniledger.repository;

import com.fintech.miniledger.model.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Override
    @EntityGraph(attributePaths = {"terminal"})
    List<Transaction> findAll();

    // Adicionamos o "cast(... as timestamp)" para o Postgres não se perder com os valores nulos!
    @EntityGraph(attributePaths = {"terminal"})
    @Query("SELECT t FROM Transaction t WHERE " +
            "(cast(:startDate as timestamp) IS NULL OR t.createdAt >= :startDate) AND " +
            "(cast(:endDate as timestamp) IS NULL OR t.createdAt <= :endDate)")
    List<Transaction> findByDateBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}