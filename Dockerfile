# Stage 1: Build Stage
FROM php:8.2-fpm-alpine as build

RUN apk add --no-cache \
	bash \
	curl \
	libpng-dev \
	libzip-dev \
	zlib-dev \
	icu-dev

# Added bcmath here
RUN docker-php-ext-install pdo_mysql gd zip intl bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# ---

# Stage 2: Runtime Stage
FROM php:8.2-fpm-alpine

# Install runtime libraries
RUN apk add --no-cache libpng libzip icu

# Install extensions (must match build stage for compatibility)
RUN docker-php-ext-install pdo_mysql gd zip intl bcmath

WORKDIR /var/www

# Copy everything from build stage
COPY --from=build /var/www /var/www

# Fix: Added bootstrap/cache to the permissions list
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]