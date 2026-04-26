import React, { useState } from 'react';
import Button from '../components/Button';
import { Hammer, Eye, EyeOff, Lock, Mail, ArrowLeft, User } from 'lucide-react';
import { getSettings } from '../services/mockDatabase';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication check against stored settings
    setTimeout(async () => {
      const settings = await getSettings();
      
      if (email === settings.adminEmail && password === settings.password) {
        onLogin();
      } else {
        setError('Ongeldige inloggegevens. Probeer bodhi@bpmparket.nl / admin');
        setLoading(false);
      }
    }, 800);
  };

  const fillDemoCredentials = async () => {
    const settings = await getSettings();
    setEmail(settings.adminEmail);
    setPassword(settings.password || 'admin');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden m-3 rounded-2xl">
        <img 
          src="https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=2000" 
          alt="Epoxy floor abstract" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <div className="flex items-center space-x-2 text-white/90">
            <Hammer className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">BPM Parket</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Beheer uw <br/>
              <span className="text-gray-400">Vakmanschap</span>
            </h1>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed">
              Beheer projecten, leads en afspraken vanuit één centraal punt.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-[360px] w-full bg-white">
          
          <div className="text-left mb-8">
            <button 
                onClick={() => onNavigate('home')} 
                className="flex items-center text-xs text-gray-400 hover:text-black transition-colors mb-6 group"
            >
                <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Terug naar website
            </button>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inloggen op uw account</h2>
            <p className="mt-1 text-xs text-gray-500">
              Beheer planningen, krijg toegang tot projecten en beheer updates vanaf elke locatie.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-gray-900 transition-all"
                    placeholder="Voer e-mailadres in"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Wachtwoord <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-gray-900 transition-all"
                    placeholder="Voer wachtwoord in"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end">
                <a href="#" className="text-xs font-medium text-green-600 hover:text-green-700">
                  Wachtwoord vergeten?
                </a>
            </div>

            {error && (
              <div className="text-red-500 text-xs bg-red-50 p-2 rounded flex items-center">
                 {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="bg-gray-900 text-white hover:bg-black py-2.5 rounded-lg text-sm font-medium shadow-none"
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </Button>
            
            <div className="pt-6 border-t border-gray-50 text-center space-y-3">
                <button 
                  type="button"
                  onClick={fillDemoCredentials}
                  className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 underline decoration-dotted"
                >
                    Vul demo gegevens in
                </button>
                
                <p className="text-xs text-gray-400">
                    Nog geen account? <span className="text-green-600 font-medium cursor-pointer hover:underline">Account aanmaken</span>
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;