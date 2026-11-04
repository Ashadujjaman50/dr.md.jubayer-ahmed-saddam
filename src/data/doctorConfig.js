export const DOCTOR_INFO = {
  name: "Dr. Md. Jubayear Ahmed Saddam",
  banglaName: "ডাঃ মোঃ জুবায়ের আহমেদ সাদ্দাম",
  degrees: "MBBS (DMC), FCPS (Surgery)",
  banglaDegrees: "এমবিবিএস (ডিএমসি), এফসিপিএস (সার্জারি)",
  title: "Assistant Professor",
  banglaTitle: "সহকারী অধ্যাপক (সার্জারি)",
  professionalTitle: "Surgeon",
  currentInstitution: "Ad-Din Medical College Hospital, Moghbazar, Dhaka",
  banglaCurrentInstitution: "আদ্-দ্বীন মেডিকেল কলেজ হাসপাতাল, মগবাজার, ঢাকা",
  formerInstitution: "Dhaka Medical College Hospital",
  banglaFormerInstitution: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
  specialties: [
    "General Surgery",
    "Advanced Laparoscopic Surgery",
    "Colorectal Surgery",
    "Hepatobiliary & Pancreatic Surgery"
  ],
  banglaSpecialties: "জেনারেল, ল্যাপারোস্কপিক, কোলোরেক্টাল, হেপাটোবিলিয়ারি ও প্যানক্রিয়াটিক সার্জন",
  bmdcRegNo: "A82849", // Official clinical registry representation
  email: "jubayearsaddam@gmail.com",
  experienceYears: 12,
  surgeriesPerformed: "3,500+",
  patientSatisfaction: "99%",

  // WhatsApp
  whatsapp: "01677-566535",
  whatsappIntl: "8801677566535",
  whatsappUrl: "https://wa.me/8801677566535",

  // 3 Chambers
  chambers: [
    {
      id: "dhaka",
      city: "Dhaka",
      banglaCity: "ঢাকা",
      hospitalName: "Health and Hope Hospital",
      banglaHospitalName: "হেলথ অ্যান্ড হোপ হাসপাতাল",
      room: "Room No-402",
      address: "Room No-402, 152/2/G, Green Road, Panthapath, Dhaka",
      banglaAddress: "রুম নং-৪০২, ১৫২/২/জি, গ্রীন রোড, পান্থপথ, ঢাকা।",
      phone: "01841-822442",
      serialPhones: ["01841-822442"],
      scheduleDays: "Every Saturday to Wednesday",
      banglaScheduleDays: "প্রতি শনিবার হতে বুধবার",
      scheduleHours: "3:00 PM – 8:00 PM",
      banglaScheduleHours: "বিকাল ৩:০০টা হতে রাত ৮:০০টা পর্যন্ত",
      closedDays: "Thursday and Friday",
      banglaClosedDays: "বৃহস্পতিবার ও শুক্রবার বন্ধ",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Health+and+Hope+Hospital+Panthapath+Dhaka",
      coordinates: {
        lat: 23.7523,
        lng: 90.3855
      }
    },
    {
      id: "ashuganj",
      city: "Ashuganj",
      banglaCity: "আশুগঞ্জ",
      hospitalName: "New Green Life Hospital",
      banglaHospitalName: "নিউ গ্রীণ লাইফ হাসপাতাল",
      room: "",
      address: "Azad Tower, Bor Mosjid Road, Purbo Bazar, Ashuganj",
      banglaAddress: "আজাদ টাওয়ার, বড় মসজিদ রোড, পূর্ব বাজার, আশুগঞ্জ।",
      phone: "01771-358595",
      serialPhones: ["01771-358595", "01308-229576"],
      scheduleDays: "Every Thursday & Friday",
      banglaScheduleDays: "প্রতি বৃহস্পতিবার ও শুক্রবার",
      scheduleHours: "3:00 PM – 8:00 PM",
      banglaScheduleHours: "দুপুর ৩:০০টা হতে রাত ৮:০০টা পর্যন্ত",
      closedDays: null,
      banglaClosedDays: null,
      googleMapsUrl: "https://www.google.com/maps/place/NEW+GREEN+LIFE+HOSPITAL/@24.0423573,91.0093257,20.5z/data=!4m6!3m5!1s0x37541b003d00305f:0x4ab0f4a7cdec7078!8m2!3d24.0424943!4d91.0089444!16s%2Fg%2F11z55mv6b1",
      coordinates: {
        lat: 24.0424943,
        lng: 91.0089444
      }
    },
    {
      id: "brahmanbaria",
      city: "Brahmanbaria",
      banglaCity: "ব্রাহ্মণবাড়িয়া",
      hospitalName: "Labaid Diagnostic Ltd.",
      banglaHospitalName: "ল্যাবএইড ডায়াগনস্টিক লিঃ",
      room: "",
      address: "Kumarshil Mor, Main Road, Paikpara, Brahmanbaria",
      banglaAddress: "কুমারশীল মোড়, মেইন রোড, পাইকপাড়া, ব্রাহ্মণবাড়িয়া।",
      phone: "01766-662233",
      serialPhones: ["01766-662233"],
      scheduleDays: "Every Friday",
      banglaScheduleDays: "প্রতি শুক্রবার",
      scheduleHours: "9:00 AM – 2:00 PM",
      banglaScheduleHours: "সকাল ৯:০০টা হতে দুপুর ২:০০টা পর্যন্ত",
      closedDays: null,
      banglaClosedDays: null,
      googleMapsUrl: "https://maps.app.goo.gl/yPieWWCKgdpGheRAA",
      coordinates: {
        lat: 23.9779546,
        lng: 91.1107943
      }
    }
  ],

  // Backwards-compatible alias for single-chamber consumers
  get chamber() {
    return this.chambers[1]; // Ashuganj
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
      degree: "MBBS",
      institution: "Dhaka Medical College (DMC)",
      year: "Graduation",
      description: "Premier foundational medical degree from Dhaka Medical College Hospital."
    },
    {
      degree: "Ex-Resident (Surgery)",
      institution: "Dhaka Medical College Hospital",
      year: "Residency",
      description: "Rigorous clinical residency handling complex polytrauma, emergency abdominal surgeries, and critical patient care."
    }
  ],

  // Detailed surgical services
  services: [
    {
      id: "laparoscopic",
      title: "Laparoscopic Surgery",
      banglaTitle: "এ্যাডভান্সড ল্যাপারোস্কপিক সার্জারি",
      shortDesc: "Advanced laparoscopic surgical procedures using minimally invasive techniques.",
      fullDesc: "Advanced laparoscopic surgery using minimally invasive surgical techniques.",
      cardProcedures: [
        "Advanced Laparoscopic Surgery",
        "Laparoscopic Surgical Procedures",
        "Laparoscopic Cholecystectomy (Gallstone removal)"
      ],
      procedures: [
        "Advanced Laparoscopic Surgery",
        "Laparoscopic Surgical Procedures",
        "Laparoscopic Cholecystectomy (Gallstone removal)"
      ],
      icon: "Activity"
    },
    {
      id: "colorectal",
      title: "Colorectal Surgery",
      banglaTitle: "কোলোরেক্টাল ও পাইলস সার্জারি",
      shortDesc: "Surgical management of anorectal conditions and colon and rectal diseases.",
      fullDesc: "Surgical management of anorectal diseases, including piles, anal fissure, anal fistula, and colon and rectal cancer.",
      cardProcedures: [
        "Piles & Hemorrhoids Surgery",
        "Anal Fissure & Anal Fistula Surgery",
        "Colon & Rectal Cancer Surgery"
      ],
      procedures: [
        "Piles Surgery",
        "Anal Fissure Surgery",
        "Anal Fistula Surgery",
        "Colon & Rectal Cancer Surgery"
      ],
      icon: "ShieldPlus"
    },
    {
      id: "hepatobiliary-pancreatic",
      title: "Hepatobiliary & Pancreatic Surgery",
      banglaTitle: "লিভার, পিত্তথলি ও প্যানক্রিয়াস সার্জারি",
      shortDesc: "Surgical treatment of liver, gallbladder, bile duct and pancreatic stones and tumors.",
      fullDesc: "Surgical management of diseases involving the liver, gallbladder, bile duct and pancreas.",
      cardProcedures: [
        "Gallbladder & Bile Duct Stones / Tumors Surgery",
        "Liver Stones, Cysts & Tumors Surgery",
        "Pancreatic Stones & Pancreatic Tumors Surgery"
      ],
      procedures: [
        "Gallbladder Stones & Tumors Surgery",
        "Bile Duct Stones & Tumors Surgery",
        "Liver Stones & Tumors Surgery",
        "Pancreatic Stones & Tumors Surgery"
      ],
      icon: "Stethoscope"
    },
    {
      id: "general-surgery",
      title: "General Surgery",
      banglaTitle: "জেনারেল ও অন্যান্য সার্জারি",
      shortDesc: "Surgical management of hernia, esophageal conditions and breast tumors, along with general surgical procedures.",
      fullDesc: "General surgical care involving hernia, esophageal tumors and cancer, and breast tumor surgery.",
      cardProcedures: [
        "Hernia Surgery (Inguinal, Umbilical, Ventral)",
        "Esophageal Tumor & Cancer Surgery",
        "Breast Tumor & General Surgical Procedures"
      ],
      procedures: [
        "Hernia Surgery",
        "Esophageal Tumor & Cancer Surgery",
        "Breast Tumor Surgery",
        "General Surgery"
      ],
      icon: "Scissors"
    }
  ],

  // Hospital and institutional affiliations
  affiliations: [
    {
      name: "Ad-Din Medical College Hospital",
      location: "Moghbazar, Dhaka",
      role: "Assistant Professor",
      type: "Academic & Clinical Teaching Hospital",
      status: "Current Workplace"
    },
    {
      name: "Dhaka Medical College Hospital",
      location: "Dhaka, Bangladesh",
      role: "MBBS & Former Resident Doctor",
      type: "Apex Tertiary Referral Hospital",
      status: "Medical Institution"
    },
    {
      name: "BCPS",
      location: "Dhaka, Bangladesh",
      role: "Fellow (FCPS Surgery)",
      type: "Apex Postgraduate Medical Institute",
      status: "Lifetime Surgical Fellowship"
    },
    {
      name: "Specialist Surgical Chambers",
      location: "Dhaka • Ashuganj • Brahmanbaria",
      role: "Visiting Specialist Surgeon",
      type: "Outpatient Consultation Chambers",
      status: "Active Practice"
    }
  ],

  // Clinical consultation principles & reviews
  clinicalPrinciples: [
    {
      quote: "Every surgical decision must balance clinical necessity with patient comfort. Accurate preoperative assessment and clear patient communication remain the cornerstones of successful surgery.",
      author: "Dr. Md. Jubayear Ahmed Saddam",
      designation: "Assistant Professor of Surgery"
    },
    {
      title: "Patient-Centered Surgical Care",
      desc: "Detailed explanation of surgical indications, expected outcomes, anesthesia safety, and comprehensive post-op care guidance."
    },
    {
      title: "Evidence-Based Modern Techniques",
      desc: "Employing globally accepted laparoscopic and minimally invasive techniques to optimize recovery and clinical safety."
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
      date: "September 2026",
      comment: "ডাঃ সাদ্দাম স্যারের তত্ত্বাবধানে নিউ গ্রীণ লাইফ হাসপাতালে আমার পিত্তথলির পাথর অপারেশন হয়। অপারেশনের পর দ্রুত স্বাভাবিক হাঁটাচলা করতে পেরেছি। স্যার অত্যন্ত অমায়িক এবং রোগীকে সময় দিয়ে বিস্তারিত বুঝিয়ে বলেন।"
    },
    {
      id: 2,
      patientName: "Mrs. Nasrin Akter",
      location: "Bhairab, Kishoreganj",
      treatment: "Anorectal Procedure",
      rating: 5,
      date: "September 2026",
      comment: "বহু বছর ধরে পাইলস সমস্যায় ভুগেছি। স্যার আধুনিক পদ্ধতিতে সার্জারি করেছেন। তাঁর সুন্দর ব্যবহার, চিকিৎসা ও সঠিক পরামর্শে আমি আজ সুস্থ।"
    },
    {
      id: 3,
      patientName: "Kamal Hossain",
      location: "Brahmanbaria Sadar",
      treatment: "Inguinal Hernia Repair",
      rating: 5,
      date: "August 2026",
      comment: "অসাধারণ সার্জিক্যাল দক্ষতা। হার্নিয়া অপারেশনের পর দ্রুত আরোগ্য লাভ করেছি। অ্যাসিস্ট্যান্ট প্রফেসর হিসেবে স্যারের অভিজ্ঞতা তাঁর চিকিৎসায় স্পষ্ট প্রকাশ পায়।"
    }
  ]
};
