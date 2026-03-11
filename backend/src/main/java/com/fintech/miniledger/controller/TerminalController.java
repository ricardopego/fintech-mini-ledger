package com.fintech.miniledger.controller;

import com.fintech.miniledger.model.Terminal;
import com.fintech.miniledger.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/terminals")
@CrossOrigin(origins = "*") // Essencial para o frontend React se comunicar sem bloqueios
public class TerminalController {

    @Autowired
    private TerminalRepository repository;

    // Retorna a lista de todas as maquininhas
    @GetMapping
    public List<Terminal> getAll() {
        return repository.findAll();
    }

    // Salva uma nova maquininha
    @PostMapping
    public Terminal create(@RequestBody Terminal terminal) {
        return repository.save(terminal);
    }

    // Exclui a maquininha pelo ID ou bloqueia se tiver vendas atreladas
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTerminal(@PathVariable UUID id) {
        try {
            repository.deleteById(id);
            return ResponseEntity.noContent().build(); // Retorna 204 (Sucesso, nada a exibir)

        } catch (DataIntegrityViolationException e) {
            // O Spring captura o "grito" do Postgres (Foreign Key constraint) e devolve 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        } catch (Exception e) {
            // Qualquer outro erro genérico
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}