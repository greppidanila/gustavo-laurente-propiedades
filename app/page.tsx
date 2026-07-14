'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Activity, 
  Calendar, 
  Maximize2, 
  Bed, 
  Bath, 
  Share2, 
  Printer, 
  Mail, 
  Phone, 
  ArrowUpDown, 
  Plus, 
  Minus, 
  Facebook, 
  Instagram, 
  MessageSquare, 
  Check, 
  Clock, 
  Sparkles,
  Building,
  Home,
  CheckCircle2,
  FileText,
  User,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { 
  DEVELOPMENTS, 
  PROPERTIES, 
  NEIGHBORHOODS, 
  INVESTMENT_OPTIONS, 
  LOTS_LANDS, 
  FULLANA_LOTS, 
  PropertyItem, 
  FullanaLot 
} from '@/lib/properties';

export default function HomeApp() {
  // Navigation State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Search State
  const [activeTab, setActiveTab] = useState<'all' | 'vivienda' | 'terreno' | 'comercial'>('all');
  const [operacion, setOperacion] = useState<string>('Venta');
  const [tipo, setTipo] = useState<string>('all');
  const [ubicacion, setUbicacion] = useState<string>('all');
  const [direccionInput, setDireccionInput] = useState<string>('');
  const [ambientes, setAmbientes] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Results list (filtered properties and developments)
  const [searchResults, setSearchResults] = useState<PropertyItem[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Carousel references
  const devSliderRef = useRef<HTMLDivElement>(null);
  const propSliderRef = useRef<HTMLDivElement>(null);

  // Detail Page tab state
  const [detailTab, setDetailTab] = useState<'imagenes' | 'mapa' | 'planos'>('imagenes');
  const [expandedDesc, setExpandedDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<'name' | 'environments' | 'area' | 'price'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAllUnits, setShowAllUnits] = useState<boolean>(false);
  
  // Interactive Monte Fullana Lot Explorer State
  const [selectedLot, setSelectedLot] = useState<FullanaLot | null>(FULLANA_LOTS[0]);
  const [filterLotStatus, setFilterLotStatus] = useState<'todos' | 'Disponible' | 'Vendido'>('todos');

  // Gallery states
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [plansIndex, setPlansIndex] = useState<number>(0);
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Form states
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Filter Monte Fullana Lotes
  const filteredFullanaLots = useMemo(() => {
    if (filterLotStatus === 'todos') return FULLANA_LOTS;
    return FULLANA_LOTS.filter(l => l.status === filterLotStatus);
  }, [filterLotStatus]);

  // Handle Quick Search (Footer/Header navigation shortcuts)
  const handleQuickSearch = (oper: string, type: string) => {
    setOperacion(oper);
    setTipo(type);
    setHasSearched(true);
    
    const allItems = [...DEVELOPMENTS, ...PROPERTIES];
    const filtered = allItems.filter(item => {
      const matchType = type === 'all' || item.type === type;
      // Venta / Alquiler mapping
      const matchOper = item.status.toLowerCase() === oper.toLowerCase() || item.isDevelopment;
      return matchType && matchOper;
    });
    setSearchResults(filtered);
    setSelectedPropertyId(null);
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Perform core search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const allItems = [...DEVELOPMENTS, ...PROPERTIES];
    const filtered = allItems.filter(item => {
      // Tab category mapping
      let matchTab = true;
      if (activeTab !== 'all') {
        matchTab = item.type === activeTab;
      }
      
      // Type selection
      let matchType = true;
      if (tipo !== 'all') {
        if (tipo === 'vivienda') {
          matchType = item.type === 'vivienda';
        } else if (tipo === 'terreno' || tipo === 'lotes') {
          matchType = item.type === 'terreno';
        } else if (tipo === 'comercial') {
          matchType = item.type === 'comercial';
        }
      }
      
      // Location (neighborhood or city)
      const matchUbi = ubicacion === 'all' || 
        item.neighborhood.toLowerCase() === ubicacion.toLowerCase() ||
        item.city.toLowerCase() === ubicacion.toLowerCase();
      
      // Text address/title
      const matchText = direccionInput === '' || 
        item.title.toLowerCase().includes(direccionInput.toLowerCase()) || 
        item.location.toLowerCase().includes(direccionInput.toLowerCase()) ||
        item.description.toLowerCase().includes(direccionInput.toLowerCase());

      // Ambientes
      let matchAmb = true;
      if (ambientes !== 'all') {
        const ambNum = parseInt(ambientes);
        if (ambNum === 5) {
          matchAmb = item.environments.some(v => v >= 5);
        } else {
          matchAmb = item.environments.includes(ambNum);
        }
      }

      // Min/Max Price
      const itemPrice = item.numericPrice;
      const matchMin = minPrice === '' || itemPrice >= parseFloat(minPrice);
      const matchMax = maxPrice === '' || itemPrice <= parseFloat(maxPrice);

      return matchTab && matchType && matchUbi && matchText && matchAmb && matchMin && matchMax;
    });

    setSearchResults(filtered);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Clear Search
  const handleClearSearch = () => {
    setHasSearched(false);
    setTipo('all');
    setUbicacion('all');
    setDireccionInput('');
    setAmbientes('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchResults([]);
  };

  // Neighborhood Quick Filter
  const handleNeighborhoodClick = (nName: string) => {
    setUbicacion(nName.toLowerCase());
    setHasSearched(true);

    const allItems = [...DEVELOPMENTS, ...PROPERTIES];
    const filtered = allItems.filter(item => 
      item.neighborhood.toLowerCase() === nName.toLowerCase() || 
      item.city.toLowerCase() === nName.toLowerCase()
    );
    setSearchResults(filtered);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Reset page layout when property changes
  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setDetailTab('imagenes');
    setExpandedDesc(false);
    setGalleryIndex(0);
    setPlansIndex(0);
    setContactSubmitted(false);
    
    // Auto-message
    const propTitle = id.toUpperCase().replace(/-/g, ' ');
    setContactMessage(`Hola, estoy interesado en "${propTitle}" de Gustavo Laurente Propiedades. Quisiera recibir asesoramiento personalizado.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Action to reserve Monte Fullana Lot
  const handleReserveLotClick = (lot: FullanaLot) => {
    setContactMessage(`Hola, estoy interesado en reservar el ${lot.number.toUpperCase()} en Monte Fullana. Mide ${lot.dimensions} (${lot.area} m²). Quisiera recibir condiciones de financiación de la inmobiliaria.`);
    
    // Scroll to contact form
    const formEl = document.getElementById('contacto-form');
    formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBackToHome = () => {
    setSelectedPropertyId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropiedadesNav = () => {
    setSelectedPropertyId(null);
    handleQuickSearch('Venta', 'all');
  };

  const handleQuieroVender = () => {
    setSelectedPropertyId(null);
    setContactMessage("Hola, tengo una propiedad que deseo vender/tasar con Gustavo Laurente Propiedades. Me gustaría recibir asesoramiento personalizado.");
    setTimeout(() => {
      const el = document.getElementById('contacto-form');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleContactos = () => {
    setSelectedPropertyId(null);
    setTimeout(() => {
      const el = document.getElementById('contacto-form');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuienesSomos = () => {
    setSelectedPropertyId(null);
    setTimeout(() => {
      const el = document.getElementById('empresa');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Carousel controls
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 350;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Selected Property details
  const currentProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    const all = [...DEVELOPMENTS, ...PROPERTIES];
    return all.find(p => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId]);

  // Sort function for Units Table
  const sortedUnits = useMemo(() => {
    if (!currentProperty || !currentProperty.units) return [];
    const units = [...currentProperty.units];
    return units.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortField === 'environments') {
        aVal = a.environments;
        bVal = b.environments;
      } else if (sortField === 'area') {
        aVal = a.area;
        bVal = b.area;
      } else if (sortField === 'price') {
        aVal = parseFloat(a.price.replace(/[^\d]/g, '')) || 0;
        bVal = parseFloat(b.price.replace(/[^\d]/g, '')) || 0;
        if (a.price.includes('Vendido') || a.price.includes('VENDIDO')) aVal = 99999999;
        if (b.price.includes('Vendido') || b.price.includes('VENDIDO')) bVal = 99999999;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [currentProperty, sortField, sortDirection]);

  const handleSort = (field: 'name' | 'environments' | 'area' | 'price') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Submit contact form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      alert('Por favor complete los campos requeridos (Nombre y Email).');
      return;
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      
      {/* TOP NOTIFICATION / INSTANT CONTACT BAR */}
      <div className="bg-[#0b141f] text-neutral-300 text-[11px] py-2 px-4 border-b border-white/5 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-accent" /> Gral. Paz 493, Pergamino, Buenos Aires</span>
            <span className="hidden md:inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-accent" /> Lun a Vie 9:00 a 17:00 / Sáb 9:00 a 13:00</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">Atención Directa:</span>
            <a href="https://wa.me/542477210864" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-400" /> 2477 210864
            </a>
          </div>
        </div>
      </div>

      {/* HEADER / NAVIGATION BAR (STICKY) */}
      <header className="sticky top-0 z-50 bg-brand-primary/95 text-white shadow-xl border-b border-brand-accent/20 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo element representing GUSTAVO LAURENTE */}
          <button onClick={handleBackToHome} className="flex flex-col items-start cursor-pointer group select-none">
            <div className="font-display tracking-tight text-white text-base sm:text-lg md:text-xl font-light leading-none">
              gustavo<span className="font-extrabold text-brand-accent">laurente</span>
            </div>
            <div className="text-[8px] md:text-[9px] font-bold tracking-[0.38em] text-neutral-400 uppercase mt-0.5 group-hover:text-white transition-colors duration-200 leading-none">
              propiedades
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-[10px] lg:text-[11px] font-bold font-display tracking-wider">
            <button 
              onClick={handleBackToHome} 
              className={`hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer ${!selectedPropertyId && !hasSearched ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-neutral-200'}`}
            >
              INICIO
            </button>
            <button 
              onClick={handlePropiedadesNav}
              className="hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer text-neutral-200"
            >
              PROPIEDADES
            </button>
            <button 
              onClick={handleQuieroVender}
              className="hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer text-neutral-200 bg-brand-accent/10 px-2 rounded-md hover:bg-brand-accent/20 border border-brand-accent/20"
            >
              QUIERO VENDER
            </button>
            <button 
              onClick={() => handleSelectProperty('monte-fullana')}
              className={`hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer ${selectedPropertyId === 'monte-fullana' ? 'text-brand-accent' : 'text-neutral-200'}`}
            >
              EMPRENDIMIENTOS
            </button>
            <button 
              onClick={handleQuienesSomos}
              className="hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer text-neutral-200"
            >
              QUIENES SOMOS
            </button>
            <button 
              onClick={handleContactos}
              className="hover:text-brand-accent uppercase transition-colors py-2 cursor-pointer text-neutral-200"
            >
              CONTACTOS
            </button>
          </nav>

          {/* Social Icons & WhatsApp Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-brand-accent transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-brand-accent transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://wa.me/542477210864" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95" aria-label="WhatsApp">
              <MessageSquare className="w-3.5 h-3.5 fill-white/10" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </header>

      {/* RENDER HOME VIEW OR DETAIL VIEW */}
      <AnimatePresence mode="wait">
        {!selectedPropertyId ? (
          
          /* MAIN HOME LANDING PAGE VIEW */
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            {/* HERO SECTION WITH BG IMAGE AND ENCONTRÁ TU LUGAR HEADLINE */}
            <section className="relative h-[500px] md:h-[580px] flex items-center justify-center overflow-hidden bg-brand-primary">
              <img 
                src="https://picsum.photos/seed/laurente_hero/1920/1080?blur=1" 
                alt="Gustavo Laurente Propiedades Pergamino" 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-brand-primary/90"></div>
              
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.4em] text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-full mb-4 inline-block backdrop-blur-sm">
                  MÁS DE 20 AÑOS DE TRAYECTORIA
                </span>
                
                <motion.h1 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wider mb-3 leading-tight"
                >
                  ENCONTRÁ TU LUGAR
                </motion.h1>
                <h2 className="text-sm sm:text-base md:text-lg text-neutral-300 font-medium tracking-wide max-w-2xl mx-auto mb-4">
                  Propiedades, terrenos y oportunidades inmobiliarias en Pergamino y la región
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
                  Acompañamos a nuestros clientes en la compra, venta y alquiler de propiedades, con conocimiento profundo del mercado local y asesoramiento profesional personalizado.
                </p>
                
                <div className="flex justify-center gap-4">
                  <a 
                    href="#buscador-box" 
                    className="h-11 bg-brand-accent hover:bg-brand-accent-hover text-white px-6 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                  >
                    <Search className="w-4 h-4 mr-1.5" /> Buscar Propiedad
                  </a>
                  <button 
                    onClick={() => handleSelectProperty('monte-fullana')}
                    className="h-11 bg-white/10 hover:bg-white/20 text-white px-6 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5 text-brand-accent" /> Monte Fullana
                  </button>
                </div>
              </div>
            </section>

            {/* SEARCH PANEL WRAPPER */}
            <section id="buscador-box" className="relative z-20 max-w-5xl mx-auto -translate-y-16 px-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-accent rounded-full"></div>
                    <h3 className="font-display font-bold text-neutral-800 text-lg">Encontrá la propiedad que estás buscando</h3>
                  </div>
                  
                  {/* Operation Tab (Venta / Alquiler) */}
                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1 mt-3 md:mt-0">
                    {['Venta', 'Alquiler'].map((op) => (
                      <button 
                        key={op}
                        type="button"
                        onClick={() => setOperacion(op)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${operacion === op ? 'bg-brand-accent text-white shadow-sm' : 'text-neutral-600 hover:bg-slate-200'}`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FORM FIELDS BODY */}
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                  
                  {/* Tipo de Propiedad */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Tipo de propiedad</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs text-neutral-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium cursor-pointer"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="vivienda">Casas o Departamentos</option>
                      <option value="terreno">Lotes y Terrenos</option>
                      <option value="comercial">Locales Comerciales</option>
                    </select>
                  </div>

                  {/* Ubicación */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Ubicación</label>
                    <select
                      value={ubicacion}
                      onChange={(e) => setUbicacion(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs text-neutral-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium cursor-pointer"
                    >
                      <option value="all">Todas las ciudades</option>
                      <option value="pergamino">Pergamino</option>
                      <option value="rojas">Rojas</option>
                      <option value="pinzon">Pinzón (Barrio/Loteo)</option>
                    </select>
                  </div>

                  {/* Ambientes */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Ambientes</label>
                    <select
                      value={ambientes}
                      onChange={(e) => setAmbientes(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs text-neutral-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium cursor-pointer"
                    >
                      <option value="all">Cualquier cantidad</option>
                      <option value="1">Monoambiente (1 Amb)</option>
                      <option value="2">1 dormitorio (2 Amb)</option>
                      <option value="3">2 dormitorios (3 Amb)</option>
                      <option value="4">3 dormitorios (4 Amb)</option>
                      <option value="5">Más ambientes (5+ Amb)</option>
                    </select>
                  </div>

                  {/* Precio Rango */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Precio Máximo (USD)</label>
                    <input 
                      type="number" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Hasta" 
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs text-neutral-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                    />
                  </div>

                  {/* Search Submit Button */}
                  <div className="flex flex-col justify-end">
                    <button 
                      type="submit"
                      className="w-full h-11 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      <span>BUSCAR</span>
                    </button>
                  </div>

                </form>
              </div>
            </section>

            {/* DYNAMIC SEARCH RESULTS SECTION */}
            {hasSearched && (
              <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 bg-white rounded-3xl mb-12 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-neutral-800">Resultados de Búsqueda</h2>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">Se encontraron {searchResults.length} propiedades que coinciden con tus filtros</p>
                  </div>
                  <button 
                    onClick={handleClearSearch}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Home className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <h3 className="font-display font-semibold text-neutral-700 text-base">No encontramos propiedades</h3>
                    <p className="text-neutral-500 text-xs max-w-sm mx-auto mt-1">Intentá buscar con otros filtros o en diferentes ubicaciones para ampliar tu rango.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectProperty(item.id)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img 
                            src={item.mainImage} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                            <span className="bg-amber-500 text-neutral-950 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-sm flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> DESTACADO
                            </span>
                            <span className={`text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-sm ${
                              item.status === 'Vendido' || item.status === 'Alquilado' ? 'bg-red-600' :
                              item.status === 'Reservado' ? 'bg-amber-600' : 'bg-emerald-600'
                            }`}>
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-grow flex flex-col justify-between text-left">
                          <div>
                            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">{item.isDevelopment ? 'Emprendimiento' : 'Propiedad en Pergamino'}</div>
                            <h3 className="font-display font-bold text-neutral-800 text-sm group-hover:text-brand-accent transition-colors truncate">{item.title}</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                              <div className="text-brand-accent font-extrabold text-base tracking-tight">{item.price}</div>
                              {item.originalPrice && (
                                <div className="text-xs text-neutral-400 line-through font-semibold">{item.originalPrice}</div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-neutral-500 mt-2">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-neutral-400" />
                              {item.status}
                            </span>
                            {item.possession && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                {item.possession}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* SECTION: EMPRENDIMIENTOS DESTACADOS - FOCUS MONTE FULLANA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
              <div className="text-center md:text-left mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em] block mb-1">PROYECTOS DESTACADOS</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight">Desarrollos con visión de futuro</h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">Loteos pensados para quienes buscan calidad de vida, crecimiento urbano y seguridad</p>
                </div>
                
                <button 
                  onClick={() => handleSelectProperty('monte-fullana')}
                  className="px-5 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Ver Ficha de Monte Fullana
                </button>
              </div>

              {/* Monte Fullana Spotlight Showcase Card */}
              <div className="bg-[#111e2e] text-white rounded-3xl overflow-hidden border border-white/5 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16 text-left">
                
                {/* Left side: Render Image Slider */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[350px] bg-slate-900 overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/fullana_landscape/800/600" 
                    alt="Loteo Residencial Fullana" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-transparent"></div>
                  
                  {/* Text Badge overlay */}
                  <div className="absolute top-6 left-6 bg-brand-accent text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg tracking-wider shadow-md">
                    PROYECTO EXCLUSIVO
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest block mb-1">PERGAMINO, BUENOS AIRES</span>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">Loteo Residencial Fullana</h3>
                    <p className="text-neutral-300 text-xs mt-2 max-w-md line-clamp-2">
                      Presentamos 33 exclusivos lotes en 29.200 m² totalmente forestados. Una comunidad planificada rodeada de naturaleza.
                    </p>
                  </div>
                </div>

                {/* Right side: Information blocks */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-brand-accent font-semibold text-xs tracking-wider uppercase">Urban Development Project</span>
                    <h4 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">MONTE FULLANA</h4>
                    
                    <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                      Monte Fullana propone una nueva forma de vivir en Pergamino: una combinación única entre naturaleza, excelente conectividad urbana y solidez financiera. 
                    </p>

                    {/* Quick Features List */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">33 Lotes</h5>
                          <p className="text-[10px] text-neutral-400">Exclusivos y amplios</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">29.200 m²</h5>
                          <p className="text-[10px] text-neutral-400">Forestación natural</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Financiación</h5>
                          <p className="text-[10px] text-neutral-400">Hasta 36 cuotas fijas</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Servicios</h5>
                          <p className="text-[10px] text-neutral-400">Agua, Gas, Luz, Cloacas</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Anticipo</span>
                      <div className="text-white font-extrabold text-lg">Desde 30%</div>
                    </div>
                    <button 
                      onClick={() => handleSelectProperty('monte-fullana')}
                      className="w-full sm:w-auto h-11 bg-brand-accent hover:bg-brand-accent-hover text-white px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center"
                    >
                      Ver disponibilidad de lotes
                    </button>
                  </div>

                </div>
              </div>





              {/* SERVICES AND INFRASTRUCTURE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mb-16">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-neutral-800 text-sm uppercase tracking-wider mb-2">Ubicación Privilegiada</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Ubicado estratégicamente en Pergamino con excelente conectividad: fácil acceso a boulevares principales y cercanía directa a autopistas clave. Proximidad inmediata a colegios, universidades y centros de salud de primer nivel.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-neutral-800 text-sm uppercase tracking-wider mb-2">Servicios Garantizados</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    El loteo residencial cuenta con toda la infraestructura soterrada y lista: agua potable, gas natural de red, cloacas, energía eléctrica, cordón cuneta, calles totalmente pavimentadas, desagües pluviales y alumbrado público moderno.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-neutral-800 text-sm uppercase tracking-wider mb-2">Financiación Accesible</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Accedé a tu lote con un anticipo inicial del 30% y financiá el resto en hasta 36 cuotas sin interés. Ofrecemos alternativas de financiación flexibles y adaptadas para familias, inversores y desarrolladores.
                  </p>
                </div>

              </div>
            </section>


            {/* SECTION: PROPIEDADES DESTACADAS */}
            <section className="bg-[#111e2e]/5 border-y border-slate-200/40 py-16 text-left">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em] block mb-1">ÚLTIMAS PROPIEDADES</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight">Propiedades Destacadas</h2>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">Propiedades destacadas disponibles para vivienda permanente, descanso e inversión directa en Pergamino y alrededores</p>
                  </div>
                  {/* Slider nav */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => scrollCarousel(propSliderRef, 'left')}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-neutral-600 hover:text-brand-accent hover:border-brand-accent transition-all cursor-pointer active:scale-95 shadow-sm"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => scrollCarousel(propSliderRef, 'right')}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-neutral-600 hover:text-brand-accent hover:border-brand-accent transition-all cursor-pointer active:scale-95 shadow-sm"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Property Cards Slider Container */}
                <div 
                  ref={propSliderRef}
                  className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
                >
                  {PROPERTIES.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectProperty(item.id)}
                      className="flex-shrink-0 w-[290px] sm:w-[330px] bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 snap-start group cursor-pointer flex flex-col justify-between"
                    >
                      {/* Thumbnail with VENTA Tag */}
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                        <img 
                          src={item.mainImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span className="bg-amber-500 text-neutral-950 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-sm flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> DESTACADO
                          </span>
                          <span className={`text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-sm ${
                            item.status === 'Vendido' || item.status === 'Alquilado' ? 'bg-red-600' :
                            item.status === 'Reservado' ? 'bg-amber-600' : 'bg-emerald-600'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Valor de Venta</div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <div className="text-brand-primary font-extrabold text-base tracking-tight">{item.price}</div>
                            {item.originalPrice && (
                              <div className="text-xs text-neutral-400 line-through font-semibold">{item.originalPrice}</div>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-neutral-800 text-sm group-hover:text-brand-accent transition-colors duration-200 line-clamp-1">{item.title}</h3>
                          
                          {/* Features row */}
                          <div className="flex items-center gap-1.5 my-3">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase mr-1">Ambientes</span>
                            {[1, 2, 3, 4, 5].map((amb) => {
                              const isIncluded = item.environments.includes(amb);
                              return (
                                <span 
                                  key={amb} 
                                  className={`w-5.5 h-5.5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                                    isIncluded 
                                      ? 'bg-brand-accent/15 text-brand-accent border border-brand-accent/20' 
                                      : 'bg-slate-50 text-neutral-300 border border-slate-100'
                                  }`}
                                >
                                  {amb === 5 ? '+5' : amb}
                                </span>
                              );
                            })}
                          </div>

                          {/* Location pin */}
                          <div className="flex items-start gap-1.5 text-xs text-neutral-500 mt-2 min-h-[32px]">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">{item.location}</span>
                          </div>
                        </div>

                        {/* Property size features */}
                        <div className="border-t border-slate-100 pt-3 mt-4 flex flex-col gap-1.5 text-[11px] text-neutral-500 font-medium">
                          {(item.surfaceCubierta || item.surfaceTotal) && (
                            <div className="flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Superficie: <strong>{item.surfaceCubierta} m² cubiertos</strong> / <strong>{item.surfaceTotal} m² totales</strong></span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-neutral-500">
                            {item.dormitorios && (
                              <span className="flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5 text-neutral-400" />
                                <strong>{item.dormitorios}</strong> Dormitorios
                              </span>
                            )}
                            {item.banos && (
                              <span className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5 text-neutral-400" />
                                <strong>{item.banos}</strong> Baño/s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>


            {/* SECTION: LOTES Y TERRENOS (Loteos destacados) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left">
              <div className="text-center mb-12">
                <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em]">TERRENOS Y PARCELAS</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight mt-1">Oportunidades para construir e invertir</h2>
                <p className="text-sm text-neutral-500 mt-2">Encontrá terrenos ubicados en zonas estratégicas de Pergamino y alrededores</p>
              </div>

              {/* Grid representation of Lot developments */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {LOTS_LANDS.map((land, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                      <img src={land.image} alt={land.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4 bg-brand-primary/80 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded">
                        RECOMENDADO
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-extrabold text-neutral-800 text-base">{land.title}</h4>
                        <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed">{land.description}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                        <span className="text-[10px] text-brand-accent font-extrabold tracking-wider uppercase">Loteo Activo</span>
                        <button 
                          onClick={() => {
                            if (land.linkId === 'monte-fullana') {
                              handleSelectProperty('monte-fullana');
                            } else {
                              handleSelectProperty(land.linkId);
                            }
                          }}
                          className="text-xs font-extrabold text-brand-primary hover:text-brand-accent transition-colors"
                        >
                          Saber más &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>


            {/* SECTION: INVERSIONES */}
            <section id="inversiones" className="bg-brand-primary text-white py-20 text-left scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em]">CRECIMIENTO SEGURO</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">Oportunidades inmobiliarias para quienes buscan crecer</h2>
                  <div className="w-12 h-1 bg-brand-accent mx-auto mt-4 rounded-full"></div>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-4">
                    Invertir en inmuebles es construir valor real a largo plazo. Te acompañamos a elegir las alternativas de mayor plusvalía y bajo riesgo en el mercado de Pergamino.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INVESTMENT_OPTIONS.map((opt, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#18293d] p-6 rounded-2xl border border-white/5 hover:border-brand-accent/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block">
                          {opt.subtitle}
                        </span>
                        <h4 className="font-display font-extrabold text-sm sm:text-base text-white tracking-wide leading-snug">
                          {opt.title}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-6">
                        <a 
                          href="#contacto-form"
                          className="text-xs font-bold text-brand-accent hover:text-white transition-colors"
                        >
                          Solicitar dossier &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>


            {/* SECTION: TASACIONES */}
            <section id="tasaciones" className="bg-white border-b border-slate-200/80 py-20 text-left scroll-mt-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em]">CONOCÉ EL VALOR REAL</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight leading-tight">Conocé el valor real de tu propiedad</h2>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                    Realizamos tasaciones profesionales y rigurosas considerando las variables críticas del mercado de Pergamino y la región: ubicación exacta, características técnicas del inmueble, tendencias locales de compra/venta y tasación comparada.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Te brindamos un informe detallado que te permitirá tomar decisiones financieras seguras al vender o alquilar tu casa, departamento o terreno.
                  </p>
                </div>
                
                <div className="md:w-1/2 bg-slate-50 border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-neutral-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-accent" /> SOLICITAR TASACIÓN PROFESIONAL
                  </h4>
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <input 
                      type="text" 
                      required 
                      placeholder="Nombre y Apellido" 
                      className="w-full h-10 border border-slate-200 rounded-lg px-3 text-xs bg-white outline-none focus:ring-2 focus:ring-brand-accent" 
                    />
                    <input 
                      type="email" 
                      required 
                      placeholder="Correo Electrónico" 
                      className="w-full h-10 border border-slate-200 rounded-lg px-3 text-xs bg-white outline-none focus:ring-2 focus:ring-brand-accent" 
                    />
                    <input 
                      type="tel" 
                      placeholder="Teléfono (con código de área)" 
                      className="w-full h-10 border border-slate-200 rounded-lg px-3 text-xs bg-white outline-none focus:ring-2 focus:ring-brand-accent" 
                    />
                    <textarea 
                      placeholder="Breve descripción del inmueble (dirección, tipo de propiedad, ambientes, m²)..." 
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg p-3 text-xs bg-white outline-none focus:ring-2 focus:ring-brand-accent resize-none"
                    ></textarea>
                    <button 
                      type="submit" 
                      className="w-full h-10 bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                      Enviar datos de tasación
                    </button>
                  </form>
                </div>
              </div>
            </section>


            {/* SECTION: EMPRESA */}
            <section id="empresa" className="bg-white border-b border-slate-200/80 py-20 text-left scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Intro row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                  <div>
                    <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em] block mb-1">SOBRE NOSOTROS</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight leading-tight">Gustavo Laurente Propiedades</h2>
                    <h3 className="text-sm font-semibold text-neutral-500 mt-2">Más de 20 años acompañando operaciones inmobiliarias en Pergamino y la región</h3>
                    
                    <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
                      Somos una firma inmobiliaria especializada en la compra, venta, alquiler, administración de contratos y tasación experta de propiedades residenciales, comerciales y rurales en el norte de la provincia de Buenos Aires.
                    </p>
                    <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                      Nuestro objetivo prioritario es brindar a las familias, propietarios e inversores un servicio caracterizado por la máxima confianza, la transparencia contractual absoluta, el profesionalismo matriculado y la atención personalizada desde el primer llamado hasta la firma de la escritura.
                    </p>
                  </div>

                  <div className="relative h-64 sm:h-80 rounded-2xl bg-slate-100 overflow-hidden shadow-md">
                    <img src="https://picsum.photos/seed/laurente_office/800/600" alt="Gustavo Laurente Oficina" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <span className="font-display font-bold text-lg">Oficina Central Pergamino</span>
                      <p className="text-[10px] text-neutral-200">Gral. Paz 493, Pergamino, Buenos Aires.</p>
                    </div>
                  </div>
                </div>

                {/* Team Grid */}
                <div className="border-t border-slate-200/80 pt-12">
                  <div className="text-center mb-10">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">NUESTRO EQUIPO MATRICULADO</span>
                    <h3 className="font-display font-extrabold text-neutral-800 text-lg sm:text-xl">Asesoramiento profesional y con trayectoria</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    
                    {/* Member 1: Gustavo Laurente */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-center gap-4 shadow-sm">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 relative border-2 border-brand-accent">
                        <img src="https://picsum.photos/seed/laurente_member1/150/150" alt="Gustavo Laurente" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-neutral-800 text-sm sm:text-base">Gustavo Laurente</h4>
                        <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest block mt-0.5">Martillero y Corredor Público Nacional</span>
                        <p className="text-[11px] text-neutral-500 leading-relaxed mt-2">Asesoramiento experto en operaciones complejas de compraventa, tasaciones y loteos rurales/urbanos.</p>
                      </div>
                    </div>

                    {/* Member 2: Marcos Tello */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-center gap-4 shadow-sm">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 relative border-2 border-brand-accent">
                        <img src="https://picsum.photos/seed/laurente_member2/150/150" alt="Marcos Tello" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-neutral-800 text-sm sm:text-base">Marcos Tello</h4>
                        <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest block mt-0.5">Martillero y Corredor Público</span>
                        <p className="text-[11px] text-neutral-500 leading-relaxed mt-2">Especialista en atención comercial, visitas personalizadas a loteos, alquileres residenciales y soporte técnico.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>


            {/* STATS COUNT UP REPRESENTING THE BRAND EXPERIENCE */}
            <section className="bg-[#111e2e] text-white py-16 text-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-accent mb-1">+20</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">Años acompañando clientes</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-accent mb-1">+33</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">Lotes en Monte Fullana</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-accent mb-1">+100</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">Propiedades en Pergamino</span>
                </div>

                <div className="flex flex-col items-center col-span-2 md:col-span-1">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-accent mb-1">+1</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">Desarrollo residencial propio</span>
                </div>

              </div>
            </section>


            {/* CONTACT SECTION & OFFICE LOCATION INFO */}
            <section id="contacto-form" className="bg-slate-50 border-y border-slate-200 py-20 scroll-mt-24">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Left block with details */}
                <div className="text-left space-y-6">
                  <div>
                    <span className="text-brand-accent font-extrabold text-[10px] uppercase tracking-[0.25em] block mb-1">CONTACTATE CON NOSOTROS</span>
                    <h2 className="text-3xl font-display font-extrabold text-brand-primary tracking-tight uppercase leading-snug">
                      TENEMOS LO QUE ESTÁS BUSCANDO
                    </h2>
                    <p className="text-neutral-500 font-medium text-sm sm:text-base leading-relaxed mt-4">
                      Contanos qué propiedad o terreno estás necesitando y nuestro equipo te ayudará a encontrar la mejor oportunidad inmobiliaria en Pergamino y alrededores.
                    </p>
                  </div>

                  {/* Institutional Data Box */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs text-neutral-600">
                    <h4 className="font-display font-bold text-neutral-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">Datos de contacto</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-800 font-semibold block">Dirección Principal:</strong>
                          <span>Gral. Paz 493, Pergamino, Buenos Aires</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-800 font-semibold block">Teléfono de atención:</strong>
                          <span>2477 210864</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-800 font-semibold block">Administración de Alquileres:</strong>
                          <span>Marcela: 2477 516083</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-800 font-semibold block">Correo Electrónico:</strong>
                          <a href="mailto:gustavo_laurente@hotmail.com" className="text-brand-accent hover:underline">gustavo_laurente@hotmail.com</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-xs text-neutral-600 space-y-1">
                    <h4 className="font-display font-bold text-neutral-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2 mb-2">Horarios de atención</h4>
                    <p className="flex justify-between"><span>Lunes a viernes:</span> <strong className="text-neutral-800">9:00 a 17:00 hs</strong></p>
                    <p className="flex justify-between"><span>Sábados:</span> <strong className="text-neutral-800">9:00 a 13:00 hs</strong></p>
                    <p className="flex justify-between text-red-500"><span>Domingos:</span> <strong>Cerrado</strong></p>
                  </div>
                </div>

                {/* Right Form Card */}
                <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-lg text-left">
                  
                  {contactSubmitted ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-neutral-800 text-lg">¡Consulta Enviada!</h3>
                      <p className="text-neutral-500 text-xs max-w-xs mx-auto mt-2">Gracias por contactarte con nosotros. Un corredor especializado se comunicará con vos a la brevedad.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Nombre y apellido *</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Tu Nombre Completo" 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Email *</label>
                        <input 
                          type="email" 
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="correo@ejemplo.com" 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Teléfono *</label>
                        <input 
                          type="tel" 
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="2477 ..." 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">¿Qué estás buscando?</label>
                        <textarea 
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Me interesaría conocer lotes en Monte Fullana..." 
                          className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer mt-2"
                      >
                        Enviar consulta
                      </button>

                    </div>
                  )}

                </form>

              </div>
            </section>

          </motion.main>
        ) : (
          
          /* INTERACTIVE REAL PROPERTY DETAIL PAGE VIEW */
          <motion.main
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow bg-white text-left"
          >
            {/* PROPERTY DETAIL TITLE HERO HEADER */}
            <section className="bg-slate-50 border-b border-slate-200 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back button Breadcrumb style */}
                <button 
                  onClick={handleBackToHome}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-brand-accent font-bold uppercase tracking-wider mb-5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver al Inicio
                </button>

                {/* Title blocks */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  <div>
                    <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-neutral-800 tracking-tight leading-snug">
                      {currentProperty?.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-slate-200 px-2.5 py-1 rounded">
                        {currentProperty?.location}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-accent/15 text-brand-accent px-2.5 py-1 rounded">
                        {currentProperty?.neighborhood.toUpperCase()} | {currentProperty?.city.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                        {currentProperty?.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions bar buttons */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setSelectedLot(FULLANA_LOTS[0]);
                        const el = document.getElementById('contacto-form');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="h-10 bg-brand-accent hover:bg-brand-accent-hover text-white font-extrabold text-xs uppercase tracking-wider px-5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Consultar Ahora
                    </button>
                    <button onClick={() => alert('Compartiendo enlace...')} className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:text-brand-accent flex items-center justify-center text-neutral-500 transition-all cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Sub features bar */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-semibold border-t border-slate-200 pt-4 mt-6">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-neutral-400" />
                    {currentProperty?.environments.length} TIPOS DE AMB.
                  </span>
                  {currentProperty?.surfaceTotal && (
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-neutral-400" />
                      HASTA {currentProperty?.surfaceTotal} M² TOTALES
                    </span>
                  )}
                  {currentProperty?.possession && (
                    <span className="flex items-center gap-1.5 text-brand-accent bg-brand-accent/5 px-2.5 py-1 rounded-md border border-brand-accent/10">
                      <Calendar className="w-4 h-4" />
                      Posesión: {currentProperty?.possession}
                    </span>
                  )}
                </div>

              </div>
            </section>

            {/* GALLERY IMAGE COLLAGE & CONTACT SIDE FORM ROW */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Columns: Image collage */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Collage of images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="h-64 sm:h-80 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => { setDetailTab('imagenes'); setGalleryIndex(0); }}>
                      <img 
                        src={currentProperty?.gallery[0]?.url || currentProperty?.mainImage} 
                        alt="Gallery 1" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    </div>
                    <div className="h-44 sm:h-48 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => { setDetailTab('imagenes'); setGalleryIndex(1); }}>
                      <img 
                        src={currentProperty?.gallery[1]?.url || 'https://picsum.photos/seed/altgallery1/800/600'} 
                        alt="Gallery 2" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="h-44 sm:h-48 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => { setDetailTab('imagenes'); setGalleryIndex(2); }}>
                      <img 
                        src={currentProperty?.gallery[2]?.url || 'https://picsum.photos/seed/altgallery2/800/600'} 
                        alt="Gallery 3" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="h-64 sm:h-80 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => { setDetailTab('imagenes'); setGalleryIndex((currentProperty?.gallery && currentProperty.gallery.length > 3) ? 3 : 0); }}>
                      <img 
                        src={(currentProperty?.gallery && currentProperty.gallery.length > 3) ? currentProperty.gallery[3].url : (currentProperty?.mainImage || '')} 
                        alt="Gallery 4" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION EXPANDER BOX */}
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
                  <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-neutral-800 mb-3">DESCRIPCIÓN</h3>
                  <div className={`text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-4 ${expandedDesc ? '' : 'line-clamp-4'}`}>
                    <p>{currentProperty?.description}</p>
                    <p>Ubicación inmejorable en una de las zonas de mayor revalorización constante. El diseño contempla detalles constructivos de categoría, aberturas DVH termoacústicas, calefacción y amenities planificados para disfrutar de un estilo de vida moderno y confortable en Pergamino.</p>
                  </div>
                  <button 
                    onClick={() => setExpandedDesc(prev => !prev)}
                    className="text-xs font-extrabold text-brand-accent hover:text-brand-accent-hover uppercase tracking-widest mt-4 cursor-pointer focus:outline-none"
                  >
                    {expandedDesc ? 'Ver menos -' : 'Ver más +'}
                  </button>
                </div>

              </div>

              {/* Right Column: Sticky Side Form */}
              <div className="lg:col-span-1 h-fit sticky top-28">
                
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
                  <div className="bg-brand-primary text-white py-3 px-4 rounded-xl text-center font-display font-extrabold text-xs uppercase tracking-wider shadow-sm border-b border-brand-accent">
                    CONSULTAR PROPUESTA
                  </div>

                  {contactSubmitted ? (
                    <div className="text-center py-10 flex flex-col items-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-bold text-neutral-800 text-sm">¡Consulta enviada!</h4>
                      <p className="text-neutral-500 text-[11px] mt-1.5 max-w-[200px] text-center">Nos contactaremos por teléfono o email muy pronto.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      
                      <div>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Nombre y Apellido *" 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <input 
                          type="email" 
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Email de contacto *" 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <input 
                          type="tel" 
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Teléfono / celular" 
                          className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                        />
                      </div>

                      <div>
                        <textarea 
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Escribí tu mensaje acá..." 
                          className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-neutral-800 bg-white focus:ring-2 focus:ring-brand-accent outline-none font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 bg-brand-accent hover:bg-brand-accent-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Enviar Consulta
                      </button>

                    </form>
                  )}

                  {/* Agent Profile direct view */}
                  {currentProperty?.agent && (
                    <div className="border-t border-slate-200 pt-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                        <img src={currentProperty.agent.avatar} alt="Agent" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        <span className="text-neutral-400 block uppercase font-bold text-[9px] tracking-wider">Agente Responsable</span>
                        <strong className="text-neutral-800 text-xs block">{currentProperty.agent.name}</strong>
                        <span>Tel: {currentProperty.agent.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </section>

            {/* TAB DISPLAY PANEL (IMAGENES | PLANOS | MAPA) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200">
              
              {/* Tab selector buttons */}
              <div className="flex border-b border-slate-200 font-display text-xs sm:text-sm font-extrabold uppercase tracking-widest gap-6 mb-8">
                <button 
                  onClick={() => setDetailTab('imagenes')}
                  className={`py-3 relative cursor-pointer ${detailTab === 'imagenes' ? 'text-brand-accent' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  IMAGENES
                  {detailTab === 'imagenes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />}
                </button>
                <button 
                  onClick={() => setDetailTab('mapa')}
                  className={`py-3 relative cursor-pointer ${detailTab === 'mapa' ? 'text-brand-accent' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  MAPA DE UBICACIÓN
                  {detailTab === 'mapa' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />}
                </button>
                <button 
                  onClick={() => setDetailTab('planos')}
                  className={`py-3 relative cursor-pointer ${detailTab === 'planos' ? 'text-brand-accent' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  PLANOS
                  {detailTab === 'planos' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />}
                </button>
              </div>

              {/* Tab Display Body */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden p-4 sm:p-6 min-h-[400px] flex items-center justify-center">
                
                {/* IMAGENES TAB SLIDER */}
                {detailTab === 'imagenes' && (
                  <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
                    <div className="relative h-[250px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300">
                      <img 
                        src={currentProperty?.gallery[galleryIndex]?.url || currentProperty?.mainImage} 
                        alt={currentProperty?.gallery[galleryIndex]?.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Nav controls */}
                      <button 
                        onClick={() => setGalleryIndex(prev => prev === 0 ? (currentProperty?.gallery.length || 1) - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer shadow"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => setGalleryIndex(prev => prev === (currentProperty?.gallery.length || 1) - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer shadow"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      {/* Text info */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-white text-xs font-semibold">
                        {currentProperty?.gallery[galleryIndex]?.title || 'Galería de imágenes'}
                      </div>
                    </div>
                    {/* Thumbnail Indicators */}
                    <div className="flex gap-2.5 overflow-x-auto py-2 justify-center">
                      {currentProperty?.gallery.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${galleryIndex === idx ? 'border-brand-accent scale-105' : 'border-slate-200 opacity-60'}`}
                        >
                          <img src={img.url} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HIGH-FIDELITY VECTOR MAP PREVIEW */}
                {detailTab === 'mapa' && (
                  <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
                    <div className="relative h-[300px] sm:h-[450px] rounded-2xl overflow-hidden bg-[#e5e3df] border border-slate-300 shadow-inner">
                      
                      {/* Simulated map blocks */}
                      <div className="absolute inset-0 select-none bg-[#f1efe8]" style={{
                        backgroundImage: `radial-gradient(#d3cfc7 1.5px, transparent 1.5px), radial-gradient(#d3cfc7 1.5px, #f1efe8 1.5px)`,
                        backgroundSize: '30px 30px',
                        backgroundPosition: '0 0, 15px 15px',
                        transform: `scale(${mapZoom / 14})`,
                        transition: 'transform 0.4s ease'
                      }}>
                        <div className="absolute inset-0 flex flex-col justify-around opacity-30">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="h-4 bg-neutral-300/40 w-full" />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex justify-around opacity-30">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="w-4 bg-neutral-300/40 h-full" />
                          ))}
                        </div>
                        <div className="absolute top-1/4 left-1/3 w-36 h-28 bg-[#d8ebd4] rounded-full filter blur-sm opacity-60"></div>
                      </div>

                      {/* Map Labels */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex flex-col items-center">
                          <div className="bg-neutral-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-md mb-1.5 whitespace-nowrap tracking-wide flex items-center gap-1 border border-neutral-800 animate-bounce">
                            <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                            {currentProperty?.location}
                          </div>
                          <div className="w-4 h-4 bg-brand-accent border-2 border-white rounded-full shadow-lg" />
                          <div className="w-8 h-2 bg-black/25 rounded-full filter blur-[1.5px] mt-0.5" />
                        </div>

                        <div className="absolute bottom-1/4 right-1/3 text-[9px] font-bold text-neutral-800 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                          Ubicación aproximada en Pergamino
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="absolute bottom-4 right-4 bg-white border border-slate-200 shadow-md rounded-lg flex flex-col overflow-hidden text-neutral-700">
                        <button onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))} className="w-8 h-8 flex items-center justify-center font-bold border-b border-slate-200 hover:bg-slate-50 cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button onClick={() => setMapZoom(prev => Math.max(prev - 1, 10))} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-slate-50 cursor-pointer">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLANOS TAB VIEW */}
                {detailTab === 'planos' && (
                  <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
                    {currentProperty?.plans && currentProperty.plans.length > 0 ? (
                      <>
                        <div className="relative h-[250px] sm:h-[450px] rounded-xl overflow-hidden bg-white border border-slate-300 p-6 flex items-center justify-center shadow-inner">
                          <img 
                            src={currentProperty.plans[plansIndex].url} 
                            alt={currentProperty.plans[plansIndex].title} 
                            className="max-h-full max-w-full object-contain select-none"
                            referrerPolicy="no-referrer"
                          />
                          {/* Controls if multiple plans */}
                          {currentProperty.plans.length > 1 && (
                            <>
                              <button 
                                onClick={() => setPlansIndex(prev => prev === 0 ? currentProperty.plans!.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer shadow"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button 
                                onClick={() => setPlansIndex(prev => prev === currentProperty.plans!.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer shadow"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}
                          <div className="absolute bottom-4 left-4 bg-neutral-900/80 backdrop-blur px-3 py-1.5 rounded text-white text-xs font-semibold">
                            {currentProperty.plans[plansIndex].title}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-16 text-neutral-500">
                        <Maximize2 className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                        <span className="text-sm font-semibold">Planos técnicos y folletos de Monte Fullana disponibles a pedido</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </section>

            {/* UNIDADES DISPONIBLES TABLE */}
            {currentProperty?.units && currentProperty.units.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
                <div className="text-left mb-6">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-neutral-800">LISTADO DE LOTES / UNIDADES</h3>
                  <div className="w-12 h-0.5 bg-brand-accent mt-2"></div>
                </div>

                {/* Table wrapper */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 font-display font-bold text-neutral-700 tracking-wide uppercase text-[10px] sm:text-xs border-b border-slate-200">
                        <th className="py-4 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-1">
                            Lote / Unidad <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </th>
                        <th className="py-4 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('environments')}>
                          <div className="flex items-center gap-1">
                            Tipo <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </th>
                        <th className="py-4 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('area')}>
                          <div className="flex items-center gap-1">
                            Superficie <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </th>
                        <th className="py-4 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('price')}>
                          <div className="flex items-center gap-1">
                            Valor Sugerido <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUnits.slice(0, showAllUnits ? undefined : 6).map((un, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6 font-semibold text-neutral-800">{un.name}</td>
                          <td className="py-3.5 px-4 font-medium text-neutral-600">{un.environments === 1 ? 'Lote Residencial/Comercial' : `${un.environments} ambientes`}</td>
                          <td className="py-3.5 px-4 font-medium text-neutral-600">{un.area} m²</td>
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-brand-accent">{un.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* View all units expansion button */}
                {currentProperty.units.length > 6 && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setShowAllUnits(prev => !prev)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-slate-300 hover:border-brand-accent hover:bg-brand-accent/5 text-xs font-bold text-neutral-700 hover:text-brand-accent uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      {showAllUnits ? 'Contraer lotes' : 'Ver todos los lotes'}
                    </button>
                  </div>
                )}

              </section>
            )}

          </motion.main>
        )}
      </AnimatePresence>

      {/* CORE FOOTER */}
      <footer id="sucursales" className="bg-[#0b141f] text-white border-t border-brand-accent/20 pt-16 pb-8 text-left mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/5 pb-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <button onClick={handleBackToHome} className="flex flex-col items-start cursor-pointer text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white uppercase">
                GUSTAVO LAURENTE
              </span>
              <span className="text-[10px] font-semibold tracking-[0.35em] text-brand-accent uppercase -mt-1">
                PROPIEDADES
              </span>
            </button>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Inmobiliaria especializada en compra, venta, alquiler y tasaciones en Pergamino, Rojas y la región. Más de 20 años acompañando a familias, propietarios e inversores locales.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-accent text-neutral-300 hover:text-white flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-accent text-neutral-300 hover:text-white flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://wa.me/542477210864" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-accent text-neutral-300 hover:text-white flex items-center justify-center transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Offices / Sucursales */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-accent border-b border-white/5 pb-2">
              OFICINA CENTRAL Y CONTACTO
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-300">
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" /> Pergamino, Bs. As.
                </h4>
                <p className="text-neutral-400">Gral. Paz 493, Pergamino.</p>
                <p className="text-neutral-300 font-semibold">Tel: 2477 210864</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-brand-accent" /> Alquileres
                </h4>
                <p className="text-neutral-400">Atención Marcela:</p>
                <p className="text-neutral-300 font-semibold">Cel: 2477 516083</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <h4 className="font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-brand-accent" /> Email corporativo
                </h4>
                <p className="text-neutral-400">Escribinos directamente a:</p>
                <p className="text-brand-accent font-semibold">gustavo_laurente@hotmail.com</p>
              </div>
            </div>

            {/* Quick search shortcuts */}
            <div className="flex flex-wrap gap-2 pt-3">
              <button 
                onClick={() => handleQuickSearch('Venta', 'vivienda')}
                className="px-3.5 py-1.5 border border-white/5 hover:border-brand-accent text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Casas en venta
              </button>
              <button 
                onClick={() => handleQuickSearch('Venta', 'terreno')}
                className="px-3.5 py-1.5 border border-white/5 hover:border-brand-accent text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Lotes en venta
              </button>
              <button 
                onClick={() => handleQuickSearch('Alquiler', 'vivienda')}
                className="px-3.5 py-1.5 border border-white/5 hover:border-brand-accent text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Alquileres Pergamino
              </button>
            </div>
          </div>

          {/* Col 3: Institutional Navigation */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-accent border-b border-white/5 pb-2">
              MENÚ INSTITUCIONAL
            </h3>
            
            <ul className="text-xs font-semibold text-neutral-400 space-y-2.5">
              <li>
                <button onClick={handleBackToHome} className="hover:text-brand-accent transition-colors cursor-pointer uppercase">
                  Buscador de Propiedades
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectProperty('monte-fullana')} className="hover:text-brand-accent transition-colors cursor-pointer uppercase">
                  Loteo Monte Fullana
                </button>
              </li>
              <li>
                <a href="#inversiones" className="hover:text-brand-accent transition-colors uppercase">
                  Inversiones Inmobiliarias
                </a>
              </li>
              <li>
                <a href="#tasaciones" className="hover:text-brand-accent transition-colors uppercase">
                  Tasaciones Profesionales
                </a>
              </li>
              <li>
                <a href="#contacto-form" className="hover:text-brand-accent transition-colors uppercase">
                  Contacto Directo
                </a>
              </li>
            </ul>

            {/* Simulated AFIP / Data Fiscal QR */}
            <div className="pt-2">
              <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-inner max-w-[90px] select-none">
                <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="25" height="25" fill="#000000" />
                  <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                  <rect x="65" y="10" width="25" height="25" fill="#000000" />
                  <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                  <rect x="10" y="65" width="25" height="25" fill="#000000" />
                  <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                  <rect x="45" y="25" width="10" height="10" fill="#000000" />
                  <rect x="55" y="45" width="10" height="10" fill="#000000" />
                  <rect x="35" y="55" width="15" height="15" fill="#c29944" />
                  <rect x="55" y="65" width="20" height="20" fill="#000000" />
                  <rect x="10" y="45" width="10" height="10" fill="#000000" />
                  <rect x="45" y="10" width="10" height="10" fill="#000000" />
                </svg>
                <div className="text-[7px] font-extrabold text-neutral-800 tracking-tight text-center mt-1 leading-none uppercase">
                  DATA FISCAL
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Gustavo Laurente Propiedades. Todos los derechos reservados. Pergamino, Buenos Aires.</span>
          <span>Desarrollado con excelencia</span>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/542477210864" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Label tooltip */}
        <span className="absolute right-16 bg-neutral-900/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md border border-white/5">
          Consultá por WhatsApp
        </span>
        <MessageSquare className="w-6 h-6 fill-white/10" />
      </a>

    </div>
  );
}
