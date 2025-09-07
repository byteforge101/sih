# 1. Start from an official, lightweight Python base image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Install system dependencies required by OpenCV using the modern package names
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy only the requirements file first to leverage Docker's build cache
COPY requirements.txt .

# 5. Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your application code into the container
COPY . .

# Copy model files into the container
COPY models/ ./models/

# 7. Declare the environment variable that the app needs.
ENV DATABASE_URL=""

# 8. Tell Docker that the container will listen on port 8000
EXPOSE 8000

# 9. The command to run when the container starts.
CMD ["gunicorn", "--timeout", "240", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "-b", "0.0.0.0:8000"]