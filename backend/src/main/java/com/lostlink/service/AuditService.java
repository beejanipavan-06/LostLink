package com.lostlink.service;

import com.lostlink.dto.AuditLogDTO;
import com.lostlink.entity.AuditLog;
import com.lostlink.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String userEmail, String action, String entityName, Long entityId, String details) {
        AuditLog log = new AuditLog(userId, userEmail, action, entityName, entityId, details);
        auditLogRepository.save(log);
    }

    public List<AuditLogDTO> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AuditLogDTO toDTO(AuditLog log) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setUserEmail(log.getUserEmail());
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }
}
