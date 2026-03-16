package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
	"time"

	"xnexus/internal/auth"
	"xnexus/internal/store"
)

func newTestServer(t *testing.T) *Server {
	t.Helper()
	st, err := store.New(filepath.Join(t.TempDir(), "blobs"))
	if err != nil {
		t.Fatal(err)
	}
	return New(st, auth.New("test-secret"))
}

func loginToken(t *testing.T, h http.Handler) string {
	t.Helper()
	body := bytes.NewBufferString(`{"username":"admin","password":"admin"}`)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/auth/login", body))
	if rec.Code != http.StatusOK {
		t.Fatalf("login failed: %d %s", rec.Code, rec.Body.String())
	}
	var resp map[string]string
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatal(err)
	}
	return resp["token"]
}

func reqWithToken(method, url, token string, body io.Reader) *http.Request {
	r := httptest.NewRequest(method, url, body)
	r.Header.Set("Authorization", "Bearer "+token)
	return r
}

func TestRepoAndArtifactFlow(t *testing.T) {
	s := newTestServer(t)
	token := loginToken(t, s.Handler())

	// create repo
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodPost, "/api/repos", token, bytes.NewBufferString(`{"name":"docker-local","type":"hosted","format":"docker"}`)))
	if rec.Code != http.StatusCreated {
		t.Fatalf("create repo code=%d body=%s", rec.Code, rec.Body.String())
	}

	// upload artifact
	rec = httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodPost, "/api/repos/docker-local/artifacts/library/nginx/latest", token, bytes.NewBufferString("payload")))
	if rec.Code != http.StatusCreated {
		t.Fatalf("upload code=%d body=%s", rec.Code, rec.Body.String())
	}

	// download artifact
	rec = httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodGet, "/api/repos/docker-local/artifacts/library/nginx/latest", token, nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("download code=%d body=%s", rec.Code, rec.Body.String())
	}
	if rec.Body.String() != "payload" {
		t.Fatalf("unexpected payload: %s", rec.Body.String())
	}
}

func TestTaskTrigger(t *testing.T) {
	s := newTestServer(t)
	token := loginToken(t, s.Handler())

	// create repo to bind task
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodPost, "/api/repos", token, bytes.NewBufferString(`{"name":"helm-proxy","type":"proxy","format":"helm"}`)))
	if rec.Code != http.StatusCreated {
		t.Fatalf("create repo code=%d body=%s", rec.Code, rec.Body.String())
	}

	// trigger task
	rec = httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodPost, "/api/tasks/trigger", token, bytes.NewBufferString(`{"type":"sync","repo":"helm-proxy"}`)))
	if rec.Code != http.StatusAccepted {
		t.Fatalf("trigger code=%d body=%s", rec.Code, rec.Body.String())
	}

	time.Sleep(80 * time.Millisecond)
	rec = httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, reqWithToken(http.MethodGet, "/api/tasks", token, nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("list tasks code=%d", rec.Code)
	}
	if !bytes.Contains(rec.Body.Bytes(), []byte("success")) {
		t.Fatalf("expected task success body=%s", rec.Body.String())
	}
}
