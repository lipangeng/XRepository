package api

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"xnexus/internal/auth"
	"xnexus/internal/format"
	"xnexus/internal/model"
	"xnexus/internal/service"
	"xnexus/internal/store"
)

type Server struct {
	mux      *http.ServeMux
	store    *store.Store
	auth     *auth.Service
	tasks    *service.TaskService
	adapters map[string]format.Adapter
}

func New(st *store.Store, au *auth.Service) *Server {
	s := &Server{
		mux:      http.NewServeMux(),
		store:    st,
		auth:     au,
		tasks:    service.NewTaskService(st),
		adapters: format.Registry(),
	}
	s.routes()
	return s
}

func (s *Server) Handler() http.Handler { return s.mux }

func (s *Server) routes() {
	s.mux.HandleFunc("GET /healthz", s.health)
	s.mux.HandleFunc("POST /api/auth/login", s.login)
	s.mux.HandleFunc("/api/repos", s.withAuth(s.repos))
	s.mux.HandleFunc("/api/repos/", s.withAuth(s.repoArtifacts))
	s.mux.HandleFunc("POST /api/tasks/trigger", s.withAuth(s.triggerTask))
	s.mux.HandleFunc("GET /api/tasks", s.withAuth(s.listTasks))
}

func (s *Server) withAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h := r.Header.Get("Authorization")
		if !strings.HasPrefix(h, "Bearer ") {
			http.Error(w, "missing bearer token", http.StatusUnauthorized)
			return
		}
		if _, err := s.auth.Verify(strings.TrimPrefix(h, "Bearer ")); err != nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) }

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	u, err := s.store.Authenticate(req.Username, req.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := s.auth.Sign(u.Username, u.Role, 8*time.Hour)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"token": token})
}

func (s *Server) repos(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListRepos())
	case http.MethodPost:
		var req model.Repository
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if req.Name == "" || req.Format == "" {
			http.Error(w, "name/format required", http.StatusBadRequest)
			return
		}
		if _, ok := s.adapters[req.Format]; !ok {
			http.Error(w, "unsupported format", http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = model.RepoHosted
		}
		if err := s.store.CreateRepo(req); err != nil {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		writeJSON(w, http.StatusCreated, req)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (s *Server) repoArtifacts(w http.ResponseWriter, r *http.Request) {
	trimmed := strings.TrimPrefix(r.URL.Path, "/api/repos/")
	parts := strings.SplitN(trimmed, "/artifacts/", 2)
	if len(parts) != 2 {
		http.NotFound(w, r)
		return
	}
	repo := parts[0]
	path := parts[1]
	if repo == "" || path == "" {
		http.Error(w, "repo/path required", http.StatusBadRequest)
		return
	}

	repoInfo, err := s.store.GetRepo(repo)
	if err != nil {
		http.Error(w, "repo not found", http.StatusNotFound)
		return
	}
	adapter := s.adapters[repoInfo.Format]
	if err := adapter.ValidatePath(path); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		art, err := s.store.SaveArtifact(repo, path, repoInfo.Format, r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusCreated, art)
	case http.MethodGet:
		art, f, err := s.store.OpenArtifact(repo, path)
		if err != nil {
			if errors.Is(err, store.ErrNotFound) {
				http.Error(w, "artifact not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer f.Close()
		w.Header().Set("Content-Length", strconv.FormatInt(art.Size, 10))
		w.Header().Set("X-Checksum-Sha256", art.Checksum)
		if _, err := io.Copy(w, f); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (s *Server) triggerTask(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Type string `json:"type"`
		Repo string `json:"repo"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if req.Type == "" {
		http.Error(w, "task type required", http.StatusBadRequest)
		return
	}
	if req.Repo != "" {
		if _, err := s.store.GetRepo(req.Repo); err != nil {
			http.Error(w, "repo not found", http.StatusNotFound)
			return
		}
	}
	writeJSON(w, http.StatusAccepted, s.tasks.Trigger(req.Type, req.Repo))
}

func (s *Server) listTasks(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, s.store.ListTasks())
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
