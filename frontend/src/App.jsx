import { useEffect, useRef, useState } from "react";
import { createNote, deleteNote, getNotes, login, register, updateNote } from "./api";

const initialFormState = { title: "", content: "" };
const initialLoginForm = { email: "", password: "" };
const initialRegisterForm = { name: "", email: "", password: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState("");
  const titleInputRef = useRef(null);
  const noteCount = notes.length;
  const noteLabel = noteCount === 1 ? "note" : "notes";

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setError("");
      setNotes([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNotes(userId = currentUser?.id) {
    if (!userId) {
      setNotes([]);
      return;
    }
    try {
      setError("");
      const data = await getNotes(userId);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError("Email and password are required.");
      return;
    }
    try {
      setIsLoggingIn(true);
      setError("");
      const response = await login({
        email: loginForm.email.trim(),
        password: loginForm.password
      });
      setCurrentUser(response.user);
      setLoginForm(initialLoginForm);
      setAuthMode("dashboard");
      await loadNotes(response.user.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (!currentUser) {
      setError("Please login before creating or updating notes.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        userId: currentUser.id
      };

      if (editingNoteId) {
        const editingNote = notes.find((n) => n.id === editingNoteId);
        if (!editingNote || editingNote.userId !== currentUser.id) {
          setError("You cannot edit another user's note.");
          setIsSubmitting(false);
          return;
        }

        await updateNote(editingNoteId, currentUser.id, {
          title: payload.title,
          content: payload.content
        });
      } else {
        await createNote(payload);
      }

      setForm(initialFormState);
      setEditingNoteId(null);
      await loadNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password.trim()) {
      setError("Name, email and password are required.");
      return;
    }
    try {
      setIsRegistering(true);
      setError("");
      const response = await register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password
      });
      setCurrentUser(response.user);
      setAuthMode("dashboard");
      setRegisterForm(initialRegisterForm);
      await loadNotes(response.user.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  }

  function startEdit(note) {
    if (!currentUser || currentUser.id !== note.userId) {
      setError("You cannot edit another user's note.");
      return;
    }
    setForm({ title: note.title, content: note.content });
    setEditingNoteId(note.id);
    setError("");
  }

  function cancelEdit() {
    setForm(initialFormState);
    setEditingNoteId(null);
    setError("");
  }

  async function handleDelete(noteId, noteOwnerId) {
    if (!currentUser) {
      setError("Please login first.");
      return;
    }
    if (currentUser.id !== noteOwnerId) {
      setError("You cannot delete another user's note.");
      return;
    }

    const shouldDelete = window.confirm("Are you sure you want to delete this note?");
    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      await deleteNote(noteId, currentUser.id);
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  }

  function getNoteColorClass(noteId) {
    const classes = ["note-yellow", "note-green", "note-blue", "note-pink", "note-orange"];
    return classes[noteId % classes.length];
  }

  function logout() {
    setCurrentUser(null);
    setNotes([]);
    setEditingNoteId(null);
    setForm(initialFormState);
    setAuthMode("login");
    setIsDrawerOpen(false);
    setError("");
  }

  function focusComposer() {
    setIsDrawerOpen(false);
    titleInputRef.current?.focus();
  }

  return (
    <main className="app">
      <header className="navbar">
        <div className="navbar-left">
          {authMode === "dashboard" && (
            <button type="button" className="ghost nav-menu-btn" onClick={() => setIsDrawerOpen(true)}>
              Menu
            </button>
          )}
          <div>
            <h1>Keep Notes</h1>
            <p>Your ideas, organized simply.</p>
          </div>
        </div>
        {currentUser && (
          <div className="navbar-meta">
            <p className="navbar-user">
              {currentUser.name} ({currentUser.email})
            </p>
            <span className="notes-count-pill">
              My Notes: {noteCount} {noteLabel}
            </span>
          </div>
        )}
      </header>

      {authMode === "dashboard" && (
        <>
          <aside className={`drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header">
              <h2>Navigation</h2>
              <button type="button" className="ghost" onClick={() => setIsDrawerOpen(false)}>
                Close
              </button>
            </div>
            <button type="button" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>
              My Notes ({noteCount})
            </button>
            <button type="button" className="drawer-link" onClick={focusComposer}>
              New Note
            </button>
            <button type="button" className="drawer-link danger-text" onClick={logout}>
              Logout
            </button>
          </aside>
          {isDrawerOpen && <button type="button" className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />}
        </>
      )}

      {authMode !== "dashboard" ? (
        <section className="auth-single">
          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="card note-form auth-card">
              <h3>Sign In</h3>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
              />
              <div className="actions">
                <button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
              </div>
              <p className="auth-switch">
                New user?{" "}
                <button type="button" className="link-btn" onClick={() => setAuthMode("register")}>
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="card note-form auth-card">
              <h3>Create Account</h3>
              <input
                type="text"
                placeholder="Name"
                value={registerForm.name}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                type="email"
                placeholder="New account email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                type="password"
                placeholder="New account password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
              />
              <div className="actions">
                <button type="submit" disabled={isRegistering}>
                  {isRegistering ? "Creating..." : "Create"}
                </button>
              </div>
              <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" className="link-btn" onClick={() => setAuthMode("login")}>
                  Back to login
                </button>
              </p>
            </form>
          )}
          {error && <p className="error auth-error">{error}</p>}
        </section>
      ) : (
        <>
          <section className="card composer">
            {currentUser && (
              <div className="dashboard-user">
                <p className="logged-in">
                  Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
                </p>
                <button type="button" className="ghost" onClick={logout}>
                  Logout
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="note-form">
              <input
                ref={titleInputRef}
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
              <textarea
                placeholder="Take a note..."
                value={form.content}
                onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                rows={4}
              />
              <div className="actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingNoteId ? "Update Note" : "Add Note"}
                </button>
                {editingNoteId && (
                  <button type="button" className="ghost" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {error && <p className="error">{error}</p>}
          </section>

          <section className="notes-section">
            <h2>
              My Notes ({noteCount})
            </h2>
            {isLoading ? (
              <p>Loading notes...</p>
            ) : notes.length === 0 ? (
              <p>No notes found. Create your first note.</p>
            ) : (
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id} className={`note-item ${getNoteColorClass(note.id)}`}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <div className="actions">
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => startEdit(note)}
                        disabled={!currentUser || currentUser.id !== note.userId}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(note.id, note.userId)}
                        disabled={!currentUser || currentUser.id !== note.userId}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
