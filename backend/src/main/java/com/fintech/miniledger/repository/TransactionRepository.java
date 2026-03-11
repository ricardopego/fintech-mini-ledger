package com.fintech.miniledger.repository;

import com.fintech.miniledger.model.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Override
    @EntityGraph(attributePaths = {"terminal"}) // Força o preenchimento do objeto Terminal
    List<Transaction> findAll();
}