import Swal from 'sweetalert2';

const baseOptions = {
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#6b7280',
  background: '#ffffff',
  color: '#111827',
  customClass: {
    popup: 'rounded-xl',
    confirmButton: 'rounded-lg',
    cancelButton: 'rounded-lg'
  }
};

export const showSuccess = (message) => Swal.fire({
  ...baseOptions,
  icon: 'success',
  title: 'Success',
  text: message,
  timer: 2000,
  showConfirmButton: false
});

export const showError = (message) => Swal.fire({
  ...baseOptions,
  icon: 'error',
  title: 'Oops...',
  text: message
});

export const showInfo = (title, text) => Swal.fire({
  ...baseOptions,
  icon: 'info',
  title,
  text,
  confirmButtonText: 'Got it'
});

export const showConfirm = (title, text) => Swal.fire({
  ...baseOptions,
  icon: 'warning',
  title,
  text,
  showCancelButton: true,
  confirmButtonText: 'Yes',
  cancelButtonText: 'No'
});