package main

import (
	"log"
	"net/http"
	"os"

	"xnexus/internal/api"
	"xnexus/internal/auth"
	"xnexus/internal/store"
)

func main() {
	addr := getenv("XNEXUS_ADDR", ":8080")
	blobRoot := getenv("XNEXUS_BLOB_ROOT", "./data/blobs")
	secret := getenv("XNEXUS_AUTH_SECRET", "dev-secret")

	st, err := store.New(blobRoot)
	if err != nil {
		log.Fatalf("init store: %v", err)
	}
	srv := api.New(st, auth.New(secret))

	log.Printf("xnexus mvp server listening on %s", addr)
	if err := http.ListenAndServe(addr, srv.Handler()); err != nil {
		log.Fatal(err)
	}
}

func getenv(key, dft string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return dft
}
