package format

import (
	"fmt"
	"strings"
)

type Adapter interface {
	Name() string
	ValidatePath(path string) error
}

type basicAdapter struct{ name string }

func (a basicAdapter) Name() string { return a.name }

func (a basicAdapter) ValidatePath(path string) error {
	if path == "" || strings.Contains(path, "..") {
		return fmt.Errorf("invalid artifact path")
	}
	return nil
}

func Registry() map[string]Adapter {
	return map[string]Adapter{
		"docker":  basicAdapter{name: "docker"},
		"helm":    basicAdapter{name: "helm"},
		"maven":   basicAdapter{name: "maven"},
		"generic": basicAdapter{name: "generic"},
	}
}
