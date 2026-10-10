package com.lostlink.service;

import com.lostlink.dto.MessageDTO;
import com.lostlink.entity.Item;
import com.lostlink.entity.Message;
import com.lostlink.entity.User;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.MessageRepository;
import com.lostlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public MessageDTO sendMessage(Long itemId, Long senderId, String content) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        Long receiverId = item.getUserId();
        if (receiverId.equals(senderId)) {
            throw new IllegalArgumentException("Cannot send message to yourself");
        }

        Message message = new Message(itemId, senderId, receiverId, content);
        Message saved = messageRepository.save(message);

        User sender = userRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "A Student";

        notificationService.createNotification(
                receiverId,
                "New Contact Request on " + item.getTitle(),
                senderName + " sent you a message: \"" + (content.length() > 40 ? content.substring(0, 40) + "..." : content) + "\"",
                "/items/" + itemId
        );

        return toDTO(saved);
    }

    public List<MessageDTO> getItemMessages(Long itemId) {
        return messageRepository.findByItemIdOrderByCreatedAtAsc(itemId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MessageDTO toDTO(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setItemId(m.getItemId());
        
        Item item = itemRepository.findById(m.getItemId()).orElse(null);
        dto.setItemTitle(item != null ? item.getTitle() : "Item #" + m.getItemId());

        dto.setSenderId(m.getSenderId());
        User sender = userRepository.findById(m.getSenderId()).orElse(null);
        dto.setSenderName(sender != null ? sender.getFullName() : "Student");

        dto.setReceiverId(m.getReceiverId());
        User receiver = userRepository.findById(m.getReceiverId()).orElse(null);
        dto.setReceiverName(receiver != null ? receiver.getFullName() : "Student");

        dto.setContent(m.getContent());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
