package com.lostlink.repository;

import com.lostlink.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuspiciousActivityRepository extends JpaRepository<SuspiciousActivity, Long> {
    List<SuspiciousActivity> findByStatus(String status);
    long countByStatus(String status);
    List<SuspiciousActivity> findByUserId(Long userId);
    List<SuspiciousActivity> findByItemId(Long itemId);
}
