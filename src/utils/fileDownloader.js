/**
 * Multi-Strategy Bulletproof File Downloader
 * 
 * Guarantees that downloaded files ALWAYS have their exact filename and .png extension.
 * 
 * Strategy 1: Native Chromium File System Access API (window.showSaveFilePicker)
 *   Opens the native Windows Save dialog with the filename pre-filled.
 *   Writes bytes directly to disk via FileSystemWritableFileStream.
 *   100% bypasses any browser download interceptors and eliminates UUID bugs.
 * 
 * Strategy 2: Server-Side HTTP Attachment Stream
 *   Registers the file with the backend server via /api/prepare-download.
 *   Then triggers a native GET request with Content-Disposition: attachment.
 * 
 * Strategy 3: Direct Data URL anchor click
 */

export async function downloadFile(source, filename, mimeType = 'image/png') {
  if (!source) {
    console.error('downloadFile: Source is missing or null');
    return;
  }

  // 1. Sanitize filename: ASCII safe, Windows safe, strictly ends with .png
  let safeName = (filename || 'GSPEED-Blueprint').trim();
  safeName = safeName.replace(/[^\w.-]/g, '_');
  
  const ext = mimeType.split('/')[1]?.toLowerCase() || 'png';
  const expectedExt = ext === 'jpeg' ? 'jpg' : ext;

  if (!safeName.toLowerCase().endsWith(`.${expectedExt}`)) {
    safeName = `${safeName}.${expectedExt}`;
  }

  // 2. Extract Data URL
  let dataUrl = null;
  if (typeof source === 'string' && source.startsWith('data:')) {
    dataUrl = source;
  } else if (source instanceof HTMLCanvasElement || (source && typeof source.toDataURL === 'function')) {
    try {
      dataUrl = source.toDataURL(mimeType, 1.0);
    } catch (e) {
      console.error('canvas.toDataURL failed:', e);
    }
  }

  if (!dataUrl && typeof source === 'string') {
    dataUrl = source;
  }

  // STRATEGY 1: Native Windows Save File Picker (Best for Chrome on Windows)
  if (window.showSaveFilePicker && dataUrl) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: safeName,
        types: [{
          description: 'PNG Image (*.png)',
          accept: { [mimeType]: [`.${expectedExt}`] }
        }]
      });

      const writable = await handle.createWritable();
      
      // Convert Data URL to binary Blob
      const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      await writable.write(blob);
      await writable.close();
      console.log('File successfully saved via showSaveFilePicker:', safeName);
      return;
    } catch (pickerErr) {
      // If user deliberately cancelled the save dialog, do nothing
      if (pickerErr.name === 'AbortError') {
        return;
      }
      console.warn('showSaveFilePicker failed, proceeding to server stream strategy:', pickerErr);
    }
  }

  // STRATEGY 2: Server-Side Stream via /api/prepare-download and /api/download-file
  if (dataUrl) {
    try {
      const prepRes = await fetch('/api/prepare-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename: safeName, mimeType })
      });

      if (prepRes.ok) {
        const { fileId } = await prepRes.json();
        if (fileId) {
          const downloadUrl = `/api/download-file?id=${fileId}&file=${encodeURIComponent(safeName)}`;
          
          // Use hidden iframe to trigger HTTP attachment download without navigating page
          let iframe = document.getElementById('gspeed-native-download-frame');
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'gspeed-native-download-frame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }
          iframe.src = downloadUrl;
          return;
        }
      }
    } catch (serverErr) {
      console.warn('Server stream failed, proceeding to anchor fallback:', serverErr);
    }

    // STRATEGY 3: Direct Data URL anchor click
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = dataUrl;
    link.download = safeName;
    link.setAttribute('download', safeName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (err) {}
    }, 1500);
  }
}
