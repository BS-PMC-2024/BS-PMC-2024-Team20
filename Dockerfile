# שלב 1: שימוש בתמונה בסיסית של Node.js עם גרסה 18
FROM node:18

# שלב 2: יצירת ספרייה לעבוד בה
WORKDIR /app

# שלב 3: העתקת קובץ package.json והתקנת התלויות
COPY package*.json ./
RUN npm install

# שלב 4: העתקת שאר קבצי האפליקציה
COPY . .

# שלב 5: בניית האפליקציה
RUN npm run build

# שלב 6: התקנת Firebase CLI
RUN npm install -g firebase-tools

# שלב 7: התקנת שרת סטטי serve
RUN npm install -g serve

# שלב 8: הפעלת האפליקציה בשרת סטטי
CMD ["serve", "-s", "build"]

# חשיפת הפורט 3000
EXPOSE 3000
