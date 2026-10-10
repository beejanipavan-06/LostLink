package com.lostlink.repository;

import com.lostlink.entity.ItemFingerprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemFingerprintRepository extends JpaRepository<ItemFingerprint, Long> {
    Optional<ItemFingerprint> findByItemId(Long itemId);
}
