package service

import (
	"fmt"
	"time"

	"xnexus/internal/model"
	"xnexus/internal/store"
)

type TaskService struct {
	store *store.Store
}

func NewTaskService(s *store.Store) *TaskService { return &TaskService{store: s} }

func (t *TaskService) Trigger(taskType, repo string) model.Task {
	now := time.Now().UTC()
	task := model.Task{
		ID:        fmt.Sprintf("task-%d", now.UnixNano()),
		Type:      taskType,
		Repo:      repo,
		Status:    model.TaskPending,
		CreatedAt: now,
		UpdatedAt: now,
	}
	t.store.AddTask(task)
	go t.run(task)
	return task
}

func (t *TaskService) run(task model.Task) {
	task.Status = model.TaskRunning
	task.UpdatedAt = time.Now().UTC()
	t.store.UpdateTask(task)
	time.Sleep(50 * time.Millisecond)
	task.Status = model.TaskSuccess
	task.Message = "completed"
	task.UpdatedAt = time.Now().UTC()
	t.store.UpdateTask(task)
}
