package model

import "time"

type RepositoryType string

const (
	RepoHosted RepositoryType = "hosted"
	RepoProxy  RepositoryType = "proxy"
	RepoGroup  RepositoryType = "group"
)

type Repository struct {
	Name      string         `json:"name"`
	Type      RepositoryType `json:"type"`
	Format    string         `json:"format"`
	CreatedAt time.Time      `json:"createdAt"`
}

type Artifact struct {
	Repo      string    `json:"repo"`
	Path      string    `json:"path"`
	Format    string    `json:"format"`
	Size      int64     `json:"size"`
	Checksum  string    `json:"checksum"`
	CreatedAt time.Time `json:"createdAt"`
}

type User struct {
	Username string
	Password string
	Role     string
}

type TaskStatus string

const (
	TaskPending TaskStatus = "pending"
	TaskRunning TaskStatus = "running"
	TaskSuccess TaskStatus = "success"
	TaskFailed  TaskStatus = "failed"
)

type Task struct {
	ID        string     `json:"id"`
	Type      string     `json:"type"`
	Repo      string     `json:"repo,omitempty"`
	Status    TaskStatus `json:"status"`
	Message   string     `json:"message,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}
