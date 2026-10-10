package com.lostlink.service;

import com.lostlink.dto.NotificationDTO;
import com.lostlink.entity.Notification;
import com.lostlink.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(Long userId, String title, String message, String link) {
        Notification notification = new Notification(userId, title, message, link);
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null && notification.getUserId().equals(userId)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setUserId(n.getUserId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setLink(n.getLink());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
