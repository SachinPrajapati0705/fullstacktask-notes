package com.fullstacktask.notesapi.controller;

import com.fullstacktask.notesapi.dto.CreateNoteRequest;
import com.fullstacktask.notesapi.dto.NoteResponse;
import com.fullstacktask.notesapi.dto.UpdateNoteRequest;
import com.fullstacktask.notesapi.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteResponse> getAllNotes(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return noteService.getNotesByUserId(userId);
        }
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public NoteResponse getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id);
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody CreateNoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(request));
    }

    @PutMapping("/{id}")
    public NoteResponse updateNote(@PathVariable Long id, @RequestParam Long userId, @Valid @RequestBody UpdateNoteRequest request) {
        return noteService.updateNote(id, userId, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNote(@PathVariable Long id, @RequestParam Long userId) {
        noteService.deleteNote(id, userId);
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully"));
    }
}
