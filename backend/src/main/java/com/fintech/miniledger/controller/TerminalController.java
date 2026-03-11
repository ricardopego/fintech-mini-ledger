package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.Terminal;
import com.fintech.miniledger.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terminals")
@CrossOrigin(origins = "*") // Permite que seu futuro Front-end acesse essa API
public class TerminalController {

    @Autowired
    private TerminalRepository repository;

    // Rota para LISTAR todas as maquininhas (GET)
    @GetMapping
    public List<Terminal> getAll() {
        return repository.findAll();
    }

    // Rota para CADASTRAR uma nova maquininha (POST)
    @PostMapping
    public Terminal create(@RequestBody Terminal terminal) {
        return repository.save(terminal);
    }
}