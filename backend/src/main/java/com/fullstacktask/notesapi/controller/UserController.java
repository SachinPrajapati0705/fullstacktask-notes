package com.fullstacktask.notesapi.controller;

import com.fullstacktask.notesapi.dto.NoteResponse;
import com.fullstacktask.notesapi.dto.UserResponse;
import com.fullstacktask.notesapi.service.NoteService;
import com.fullstacktask.notesapi.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class UserController {

    private final UserService userService;
    private final NoteService noteService;

    public UserController(UserService userService, NoteService noteService) {
        this.userService = userService;
        this.noteService = noteService;
    }

    @GetMapping
    public List<UserResponse> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/{id}/notes")
    public List<NoteResponse> getUserNotes(@PathVariable Long id) {
        userService.getUserById(id);
        return noteService.getNotesByUserId(id);
    }
}
