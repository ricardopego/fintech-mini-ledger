package com.fintech.miniledger.repository;

import com.fintech.miniledger.model.ExportLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportLogRepository extends JpaRepository<ExportLog, Long> {
    // O Spring Boot gera automaticamente os métodos de salvar e buscar aqui
}