package com.fullstacktask.notesapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateNoteRequest(
        @NotBlank(message = "Title is required")
        String title,
        @NotBlank(message = "Content is required")
        @Size(max = 1000, message = "Content must be at most 1000 characters")
        String content,
        @NotNull(message = "User id is required")
        @Positive(message = "User id must be positive")
        Long userId
) {
}
