import React, { useState } from 'react';
import { createLead } from '../services/mockDatabase';
import {
  CheckCircle, ArrowRight, ArrowLeft, Layers,
  Maximize2, Droplet, Grid, Sparkles, Home
} from 'lucide-react';
import { companyConfig } from '../config';

// Floor Types Data
const FLOOR_TYPES = [
  { id: 'Traditioneel Parket', icon: Home, title: 'Traditioneel Parket', desc: 'Visgraat, band & bies of lamel' },
  { id: 'PVC & Laminaat', icon: Layers, title: 'PVC & Laminaat', desc: 'Slijtvast en onderhoudsvriendelijk' },
  { id: 'Traprenovatie', icon: Maximize2, title: 'Traprenovatie', desc: 'Eikenhouten overzettreden' },
  { id: 'Schuren & Onderhoud', icon: Sparkles, title: 'Schuren & Onderhoud', desc: 'Bestaande vloer vernieuwen' },
  { id: 'Vloerafwerking', icon: Droplet, title: 'Vloerafwerking', desc: 'Olie, lak of kleurbehandeling' },
  { id: 'Anders', icon: CheckCircle, title: 'Anders', desc: 'Specifieke wensen' },
];

const Quote: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    floorType: '',
    areaSize: 50,
    message: ''
  });

  const handleNext = () => {
    if (step === 1 && !formData.floorType) return; // Validation step 1
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    await createLead({
      name: `${formData.name} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      floorType: formData.floorType,
      areaSize: Number(formData.areaSize),
      message: formData.message
    });
    setSubmitted(true);
  };

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- Success State ---
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg w-full animate-in zoom-in duration-300">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-black text-white mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Aanvraag Verstuurd!</h2>
          <p className="text-gray-500 mb-8">
            Bedankt {formData.name}. We hebben je gegevens ontvangen en sturen binnen 24 uur een prijsindicatie op maat.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Terug naar home
          </button>
        </div>
      </div>
    );
  }

  // --- Main Wizard Layout ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">

      {/* Main Card Container */}
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[600px]">

        {/* Left Sidebar (Progress & Info) */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-8 lg:p-12 flex flex-col justify-between border-r border-gray-100">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{companyConfig.name.substring(0, 1)}</span>
              </div>
              <span className="font-bold text-xl">{companyConfig.name}</span>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900">Offerte Aanvraag</h3>
                <p className="text-sm text-gray-500">Volg de stappen om een nauwkeurige prijsindicatie te ontvangen.</p>
              </div>

              {/* Steps Indicator */}
              <div className="space-y-4">
                {[
                  { num: 1, label: 'Type Vloer' },
                  { num: 2, label: 'Oppervlakte' },
                  { num: 3, label: 'Contactgegevens' }
                ].map((s) => (
                  <div key={s.num} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 transition-colors duration-300
                      ${step === s.num ? 'bg-black text-white' : step > s.num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {step > s.num ? <CheckCircle size={16} /> : s.num}
                    </div>
                    <span className={`text-sm font-medium ${step === s.num ? 'text-black' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Hulp nodig?</p>
              <p className="text-sm font-medium">{companyConfig.contact.phone}</p>
              <p className="text-sm text-gray-500">{companyConfig.contact.email}</p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col relative">

          <div className="flex-1">
            {/* --- STEP 1: Floor Type --- */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Waar ben je naar op zoek?</h2>
                  <p className="text-gray-500">Kies het type vloer dat het beste bij jouw situatie past.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FLOOR_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateData('floorType', type.id)}
                      className={`
                        text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${formData.floorType === type.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-3 rounded-full ${formData.floorType === type.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <type.icon size={20} />
                        </div>
                        {formData.floorType === type.id && <CheckCircle className="text-black" size={20} />}
                      </div>
                      <h4 className="font-bold text-gray-900">{type.title}</h4>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 2: Surface Area --- */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoe groot is de oppervlakte?</h2>
                  <p className="text-gray-500">Geef een schatting van het aantal vierkante meters.</p>
                </div>

                <div className="py-8">
                  <div className="flex items-end mb-8">
                    <span className="text-6xl font-bold tracking-tight">{formData.areaSize}</span>
                    <span className="text-2xl text-gray-400 font-medium mb-2 ml-2">m²</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={formData.areaSize}
                    onChange={(e) => updateData('areaSize', e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>10 m²</span>
                    <span>250 m²</span>
                    <span>500+ m²</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-8">
                  <h4 className="font-bold text-sm mb-2">Notitie over oppervlakte</h4>
                  <p className="text-sm text-gray-500">
                    Heeft u meerdere ruimtes of een specifieke traprenovatie? Geef dit dan aan in het opmerkingenveld bij de laatste stap.
                  </p>
                </div>
              </div>
            )}

            {/* --- STEP 3: Contact Details --- */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoe kunnen we je bereiken?</h2>
                  <p className="text-gray-500">Laat je gegevens achter zodat we de offerte kunnen sturen.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Voornaam</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateData('name', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                        placeholder="Jan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Achternaam</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateData('lastName', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                        placeholder="Jansen"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                      placeholder="jan@voorbeeld.nl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Telefoon</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateData('phone', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                      placeholder="06 12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Opmerking (Optioneel)</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => updateData('message', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none"
                      placeholder="Bijv. voorkeur voor startdatum..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center text-gray-500 font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" /> Vorige
              </button>
            ) : (
              <div></div> // Spacer
            )}

            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={step === 1 && !formData.floorType}
              className={`
                 flex items-center px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg
                 ${(step === 1 && !formData.floorType) ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:scale-105'}
               `}
            >
              {step === 3 ? 'Verstuur Aanvraag' : 'Volgende Stap'}
              {step !== 3 && <ArrowRight size={18} className="ml-2" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Quote;