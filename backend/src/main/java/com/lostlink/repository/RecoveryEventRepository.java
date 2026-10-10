package com.lostlink.repository;

import com.lostlink.entity.RecoveryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecoveryEventRepository extends JpaRepository<RecoveryEvent, Long> {
    List<RecoveryEvent> findByItemIdOrderByCreatedAtAsc(Long itemId);
}
