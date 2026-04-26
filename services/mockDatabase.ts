import { Project, Lead, Appointment, KnowledgeItem, AdminSettings, Customer, Invoice, Policy, GalleryImage } from '../types';
import { companyConfig } from '../config';

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Traditioneel Parket - Visgraat',
    description: 'Klassieke eiken visgraatvloer met ambachtelijke band en bies afwerking.',
    longDescription: 'BPM Parket is gespecialiseerd in het leggen van traditioneel parket. Deze visgraatvloer is met uiterste precisie gelegd en voorzien van een klassieke randafwerking. Een tijdloze keuze voor elk interieur.',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1000',
    areaSize: 65,
    location: 'Geldrop',
    date: '2023-11-15',
    techniques: [
      'Ondervloer prepareren',
      'Traditioneel leggen en spijkeren',
      'Schuren en polijsten',
      'Afwerken met premium olie'
    ]
  },
  {
    id: '2',
    title: 'PVC Designvloer',
    description: 'Stijlvolle en duurzame PVC vloer met de look van echt hout.',
    longDescription: 'Voor deze moderne woning hebben we een hoogwaardige PVC vloer geinstalleerd. PVC biedt de warme uitstraling van hout met het gemak van minimaal onderhoud en hoge slijtvastheid. Ideaal voor intensief gebruik.',
    imageUrl: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&q=80&w=1000',
    areaSize: 45,
    location: 'Geldrop',
    date: '2024-01-20',
    techniques: [
      'Egaliseren van de dekvloer',
      'Verlijmen van PVC stroken',
      'Naden afwerken',
      'Eerste onderhoudsbeurt'
    ]
  },
  {
    id: '3',
    title: 'Exclusieve Traprenovatie',
    description: 'Transformeer uw trap met eiken overzettreden in recordtijd.',
    longDescription: 'Een trap is vaak de eyecatcher van de woning. Wij renoveren uw oude trap met massief eiken overzettreden, vaak al binnen één dag klaar. De treden zijn verkrijgbaar in vele kleuren en afwerkingen.',
    imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1000',
    areaSize: 1,
    location: 'Geldrop',
    date: '2024-02-10',
    techniques: [
      'Inmeten van de treden',
      'Maatwerk zagen van eiken overzettreden',
      'Montage met geluiddempende verbinding',
      'Afwerking in kleur naar wens'
    ]
  }
];

const INITIAL_GALLERY: GalleryImage[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&q=80&w=500', caption: 'Details visgraat leggen' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=500', caption: 'Traprenovatie na' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=500', caption: 'Maatwerk meubel detail' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=500', caption: 'Houtselectie in werkplaats' }
];

const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: '1',
    topic: 'Onze Specialiteiten',
    content: 'BPM Parket is dé expert in traditioneel parket, multiplanken, PVC en laminaat. Daarnaast zijn wij gespecialiseerd in traprenovatie en het schuren en onderhouden van houten vloeren.'
  },
  {
    id: '2',
    topic: 'Vakmanschap',
    content: 'Bij BPM Parket staat ambacht voorop. Wij werken met hoogwaardige materialen en bieden diverse afwerkingsmogelijkheden zoals kleurenolie, lak en logen.'
  },
  {
    id: '3',
    topic: 'Traprenovatie',
    content: 'Een traprenovatie door BPM Parket geeft uw trap een compleet nieuwe uitstraling. Met onze eiken overzettreden is uw trap vaak al binnen één dag volledig getransformeerd.'
  }
];

const INITIAL_POLICIES: Policy[] = [
  {
    id: 'privacy',
    title: 'Privacybeleid',
    content: 'Dit is het privacybeleid van BPM Parket. Wij gaan zorgvuldig om met uw persoonsgegevens.',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'terms',
    title: 'Algemene Voorwaarden',
    content: 'Op al onze leveringen en diensten zijn de algemene voorwaarden van BPM Parket van toepassing.',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

const INITIAL_SETTINGS: AdminSettings = {
  adminName: 'Bodhi van Baar',
  adminRole: 'Eigenaar',
  adminEmail: 'bodhi@bpmparket.nl',
  password: 'admin',
  adminAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
  chatbotEnabled: true,
  enablePhotoGallery: true,
  phone: companyConfig.contact.phone,
  // Default Company Settings from Config
  companyName: companyConfig.legalName,
  companyAddress: companyConfig.contact.address,
  companyZip: companyConfig.contact.zipCity.split(' ')[0],
  companyCity: companyConfig.contact.zipCity.split(' ').slice(1).join(' '),
  companyKvk: companyConfig.contact.kvk,
  companyBtw: companyConfig.contact.btw,
  companyIban: companyConfig.contact.iban,
  companyLogo: '/logo.png'
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Jan de Vries',
    email: 'jan@bedrijf.nl',
    phone: '0612345678',
    address: 'Kalverstraat 1',
    zip: '1012 NX',
    city: 'Amsterdam',
    companyName: 'De Vries Retail'
  },
  {
    id: '2',
    name: 'Sara Jansen',
    email: 'sara@gmail.com',
    phone: '0687654321',
    address: 'Herenstraat 14',
    zip: '3512 KB',
    city: 'Utrecht'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    customerId: '1',
    date: '2024-03-01',
    dueDate: '2024-03-15',
    status: 'paid',
    type: 'invoice',
    totalAmount: 4500,
    items: [
      { id: '1', description: 'Epoxy Gietvloer 50m2', quantity: 50, price: 85, vatRate: 21 },
      { id: '2', description: 'Voorbewerking', quantity: 1, price: 250, vatRate: 21 }
    ]
  }
];

// Bump when seeded media (project/gallery image URLs) changes so cached
// localStorage entries get re-seeded instead of serving broken images.
const SEED_VERSION = '2';
if (typeof window !== 'undefined') {
  if (localStorage.getItem('seed_version') !== SEED_VERSION) {
    localStorage.removeItem('projects');
    localStorage.removeItem('gallery');
    localStorage.setItem('seed_version', SEED_VERSION);
  }
}

// Helpers
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Projects ---
export const getProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getStorage('projects', INITIAL_PROJECTS)), 300);
  });
};

