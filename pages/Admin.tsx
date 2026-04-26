import React, { useState, useEffect } from 'react';
import {
    getProjects, saveProject, deleteProject,
    getLeads, getAppointments, getKnowledgeBase,
    saveKnowledgeItem, deleteKnowledgeItem,
    getSettings, saveSettings,
    getCustomers, saveCustomer, deleteCustomer,
    getInvoices, saveInvoice,
    getPolicies, savePolicy, deletePolicy,
    getGallery, saveGalleryImage, deleteGalleryImage
} from '../services/mockDatabase';
import { Project, Lead, Appointment, KnowledgeItem, AdminSettings, Customer, Invoice, InvoiceItem, Policy, GalleryImage } from '../types';
import Button from '../components/Button';
import {
    LayoutDashboard, FolderOpen, Users, Calendar,
    Bot, Plus, Trash2, Edit2, Upload, Search,
    ChevronDown, Settings, HelpCircle, LogOut, Check, X,
    Shield, User, Bell, Briefcase, FileText, Printer, Send, CreditCard, ScrollText, Image
} from 'lucide-react';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'leads' | 'customers' | 'invoices' | 'calendar' | 'knowledge' | 'settings' | 'policies' | 'gallery'>('dashboard');

    // Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [gallery, setGallery] = useState<GalleryImage[]>([]);

    // Settings State
    const [settings, setSettings] = useState<AdminSettings>({
        adminName: '', adminEmail: '', adminRole: '', adminAvatar: '',
        chatbotEnabled: true, enablePhotoGallery: true, phone: '', password: ''
    });
    const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'company'>('profile');

    // Edit States
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [editingKnowledge, setEditingKnowledge] = useState<Partial<KnowledgeItem> | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
    const [editingPolicy, setEditingPolicy] = useState<Partial<Policy> | null>(null);
    const [newGalleryImage, setNewGalleryImage] = useState<Partial<GalleryImage>>({});
    const [isAddingImage, setIsAddingImage] = useState(false);

    // Invoice Builder State
    const [isBuildingInvoice, setIsBuildingInvoice] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
        items: [],
        type: 'quote',
        status: 'draft',
        date: new Date().toISOString().split('T')[0]
    });

    // Temporary state for adding a new technique
    const [newTechnique, setNewTechnique] = useState('');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        setProjects(await getProjects());
        setLeads(await getLeads());
        setAppointments(await getAppointments());
        setKnowledge(await getKnowledgeBase());
        setSettings(await getSettings());
        setCustomers(await getCustomers());
        setInvoices(await getInvoices());
        setPolicies(await getPolicies());
        setGallery(await getGallery());
    };

    const updateSettings = async (newSettings: Partial<AdminSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await saveSettings(updated);
    };

    // --- Handlers ---
    const handleSaveProject = async () => {
        if (!editingProject?.title || !editingProject.imageUrl) return;

        const newProject = {
            ...editingProject,
            id: editingProject.id || Math.random().toString(36).substr(2, 9),
            date: editingProject.date || new Date().toISOString().split('T')[0],
            techniques: editingProject.techniques || []
        } as Project;

        await saveProject(newProject);
        setIsEditingProject(false);
        setEditingProject(null);
        setNewTechnique('');
        refreshData();
    };

    const handleDeleteProject = async (id: string) => {
        if (window.confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
            await deleteProject(id);
            refreshData();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingProject(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSettings({ adminAvatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSettings({ companyLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewGalleryImage(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveGalleryImage = async () => {
        if (!newGalleryImage.imageUrl) return;

        const img: GalleryImage = {
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: newGalleryImage.imageUrl,
            caption: newGalleryImage.caption
        };

        await saveGalleryImage(img);
        setNewGalleryImage({});
        setIsAddingImage(false);
        refreshData();
    };

    const handleDeleteGalleryImage = async (id: string) => {
        if (window.confirm("Foto verwijderen?")) {
            await deleteGalleryImage(id);
            refreshData();
        }
    };

    const handleAddTechnique = () => {
        if (!newTechnique.trim() || !editingProject) return;
        const currentTechniques = editingProject.techniques || [];
        setEditingProject({
            ...editingProject,
            techniques: [...currentTechniques, newTechnique.trim()]
        });
        setNewTechnique('');
    };

    const handleRemoveTechnique = (index: number) => {
        if (!editingProject?.techniques) return;
        const newTechniques = [...editingProject.techniques];
        newTechniques.splice(index, 1);
        setEditingProject({
            ...editingProject,
            techniques: newTechniques
        });
    };

    const handleSaveKnowledge = async () => {
        if (!editingKnowledge?.topic || !editingKnowledge.content) return;

        const newItem = {
            ...editingKnowledge,
            id: editingKnowledge.id || Math.random().toString(36).substr(2, 9)
        } as KnowledgeItem;

        await saveKnowledgeItem(newItem);
        setEditingKnowledge(null);
        refreshData();
    };

    const handleDeleteKnowledge = async (id: string) => {
        await deleteKnowledgeItem(id);
        refreshData();
    };

    const handleSaveCustomer = async () => {
        if (!editingCustomer?.name || !editingCustomer.email) return;
        const newCustomer = {
            ...editingCustomer,
            id: editingCustomer.id || Math.random().toString(36).substr(2, 9)
        } as Customer;
        await saveCustomer(newCustomer);
        setEditingCustomer(null);
        refreshData();
    }

    const handleDeleteCustomer = async (id: string) => {
        if (window.confirm("Klant verwijderen?")) {
            await deleteCustomer(id);
            refreshData();
        }
    }

    const handleSavePolicy = async () => {
        if (!editingPolicy?.title || !editingPolicy.content) return;
        const newPolicy = {
            ...editingPolicy,
            id: editingPolicy.id || editingPolicy.title?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9),
            lastUpdated: new Date().toISOString().split('T')[0]
        } as Policy;
        await savePolicy(newPolicy);
        setEditingPolicy(null);
        refreshData();
    }

    const handleDeletePolicy = async (id: string) => {
        if (window.confirm("Beleid verwijderen?")) {
            await deletePolicy(id);
            refreshData();
        }
    }

    // Invoice Builder Handlers
    const handleAddInvoiceItem = () => {
        const items = currentInvoice.items || [];
        const newItem: InvoiceItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: '',
            quantity: 1,
            price: 0,
            vatRate: 21
        };
        setCurrentInvoice({ ...currentInvoice, items: [...items, newItem] });
    }

    const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
        const items = currentInvoice.items?.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ) || [];
        setCurrentInvoice({ ...currentInvoice, items });
    }

    const calculateInvoiceTotal = () => {
        return currentInvoice.items?.reduce((acc, item) => {
            return acc + (item.quantity * item.price * (1 + item.vatRate / 100));
        }, 0) || 0;
    }

    const handleSaveInvoice = async (status: 'draft' | 'sent') => {
        if (!currentInvoice.customerId) {
            alert("Selecteer eerst een klant.");
            return;
        }

        const total = calculateInvoiceTotal();
        const invoice: Invoice = {
            ...currentInvoice,
            id: currentInvoice.id || Math.random().toString(36).substr(2, 9),
            number: currentInvoice.number || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status,
            totalAmount: total,
            dueDate: currentInvoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        } as Invoice;

        await saveInvoice(invoice);
        setIsBuildingInvoice(false);
        refreshData();
        if (status === 'sent') alert(`Document verstuurd naar klant!`);
    }


    // --- UI Components ---

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange?: () => void }) => (
        <div
            className={`w-12 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${checked ? 'bg-brand-red' : 'bg-brand-light'}`}
            onClick={onChange}
        >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    );

    const InputField = ({ label, value, onChange, placeholder, type = "text", area = false, className }: any) => (
        <div className={`mb-5 ${className}`}>
            <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
            {area ? (
                <textarea
                    className="w-full bg-white border border-brand-light rounded-lg px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all resize-none"
                    rows={4}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : (
                <div className="relative group">
                    <input
                        type={type}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all pr-10"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                    <div className="absolute right-3 top-3 text-gray-400 group-hover:text-black transition-colors pointer-events-none cursor-pointer">
                        <Edit2 size={16} />
                    </div>
                </div>
            )}
        </div>
    );

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === id
                ? 'bg-brand-light text-brand-red font-semibold'
                : 'text-brand-dark opacity-60 hover:text-brand-red hover:bg-brand-light/50'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    const SectionHeader = ({ title, subtitle, action }: any) => (
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
            {action}
        </div>
    );

    // --- Sidebar ---
    const Sidebar = () => (
        <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-10">

            {/* User Profile Widget */}
            <div className="p-6 pb-2">
                <div
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-3 mb-10 hover:bg-gray-50 p-3 -mx-3 rounded-xl cursor-pointer transition-colors"
                >
                    <img
                        src={settings.adminAvatar}
                        alt="Admin"
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-brand-dark opacity-40 font-bold uppercase tracking-wider">Beheerder</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-brand-dark truncate">{settings.adminName}</p>
                            <ChevronDown size={14} className="text-brand-dark opacity-40" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 mt-2">Main</p>
                    <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                    <TabButton id="projects" label="Projecten" icon={FolderOpen} />
                    <TabButton id="gallery" label="Galerij" icon={Image} />
                    <TabButton id="leads" label="Aanvragen" icon={Users} />
                    <TabButton id="calendar" label="Agenda" icon={Calendar} />
                    <TabButton id="knowledge" label="AI Kennisbank" icon={Bot} />
                </div>

                <div className="space-y-1 mt-6">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Business</p>
                    <TabButton id="customers" label="Klanten" icon={Briefcase} />
                    <TabButton id="invoices" label="Facturen & Offertes" icon={FileText} />
                </div>

                <div className="space-y-1 mt-6">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Other</p>
                    <TabButton id="policies" label="Beleid" icon={ScrollText} />
                    <TabButton id="settings" label="Instellingen" icon={Settings} />
                    <button
                        onClick={() => window.location.hash = 'home'}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors mt-2"
                    >
                        <LogOut size={18} className="rotate-180" /> <span>Terug naar Website</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-red hover:bg-brand-red/10 transition-colors"
                    >
                        <LogOut size={18} /> <span>Uitloggen</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Content Renderers ---

    const renderLeads = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Aanvragen" subtitle="Beheer binnengekomen leads" />
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Naam</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Bericht</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{lead.name}</div>
                                    <div className="text-gray-400 text-xs">{lead.email}</div>
                                    <div className="text-gray-400 text-xs">{lead.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{lead.floorType}</div>
                                    <div className="text-xs text-gray-500">{lead.areaSize} m²</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{lead.message || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {lead.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nog geen aanvragen.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderGallery = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader
                title="Fotogalerij"
                subtitle="Beheer losse projectfoto's"
                action={
                    <Button size="sm" onClick={() => setIsAddingImage(true)}>
                        <Plus size={16} className="mr-2" /> Foto Toevoegen
                    </Button>
                }
            />

            {isAddingImage && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-6">Nieuwe Foto Uploaden</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <InputField
                                label="Omschrijving (Optioneel)"
                                value={newGalleryImage.caption || ''}
                                onChange={(e: any) => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })}
                                placeholder="Bijv. Detail badkamer"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 ml-1">Afbeelding</label>
                            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-48 flex flex-col items-center justify-center relative overflow-hidden group hover:border-black transition-colors">
                                {newGalleryImage.imageUrl ? (
                                    <>
                                        <img src={newGalleryImage.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium text-sm">Wijzigen</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-400">Upload Foto</p>
                                    </div>
                                )}
                                <input type="file" onChange={handleGalleryImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setIsAddingImage(false); setNewGalleryImage({}); }} className="px-6 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Annuleren</button>
                        <button onClick={handleSaveGalleryImage} className="px-6 py-3 rounded-xl text-sm bg-black text-white hover:bg-gray-800">Opslaan</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map(img => (
                    <div key={img.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm">
                        <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                            {img.caption && <p className="text-white font-medium text-sm mb-4">{img.caption}</p>}
                            <button
                                onClick={() => handleDeleteGalleryImage(img.id)}
                                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {gallery.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
                        Nog geen foto's in de galerij.
                    </div>
                )}
            </div>
        </div>
    );

    const renderCalendar = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Agenda" subtitle="Afspraken en bezichtigingen" />
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                    {appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(appt => (
                        <div key={appt.id} className="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0 w-16 text-center mr-6">
                                <div className="text-xs font-bold text-gray-400 uppercase">{new Date(appt.date).toLocaleDateString('nl-NL', { month: 'short' })}</div>
                                <div className="text-2xl font-bold text-black">{new Date(appt.date).getDate()}</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-bold text-gray-900">{appt.customerName}</h4>
                                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{new Date(appt.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">{appt.notes}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                    <span className="mr-3">{appt.customerEmail}</span>
                                    {appt.source === 'chatbot' && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center"><Bot size={10} className="mr-1" /> AI Boeking</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && <p className="text-center text-gray-400 py-8">Geen afspraken gepland.</p>}
                </div>
            </div>
        </div>
    );

    const renderKnowledge = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader
                title="AI Kennisbank"
                subtitle="Beheer de kennis van de chatbot"
                action={
                    <Button size="sm" onClick={() => setEditingKnowledge({})}>
                        <Plus size={16} className="mr-2" /> Item Toevoegen
                    </Button>
                }
            />

            {editingKnowledge && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-6">{editingKnowledge.id ? 'Kennis Item Bewerken' : 'Nieuw Item'}</h3>
                    <div className="space-y-4">
                        <InputField
                            label="Onderwerp"
                            value={editingKnowledge.topic || ''}
                            onChange={(e: any) => setEditingKnowledge({ ...editingKnowledge, topic: e.target.value })}
                            placeholder="bijv. Openingstijden"
                        />
                        <InputField
                            label="Inhoud"
                            value={editingKnowledge.content || ''}
                            onChange={(e: any) => setEditingKnowledge({ ...editingKnowledge, content: e.target.value })}
                            placeholder="Het antwoord dat de AI moet geven..."
                            area
                        />
                    </div>
                    <div className="flex justify-end pt-6 mt-6 border-t border-gray-100 gap-3">
                        <button onClick={() => setEditingKnowledge(null)} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">Annuleren</button>
                        <button onClick={handleSaveKnowledge} className="px-6 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800">Opslaan</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {knowledge.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <HelpCircle size={20} />
                                </div>
                                <h4 className="font-bold text-gray-900">{item.topic}</h4>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingKnowledge(item)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteKnowledge(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {item.content}
                        </p>
                    </div>
                ))}
                {knowledge.length === 0 && (
                    <div className="col-span-2 text-center text-gray-400 py-12 bg-white rounded-3xl border border-gray-100">
                        Nog geen kennis items. Voeg items toe zodat de chatbot vragen kan beantwoorden.
                    </div>
                )}
            </div>
        </div>
    );

    const renderPolicies = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader
                title="Beleid & Voorwaarden"
                subtitle="Beheer juridische documenten die in de footer verschijnen."
                action={
                    <Button size="sm" onClick={() => setEditingPolicy({})}>
                        <Plus size={16} className="mr-2" /> Document Toevoegen
                    </Button>
                }
            />

            {editingPolicy && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-6">{editingPolicy.id ? 'Document Bewerken' : 'Nieuw Document'}</h3>
                    <div className="space-y-4">
                        <InputField label="Titel" value={editingPolicy.title || ''} onChange={(e: any) => setEditingPolicy({ ...editingPolicy, title: e.target.value })} placeholder="bv. Privacybeleid" />
                        <InputField label="Inhoud" value={editingPolicy.content || ''} onChange={(e: any) => setEditingPolicy({ ...editingPolicy, content: e.target.value })} area placeholder="De volledige tekst..." />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditingPolicy(null)} className="px-6 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Annuleren</button>
                        <button onClick={handleSavePolicy} className="px-6 py-3 rounded-xl text-sm bg-black text-white hover:bg-gray-800">Opslaan</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Titel</th>
                            <th className="px-6 py-4">Laatst bijgewerkt</th>
                            <th className="px-6 py-4 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(p => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{p.title}</td>
                                <td className="px-6 py-4 text-gray-500">{p.lastUpdated}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => setEditingPolicy(p)} className="p-2 hover:bg-gray-200 rounded-full"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeletePolicy(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-full"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {policies.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-8 text-gray-400">Nog geen beleidsdocumenten.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Dashboard" subtitle="Overzicht van uw bedrijfsprestaties" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Omzet (Dit Jaar)', value: `€${invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}`, icon: CreditCard, color: 'bg-green-50 text-green-600' },
                    { label: 'Actieve Aanvragen', value: leads.filter(l => l.status === 'new').length, icon: Users, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Openstaande Facturen', value: invoices.filter(i => i.status === 'sent').length, icon: FileText, color: 'bg-red-50 text-red-600' },
                    { label: 'Klanten', value: customers.length, icon: Briefcase, color: 'bg-orange-50 text-orange-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-light flex items-center space-x-4">
                        <div className={`p-4 rounded-2xl ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-brand-dark opacity-40 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-brand-dark">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Short list of recent leads */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Recente Aanvragen</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-sm text-gray-400 hover:text-black">Bekijk alles</button>
                </div>
                <div className="space-y-4">
                    {leads.slice(0, 3).map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {lead.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{lead.name}</h4>
                                    <p className="text-xs text-gray-500">{lead.floorType} • {lead.areaSize} m²</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-gray-600">
                                {lead.status === 'new' ? 'Nieuw' : lead.status === 'contacted' ? 'Gecontacteerd' : 'Afgerond'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCustomers = () => (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader
                title="Klanten"
                subtitle="Beheer uw klantenbestand"
                action={
                    <Button size="sm" onClick={() => setEditingCustomer({})}>
                        <Plus size={16} className="mr-2" /> Nieuwe Klant
                    </Button>
                }
            />

            {editingCustomer && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
                    <h3 className="font-bold text-lg mb-6">{editingCustomer.id ? 'Klant Bewerken' : 'Nieuwe Klant'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Naam" value={editingCustomer.name || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, name: e.target.value })} />
                        <InputField label="Bedrijfsnaam (Optioneel)" value={editingCustomer.companyName || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, companyName: e.target.value })} />
                        <InputField label="Email" value={editingCustomer.email || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, email: e.target.value })} />
                        <InputField label="Telefoon" value={editingCustomer.phone || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} />
                        <InputField label="Adres" value={editingCustomer.address || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, address: e.target.value })} />
                        <div className="flex gap-4">
                            <InputField label="Postcode" className="w-1/3" value={editingCustomer.zip || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, zip: e.target.value })} />
                            <InputField label="Stad" className="flex-1" value={editingCustomer.city || ''} onChange={(e: any) => setEditingCustomer({ ...editingCustomer, city: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditingCustomer(null)} className="px-6 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Annuleren</button>
                        <button onClick={handleSaveCustomer} className="px-6 py-3 rounded-xl text-sm bg-black text-white hover:bg-gray-800">Opslaan</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Naam</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Adres</th>
                            <th className="px-6 py-4 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{customer.name}</div>
                                    <div className="text-gray-400 text-xs">{customer.companyName}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div>{customer.email}</div>
                                    <div>{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.address}, {customer.city}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => setEditingCustomer(customer)} className="p-2 hover:bg-gray-200 rounded-full"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeleteCustomer(customer.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-full"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-400">Nog geen klanten.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderInvoices = () => {
        if (isBuildingInvoice) {
            // --- INVOICE BUILDER UI ---
            const selectedCustomer = customers.find(c => c.id === currentInvoice.customerId);
            const total = calculateInvoiceTotal();

            return (
                <div className="animate-in slide-in-from-bottom-8">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setIsBuildingInvoice(false)} className="flex items-center text-gray-500 hover:text-black">
                            <ChevronDown className="rotate-90 mr-2" size={20} /> Terug naar overzicht
                        </button>
                        <h2 className="text-2xl font-bold">Nieuwe {currentInvoice.type === 'quote' ? 'Offerte' : 'Factuur'}</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Editor */}
                        <div className="flex-1 space-y-6">

                            {/* 1. Header Info */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold mb-4">Basis Gegevens</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Type</label>
                                        <div className="flex bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setCurrentInvoice({ ...currentInvoice, type: 'quote' })}
                                                className={`flex-1 py-2 text-sm font-medium rounded-md ${currentInvoice.type === 'quote' ? 'bg-white shadow-sm' : ''}`}
                                            >Offerte</button>
                                            <button
                                                onClick={() => setCurrentInvoice({ ...currentInvoice, type: 'invoice' })}
                                                className={`flex-1 py-2 text-sm font-medium rounded-md ${currentInvoice.type === 'invoice' ? 'bg-white shadow-sm' : ''}`}
                                            >Factuur</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Klant</label>
                                        <select
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                            value={currentInvoice.customerId || ''}
                                            onChange={(e) => setCurrentInvoice({ ...currentInvoice, customerId: e.target.value })}
                                        >
                                            <option value="">Selecteer Klant...</option>
                                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>)}
                                        </select>
                                    </div>
                                    <InputField label="Factuurdatum" type="date" value={currentInvoice.date} onChange={(e: any) => setCurrentInvoice({ ...currentInvoice, date: e.target.value })} />
                                    <InputField label="Vervaldatum" type="date" value={currentInvoice.dueDate} onChange={(e: any) => setCurrentInvoice({ ...currentInvoice, dueDate: e.target.value })} />
                                </div>
                            </div>

                            {/* 2. Line Items */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Regels</h3>
                                    <button onClick={handleAddInvoiceItem} className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800">+ Regel</button>
                                </div>
                                <div className="space-y-3">
                                    {currentInvoice.items?.map((item, idx) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <input
                                                className="flex-1 bg-gray-50 p-2 rounded-lg text-sm border border-transparent focus:border-black"
                                                placeholder="Omschrijving"
                                                value={item.description}
                                                onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                                            />
                                            <input
                                                type="number" className="w-16 bg-gray-50 p-2 rounded-lg text-sm" placeholder="Aantal"
                                                value={item.quantity}
                                                onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                                            />
                                            <input
                                                type="number" className="w-24 bg-gray-50 p-2 rounded-lg text-sm" placeholder="Prijs"
                                                value={item.price}
                                                onChange={(e) => updateInvoiceItem(item.id, 'price', Number(e.target.value))}
                                            />
                                            <select
                                                className="w-20 bg-gray-50 p-2 rounded-lg text-sm"
                                                value={item.vatRate}
                                                onChange={(e) => updateInvoiceItem(item.id, 'vatRate', Number(e.target.value))}
                                            >
                                                <option value={21}>21%</option>
                                                <option value={9}>9%</option>
                                                <option value={0}>0%</option>
                                            </select>
                                            <button
                                                onClick={() => {
                                                    const newItems = currentInvoice.items?.filter(i => i.id !== item.id);
                                                    setCurrentInvoice({ ...currentInvoice, items: newItems });
                                                }}
                                                className="text-red-500 p-2"
                                            ><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    {currentInvoice.items?.length === 0 && <p className="text-sm text-gray-400 italic">Nog geen regels toegevoegd.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right: Live Preview */}
                        <div className="w-full lg:w-[450px]">
                            <div className="bg-white rounded shadow-2xl p-8 min-h-[600px] text-xs flex flex-col relative" style={{ fontFamily: 'Arial, sans-serif' }}>
                                {/* Preview Badge */}
                                <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 px-3 py-1 rounded-bl-lg text-[10px] font-bold uppercase">Voorbeeld</div>

                                <div className="flex justify-between items-start mb-12 mt-4">
                                    <div>
                                        {settings.companyLogo ? (
                                            <img src={settings.companyLogo} className="h-12 object-contain mb-4" alt="Logo" />
                                        ) : (
                                            <div className="h-12 w-32 bg-gray-100 flex items-center justify-center text-gray-400 mb-4">Logo</div>
                                        )}
                                        <p className="font-bold text-lg">{settings.companyName}</p>
                                        <p className="text-gray-500">{settings.companyAddress}</p>
                                        <p className="text-gray-500">{settings.companyZip} {settings.companyCity}</p>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-xl font-bold uppercase tracking-widest text-gray-800">{currentInvoice.type === 'quote' ? 'OFFERTE' : 'FACTUUR'}</h1>
                                        <p className="text-gray-500 mt-2">Nr: {currentInvoice.number || 'CONCEPT'}</p>
                                        <p className="text-gray-500">Datum: {currentInvoice.date}</p>
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold mb-2">Aan</p>
                                    {selectedCustomer ? (
                                        <>
                                            <p className="font-bold">{selectedCustomer.companyName || selectedCustomer.name}</p>
                                            {selectedCustomer.companyName && <p>{selectedCustomer.name}</p>}
                                            <p>{selectedCustomer.address}</p>
                                            <p>{selectedCustomer.zip} {selectedCustomer.city}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">Selecteer een klant...</p>
                                    )}
                                </div>

                                <table className="w-full mb-8">
                                    <thead className="border-b-2 border-gray-100 pb-2">
                                        <tr className="text-left text-gray-500">
                                            <th className="pb-2 w-1/2">Omschrijving</th>
                                            <th className="pb-2 text-right">Aantal</th>
                                            <th className="pb-2 text-right">Prijs</th>
                                            <th className="pb-2 text-right">Totaal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentInvoice.items?.map(item => (
                                            <tr key={item.id} className="border-b border-gray-50">
                                                <td className="py-2">{item.description}</td>
                                                <td className="py-2 text-right">{item.quantity}</td>
                                                <td className="py-2 text-right">€{item.price.toFixed(2)}</td>
                                                <td className="py-2 text-right font-medium">€{(item.quantity * item.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mt-auto pt-8 border-t border-gray-100">
                                    <div className="text-right space-y-2">
                                        <div className="flex justify-between w-48 text-gray-500">
                                            <span>Subtotaal:</span>
                                            <span>€{(total / 1.21).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between w-48 text-gray-500">
                                            <span>BTW (21%):</span>
                                            <span>€{(total - (total / 1.21)).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between w-48 font-bold text-lg text-black pt-2 border-t border-gray-200">
                                            <span>Totaal:</span>
                                            <span>€{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Details from Settings */}
                                <div className="mt-12 pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center flex justify-between">
                                    <span>KVK: {settings.companyKvk}</span>
                                    <span>BTW: {settings.companyBtw}</span>
                                    <span>IBAN: {settings.companyIban}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button className="flex-1 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50" onClick={() => handleSaveInvoice('draft')}>
                                    Opslaan als Concept
                                </Button>
                                <Button className="flex-1" withIcon onClick={() => handleSaveInvoice('sent')}>
                                    <Send className="mr-2 w-4 h-4" /> Verstuur naar Klant
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // --- INVOICE LIST UI ---
        return (
            <div className="space-y-6 animate-in fade-in">
                <SectionHeader
                    title="Facturen & Offertes"
                    subtitle="Beheer uw financiële documenten"
                    action={
                        <Button size="sm" onClick={() => { setIsBuildingInvoice(true); setCurrentInvoice({ items: [], type: 'quote', status: 'draft', date: new Date().toISOString().split('T')[0] }) }}>
                            <Plus size={16} className="mr-2" /> Nieuw Document
                        </Button>
                    }
                />

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Nummer</th>
                                <th className="px-6 py-4">Klant</th>
                                <th className="px-6 py-4">Datum</th>
                                <th className="px-6 py-4">Bedrag</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => {
                                const customer = customers.find(c => c.id === invoice.customerId);
                                return (
                                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold">{invoice.number}</td>
                                        <td className="px-6 py-4">{customer?.name || 'Onbekend'}</td>
                                        <td className="px-6 py-4 text-gray-500">{invoice.date}</td>
                                        <td className="px-6 py-4 font-medium">€{invoice.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                                    invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-200 text-gray-700'
                                                }`}>
                                                {invoice.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-black"><Printer size={18} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {invoices.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nog geen facturen aangemaakt.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const renderProjects = () => (
        <div className="space-y-6">
            <SectionHeader
                title="Projecten"
                subtitle="Beheer uw portfolio items"
                action={
                    <Button size="sm" onClick={() => { setEditingProject({ techniques: [] }); setIsEditingProject(true); }}>
                        <Plus size={16} className="mr-2" /> Project Toevoegen
                    </Button>
                }
            />

            {isEditingProject && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg">{editingProject?.id ? 'Project Bewerken' : 'Nieuw Project'}</h3>
                        <button onClick={() => setIsEditingProject(false)} className="text-gray-400 hover:text-black"><LogOut size={20} className="rotate-180" /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-2">
                            <InputField
                                label="Project Titel"
                                value={editingProject?.title || ''}
                                onChange={(e: any) => setEditingProject({ ...editingProject, title: e.target.value })}
                                placeholder="bijv. Modern Loft Amsterdam"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Oppervlakte (m²)"
                                    type="number"
                                    value={editingProject?.areaSize || ''}
                                    onChange={(e: any) => setEditingProject({ ...editingProject, areaSize: Number(e.target.value) })}
                                    placeholder="0"
                                />
                                <InputField
                                    label="Locatie"
                                    value={editingProject?.location || ''}
                                    onChange={(e: any) => setEditingProject({ ...editingProject, location: e.target.value })}
                                    placeholder="Stad"
                                />
                            </div>

                            <InputField
                                label="Korte Beschrijving"
                                value={editingProject?.description || ''}
                                onChange={(e: any) => setEditingProject({ ...editingProject, description: e.target.value })}
                                placeholder="Korte samenvatting voor op de overzichtspagina..."
                                area
                            />

                            <InputField
                                label="Uitgebreide Beschrijving (Detail Pagina)"
                                value={editingProject?.longDescription || ''}
                                onChange={(e: any) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                                placeholder="Het volledige verhaal achter het project..."
                                area
                            />

                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-2">Toegepaste Technieken</label>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                    {editingProject?.techniques && editingProject.techniques.map((tech, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                            <span className="text-sm text-gray-700">{tech}</span>
                                            <button onClick={() => handleRemoveTechnique(idx)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={newTechnique}
                                            onChange={(e) => setNewTechnique(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTechnique()}
                                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-black"
                                            placeholder="Nieuwe techniek toevoegen..."
                                        />
                                        <button onClick={handleAddTechnique} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Toevoegen</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 ml-1">Project Afbeelding</label>
                            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-64 flex flex-col items-center justify-center relative overflow-hidden group hover:border-black transition-colors">
                                {editingProject?.imageUrl ? (
                                    <>
                                        <img src={editingProject.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium text-sm">Afbeelding Wijzigen</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-400">Klik om te uploaden</p>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-gray-100 gap-3">
                        <button onClick={() => setIsEditingProject(false)} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">Annuleren</button>
                        <button onClick={handleSaveProject} className="px-6 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">Opslaan</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {projects.map((p, idx) => (
                    <div key={p.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== projects.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="flex items-center space-x-6">
                            <div className="h-16 w-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{p.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-md">{p.description}</p>
                                <div className="flex gap-3 mt-2">
                                    <span className="text-xs font-medium text-gray-400 flex items-center"><Check size={12} className="mr-1" /> {p.areaSize} m²</span>
                                    <span className="text-xs font-medium text-gray-400 flex items-center"><Check size={12} className="mr-1" /> {p.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => { setEditingProject(p); setIsEditingProject(true) }} className="p-2 text-gray-400 hover:text-black transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Instellingen</h2>
            <p className="text-gray-500 mb-8">Beheer uw profiel, beveiliging en bedrijfsgegevens.</p>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 border-r border-gray-100 p-6">
                    <div className="space-y-1">
                        <button onClick={() => setSettingsTab('profile')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-colors ${settingsTab === 'profile' ? 'bg-gray-100 text-black font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <User size={18} /> <span>Profiel</span>
                        </button>
                        <button onClick={() => setSettingsTab('company')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-colors ${settingsTab === 'company' ? 'bg-gray-100 text-black font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <Briefcase size={18} /> <span>Bedrijf</span>
                        </button>
                        <button onClick={() => setSettingsTab('security')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-colors ${settingsTab === 'security' ? 'bg-gray-100 text-black font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <Shield size={18} /> <span>Beveiliging</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {settingsTab === 'profile' && (
                        <div className="max-w-2xl space-y-8 animate-in fade-in">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Profiel Informatie</h3>
                                <p className="text-gray-400 text-sm">Beheer uw openbare profiel.</p>
                            </div>
                            <div className="flex items-center gap-6 py-4 border-b border-gray-50">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100">
                                        <img src={settings.adminAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit2 className="text-white w-6 h-6" />
                                        <input type="file" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <InputField label="Volledige Naam" value={settings.adminName} onChange={(e: any) => updateSettings({ adminName: e.target.value })} />
                                <InputField label="Functie" value={settings.adminRole} onChange={(e: any) => updateSettings({ adminRole: e.target.value })} />
                                <InputField label="Email Adres" value={settings.adminEmail} onChange={(e: any) => updateSettings({ adminEmail: e.target.value })} />
                                <InputField label="Telefoonnummer" value={settings.phone || ''} onChange={(e: any) => updateSettings({ phone: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {settingsTab === 'company' && (
                        <div className="max-w-2xl space-y-8 animate-in fade-in">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Bedrijfsgegevens</h3>
                                <p className="text-gray-400 text-sm">Deze gegevens worden gebruikt op uw facturen en offertes.</p>
                            </div>

                            {/* Company Logo Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-900">Bedrijfslogo</label>
                                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-32 flex flex-col items-center justify-center relative overflow-hidden group hover:border-black transition-colors w-64">
                                    {settings.companyLogo ? (
                                        <>
                                            <img src={settings.companyLogo} className="absolute inset-0 w-full h-full object-contain p-4" alt="Company Logo" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium text-sm">Logo Wijzigen</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-400">Upload Logo</p>
                                        </div>
                                    )}
                                    <input type="file" onChange={handleCompanyLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <InputField label="Bedrijfsnaam" value={settings.companyName || ''} onChange={(e: any) => updateSettings({ companyName: e.target.value })} />
                                <InputField label="Adres" value={settings.companyAddress || ''} onChange={(e: any) => updateSettings({ companyAddress: e.target.value })} />
                                <div className="flex gap-4">
                                    <InputField label="Postcode" className="w-1/3" value={settings.companyZip || ''} onChange={(e: any) => updateSettings({ companyZip: e.target.value })} />
                                    <InputField label="Stad" className="flex-1" value={settings.companyCity || ''} onChange={(e: any) => updateSettings({ companyCity: e.target.value })} />
                                </div>
                                <div className="flex gap-4">
                                    <InputField label="KVK Nummer" value={settings.companyKvk || ''} onChange={(e: any) => updateSettings({ companyKvk: e.target.value })} />
                                    <InputField label="BTW Nummer" value={settings.companyBtw || ''} onChange={(e: any) => updateSettings({ companyBtw: e.target.value })} />
                                </div>
                                <InputField label="IBAN (voor facturen)" value={settings.companyIban || ''} onChange={(e: any) => updateSettings({ companyIban: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {settingsTab === 'security' && (
                        <div className="max-w-2xl space-y-8 animate-in fade-in">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Beveiliging & Features</h3>
                                <p className="text-gray-400 text-sm">Beheer uw wachtwoord en website features.</p>
                            </div>
                            <div className="space-y-6">
                                <InputField label="Wachtwoord" type="password" value={settings.password} onChange={(e: any) => updateSettings({ password: e.target.value })} />

                                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-900">AI Chatbot</h4>
                                        <p className="text-xs text-gray-500">Klantenservice op de website.</p>
                                    </div>
                                    <Toggle checked={settings.chatbotEnabled} onChange={() => updateSettings({ chatbotEnabled: !settings.chatbotEnabled })} />
                                </div>

                                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-900">Fotogalerij</h4>
                                        <p className="text-xs text-gray-500">Toon losse foto sectie bij projecten.</p>
                                    </div>
                                    <Toggle checked={settings.enablePhotoGallery} onChange={() => updateSettings({ enablePhotoGallery: !settings.enablePhotoGallery })} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen font-sans text-gray-900 bg-gray-50">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-72 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'projects' && renderProjects()}
                    {activeTab === 'gallery' && renderGallery()}
                    {activeTab === 'leads' && renderLeads()}
                    {activeTab === 'customers' && renderCustomers()}
                    {activeTab === 'invoices' && renderInvoices()}
                    {activeTab === 'calendar' && renderCalendar()}
                    {activeTab === 'knowledge' && renderKnowledge()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'policies' && renderPolicies()}
                </div>
            </div>
        </div>
    );
};

export default Admin;