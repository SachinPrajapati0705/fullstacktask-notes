const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch (err) {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getNotes(userId) {
  if (userId) {
    return request(`/notes?userId=${userId}`);
  }
  return request("/notes");
}

export function createNote(payload) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateNote(id, userId, payload) {
  return request(`/notes/${id}?userId=${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteNote(id, userId) {
  return request(`/notes/${id}?userId=${userId}`, {
    method: "DELETE"
  });
}

export function getUsers() {
  return request("/users");
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
