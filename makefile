.PHONY: install clean-ports dev-backend dev-frontend dev

# Задаем порты, которые использует наш проект
BACKEND_PORT=3001
FRONTEND_PORT=5173

# Установка всех зависимостей (бэкенд и фронтенд)
install:
	@echo "Устанавливаем зависимости бэкенда..."
	cd backend && yarn install
	@echo "Устанавливаем зависимости фронтенда..."
	cd frontend && yarn install

i: install
# Кроссплатформенная очистка портов перед запуском
clean-ports:
	@echo "Очищаем порты $(BACKEND_PORT) (Backend) и $(FRONTEND_PORT) (Frontend)..."
	-npx --yes kill-port $(BACKEND_PORT) $(FRONTEND_PORT)

# Запуск только бэкенда (с предварительной очисткой порта)
dev-backend: clean-ports
	@echo "Запускаем Backend..."
	cd backend && node src/app/server.js

# Запуск только фронтенда (на порту 5173)
dev-frontend:
	@echo "Запускаем Frontend..."
	cd frontend && yarn run dev

# Главная команда: убивает зависшие процессы и запускает фронт и бэк параллельно
dev: clean-ports
	@echo "Запускаем Fullstack проект..."
	make -j2 _run-backend _run-frontend

# Внутренние таски для параллельного запуска без двойной очистки портов
_run-backend:
	cd backend && node src/app/server.js

_run-frontend:
	cd frontend && yarn run dev