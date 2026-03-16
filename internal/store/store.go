package store

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"os"
	"path/filepath"
	"sync"
	"time"

	"xnexus/internal/model"
)

var ErrNotFound = errors.New("not found")

type Store struct {
	mu        sync.RWMutex
	repos     map[string]model.Repository
	artifacts map[string]model.Artifact
	tasks     map[string]model.Task
	users     map[string]model.User
	blobRoot  string
}

func New(blobRoot string) (*Store, error) {
	if err := os.MkdirAll(blobRoot, 0o755); err != nil {
		return nil, err
	}
	return &Store{
		repos:     map[string]model.Repository{},
		artifacts: map[string]model.Artifact{},
		tasks:     map[string]model.Task{},
		users: map[string]model.User{
			"admin": {Username: "admin", Password: "admin", Role: "admin"},
		},
		blobRoot: blobRoot,
	}, nil
}

func (s *Store) Authenticate(username, password string) (model.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[username]
	if !ok || u.Password != password {
		return model.User{}, ErrNotFound
	}
	return u, nil
}

func (s *Store) CreateRepo(r model.Repository) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.repos[r.Name]; ok {
		return errors.New("repository exists")
	}
	r.CreatedAt = time.Now().UTC()
	s.repos[r.Name] = r
	return nil
}

func (s *Store) ListRepos() []model.Repository {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]model.Repository, 0, len(s.repos))
	for _, r := range s.repos {
		out = append(out, r)
	}
	return out
}

func (s *Store) GetRepo(name string) (model.Repository, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	r, ok := s.repos[name]
	if !ok {
		return model.Repository{}, ErrNotFound
	}
	return r, nil
}

func (s *Store) SaveArtifact(repo, path, format string, reader io.Reader) (model.Artifact, error) {
	if _, err := s.GetRepo(repo); err != nil {
		return model.Artifact{}, err
	}
	blobPath := filepath.Join(s.blobRoot, repo, filepath.Clean(path))
	if err := os.MkdirAll(filepath.Dir(blobPath), 0o755); err != nil {
		return model.Artifact{}, err
	}
	f, err := os.Create(blobPath)
	if err != nil {
		return model.Artifact{}, err
	}
	defer f.Close()

	h := sha256.New()
	w := io.MultiWriter(f, h)
	n, err := io.Copy(w, reader)
	if err != nil {
		return model.Artifact{}, err
	}
	a := model.Artifact{
		Repo:      repo,
		Path:      path,
		Format:    format,
		Size:      n,
		Checksum:  hex.EncodeToString(h.Sum(nil)),
		CreatedAt: time.Now().UTC(),
	}
	s.mu.Lock()
	s.artifacts[repo+":"+path] = a
	s.mu.Unlock()
	return a, nil
}

func (s *Store) OpenArtifact(repo, path string) (model.Artifact, *os.File, error) {
	s.mu.RLock()
	a, ok := s.artifacts[repo+":"+path]
	s.mu.RUnlock()
	if !ok {
		return model.Artifact{}, nil, ErrNotFound
	}
	blobPath := filepath.Join(s.blobRoot, repo, filepath.Clean(path))
	f, err := os.Open(blobPath)
	if err != nil {
		return model.Artifact{}, nil, err
	}
	return a, f, nil
}

func (s *Store) AddTask(t model.Task) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.tasks[t.ID] = t
}

func (s *Store) UpdateTask(t model.Task) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.tasks[t.ID] = t
}

func (s *Store) ListTasks() []model.Task {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]model.Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		out = append(out, t)
	}
	return out
}
