#4
# Use Python 3.8 as the base image
FROM python:3.8-slim-buster

# Install Dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

# Create a directory for the application and copy files into it
WORKDIR /app
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set ENTRYPOINT and CMD for running the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# fastapi/Dockerfile
# FROM python:3.9

# # Install dependencies
# RUN apt-get update && apt-get install -y \
#     wget \
#     --no-install-recommends \
#     chromium \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Set environment variables for Pyppeteer
# ENV PUPPETEER_HOME=/usr/local/share/puppeteer
# ENV PUPPETEER_SKIP_DOWNLOAD=true

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]



