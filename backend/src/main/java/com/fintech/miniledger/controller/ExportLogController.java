package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.ExportLog;
import com.fintech.miniledger.repository.ExportLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exports")
@CrossOrigin(origins = "*") // Permite que o seu Front-end acesse a API
public class ExportLogController {

    @Autowired
    private ExportLogRepository repository;

    // Rota que o React vai chamar via POST para salvar o log
    @PostMapping
    public ExportLog registrarExportacao(@RequestBody ExportLog log) {
        return repository.save(log);
    }

    // Rota extra para você poder listar os logs se quiser conferir
    @GetMapping
    public List<ExportLog> listarLogs() {
        return repository.findAll();
    }
}