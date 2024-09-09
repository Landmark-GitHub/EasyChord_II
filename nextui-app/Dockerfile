# ใช้ Node.js เป็น base image เวอร์ชัน 18
FROM node:18-alpine

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json ไปยัง working directory
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# ติดตั้ง NextUI CLI แบบ global
RUN npm install -g nextui-cli

# คัดลอกไฟล์ทั้งหมดในโปรเจกต์ไปยัง working directory
COPY . .

# ตั้ง port ที่ container จะ expose
EXPOSE 3000

# คำสั่งเพื่อเริ่มแอปพลิเคชัน
CMD ["npm", "run", "dev"]

