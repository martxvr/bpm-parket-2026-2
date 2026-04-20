"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, LayoutGrid, ChevronsUp, Grid3x3, Blinds, Columns
} from 'lucide-react';
import CheckedIcon from '@/components/ui/checked-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import ArrowBackIcon from '@/components/ui/arrow-back-icon';
import SparklesIcon from '@/components/ui/sparkles-icon';
import CameraIcon from '@/components/ui/camera-icon';
import StarIcon from '@/components/ui/star-icon';
import { companyConfig } from '@/config';
import { submitOfferte } from '../actions';
import { categories } from '@/data/brands';

const FLOOR_TYPES = [
    { id: 'pvc-vloeren', icon: LayoutGrid, title: 'PVC-vloeren', desc: 'Stijlvol en onderhoudsvriendelijk' },
    { id: 'houten-vloeren', icon: Grid3x3, title: 'Houten Vloeren', desc: 'Warmte en comfort in huis' },
    { id: 'traprenovatie', icon: ChevronsUp, title: 'Traprenovatie', desc: 'Geef uw trap een nieuw leven' },
    { id: 'vloerbedekking', icon: SparklesIcon, title: 'Vloerbedekking', desc: 'Sfeervol en zacht' },
    { id: 'raamdecoratie', icon: Blinds, title: 'Raamdecoratie', desc: 'Perfecte lichtinval' },
    { id: 'gordijnen', icon: Columns, title: 'Gordijnen', desc: 'Gordijnen op maat' },
    { id: 'Anders', icon: CheckedIcon, title: 'Anders', desc: 'Specifieke wensen' },
];

