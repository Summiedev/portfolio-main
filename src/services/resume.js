/**
 * Resume link utility.
 *
 * Set VITE_RESUME_URL to the Google Drive share link for the resume.
 */

const RESUME_URL = 'https://docs.google.com/document/d/1Pt0Zt7h65j1ybulYFqjwLgS98EVAlVOa/export?format=pdf'

export function downloadResume() {
  window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
}
