export const DOCTOR_INFO = {
  name: "Dr. Md. Jubayer Ahmed Saddam",
  banglaName: "ডাঃ মোঃ জুবায়ের আহমেদ সাদ্দাম",
  degrees: "MBBS, BCS (Health), FCPS (Surgery)",
  banglaDegrees: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (সার্জারি)",
  title: "Assistant Professor (Surgery)",
  banglaTitle: "সহকারী অধ্যাপক (সার্জারি)",
  currentInstitution: "Ad-din Medical College & Hospital, Dhaka",
  banglaCurrentInstitution: "আদ্-দ্বীন মেডিকেল কলেজ ও হাসপাতাল, ঢাকা",
  formerInstitution: "Former Resident, Dhaka Medical College Hospital",
  banglaFormerInstitution: "প্রাক্তন রেসিডেন্ট, ঢাকা মেডিকেল কলেজ হাসপাতাল",
  specialties: [
    "General Surgery",
    "Laparoscopic Surgery",
    "Colorectal Surgery",
    "Liver & Gallbladder Surgery"
  ],
  banglaSpecialties: "জেনারেল, ল্যাপারোস্কপিক, কোলোরেক্টাল ও লিভার সার্জন",
  bmdcRegNo: "A-67890", // Official clinical registry representation
  experienceYears: 12,
  surgeriesPerformed: "3,500+",
  patientSatisfaction: "99%",

  // Ashuganj Chamber details
  chamber: {
    hospitalName: "New Green Life Hospital",
    banglaHospitalName: "নিউ গ্রীণ লাইফ হাসপাতাল",
    address: "Near Sonali Bank, Station Road, Ashuganj, Brahmanbaria",
    banglaAddress: "সোনালী ব্যাংক সংলগ্ন, স্টেশন রোড, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া",
    scheduleDays: "Every Thursday",
    banglaScheduleDays: "প্রতি বৃহস্পতিবার",
    scheduleHours: "2:00 PM – 8:00 PM",
    banglaScheduleHours: "দুপুর ২:০০টা হতে রাত ৮:০০টা পর্যন্ত",
    phone: "01771-358595",
    intlPhone: "+8801771-358595",
    serialPhone: "01771-358595",
    emergencyNote: "For urgent surgical emergencies, call the hotline immediately.",
    googleMapsUrl: "https://www.google.com/maps/place/NEW+GREEN+LIFE+HOSPITAL/@24.0423573,91.0093257,20.5z/data=!4m6!3m5!1s0x37541b003d00305f:0x4ab0f4a7cdec7078!8m2!3d24.0424943!4d91.0089444!16s%2Fg%2F11z55mv6b1",
    coordinates: {
      lat: 24.0424943,
      lng: 91.0089444
    }
  },

  // Academic and professional credentials
  credentials: [
    {
      degree: "FCPS (Surgery)",
      institution: "Bangladesh College of Physicians and Surgeons (BCPS)",
      year: "Fellowship Certified",
      description: "Highest surgical qualification in Bangladesh with extensive specialized training in advanced surgical pathology and operative care."
    },
    {
      degree: "BCS (Health)",
      institution: "Government of the People's Republic of Bangladesh",
      year: "Civil Service",
      description: "Cadre service excellence serving across premier government healthcare institutions and apex tertiary hospitals."
    },
    {
      degree: "MBBS",
      institution: "Dhaka Medical College & Hospital",
      year: "Graduation",
      description: "Foundational medical degree with honors from Bangladesh's premier medical institution."
    },
    {
      degree: "Ex-Resident (Surgery)",
      institution: "Dhaka Medical College Hospital",
      year: "Residency",
      description: "Rigorous clinical residency handling complex polytrauma, emergency abdominal surgeries, and critical post-op intensive care."
    }
  ],

  // Detailed surgical services
  services: [
    {
      id: "laparoscopic",
      title: "Laparoscopic Surgery",
      banglaTitle: "ল্যাপারোস্কপিক (দূরবীন) সার্জারি",
      shortDesc: "Minimally invasive keyhole procedures for gallbladder stones, appendix, hernia, and intra-abdominal diagnostics.",
      fullDesc: "Utilizing high-definition video laparoscopy for precision interventions with tiny 5–10mm incisions. Patients experience drastically reduced post-operative pain, minimal blood loss, minimal scarring, and quick return to regular activities within 24–48 hours.",
      procedures: [
        "Laparoscopic Cholecystectomy (Gallstone removal)",
        "Laparoscopic Appendectomy (Acute & chronic appendicitis)",
        "Laparoscopic Hernioplasty (Inguinal, umbilical & incisional)",
        "Diagnostic Laparoscopy with peritoneal biopsy"
      ],
      icon: "Activity"
    },
    {
      id: "colorectal",
      title: "Colorectal Surgery",
      banglaTitle: "কোলোরেক্টাল ও পাইলস সার্জারি",
      shortDesc: "Specialized painless modern treatments for Piles (Hemorrhoids), Anal Fissure, Fistula-in-Ano, and Rectal Prolapse.",
      fullDesc: "Comprehensive anorectal disease management utilizing minimally invasive stapled hemorrhoidopexy (Longo), laser-assisted procedures, and advanced flap reconstructions to ensure painless recovery, sphincter preservation, and recurrence prevention.",
      procedures: [
        "Modern Daycare Hemorrhoidectomy & Stapler Surgery",
        "Anal Fissure Sphincterotomy & Medical Management",
        "High & Low Anal Fistula Ligation & Fistulectomy",
        "Pilonidal Sinus Excision & Flap Reconstruction"
      ],
      icon: "ShieldPlus"
    },
    {
      id: "liver-gallbladder",
      title: "Liver & Gallbladder Surgery",
      banglaTitle: "লিভার ও পিত্তথলি সার্জারি",
      shortDesc: "Advanced hepatobiliary interventions for liver cysts, obstructive jaundice, bile duct stones, and gallbladder pathologies.",
      fullDesc: "Expert surgical care for hepatobiliary disorders involving state-of-the-art radiological evaluation, intraoperative cholangiography, bile duct exploration, and safe hepatic resection protocols.",
      procedures: [
        "Complicated Gallbladder Disease & Cholecystitis",
        "Common Bile Duct (CBD) Exploration for Choledocholithiasis",
        "Hepatic Cyst Marsupialization & Abscess Drainage",
        "Evaluation of Obstructive Jaundice & Biliary Strictures"
      ],
      icon: "Stethoscope"
    },
    {
      id: "general-surgery",
      title: "General & Emergency Surgery",
      banglaTitle: "জেনারেল ও জরুরি সার্জারি",
      shortDesc: "Comprehensive abdominal surgery, soft tissue tumors, hernia repairs, diabetic foot care, and surgical biopsy.",
      fullDesc: "Mastery in core general surgical procedures, acute abdominal emergencies (intestinal perforation, obstruction, acute peritonitis), complex breast lumps, neck swellings, and advanced reconstructive hernia repairs.",
      procedures: [
        "Emergency Laparotomy for Intestinal Perforation/Obstruction",
        "Mesh Hernioplasty for Inguinal, Umbilical & Ventral Hernias",
        "Excision of Lipoma, Sebaceous Cyst, & Soft Tissue Tumors",
        "Breast Lump Biopsy, Lumpectomy & Hydrocele Surgery"
      ],
      icon: "Scissors"
    }
  ],

  // Hospital and institutional affiliations
  affiliations: [
    {
      name: "Ad-din Medical College & Hospital",
      location: "Dhaka, Bangladesh",
      role: "Assistant Professor (Surgery)",
      type: "Academic & Clinical Teaching Hospital",
      status: "Current Primary Academic Appointment"
    },
    {
      name: "New Green Life Hospital",
      location: "Station Road, Ashuganj, Brahmanbaria",
      role: "Visiting Consultant Surgeon",
      type: "Specialist Surgical Consultation Chamber",
      status: "Every Thursday (2:00 PM – 8:00 PM)"
    },
    {
      name: "Dhaka Medical College Hospital",
      location: "Dhaka, Bangladesh",
      role: "Former Resident Doctor",
      type: "Apex Tertiary Referral Hospital",
      status: "Advanced Surgical Training Completion"
    },
    {
      name: "BCPS",
      location: "Dhaka, Bangladesh",
      role: "Fellow (FCPS)",
      type: "Apex Postgraduate Medical Institute",
      status: "Lifetime Surgical Fellowship"
    }
  ],

  // Clinical consultation principles & reviews
  clinicalPrinciples: [
    {
      quote: "Every surgical decision must balance clinical necessity with patient comfort. Accurate preoperative assessment and clear patient communication remain the cornerstones of successful surgery.",
      author: "Dr. Md. Jubayer Ahmed Saddam",
      designation: "Assistant Professor of Surgery"
    },
    {
      title: "Patient-Centered Surgical Care",
      desc: "Detailed explanation of surgical indications, expected outcomes, anesthesia safety, and comprehensive post-op care guidance."
    },
    {
      title: "Evidence-Based Modern Techniques",
      desc: "Employing globally accepted laparoscopic and minimally invasive techniques to minimize hospital stay and optimize tissue recovery."
    },
    {
      title: "Strict Sterility & Patient Safety",
      desc: "Adherence to international WHO surgical safety checklists, aseptic protocols, and vigilant postoperative monitoring."
    }
  ],

  // Patient feedback and testimonials
  reviews: [
    {
      id: 1,
      patientName: "Md. Rafiqul Islam",
      location: "Ashuganj, Brahmanbaria",
      treatment: "Laparoscopic Gallbladder Surgery",
      rating: 5,
      date: "October 2024",
      comment: "ডাঃ সাদ্দাম স্যারের তত্ত্বাবধানে নিউ গ্রীণ লাইফ হাসপাতালে আমার পিত্তথলির পাথর অপারেশন হয়। কোন ব্যথা ছাড়াই মাত্র ২ দিনে স্বাভাবিক হাঁটাচলা করতে পেরেছি। স্যার অত্যন্ত অমায়িক এবং রোগীকে সময় দিয়ে বিস্তারিত বুঝিয়ে বলেন।"
    },
    {
      id: 2,
      patientName: "Mrs. Nasrin Akter",
      location: "Bhairab, Kishoreganj",
      treatment: "Painless Anorectal Procedure",
      rating: 5,
      date: "September 2024",
      comment: "বহু বছর ধরে পাইলস সমস্যায় ভুগেছি। স্যার আধুনিক পদ্ধতিতে সার্জারি করেছেন, অপারেশনের পর কোন কষ্ট হয়নি। তাঁর শান্ত আচরণ ও সঠিক পরামর্শে আমি আজ সম্পূর্ণ সুস্থ।"
    },
    {
      id: 3,
      patientName: "Kamal Hossain",
      location: "Brahmanbaria Sadar",
      treatment: "Inguinal Hernia Repair",
      rating: 5,
      date: "August 2024",
      comment: "অসাধারণ সার্জিক্যাল দক্ষতা। হার্নিয়া অপারেশনের দ্রুত আরোগ্য লাভ করেছি। অ্যাসিস্ট্যান্ট প্রফেসর হিসেবে স্যারের অভিজ্ঞতা তাঁর প্রতিটি চিকিৎসায় স্পষ্ট প্রকাশ পায়।"
    }
  ]
};
