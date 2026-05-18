import { apiRequest } from './client';

export function fetchNotes(token) {
  return apiRequest('/notes/getAll', { token });
}

export function fetchSingleNote(token, id) {
  return apiRequest(`/notes/singleNote/${id}`, { token });
}

export function createNote(token, payload) {
  return apiRequest('/notes/create', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function updateNote(token, id, payload) {
  return apiRequest(`/notes/update/${id}`, {
    method: 'PUT',
    token,
    body: payload,
  });
}

export function deleteNote(token, id) {
  return apiRequest(`/notes/delete/${id}`, {
    method: 'DELETE',
    token,
  });
}
