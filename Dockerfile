# שלב 1: שימוש בתמונה בסיסית של Node.js עם גרסה 18
FROM node:18

# שלב 2: התקנת Java
RUN apt-get update && apt-get install -y openjdk-17-jre-headless

# שלב 3: יצירת ספרייה לעבוד בה
WORKDIR /app

# שלב 4: העתקת קובץ package.json והתקנת התלויות
COPY package*.json ./
RUN npm install

# שלב 5: העתקת שאר קבצי האפליקציה
COPY . .

# שלב 6: בניית האפליקציה
RUN npm run build

# שלב 7: התקנת Firebase CLI
RUN npm install -g firebase-tools

# שלב 8: התקנת שרת סטטי serve
RUN npm install -g serve

# שלב 9: הפעלת האפליקציה בשרת סטטי
CMD ["serve", "-s", "build"]

# חשיפת הפורט 3000
EXPOSE 3000
