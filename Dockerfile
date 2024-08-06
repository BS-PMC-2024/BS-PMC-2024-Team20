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

# התקנת Firebase CLI
RUN npm install -g firebase-tools

# שינוי הרשאות התיקייה server
RUN mkdir -p /app/server && chown -R node:node /app/server

# שלב 6: הפעלת האפליקציה בשרת סטטי
RUN npm install -g serve

# הפעלת היישום כמשתמש לא-רוט
USER node

# הצהרת הפקודה לשם הרצת היישום
CMD ["serve", "-s", "build"]

# חשיפת הפורט 3000
EXPOSE 3000
