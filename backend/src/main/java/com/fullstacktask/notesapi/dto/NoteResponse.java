package com.fullstacktask.notesapi.dto;

public record NoteResponse(Long id, String title, String content, Long userId) {
}