export default function OfferteClient({ bedrijfsgegevens }: { bedrijfsgegevens?: any }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        floorType: '',
        brand: '',
        variant: '',
        areaSize: 50,
        message: ''
    });

    const companyPhone = bedrijfsgegevens?.phone || companyConfig.contact.phone;
    const companyEmail = bedrijfsgegevens?.email || companyConfig.contact.email;
    const companyName = bedrijfsgegevens?.companyName || companyConfig.name;

    // Derived Selection Data
    const selectedCategory = useMemo(() => {
        return categories.find(c => c.slug === formData.floorType);
    }, [formData.floorType]);

    const availableBrands = selectedCategory ? selectedCategory.brands : [];

    const selectedBrandFull = useMemo(() => {
        return availableBrands.find(b => b.name === formData.brand);
    }, [formData.brand, availableBrands]);

    const availableVariants = selectedBrandFull?.products || [];

    // Step UI Configuration
    const displaySteps = [
        { num: 1, label: 'Type Vloer' },
        { num: 2, label: 'Kies Merk' },
        { num: 3, label: 'Kies Variant' },
        { num: 4, label: 'Oppervlakte' },
        { num: 5, label: 'Contactgegevens' }
    ];

    const handleNext = () => {
        if (step === 1 && !formData.floorType) return;
        if (step === 2 && !formData.brand) return;
        if (step === 3 && !formData.variant) return;

        // Routing Logic
        if (step === 1) {
            const hasBrands = selectedCategory?.brands && selectedCategory.brands.length > 0;

            if (!hasBrands) {
                setStep(4); // Skip to area size if no brands available (service categories)
            } else {
                setStep(2); // Go to brand selection
            }
            return;
        }

        if (step === 2) {
            if (availableVariants.length === 0 || formData.brand === 'Geen voorkeur') {
                setStep(4); // Skip to area size if no variants or no brand selected
            } else {
                setStep(3); // Go to variant selection
            }
            return;
        }

        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step === 4) {
            const hasVariants = availableVariants.length > 0;
            const hasBrands = availableBrands.length > 0;

            if (!hasVariants || formData.brand === 'Geen voorkeur' || formData.brand === 'Nog geen voorkeur') {
                if (!hasBrands) {
                    setStep(1);
                } else {
                    setStep(2);
                }
            } else {
                setStep(3);
            }
            return;
        }
        if (step === 2) {
            setStep(1);
            return;
        }
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            // Append brand and variant to the message if they exist so it's readable in standard emails
            const enrichedFormData = {
                ...formData,
                message: formData.message + (formData.brand ? `\n\nGewenst merk: ${formData.brand}` : '') + (formData.variant ? `\nGewenste variant: ${formData.variant}` : '')
            }
            await submitOfferte(enrichedFormData);
            setSubmitted(true);
        } catch(error) {
            console.error("Failed to submit", error);
        }
    };

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const selectFloorType = (typeId: string) => {
        updateData('floorType', typeId);
        const category = categories.find(c => c.slug === typeId);
        const hasBrands = category?.brands && category.brands.length > 0;
        setStep(!hasBrands ? 4 : 2);
    };

    const selectBrand = (brandName: string) => {
        updateData('brand', brandName);
        const brand = availableBrands.find(b => b.name === brandName);
        const variants = brand?.products || [];
        setStep(variants.length === 0 || brandName === 'Geen voorkeur' ? 4 : 3);
    };

    const selectVariant = (variantName: string) => {
        updateData('variant', variantName);
        setStep(4);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg w-full">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#5EBE1B] text-white mb-6">
                        <CheckedIcon size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Aanvraag Verstuurd!</h2>
                    <p className="text-gray-500 mb-8">
                        Bedankt {formData.name}. We hebben je gegevens succesvol ontvangen en gaan direct aan de slag om een scherpe, vrijblijvende prijsindicatie op te stellen. We nemen snel contact met je op!
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gray-100 text-gray-900 px-8 py-3 rounded-[5px] font-medium hover:bg-gray-200 transition-colors"
                    >
                        Terug naar home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[600px] border border-gray-100">

                {/* Left Sidebar */}
                <div className="w-full lg:w-1/3 bg-[#FAFAFA] p-8 lg:p-12 flex flex-col justify-between border-r border-gray-100 relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#5EBE1B] opacity-[0.03] rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-12">
                            <span className="font-bold text-xl uppercase tracking-widest text-[#5EBE1B]">{companyName}</span>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="font-bold text-gray-900 text-3xl">Jouw Offerte</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Stel eenvoudig je ideale droomvloer samen. Wij verzorgen vervolgens een transparante en scherpe prijs.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                {displaySteps.map((s) => {
                                    // Skip visual steps if they are implicitly skipped by the dynamic routing
                                    if (s.num === 2 && availableBrands.length === 0 && step > 1) return null;
                                    if (s.num === 3 && (availableVariants.length === 0 || formData.brand === 'Geen voorkeur') && step > 2) return null;

                                    return (
                                        <div key={s.num} className="flex items-center group">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-all duration-300 ${step === s.num ? 'bg-[#5EBE1B] text-white shadow-md' : step > s.num ? 'bg-[#212121] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                {step > s.num ? <CheckedIcon size={14} /> : s.num}
                                            </div>
                                            <span className={`text-sm font-semibold transition-colors duration-300 ${step === s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-0 relative z-10">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-[#5EBE1B] font-bold uppercase tracking-wider mb-2">Heb je een vraag?</p>
                            <p className="text-sm font-semibold text-gray-900">{companyPhone}</p>
                            <p className="text-sm text-gray-500">{companyEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col relative bg-white">
                    <div key={step} className="flex-1">

                        {/* STEP 1: Type Vloer */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Waar ben je naar op zoek?</h2>
                                    <p className="text-gray-500">Kies de hoofdcategorie van je gewenste renovatie.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {FLOOR_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => selectFloorType(type.id)}
                                            className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${formData.floorType === type.id ? 'border-[#5EBE1B] bg-[#5EBE1B]/5 ring-2 ring-[#5EBE1B]/10' : 'border-gray-100 hover:border-gray-300 hover:shadow-md hover:-translate-y-1'}`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-full transition-colors ${formData.floorType === type.id ? 'bg-[#5EBE1B] text-white shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-gray-900'}`}>
                                                    <type.icon size={22} className={formData.floorType === type.id ? "animate-in zoom-in" : ""} />
                                                </div>
                                                {formData.floorType === type.id && <CheckedIcon className="text-[#5EBE1B]" size={22} />}
                                            </div>
                                            <h4 className={`font-bold text-lg mb-1 ${formData.floorType === type.id ? 'text-gray-900' : 'text-gray-700'}`}>{type.title}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{type.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Brand Selection */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Heb je een voorkeur voor een merk?
                                    </h2>
                                    <p className="text-gray-500">
                                        {`Kies een van onze premium ${selectedCategory?.name.toLowerCase() || 'vloer'} merken of sla deze stap over.`}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {/* Brand Grid */}
                                    {availableBrands.map((brand) => (
                                        <button
                                            key={brand.slug}
                                            onClick={() => selectBrand(brand.name)}
                                            className={`relative p-4 h-28 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center bg-white overflow-hidden ${formData.brand === brand.name ? 'border-[#5EBE1B] ring-2 ring-[#5EBE1B]/10 bg-[#5EBE1B]/5' : 'border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1'}`}
                                        >
                                            <div className="absolute top-2 right-2 opacity-0 transition-opacity">
                                                {formData.brand === brand.name && <CheckedIcon className="text-[#5EBE1B] opacity-100" size={16} />}
                                            </div>
                                            {brand.logoUrl ? (
                                                <img src={brand.logoUrl} alt={brand.name} className={`max-w-[80%] max-h-[60%] object-contain transition-all duration-500 ${formData.brand === brand.name ? 'scale-105 filter-none mix-blend-multiply' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 mix-blend-multiply'}`} />
                                            ) : (
                                                <span className={`font-bold text-sm ${formData.brand === brand.name ? 'text-gray-900' : 'text-gray-600'}`}>{brand.name}</span>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => selectBrand('Geen voorkeur')}
                                        className={`relative p-4 h-28 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center bg-gray-50 ${formData.brand === 'Geen voorkeur' ? 'border-[#5EBE1B] text-[#5EBE1B] ring-2 ring-[#5EBE1B]/10 bg-[#5EBE1B]/5' : 'border-gray-100 hover:bg-white hover:border-gray-300 text-gray-500 hover:text-gray-900 hover:-translate-y-1'}`}
                                    >
                                        <Box size={24} className="mb-2" />
                                        <span className="text-sm font-semibold">Nog geen idee</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Variant Selection */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Kies de uitstraling!</h2>
                                    <p className="text-gray-500">Welke collectie of specifieke variant van {formData.brand} vind je het mooist?</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                                    {availableVariants.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectVariant(variant.name)}
                                            className={`group relative flex flex-col items-start text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white ${formData.variant === variant.name ? 'border-[#5EBE1B] ring-2 ring-[#5EBE1B]/10' : 'border-gray-100 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'}`}
                                        >
                                            <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                                {formData.variant === variant.name && (
                                                     <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-0.5 shadow-sm">
                                                         <CheckedIcon className="text-[#5EBE1B]" size={16} />
                                                     </div>
                                                )}
                                                {variant.imageUrl ? (
                                                    <img src={variant.imageUrl} alt={variant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <CameraIcon className="text-gray-300 transition-transform group-hover:scale-110" size={32} />
                                                )}
                                            </div>
                                            <div className="p-4 w-full bg-white">
                                                <h4 className="font-bold text-gray-900 text-sm truncate w-full">{variant.name}</h4>
                                                {variant.specs && variant.specs['Legsysteem'] && (
                                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold truncate w-full">{variant.specs['Legsysteem']}</p>
                                                )}
                                                {variant.specs && variant.specs['Kleur'] && (
                                                     <p className="text-xs text-gray-400 mt-1 truncate w-full">{variant.specs['Kleur']}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => selectVariant('Geen voorkeur')}
                                        className={`relative p-6 h-full min-h-[180px] rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center bg-gray-50 ${formData.variant === 'Geen voorkeur' ? 'border-[#5EBE1B] text-[#5EBE1B] ring-2 ring-[#5EBE1B]/10 bg-[#5EBE1B]/5' : 'border-gray-100 hover:border-[#5EBE1B]/50 hover:bg-[#5EBE1B]/5 text-gray-500 hover:text-[#5EBE1B]'}`}
                                    >
                                        <div className={`p-4 rounded-full mb-3 ${formData.variant === 'Geen voorkeur' ? 'bg-[#5EBE1B]/10' : 'bg-gray-100'}`}>
                                            <Box size={24} />
                                        </div>
                                        <span className="text-sm font-bold">Nog geen voorkeur</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Area Size */}
                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoe groot is de oppervlakte?</h2>
                                    <p className="text-gray-500">Geef een schatting van het aantal vierkante meters in totaal.</p>
                                </div>
                                <div className="py-8 px-2">
                                    <div className="flex justify-center items-baseline mb-12">
                                        <span className="text-7xl font-bold tracking-tighter text-[#5EBE1B]">{formData.areaSize}</span>
                                        <span className="text-2xl text-gray-400 font-bold mb-2 ml-3">m²</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="500"
                                        step="5"
                                        value={formData.areaSize}
                                        onChange={(e) => updateData('areaSize', e.target.value)}
                                        className="w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#5EBE1B] shadow-inner"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-4 font-bold tracking-widest uppercase">
                                        <span>10 m²</span>
                                        <span>250 m²</span>
                                        <span>500+ m²</span>
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mt-4 flex items-start space-x-4">
                                    <CheckedIcon size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Meerdere ruimtes of trappen?</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Je kunt dit straks in de laatste stap eenvoudig doorgeven via het opmerkingenveld!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Contact Info */}
                        {step === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Bijna klaar! 🎉</h2>
                                    <p className="text-gray-500">Laat je gegevens achter en we maken een prachtige offerte op maat voor je.</p>
                                    {formData.brand && formData.brand !== 'Geen voorkeur' && (
                                       <div className="mt-4 inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                           <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Keuze: </span>
                                           <span className="text-sm font-bold text-gray-800">{formData.brand}</span>
                                           {formData.variant && formData.variant !== 'Geen voorkeur' && (
                                               <>
                                                   <span className="text-gray-300 px-1">/</span>
                                                   <span className="text-sm font-bold text-[#5EBE1B]">{formData.variant}</span>
                                               </>
                                           )}
                                       </div>
                                    )}
                                </div>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Voornaam *</label>
                                            <input type="text" value={formData.name} onChange={(e) => updateData('name', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5EBE1B]/20 focus:bg-white focus:border-[#5EBE1B] transition-all font-medium" placeholder="Piet" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Achternaam *</label>
                                            <input type="text" value={formData.lastName} onChange={(e) => updateData('lastName', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5EBE1B]/20 focus:bg-white focus:border-[#5EBE1B] transition-all font-medium" placeholder="Jansen" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Emailadres *</label>
                                        <input type="email" value={formData.email} onChange={(e) => updateData('email', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5EBE1B]/20 focus:bg-white focus:border-[#5EBE1B] transition-all font-medium" placeholder="piet@voorbeeld.nl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Telefoonnummer *</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => updateData('phone', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5EBE1B]/20 focus:bg-white focus:border-[#5EBE1B] transition-all font-medium" placeholder="06 12 34 56 78" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Aanvullende Wensen (Optioneel)</label>
                                        <textarea rows={3} value={formData.message} onChange={(e) => updateData('message', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5EBE1B]/20 focus:bg-white focus:border-[#5EBE1B] transition-all font-medium resize-none" placeholder="Bijv. plinten gewenst, we hebben vloerverwarming, etc..." />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center relative z-10 bg-white">
                        {step > 1 ? (
                            <button onClick={handleBack} className="flex items-center text-gray-500 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs">
                                <ArrowBackIcon size={16} className="mr-2" /> Vorige Stap
                            </button>
                        ) : (
                            <div />
                        )}
                        <button
                            onClick={step === 5 ? handleSubmit : handleNext}
                            disabled={
                                (step === 1 && !formData.floorType) || 
                                (step === 2 && !formData.brand) || 
                                (step === 3 && !formData.variant) ||
                                (step === 5 && (!formData.name || !formData.email || !formData.phone))
                            }
                            className={`flex items-center px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 uppercase tracking-wider text-xs shadow-xl
                                ${((step === 1 && !formData.floorType) || (step === 2 && !formData.brand) || (step === 3 && !formData.variant) || (step === 5 && (!formData.name || !formData.email || !formData.phone))) 
                                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                                    : 'bg-[#212121] hover:bg-[#5EBE1B] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5EBE1B]/20'
                                }`}
                        >
                            {step === 5 ? 'Verstuur Offerte Aanvraag' : 'Volgende Stap'}
                            {step !== 5 && <ArrowNarrowRightIcon size={16} className="ml-2" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}