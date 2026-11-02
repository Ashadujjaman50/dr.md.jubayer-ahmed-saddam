/**
 * Video Gallery Data Structure for Dr. Md. Jubayear Ahmed Saddam
 * 
 * Reusable data structure:
 * - id: unique string identifier
 * - title: clinical or professional video title
 * - description: concise description of the video
 * - video: path to video in /assets/videos/
 * - thumbnail: path to poster image in /assets/videos/
 * - duration: formatted duration string (e.g. '0:49')
 * - uploadedAt: ISO date string (YYYY-MM-DD)
 * - category: 'Medical Activities' | 'Operation Theater' | 'Professional Moments'
 */

export const VIDEO_CATEGORIES = [
  'All Videos',
  'Medical Activities',
  'Operation Theater',
  'Professional Moments'
];

export const VIDEO_ITEMS = [
  {
    id: 'laparoscopic-ot-live-surgery',
    title: 'Advanced Laparoscopic Surgery in Operation Theater',
    description: 'Dr. Md. Jubayear Ahmed Saddam and surgical team performing precision laparoscopic procedure using Karl Storz HD imaging.',
    video: '/assets/videos/video-3.mp4',
    thumbnail: '/assets/videos/video-3-poster.jpg',
    duration: '0:49',
    uploadedAt: '2024-06-15',
    category: 'Operation Theater',
    featured: true
  },
  {
    id: 'surgical-specimen-examination',
    title: 'Clinical Examination of Excised Surgical Specimen',
    description: 'Post-operative demonstration and evaluation of resected tissue mass for pathological investigation.',
    video: '/assets/videos/video-2.mp4',
    thumbnail: '/assets/videos/video-2-poster.jpg',
    duration: '0:36',
    uploadedAt: '2024-06-05',
    category: 'Medical Activities'
  },
  {
    id: 'extracted-gallbladder-stones-demonstration',
    title: 'Extracted Gallbladder Stones & Resected Specimen',
    description: 'Post-operative surgical tray demonstration showcasing multiple extracted gallstones and tissue pathology.',
    video: '/assets/videos/video-1.mp4',
    thumbnail: '/assets/videos/video-1-poster.jpg',
    duration: '0:10',
    uploadedAt: '2024-05-28',
    category: 'Medical Activities'
  }
];

export function getSortedVideoItems() {
  return [...VIDEO_ITEMS].sort((a, b) => {
    const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    return dateB - dateA;
  });
}

