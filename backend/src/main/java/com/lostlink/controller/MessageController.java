package com.lostlink.controller;

import com.lostlink.dto.MessageDTO;
import com.lostlink.security.UserPrincipal;
import com.lostlink.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body) {
        Long itemId = Long.parseLong(body.get("itemId").toString());
        String content = (String) body.get("content");
        return ResponseEntity.ok(messageService.sendMessage(itemId, userPrincipal.getId(), content));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<MessageDTO>> getItemMessages(@PathVariable Long itemId) {
        return ResponseEntity.ok(messageService.getItemMessages(itemId));
    }
}
