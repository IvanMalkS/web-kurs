FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY pyproject.toml uv.lock* ./

RUN uv sync --frozen --no-install-project

COPY main.py ./

CMD ["uv", "run", "main.py"]