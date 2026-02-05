FROM python:3.12-slim

# Копируем uv из официального образа
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Переменные окружения для uv
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1

# Сначала копируем только файлы зависимостей для кеширования
COPY pyproject.toml uv.lock* ./

# Синхронизируем зависимости
RUN uv sync --frozen --no-install-project

# Копируем исходный код
COPY main.py ./

# Запуск парсера
CMD ["uv", "run", "main.py"]