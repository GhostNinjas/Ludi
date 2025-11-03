# Multi-stage Dockerfile for Laravel application

# Builder stage
FROM php:8.3-fpm-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libzip-dev \
    zip \
    unzip \
    mysql-client \
    postgresql-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    zip \
    opcache \
    pcntl \
    bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Development stage
FROM php:8.3-fpm-alpine AS development

# Install runtime dependencies and build dependencies for pecl
RUN apk add --no-cache \
    bash \
    mysql-client \
    postgresql-dev \
    libzip-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    zip \
    opcache \
    pcntl \
    bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# PHP configuration for development
RUN echo "opcache.enable=0" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "display_errors=On" >> /usr/local/etc/php/conf.d/error-reporting.ini && \
    echo "error_reporting=E_ALL" >> /usr/local/etc/php/conf.d/error-reporting.ini && \
    echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo "upload_max_filesize=20M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000

CMD ["php-fpm"]

# Production stage
FROM php:8.3-fpm-alpine AS production

# Install runtime dependencies and build dependencies for pecl
RUN apk add --no-cache \
    bash \
    mysql-client \
    libzip-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    zip \
    opcache \
    pcntl \
    bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# PHP configuration for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "display_errors=Off" >> /usr/local/etc/php/conf.d/error-reporting.ini && \
    echo "log_errors=On" >> /usr/local/etc/php/conf.d/error-reporting.ini && \
    echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo "upload_max_filesize=20M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html

# Copy optimized files from builder
COPY --from=builder --chown=www-data:www-data /var/www/html /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
