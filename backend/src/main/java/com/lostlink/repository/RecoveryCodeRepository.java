package com.lostlink.repository;

import com.lostlink.entity.RecoveryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecoveryCodeRepository extends JpaRepository<RecoveryCode, Long> {
    Optional<RecoveryCode> findByClaimId(Long claimId);
    Optional<RecoveryCode> findByCode(String code);
}
