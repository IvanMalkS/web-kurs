FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    bash \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    mysql-client

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    intl \
    mbstring \
    zip

WORKDIR /var/www/html