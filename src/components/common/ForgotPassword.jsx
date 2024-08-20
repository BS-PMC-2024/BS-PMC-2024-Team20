// ForgotPassword.js
import React, { useState } from 'react';
import { resetPassword } from '../../services/auth'; 
import Swal from 'sweetalert2';
import '../../styles/transitionPages.css';

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