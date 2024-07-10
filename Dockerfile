# שלב 1: שימוש בתמונה בסיסית של Node.js
FROM node:14

# שלב 2: יצירת ספרייה לעבוד בה
WORKDIR /app

# שלב 3: העתקת קובץ package.json והתקנת התלויות
COPY package*.json ./
RUN npm install

# שלב 4: העתקת שאר קבצי האפליקציה
COPY . .

# שלב 5: בניית האפליקציה
RUN npm run build

# שלב 6: הפעלת האפליקציה בשרת סטטי
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# חשיפת הפורט 3000
EXPOSE 3000
