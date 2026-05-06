'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';
import { trackConversion } from '@/lib/analytics';

const initialState: CreateLeadState = { status: 'idle' };

export function ShowroomForm() {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (state.status === 'success') {
      trackConversion({ name: 'lead_submit', source: 'showroom-form' });
    }
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-red text-white mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-brand-dark mb-3">Afspraak Bevestigd!</h3>
        <p className="text-gray-500">
          Bedankt {name || ''}. We hebben uw verzoek voor een showroom bezoek ontvangen. We nemen spoedig contact met u op om de afspraak definitief te bevestigen.
        </p>
      </div>
    );
  }

  const dateLabel = selectedDateTime
    ? selectedDateTime.toLocaleString('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const composedMessage = selectedDateTime
    ? `Showroomafspraak — gewenste datum: ${dateLabel}.${message ? `\n\n${message}` : ''}`
    : message;

  return (
    <form action={formAction} className="space-y-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0" aria-hidden="true" />
      <input type="hidden" name="source" value="showroom-form" />
      <input type="hidden" name="floor_type" value="anders" />
      <input type="hidden" name="message" value={composedMessage} />

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Volledige Naam</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
          placeholder="Jan Jansen"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">E-mailadres</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
            placeholder="mail@voorbeeld.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Telefoonnummer</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
            placeholder="06 12345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Voorkeursdatum & tijd</label>
        <DatePicker variant="light" value={selectedDateTime} onChange={setSelectedDateTime} />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Bericht (Optioneel)</label>
        <textarea
          rows={3}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all resize-none"
          placeholder="Heeft u specifieke wensen of vragen?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-700">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-red text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-red/90 transition-all shadow-lg hover:shadow-brand-red/20 active:scale-[0.98] flex items-center justify-center group disabled:opacity-50"
      >
        {pending ? 'Versturen…' : 'Bevestig Aanvraag'}
        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}
