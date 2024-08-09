// ForgotPassword.js
import React, { useState } from 'react';
import { resetPassword } from '../../services/auth'; 
import Swal from 'sweetalert2';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     try {
//       await resetPassword(email);
//       setMessage('Password reset email sent! Check your inbox.');
//     } catch (error) {
//       setError('Failed to send password reset email. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Forgot Password</h2>
//       <form onSubmit={handleForgotPassword}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           required
//         />
//         <button type="submit">Send Password Reset Email</button>
//       </form>
//       {message && <p>{message}</p>}
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;

export const ForgotPassword = () => {
    const handleResetPassword = async (email) => {
      try {
        await resetPassword(email);
        Swal.fire({
          title: 'Success!',
          text: 'Password reset email sent!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal-button'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `Failed to send password reset email: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal-button'
          }
        });
      }
    };
  
    Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Email',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Email',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal-button',
        cancelButton: 'swal-button'
      },
      preConfirm: (email) => {
        handleResetPassword(email);
      }
    });
  
    return null;
  };