import React from 'react';
import '../styles/common.css';
/*Creating a main home page BSPMS2420-9*/  
const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to AI-AID</h1>
      <p className="homepage-intro">AI-AID הוא פרויקט שנוצר על ידי צוות מומחים בטכנולוגיה וחינוך שמטרתו לסייע לתלמידים עם קשיים בלמידה בעזרת כלי בינה מלאכותית מתקדמים.</p>
      <p className="homepage-mission">הפרויקט שלנו מציע פתרונות מותאמים אישית, טיפים ללמידה, וניהול זמן באמצעות ממשק ידידותי למשתמש.</p>
      <p className="homepage-goal">מטרתנו היא לספק תמיכה ולסייע לתלמידים להצליח בלימודים בעזרת טכנולוגיות מתקדמות.</p>
      <div className="homepage-features">
        <h2>Features</h2>
        <ul>
          <li>פתרונות מותאמים אישית</li>
          <li>טיפים ללמידה</li>
          <li>ניהול זמן</li>
          <li>ממשק ידידותי למשתמש</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
