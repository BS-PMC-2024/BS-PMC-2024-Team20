# Dockerfile

# שלב הבסיס - משתמש בתמונת node
FROM node:14

# מגדיר את ספריית העבודה
WORKDIR /app

# מעתיק את package.json ו-package-lock.json
COPY package*.json ./

# מתקין את התלויות
RUN npm install

# מעתיק את שאר הקבצים
COPY . .

# בונה את הפרויקט
RUN npm run build

# פותח את הפורט שבו האפליקציה תרוץ
EXPOSE 3000

# פקודת הריצה של האפליקציה
CMD ["npm", "start"]
