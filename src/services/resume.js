/**
 * Resume link utility.
 *
 * Set VITE_RESUME_URL to the Google Drive share link for the resume.
 */

const RESUME_URL = import.meta.env.VITE_RESUME_URL || 'https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/view?usp=sharing'

export function downloadResume() {
  window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
}
