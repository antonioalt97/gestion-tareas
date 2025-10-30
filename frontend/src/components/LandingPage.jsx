import React from 'react';
import { Button } from './ui/button';
import { CheckCircle2, ListTodo, Filter, Calendar } from 'lucide-react';

const LandingPage = () => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            data-testid="landing-hero-title"
          >
            Gestiona tus Tareas
          </h1>
          <p 
            className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
            data-testid="landing-hero-subtitle"
          >
            Organiza, prioriza y completa tus tareas con una interfaz moderna y vibrante.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = authUrl}
            data-testid="landing-login-button"
          >
            Comenzar con Google
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" data-testid="feature-card-crud">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ListTodo className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>CRUD Completo</h3>
            <p className="text-gray-600 text-sm">Crea, lee, actualiza y elimina tareas fácilmente.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" data-testid="feature-card-filters">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Filter className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Filtros Avanzados</h3>
            <p className="text-gray-600 text-sm">Filtra por estado, prioridad y más.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" data-testid="feature-card-calendar">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Fechas Límite</h3>
            <p className="text-gray-600 text-sm">Establece y rastrea fechas límite para tus tareas.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" data-testid="feature-card-complete">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Marca Completas</h3>
            <p className="text-gray-600 text-sm">Marca tareas como completadas con un clic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;