export const saveProject = (project: Project): Promise<void> => {
  return new Promise((resolve) => {
    const projects = getStorage<Project[]>('projects', INITIAL_PROJECTS);
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    setStorage('projects', projects);
    resolve();
  });
};

export const deleteProject = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const projects = getStorage<Project[]>('projects', INITIAL_PROJECTS);
    setStorage('projects', projects.filter(p => p.id !== id));
    resolve();
  });
};

// --- Gallery ---
export const getGallery = (): Promise<GalleryImage[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('gallery', INITIAL_GALLERY));
  });
};

export const saveGalleryImage = (image: GalleryImage): Promise<void> => {
  return new Promise((resolve) => {
    const gallery = getStorage<GalleryImage[]>('gallery', INITIAL_GALLERY);
    gallery.push(image);
    setStorage('gallery', gallery);
    resolve();
  });
};

export const deleteGalleryImage = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const gallery = getStorage<GalleryImage[]>('gallery', INITIAL_GALLERY);
    setStorage('gallery', gallery.filter(img => img.id !== id));
    resolve();
  });
};

// --- Leads ---
export const getLeads = (): Promise<Lead[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('leads', []));
  });
};

export const createLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<void> => {
  return new Promise((resolve) => {
    const leads = getStorage<Lead[]>('leads', []);
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    leads.unshift(newLead);
    setStorage('leads', leads);
    resolve();
  });
};

// --- Customers ---
export const getCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('customers', INITIAL_CUSTOMERS));
  });
}

export const saveCustomer = (customer: Customer): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
    const index = list.findIndex(c => c.id === customer.id);
    if (index >= 0) list[index] = customer;
    else list.push(customer);
    setStorage('customers', list);
    resolve();
  });
}

export const deleteCustomer = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
    setStorage('customers', list.filter(c => c.id !== id));
    resolve();
  });
}

// --- Invoices ---
export const getInvoices = (): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('invoices', INITIAL_INVOICES));
  });
}

export const saveInvoice = (invoice: Invoice): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<Invoice[]>('invoices', INITIAL_INVOICES);
    const index = list.findIndex(i => i.id === invoice.id);
    if (index >= 0) list[index] = invoice;
    else list.push(invoice);
    setStorage('invoices', list);
    resolve();
  });
}

// --- Appointments ---
export const getAppointments = (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('appointments', []));
  });
};

export const createAppointment = (appt: Omit<Appointment, 'id'>): Promise<string> => {
  return new Promise((resolve) => {
    const appointments = getStorage<Appointment[]>('appointments', []);
    const newAppt: Appointment = {
      ...appt,
      id: Math.random().toString(36).substr(2, 9)
    };
    appointments.push(newAppt);
    setStorage('appointments', appointments);
    console.log(`[Calendar Service] Added to Google Calendar mock: ${appt.date}`);
    resolve(newAppt.id);
  });
};

// --- Knowledge Base ---
export const getKnowledgeBase = (): Promise<KnowledgeItem[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('knowledge', INITIAL_KNOWLEDGE));
  });
};

export const saveKnowledgeItem = (item: KnowledgeItem): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<KnowledgeItem[]>('knowledge', INITIAL_KNOWLEDGE);
    const index = list.findIndex(k => k.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    setStorage('knowledge', list);
    resolve();
  });
};

export const deleteKnowledgeItem = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<KnowledgeItem[]>('knowledge', INITIAL_KNOWLEDGE);
    setStorage('knowledge', list.filter(k => k.id !== id));
    resolve();
  });
};

// --- Policies ---
export const getPolicies = (): Promise<Policy[]> => {
  return new Promise((resolve) => {
    resolve(getStorage('policies', INITIAL_POLICIES));
  });
};

export const savePolicy = (policy: Policy): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<Policy[]>('policies', INITIAL_POLICIES);
    const index = list.findIndex(p => p.id === policy.id);
    if (index >= 0) {
      list[index] = policy;
    } else {
      list.push(policy);
    }
    setStorage('policies', list);
    resolve();
  });
};

export const deletePolicy = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const list = getStorage<Policy[]>('policies', INITIAL_POLICIES);
    setStorage('policies', list.filter(p => p.id !== id));
    resolve();
  });
};

// --- Settings ---
export const getSettings = (): Promise<AdminSettings> => {
  return new Promise((resolve) => {
    resolve(getStorage('admin_settings', INITIAL_SETTINGS));
  });
};

export const saveSettings = (settings: AdminSettings): Promise<void> => {
  return new Promise((resolve) => {
    setStorage('admin_settings', settings);
    resolve();
  });
};