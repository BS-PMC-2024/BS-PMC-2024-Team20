// src/pages/TermsOfService.jsx
import React from 'react';
import './../styles/common.css';

const TermsOfService = () => {
  return (
    <div className="terms-of-service rtl">
      <h1>תנאי שימוש</h1>
      <section>
        <h2><i className="fas fa-info-circle"></i> ברוכים הבאים</h2>
        <p>ברוכים הבאים לדף תנאי השימוש שלנו. כאן תוכלו למצוא את הכללים והתקנות לשימוש באתר שלנו.</p>
      </section>
      <section>
        <h2><i className="fas fa-balance-scale"></i> תנאים כלליים</h2>
        <ul>
          <li>המשתמש מתחייב להשתמש באתר באחריות.</li>
          <li>המשתמש מתחייב לא להשתמש לרעה באתר או בשירותיו.</li>
          <li>כל המידע המסופק על ידי המשתמש חייב להיות מדויק.</li>
          <li>האתר לא יישא באחריות לכל שימוש לרעה בשירותיו על ידי המשתמש.</li>
          <li>המשתמש מתחייב לפעול בהתאם לכל החוקים והתקנות החלים.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-user-shield"></i> מדיניות פרטיות</h2>
        <ul>
          <li>המשתמש מתחייב לשמור על סודיות המידע האישי של משתמשים אחרים.</li>
          <li>האתר שומר לעצמו את הזכות לשנות את תנאי השימוש בכל עת ללא הודעה מוקדמת.</li>
          <li>המשתמש מתחייב לא לפרסם תוכן פוגע, משמיץ או מפר זכויות יוצרים.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-business-time"></i> שימוש מסחרי</h2>
        <ul>
          <li>המשתמש מתחייב לא להשתמש באתר לצרכים מסחריים ללא אישור מפורש מהנהלת האתר.</li>
          <li>המשתמש מתחייב לא לנסות לפרוץ לאתר או לבצע פעולות זדוניות.</li>
          <li>המשתמש מתחייב לא לשתף את פרטי ההתחברות שלו עם אחרים.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-shield-alt"></i> זכויות ואחריות</h2>
        <ul>
          <li>האתר שומר לעצמו את הזכות לחסום גישה למשתמשים המפרים את תנאי השימוש.</li>
          <li>האתר לא יישא באחריות לנזקים שנגרמו כתוצאה מהשימוש באתר.</li>
        </ul>
      </section>
    </div>
  );
};

export default TermsOfService;
