/**
 * Resume link utility.
 *
 * Keep the resume URL here so every resume link uses the same destination.
 */

export const resumeUrl = 'https://docs.google.com/document/d/1Pt0Zt7h65j1ybulYFqjwLgS98EVAlVOa/export?format=pdf'

export function downloadResume() {
  window.open(resumeUrl, '_blank', 'noopener,noreferrer')
}
