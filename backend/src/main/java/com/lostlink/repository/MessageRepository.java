package com.lostlink.repository;

import com.lostlink.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByItemIdOrderByCreatedAtAsc(Long itemId);

    @Query("SELECT m FROM Message m WHERE m.itemId = :itemId AND ((m.senderId = :user1 AND m.receiverId = :user2) OR (m.senderId = :user2 AND m.receiverId = :user1)) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("itemId") Long itemId, @Param("user1") Long user1, @Param("user2") Long user2);

    List<Message> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
}
