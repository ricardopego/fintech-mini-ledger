package com.fintech.miniledger.repository;

import com.fintech.miniledger.model.Terminal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, UUID> {
    // Aqui mora a mágica!
    // O JpaRepository já nos dá métodos como .save(), .findAll(), .deleteById() prontos.
}