/**
 * Gallery Data Structure for Dr. Md. Jubayear Ahmed Saddam
 * 
 * Reusable data structure:
 * - id: unique string identifier
 * - title: clinical or activity title
 * - description: concise description (optional)
 * - image: path to image in /assets/gallery/
 * - uploadedAt: ISO date string (YYYY-MM-DD) for newest-first sorting
 * - category: 'Medical Activities' | 'Hospital & Chamber' | 'Professional Moments' | 'Achievements' | 'General Gallery'
 * - featured: boolean (optional)
 */

export const GALLERY_CATEGORIES = [
  'All',
  'Medical Activities',
  'Hospital & Chamber',
  'Professional Moments',
  'Achievements',
  'General Gallery'
];

export const GALLERY_ITEMS = [
  {
    id: 'hernia-mesh-repair',
    title: 'Inguinal Hernia Mesh Repair (Hernioplasty)',
    description: 'Intraoperative mesh placement and anatomical tissue reconstruction during open inguinal hernioplasty.',
    image: '/assets/gallery/gallery-hernia-mesh-repair.jpg',
    uploadedAt: '2024-06-12',
    category: 'Medical Activities',
    featured: true
  },
  {
    id: 'bowel-resection-surgery',
    title: 'Abdominal & Intestinal Surgical Exploration',
    description: 'Intraoperative inspection and surgical management of bowel pathology during general surgical care.',
    image: '/assets/gallery/gallery-bowel-resection-surgery.jpg',
    uploadedAt: '2024-06-02',
    category: 'Medical Activities'
  },
  {
    id: 'surgical-pathology-specimen',
    title: 'Post-Surgical Resected Pathology Specimen',
    description: 'Carefully excised surgical specimen on sterile field prepared for comprehensive histopathological examination.',
    image: '/assets/gallery/gallery-surgical-specimen.jpg',
    uploadedAt: '2024-05-25',
    category: 'Medical Activities'
  },
  {
    id: 'ct-scan-diagnostics',
    title: 'Preoperative Abdominopelvic CT Scan Review',
    description: 'Multi-slice coronal CT scan radiograph evaluation on illuminator for meticulous surgical pre-planning.',
    image: '/assets/gallery/gallery-ct-scan-diagnostics.jpg',
    uploadedAt: '2024-05-20',
    category: 'Medical Activities'
  },
  {
    id: 'laparoscopic-cholecystectomy-procedure',
    title: 'Laparoscopic Cholecystectomy Procedure',
    description: 'High-definition intraoperative view during laparoscopic gallbladder surgery with precise clip application.',
    image: '/assets/gallery/gallery-laparoscopic-ot-2.jpg',
    uploadedAt: '2024-05-18',
    category: 'Medical Activities'
  },
  {
    id: 'advanced-laparoscopic-system',
    title: 'Advanced Laparoscopic Surgery Procedure',
    description: 'Intraoperative laparoscopic surgery procedure performed using Karl Storz high-definition endoscopic surgical system.',
    image: '/assets/gallery/gallery-laparoscopic-ot-1.jpg',
    uploadedAt: '2024-04-25',
    category: 'Medical Activities'
  },
  {
    id: 'piles-fistula-surgical-care',
    title: 'Piles & Fistula Specialized Surgical Care',
    description: 'Clinical consultation details for anorectal diseases including piles, fissure and fistula at New Green Life Hospital.',
    image: '/assets/gallery/gallery-piles-fistula.jpg',
    uploadedAt: '2024-02-10',
    category: 'Hospital & Chamber'
  },
  {
    id: 'gallbladder-stones-surgical-care',
    title: 'Gallbladder Stone Surgical Treatment',
    description: 'Surgical management and clinical consultation details for gallbladder stones and pathologies at New Green Life Hospital.',
    image: '/assets/gallery/gallery-gallbladder-stones.jpg',
    uploadedAt: '2024-01-15',
    category: 'Hospital & Chamber'
  }
];

/**
 * Returns gallery items sorted by upload date in descending order (newest first).
 */
export function getSortedGalleryItems() {
  return [...GALLERY_ITEMS].sort((a, b) => {
    const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    return dateB - dateA;
  });
}

