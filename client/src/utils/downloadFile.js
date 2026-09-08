import api from '../services/api';
import Swal from 'sweetalert2';

export const downloadFile = async (url, filename) => {
  try {
    Swal.fire({ title: 'Generating File...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    // Fetch the file as a Blob (binary data)
    const res = await api.get(url, { responseType: 'blob' });
    
    // Create a temporary link element to trigger the download
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(link.href);
    Swal.close();
  } catch (err) {
    Swal.fire('Error', 'Failed to download file.', 'error');
    console.error(err);
  }
};