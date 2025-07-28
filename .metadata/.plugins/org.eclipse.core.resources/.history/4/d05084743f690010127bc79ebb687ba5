package com.example.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.backend.entity.Message;
import com.example.backend.requestmodels.AdminQuestionRequest;
import com.example.backend.service.MessagesService;
import com.example.backend.utils.ExtractJWT;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/messages")
public class MessagesController {

    private final MessagesService messagesService; 

    @Autowired
    public MessagesController(MessagesService messagesService) { 
        this.messagesService = messagesService;
    }

    @GetMapping("/secure/search/findByClosed")
    public Page<Message> getMessagesByClosed(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam boolean closed,
            Pageable pageable) throws Exception {

        String userType = ExtractJWT.payLoadJWTExtraction(token, "userType");

        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Only admins can access this endpoint.");
        }

        return messagesService.getMessagesByClosed(closed, pageable);
    }

    @PostMapping("/secure/add/message")
    public void postMessage(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        messagesService.postMessage(messageRequest, userEmail);
    }
    
    @PutMapping("/secure/admin/message") 
    public void putMessage(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {

        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        String admin = ExtractJWT.payLoadJWTExtraction(token, "userType");

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only.");
        }

        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}

