package com.fintech.miniledger.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "export_logs")
public class ExportLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String format; // CSV ou PDF

    @Column(name = "filters_used")
    private String filtersUsed;

    @Column(name = "records_count")
    private Integer recordsCount;

    @Column(name = "exported_at")
    private LocalDateTime exportedAt = LocalDateTime.now();

    // Construtor padrão exigido pelo JPA
    public ExportLog() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getFiltersUsed() { return filtersUsed; }
    public void setFiltersUsed(String filtersUsed) { this.filtersUsed = filtersUsed; }

    public Integer getRecordsCount() { return recordsCount; }
    public void setRecordsCount(Integer recordsCount) { this.recordsCount = recordsCount; }

    public LocalDateTime getExportedAt() { return exportedAt; }
    public void setExportedAt(LocalDateTime exportedAt) { this.exportedAt = exportedAt; }
}