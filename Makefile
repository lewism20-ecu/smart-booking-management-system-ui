SHELL := /bin/bash

LOCAL_API_ORIGIN ?= http://localhost:8080
HOSTED_API_BASE_URL ?=

.PHONY: help dev dev-local dev-hosted dev-mock check clean

help:
	@echo "SBMS UI Make targets"
	@echo "  make dev          - run Vite in mock mode (default for UI-first testing)"
	@echo "  make dev-mock     - run dev server with mock auth mode (MSW)"
	@echo "  make dev-local    - run Vite against locally hosted API via dev proxy"
	@echo "  make dev-hosted   - run Vite against hosted API (can be backed by Cloud SQL)"
	@echo "  make check        - run lint + test + build"
	@echo "  make clean        - remove dist folder"

dev:
	@$(MAKE) dev-mock

dev-local:
	VITE_AUTH_MODE=api VITE_ENABLE_MOCK_WORKER=false VITE_API_BASE_URL=/api/v1 VITE_DEV_PROXY_TARGET=$(LOCAL_API_ORIGIN) npm run dev

dev-hosted:
	@if [ -z "$(HOSTED_API_BASE_URL)" ]; then \
		echo "HOSTED_API_BASE_URL is required."; \
		echo "Example: make dev-hosted HOSTED_API_BASE_URL=https://your-api.example.com/api/v1"; \
		exit 1; \
	fi
	VITE_AUTH_MODE=api VITE_ENABLE_MOCK_WORKER=false VITE_API_BASE_URL=$(HOSTED_API_BASE_URL) npm run dev

dev-mock:
	VITE_AUTH_MODE=mock VITE_ENABLE_MOCK_WORKER=true npm run dev

check:
	npm run lint
	npm run test
	npm run build

clean:
	rm -rf dist
