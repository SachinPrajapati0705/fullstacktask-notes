package com.fullstacktask.notesapi.service;

import com.fullstacktask.notesapi.dto.CreateNoteRequest;
import com.fullstacktask.notesapi.dto.NoteResponse;
import com.fullstacktask.notesapi.dto.UpdateNoteRequest;
import com.fullstacktask.notesapi.exception.ForbiddenException;
import com.fullstacktask.notesapi.exception.NotFoundException;
import com.fullstacktask.notesapi.model.Note;
import com.fullstacktask.notesapi.model.User;
import com.fullstacktask.notesapi.repository.NoteRepository;
import com.fullstacktask.notesapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<NoteResponse> getAllNotes() {
        return noteRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<NoteResponse> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public NoteResponse getNoteById(Long id) {
        return toResponse(getNoteEntityById(id));
    }

    private Note getNoteEntityById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Note not found with id " + id));
    }

    public NoteResponse createNote(CreateNoteRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found with id " + request.userId()));

        Note note = new Note();
        note.setTitle(request.title().trim());
        note.setContent(request.content().trim());
        note.setUser(user);
        return toResponse(noteRepository.save(note));
    }

    public NoteResponse updateNote(Long id, Long requesterUserId, UpdateNoteRequest request) {
        Note note = getNoteEntityById(id);
        if (!note.getUser().getId().equals(requesterUserId)) {
            throw new ForbiddenException("You cannot edit another user's note");
        }
        note.setTitle(request.title().trim());
        note.setContent(request.content().trim());
        return toResponse(noteRepository.save(note));
    }

    public void deleteNote(Long id, Long requesterUserId) {
        Note note = getNoteEntityById(id);
        if (!note.getUser().getId().equals(requesterUserId)) {
            throw new ForbiddenException("You cannot delete another user's note");
        }
        noteRepository.delete(note);
    }

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(note.getId(), note.getTitle(), note.getContent(), note.getUser().getId());
    }
}
