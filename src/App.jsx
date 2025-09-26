import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Ticket,
  ShoppingCart,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

// Componente de header padronizado
const PageHeader = ({ icon: Icon, title, subtitle, onBack, count }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3 p-4 sm:p-6 bg-white rounded-lg shadow-sm border-l-4" style={{borderLeftColor: '#165743'}}>
        {onBack && (
          <button
            className="bg-gray-50 text-gray-600 border border-gray-300 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 flex items-center justify-center"
            onClick={onBack}
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(22, 87, 67, 0.1)'}}>
          <Icon className="w-6 h-6" style={{color: '#165743'}} />
        </div>
        <div className="flex-1">
          <h2 className="text-gray-700 text-lg sm:text-xl font-semibold m-0">{title}</h2>
          <p className="text-gray-500 text-xs sm:text-xs m-0">
            {subtitle || (count !== undefined
              ? count > 0
                ? `${count} ${count === 1 ? 'item' : 'itens'} encontrado${count === 1 ? '' : 's'}`
                : 'Nenhum item encontrado'
              : ''
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const MyTickets = ({ customerId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchTickets();
    }
  }, [customerId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://expoflora-orders-api.azurewebsites.net/api/users/${customerId}/orders`);
      const orders = await response.json();

      // Extrair todos os ingressos de todos os pedidos aprovados
      const allTickets = [];
      orders.forEach(order => {
        if (order.tickets && Array.isArray(order.tickets) &&
            (order.paymentStatus === 'Authorized' || order.paymentStatus === 'PaymentConfirmed')) {
          allTickets.push(...order.tickets);
        }
      });

      setTickets(allTickets);
    } catch (error) {
      console.error('Erro ao buscar ingressos:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl p-12 bg-white rounded-xl shadow-sm">Carregando ingressos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-120px)] p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={Ticket}
        title="Meus Ingressos"
        subtitle={tickets.length > 0
          ? `${tickets.length} ingresso${tickets.length > 1 ? 's' : ''} disponível${tickets.length > 1 ? 'eis' : ''}`
          : 'Nenhum ingresso encontrado'
        }
      />

      {tickets.length === 0 ? (
        <div className="border rounded-xl p-8 text-center" style={{backgroundColor: 'rgba(22, 87, 67, 0.05)', borderColor: 'rgba(22, 87, 67, 0.2)'}}>
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full" style={{backgroundColor: 'rgba(22, 87, 67, 0.1)'}}>
              <Ticket className="w-8 h-8" style={{color: '#165743'}} />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-xs mb-2" style={{color: '#165743'}}>Nenhum Ingresso Encontrado</h4>
              <p className="text-xs sm:text-xs leading-relaxed mb-1" style={{color: 'rgba(22, 87, 67, 0.8)'}}>
                Você ainda não possui ingressos válidos.
              </p>
              <p className="text-xs" style={{color: 'rgba(22, 87, 67, 0.7)'}}>
                Faça um pedido para adquirir seus ingressos!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
              {/* Header Compacto */}
              <div className="px-4 py-3 border-b border-gray-100" style={{background: 'linear-gradient(135deg, #165743 0%, rgba(22, 87, 67, 0.85) 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-xs m-0">Ingresso #{index + 1}</h4>
                      <p className="text-white text-opacity-90 text-xs m-0">{ticket.ticketTypeName}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    ticket.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ticket.status === 'ACTIVE' ? '✓ Ativo' : ticket.status}
                  </span>
                </div>
              </div>

              {/* Conteúdo Responsivo */}
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* QR Code */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 flex-shrink-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                      <img
                        src={ticket.qrCodeUrl}
                        alt={`QR Code do ingresso ${index + 1}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 block"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden justify-center items-center w-16 h-16 sm:w-20 sm:h-20">
                        <div className="text-center text-gray-400">
                          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                          <span className="text-xs">QR indisponível</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-white border-0 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all duration-200 text-xs flex items-center gap-1 hover:opacity-90 flex-shrink-0"
                      style={{backgroundColor: 'rgb(255, 122, 0)'}}
                      onClick={() => window.open(ticket.qrCodeUrl, '_blank')}
                    >
                      <Download className="w-3 h-3" />
                      Baixar
                    </button>
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Portador:</span>
                        <span className="font-semibold text-gray-800 text-right">{ticket.customerName}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Evento:</span>
                        <span className="font-semibold text-gray-800 text-right">{ticket.eventName}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Data:</span>
                        <span className="font-semibold text-gray-800 text-right">{formatDate(ticket.startDateEvent)}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Tipo:</span>
                        <span className="font-semibold text-gray-800 text-right">{ticket.ticketTypeName}</span>
                      </div>

                      {ticket.validatedAt && (
                        <div className="flex justify-between items-start">
                          <span className="text-green-600 font-medium flex-shrink-0 mr-2">✅ Validado:</span>
                          <span className="font-semibold text-green-800 text-right">{formatDate(ticket.validatedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t border-gray-100">
                      {ticket.status === 'ACTIVE' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-green-800 font-medium text-xs">Ingresso válido e pronto para uso!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                          <span className="text-yellow-800 font-medium text-xs">Status: {ticket.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState('tickets');
  const [currentPage, setCurrentPage] = useState('buy-tickets');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('usuario');
    if (userId) {
      setCustomerId(userId);
    } else {
      setCustomerId('d4e5f6a7-b8c9-4123-9def-456789012345');
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://expoflora-orders-api.azurewebsites.net/api/events/1f116a2b-69b2-41e7-a362-55eb8ce5a2f4/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Erro ao buscar ingressos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (ticket, quantity) => {
    const existingItem = cart.find(item => item.ticketTypeId === ticket.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.ticketTypeId === ticket.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        ticketTypeId: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quantity: quantity
      }]);
    }
  };

  const removeFromCart = (ticketTypeId) => {
    setCart(cart.filter(item => item.ticketTypeId !== ticketTypeId));
  };

  const updateCartQuantity = (ticketTypeId, quantity) => {
    if (quantity === 0) {
      removeFromCart(ticketTypeId);
    } else {
      setCart(cart.map(item =>
        item.ticketTypeId === ticketTypeId
          ? { ...item, quantity: quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold m-0" style={{color: 'rgb(255, 122, 0)'}}>
                ExpoFlora
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <a
                href="#"
                className={`${
                  currentPage === 'buy-tickets'
                    ? 'border-2 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } no-underline font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-transparent`}
                style={currentPage === 'buy-tickets' ? {color: '#165743', backgroundColor: '#f0f9ff', borderColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('buy-tickets');
                  setCurrentStep('tickets');
                  setIsMobileMenuOpen(false);
                }}
              >
                Comprar Ingressos
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'my-orders'
                    ? 'border-2 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } no-underline font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-transparent`}
                style={currentPage === 'my-orders' ? {color: '#165743', backgroundColor: '#f0f9ff', borderColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('my-orders');
                  setIsMobileMenuOpen(false);
                }}
              >
                Meus Pedidos
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'my-tickets'
                    ? 'border-2 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } no-underline font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-transparent`}
                style={currentPage === 'my-tickets' ? {color: '#165743', backgroundColor: '#f0f9ff', borderColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('my-tickets');
                  setIsMobileMenuOpen(false);
                }}
              >
                Meus Ingressos
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'history'
                    ? 'border-2 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } no-underline font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-transparent`}
                style={currentPage === 'history' ? {color: '#165743', backgroundColor: '#f0f9ff', borderColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('history');
                  setIsMobileMenuOpen(false);
                }}
              >
                Histórico
              </a>
            </nav>

            {/* User Info & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Info - Hidden on small screens */}
              <div className="hidden sm:block text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200">
                <span className="text-gray-500">Usuário:</span> {customerId.slice(0, 8)}...
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{'--tw-ring-color': '#165743'}}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menu principal</span>
                {/* Hamburger icon */}
                <Menu className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
                {/* Close icon */}
                <X className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-gray-50">
              {/* User info for mobile */}
              <div className="text-gray-600 bg-white px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 mb-3">
                <span className="text-gray-500">Usuário:</span> {customerId.slice(0, 8)}...
              </div>

              <a
                href="#"
                className={`${
                  currentPage === 'buy-tickets'
                    ? 'border-l-4 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                } block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200`}
                style={currentPage === 'buy-tickets' ? {color: '#165743', backgroundColor: '#f0f9ff', borderLeftColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('buy-tickets');
                  setCurrentStep('tickets');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Comprar Ingressos
                </div>
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'my-orders'
                    ? 'border-l-4 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                } block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200`}
                style={currentPage === 'my-orders' ? {color: '#165743', backgroundColor: '#f0f9ff', borderLeftColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('my-orders');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Meus Pedidos
                </div>
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'my-tickets'
                    ? 'border-l-4 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                } block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200`}
                style={currentPage === 'my-tickets' ? {color: '#165743', backgroundColor: '#f0f9ff', borderLeftColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('my-tickets');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Meus Ingressos
                </div>
              </a>
              <a
                href="#"
                className={`${
                  currentPage === 'history'
                    ? 'border-l-4 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                } block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200`}
                style={currentPage === 'history' ? {color: '#165743', backgroundColor: '#f0f9ff', borderLeftColor: '#165743'} : {}}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('history');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Histórico
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gray-50 min-h-[calc(100vh-64px)]">
        {currentPage === 'buy-tickets' && (
          <>
           


            {currentStep === 'tickets' && (
              <TicketSelection
                tickets={tickets}
                loading={loading}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                getTotalPrice={getTotalPrice}
                onProceedToCheckout={() => setCurrentStep('checkout')}
              />
            )}

            {currentStep === 'checkout' && (
              <Checkout
                cart={cart}
                customerId={customerId}
                getTotalPrice={getTotalPrice}
                onBack={() => setCurrentStep('tickets')}
              />
            )}
          </>
        )}

        {currentPage === 'my-orders' && !selectedOrder && (
          <MyOrders
            customerId={customerId}
            onViewOrder={(order) => setSelectedOrder(order)}
          />
        )}

        {currentPage === 'my-orders' && selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
          />
        )}

        {currentPage === 'my-tickets' && (
          <MyTickets customerId={customerId} />
        )}

        {currentPage === 'history' && (
          <div className="max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-120px)] p-4 sm:p-6 lg:p-8">
            <PageHeader
              icon={Clock}
              title="Histórico de Atividades"
              subtitle="Acompanhe suas atividades recentes"
            />
            <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm max-w-2xl mx-auto">
              <p className="text-gray-500 text-lg m-0">Em breve...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TicketSelection = ({ tickets, loading, cart, addToCart, removeFromCart, updateCartQuantity, getTotalPrice, onProceedToCheckout }) => {
  const [quantities, setQuantities] = useState({});
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const handleQuantityChange = (ticketId, quantity) => {
    setQuantities({ ...quantities, [ticketId]: quantity });
  };

  const handleAddToCart = (ticket) => {
    const quantity = quantities[ticket.id] || 1;
    addToCart(ticket, quantity);
    // Não resetar a quantidade, manter o valor escolhido
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl p-12 bg-white rounded-xl shadow-sm">Carregando ingressos...</div>;
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Seção de Ingressos - 2/3 da tela no desktop */}
        <div className="xl:col-span-2">
          <h2 className="text-gray-800 mb-6 text-3xl font-bold">Ingressos Disponíveis</h2>
          <div className="space-y-2 mb-6 xl:mb-0">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-lg" style={{'--hover-border-color': 'rgb(255, 122, 0)'}} onMouseEnter={(e) => e.target.style.borderColor = 'rgb(255, 122, 0)'} onMouseLeave={(e) => e.target.style.borderColor = ''}>
                {/* Layout Mobile - tudo empilhado */}
                <div className="block md:hidden">
                  {/* Cabeçalho com ícone e nome */}
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-6 h-6 flex-shrink-0" style={{color: 'rgb(255, 122, 0)'}} />
                    <h3 className="text-gray-800 text-lg font-semibold flex-1">{ticket.name}</h3>
                  </div>

                  {/* Preço */}
                  <div className="text-2xl font-bold mb-3" style={{color: '#165743'}}>
                    R$ {ticket.price.toFixed(2)}
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{ticket.description}</p>

                  {/* Controles de quantidade */}
                  <div className="flex items-center justify-start">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                      <button
                        className="bg-gray-50 border-0 w-10 h-10 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-l-md"
                        onClick={() => handleQuantityChange(ticket.id, Math.max(1, (quantities[ticket.id] || 1) - 1))}
                        disabled={(quantities[ticket.id] || 1) <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        className="w-16 h-10 border-0 text-center font-semibold bg-white text-gray-600 focus:outline-none text-lg"
                        min="1"
                        value={quantities[ticket.id] || 1}
                        onChange={(e) => handleQuantityChange(ticket.id, Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <button
                        className="bg-gray-50 border-0 w-10 h-10 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-r-md"
                        onClick={() => handleQuantityChange(ticket.id, Math.max(1, (quantities[ticket.id] || 1) + 1))}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Layout Desktop - lado a lado */}
                <div className="hidden md:flex md:items-center md:justify-between gap-4">
                  {/* Nome do ingresso com ícone */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Ticket className="w-6 h-6" style={{color: 'rgb(255, 122, 0)'}} />
                        <h3 className="text-gray-800 text-xl font-semibold">{ticket.name}</h3>
                      </div>
                      <div className="text-2xl font-bold mt-2" style={{color: '#165743'}}>
                        R$ {ticket.price.toFixed(2)}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mt-2">{ticket.description}</p>
                    </div>
                  </div>

                  {/* Controles de quantidade - alinhados à direita */}
                  <div className="flex items-center justify-end">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                      <button
                        className="bg-gray-50 border-0 w-9 h-9 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-l-md"
                        onClick={() => handleQuantityChange(ticket.id, Math.max(1, (quantities[ticket.id] || 1) - 1))}
                        disabled={(quantities[ticket.id] || 1) <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        className="w-12 h-9 border-0 text-center font-semibold bg-white text-gray-600 focus:outline-none"
                        min="1"
                        value={quantities[ticket.id] || 1}
                        onChange={(e) => handleQuantityChange(ticket.id, Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <button
                        className="bg-gray-50 border-0 w-9 h-9 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-r-md"
                        onClick={() => handleQuantityChange(ticket.id, Math.max(1, (quantities[ticket.id] || 1) + 1))}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Adicionar ao Carrinho embaixo de todos os ingressos */}
          {Object.keys(quantities).length > 0 && Object.values(quantities).some(q => q > 0) && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-32 xl:mb-0">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <h4 className="text-gray-800 text-lg font-semibold mb-3">Resumo da Seleção</h4>
                  <div className="space-y-2">
                    {tickets
                      .filter(ticket => quantities[ticket.id] > 0)
                      .map(ticket => (
                        <div key={ticket.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{quantities[ticket.id]}x {ticket.name}</span>
                          <span className="font-semibold text-gray-800">R$ {(ticket.price * quantities[ticket.id]).toFixed(2)}</span>
                        </div>
                      ))
                    }
                  </div>
                  <div className="mt-3 pt-3 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold" style={{color: '#165743'}}>
                        R$ {tickets
                          .filter(ticket => quantities[ticket.id] > 0)
                          .reduce((total, ticket) => total + (ticket.price * quantities[ticket.id]), 0)
                          .toFixed(2)
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Adicionar todos os ingressos selecionados de uma vez
                    tickets
                      .filter(ticket => quantities[ticket.id] > 0)
                      .forEach(ticket => {
                        const quantity = quantities[ticket.id];
                        addToCart(ticket, quantity);
                      });

                    // Opcional: resetar quantities após adicionar ao carrinho
                    const resetQuantities = {};
                    Object.keys(quantities).forEach(ticketId => {
                      resetQuantities[ticketId] = 1;
                    });
                    setQuantities(resetQuantities);
                  }}
                  className="w-full text-white border-0 px-6 py-4 rounded-lg cursor-pointer font-semibold text-lg transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                  style={{backgroundColor: 'rgb(255, 122, 0)'}}
                >
                  Adicionar Tudo ao Carrinho
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Seção do Carrinho - 1/3 da tela no desktop */}
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-xl font-bold">Carrinho de Compras</h3>
              <button
                className="text-white px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{backgroundColor: 'rgb(255, 122, 0)'}}
                onClick={() => setShowCartDropdown(true)}
              >
                Abrir Drawer
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Itens no Carrinho</span>
                    <span className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" style={{backgroundColor: '#165743'}}>
                      {getTotalItems()}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.ticketTypeId} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          R$ {item.price.toFixed(2)} cada
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded bg-white">
                          <button
                            className="bg-gray-50 border-0 w-6 h-6 flex items-center justify-center cursor-pointer font-semibold text-xs text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800"
                            onClick={() => updateCartQuantity(item.ticketTypeId, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 h-6 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {item.quantity}
                          </span>
                          <button
                            className="bg-gray-50 border-0 w-6 h-6 flex items-center justify-center cursor-pointer font-semibold text-xs text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800"
                            onClick={() => updateCartQuantity(item.ticketTypeId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          className="bg-red-600 text-white border-0 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-700 text-xs"
                          onClick={() => removeFromCart(item.ticketTypeId)}
                          title="Remover item"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="font-bold text-gray-700 text-lg mb-4 text-center">
                    Total: R$ {getTotalPrice().toFixed(2)}
                  </div>
                  <button
                    className="w-full text-white border-0 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    style={{backgroundColor: 'rgb(255, 122, 0)'}}
                    onClick={() => onProceedToCheckout()}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão do Carrinho - sempre visível */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-40">
        {cart.length > 0 ? (
          <button
            className="w-full text-white border-0 rounded-lg px-4 py-4 font-semibold cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl text-sm sm:text-xs"
            style={{backgroundColor: 'rgb(255, 122, 0)'}}
            onClick={() => setShowCartDropdown(true)}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Carrinho ({getTotalItems()}) - R$ {getTotalPrice().toFixed(2)}
            </div>
          </button>
        ) : (
          <div className="w-full bg-gray-500 text-white border-0 rounded-lg px-4 py-3 text-center opacity-50 text-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Carrinho vazio
            </div>
          </div>
        )}
      </div>

      {/* Overlay do Drawer */}
      {showCartDropdown && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setShowCartDropdown(false)}
        />
      )}

      {/* Drawer Lateral do Carrinho */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        showCartDropdown ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header do Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{backgroundColor: '#165743'}}>
          <h3 className="text-white text-lg font-semibold">Carrinho de Compras</h3>
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={() => setShowCartDropdown(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo do Drawer */}
        <div className="flex flex-col h-full">
          {/* Lista de Itens - com padding bottom para não sobrepor o footer */}
          <div className="flex-1 overflow-y-auto p-4" style={{paddingBottom: cart.length > 0 ? '120px' : '20px'}}>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.ticketTypeId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)} cada</p>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => removeFromCart(item.ticketTypeId)}
                        title="Remover item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => updateCartQuantity(item.ticketTypeId, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => updateCartQuantity(item.ticketTypeId, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-lg font-bold" style={{color: '#165743'}}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com Total e Botão - sempre fixo na parte inferior */}
          {cart.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold" style={{color: '#165743'}}>
                  R$ {getTotalPrice().toFixed(2)}
                </span>
              </div>
              <button
                className="w-full text-white border-0 py-4 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-lg"
                style={{backgroundColor: 'rgb(255, 122, 0)'}}
                onClick={() => {
                  setShowCartDropdown(false);
                  onProceedToCheckout();
                }}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Finalizar Compra
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ cart, customerId, getTotalPrice, onBack }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cardCVV: '',
    installments: 1
  });
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 6);
    }
    return v;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'cardExpiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cardCVV') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentData({ ...paymentData, [field]: formattedValue });
  };

  const submitOrder = async () => {
    setProcessing(true);

    const orderData = {
      customerId: customerId,
      eventId: "1f116a2b-69b2-41e7-a362-55eb8ce5a2f4",
      items: cart.map(item => ({
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity
      })),
      payment: {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        cardHolderName: paymentData.cardHolderName,
        cardExpiry: paymentData.cardExpiry,
        cardCVV: paymentData.cardCVV,
        installments: paymentData.installments
      }
    };

    try {
      const response = await fetch('https://expoflora-orders-api.azurewebsites.net/api/ReceiveOrderFunction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderComplete(true);
      } else {
        alert('Erro ao processar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-green-600 mb-6 text-4xl font-bold">✅ Pedido Confirmado!</h2>
        <p className="text-gray-500 mb-4 leading-relaxed text-lg">Seu pedido foi processado com sucesso.</p>
        <p className="text-gray-500 mb-4 leading-relaxed text-lg">Você receberá um e-mail com os detalhes em breve.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-white border-0 px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer mt-6 transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
          style={{backgroundColor: 'rgb(255, 122, 0)'}}
        >
          Fazer Novo Pedido
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Resumo do Pedido */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-800 mb-4 text-lg font-bold border-b border-gray-200 pb-2">Resumo do Pedido</h3>
          {cart.map(item => (
            <div key={item.ticketTypeId} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
              <span className="text-gray-700 text-sm">{item.name}</span>
              <span className="text-gray-700 font-semibold text-sm">{item.quantity}x R$ {item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t-2 text-gray-800 text-lg font-bold text-center" style={{borderTopColor: '#165743'}}>
            Total: R$ {getTotalPrice().toFixed(2)}
          </div>
        </div>

        {/* Coluna Direita - Formulário de Pagamento */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-800 mb-4 text-lg font-bold border-b border-gray-200 pb-2">Dados do Pagamento</h3>

          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Número do Cartão</label>
            <div className="relative">
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none hover:border-gray-400 shadow-sm focus:shadow-lg"
                onFocus={(e) => {
                  e.target.style.borderColor = '#165743';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 87, 67, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Nome no Cartão</label>
            <input
              type="text"
              value={paymentData.cardHolderName}
              onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
              placeholder="Nome como no cartão"
              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none hover:border-gray-400 shadow-sm focus:shadow-lg"
              onFocus={(e) => {
                e.target.style.borderColor = '#165743';
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 87, 67, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Validade</label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentData.cardExpiry}
                  onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                  placeholder="MM/AAAA"
                  maxLength="7"
                  className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none hover:border-gray-400 shadow-sm focus:shadow-lg"
                onFocus={(e) => {
                  e.target.style.borderColor = '#165743';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 87, 67, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">CVV</label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentData.cardCVV}
                  onChange={(e) => handleInputChange('cardCVV', e.target.value)}
                  placeholder="123"
                  maxLength="3"
                  className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none hover:border-gray-400 shadow-sm focus:shadow-lg"
                onFocus={(e) => {
                  e.target.style.borderColor = '#165743';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 87, 67, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Parcelas</label>
            <div className="relative">
              <select
                value={paymentData.installments}
                onChange={(e) => setPaymentData({ ...paymentData, installments: parseInt(e.target.value) })}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none hover:border-gray-400 shadow-sm focus:shadow-lg appearance-none cursor-pointer"
                onFocus={(e) => {
                  e.target.style.borderColor = '#165743';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 87, 67, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value={1}>1x R$ {getTotalPrice().toFixed(2)}</option>
                <option value={2}>2x R$ {(getTotalPrice() / 2).toFixed(2)}</option>
                <option value={3}>3x R$ {(getTotalPrice() / 3).toFixed(2)}</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white border-0 px-4 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:-translate-y-0.5"
            >
              Voltar
            </button>
            <button
              onClick={submitOrder}
              className="flex-2 text-white border-0 px-4 py-3 rounded-lg text-base font-bold cursor-pointer transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              style={{backgroundColor: 'rgb(255, 122, 0)'}}
              disabled={processing || !paymentData.cardNumber || !paymentData.cardHolderName || !paymentData.cardExpiry || !paymentData.cardCVV}
            >
              {processing ? 'Processando...' : `Pagar R$ ${getTotalPrice().toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyOrders = ({ customerId, onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://expoflora-orders-api.azurewebsites.net/api/users/${customerId}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

const getStatusColor = (status) => {
  switch (status) {
    case "Authorized":
    case "PaymentConfirmed":
      return {backgroundColor: '#165743'};

    case "Pending":
    case "Scheduled":
      return {backgroundColor: 'rgb(255, 122, 0)'};

    case "Denied":
    case "Voided":
    case "Refunded":
    case "Aborted":
    case "FAILED":
    case "Failed":
      return {backgroundColor: '#ef4444'};

    case "NotFinished":
    default:
      return {backgroundColor: '#6b7280'};
  }
};


  const getStatusText = (status) => {
  switch (status) {
    case "Authorized":
    case "PaymentConfirmed":
      return "Aprovado";

    case "Pending":
    case "Scheduled":
      return "Pendente";

    case "Denied":
    case "Voided":
    case "Refunded":
    case "Aborted":
    case "FAILED":
    case "Failed":
      return "Falhou";

    case "NotFinished":
      return "Não finalizado";

    default:
      return status; // fallback, mostra o valor cru caso não mapeado
  }
};
  if (loading) {
    return <div className="text-center text-gray-500 text-xl p-12 bg-white rounded-xl shadow-sm">Carregando pedidos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-0">
      <PageHeader
        icon={Eye}
        title="Meus Pedidos"
        count={orders.length}
      />
      {orders.length === 0 ? (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
          <p className="text-gray-500 text-lg m-0">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header da tabela - Apenas Desktop */}
          <div className="hidden md:block bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center font-semibold text-gray-700 text-xs sm:text-xs">
              <div className="col-span-1"></div>
              <div className="col-span-3">Evento</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Data</div>
              <div className="col-span-2">Ações</div>
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="divide-y divide-gray-200">
            {orders.map(order => {
              const isExpanded = expandedOrders.has(order.id);
              return (
                <div key={order.id} className="transition-all duration-200 hover:bg-gray-50">

                  {/* Layout Desktop */}
                  <div className="hidden md:block px-6 py-4 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Ícone de expansão */}
                      <div className="col-span-1">
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>

                      {/* Nome do evento */}
                      <div className="col-span-3">
                        <h3 className="text-gray-800 font-semibold text-xs sm:text-xs">{order.eventName}</h3>
                        <p className="text-gray-500 text-xs">#{order.id.slice(0, 8)}...</p>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span className="text-white px-2 py-1 rounded-lg text-xs font-semibold uppercase" style={getStatusColor(order.paymentStatus)}>
                          {getStatusText(order.paymentStatus)}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="col-span-2">
                        <span className="font-bold text-gray-800">R$ {order.totalValue.toFixed(2)}</span>
                        <p className="text-gray-500 text-xs">{order.installments}x parcela{order.installments > 1 ? 's' : ''}</p>
                      </div>

                      {/* Data */}
                      <div className="col-span-2">
                        <span className="text-gray-700 text-xs sm:text-xs">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>

                      {/* Ações */}
                      <div className="col-span-2 flex gap-2">
                        <button
                          className="px-3 py-1 bg-gray-500 text-white border-0 rounded text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewOrder(order);
                          }}
                        >
                          Detalhes
                        </button>
                        {(order.paymentStatus === 'Authorized' || order.paymentStatus === 'PAID') && (
                          <button
                            className="px-3 py-1 text-white border-0 rounded text-xs font-semibold cursor-pointer transition-all duration-200"
                            style={{backgroundColor: 'rgb(255, 122, 0)'}}
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewOrder(order);
                            }}
                          >
                            Ingressos
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layout Mobile - Compacto */}
                  <div className="md:hidden p-3 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-gray-800 font-semibold text-xs truncate">{order.eventName}</h3>
                            <span className="text-white px-2 py-0.5 rounded text-xs font-bold uppercase ml-2 flex-shrink-0" style={getStatusColor(order.paymentStatus)}>
                              {getStatusText(order.paymentStatus)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800" style={{color: '#165743'}}>R$ {order.totalValue.toFixed(2)}</span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{order.installments}x</span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos - Responsivo */}
                  {isExpanded && (
                    <div className="px-4 md:px-6 pb-4 bg-gray-25 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">ID do Pedido</div>
                          <div className="text-sm font-medium text-gray-800">#{order.id.slice(0, 8)}...</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Valor Total</div>
                          <div className="text-sm font-bold" style={{color: '#165743'}}>R$ {order.totalValue.toFixed(2)}</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Forma de Pagamento</div>
                          <div className="text-sm font-medium text-gray-800">{order.installments}x no cartão</div>
                        </div>

                        {order.transactionId && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">ID da Transação</div>
                            <div className="text-sm font-medium text-gray-800">{order.transactionId}</div>
                          </div>
                        )}

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Data de Criação</div>
                          <div className="text-sm font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Status do Pagamento</div>
                          <span className="text-white px-2 py-1 rounded text-xs font-semibold uppercase" style={getStatusColor(order.paymentStatus)}>
                            {getStatusText(order.paymentStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Botões de ação expandidos */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 bg-gray-500 text-white border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:-translate-y-0.5 text-sm"
                          onClick={() => onViewOrder(order)}
                        >
                          Ver Detalhes Completos
                        </button>
                        {(order.paymentStatus === 'Authorized' || order.paymentStatus === 'PAID') && (
                          <button
                            className="px-4 py-2 text-white border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-sm"
                            style={{backgroundColor: 'rgb(255, 122, 0)'}}
                            onClick={() => onViewOrder(order)}
                          >
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Baixar Ingressos
                            </div>
                          </button>
                        )}
                        {(order.paymentStatus === 'FAILED' || order.paymentStatus === 'Failed') && (
                          <button className="px-4 py-2 bg-red-600 text-white border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 text-sm">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Tentar Novamente
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderDetails = ({ order, onBack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Authorized":
      case "PaymentConfirmed":
        return {backgroundColor: '#165743'};

      case "Pending":
      case "Scheduled":
        return {backgroundColor: 'rgb(255, 122, 0)'};

      case "Denied":
      case "Voided":
      case "Refunded":
      case "Aborted":
      case "FAILED":
      case "Failed":
        return {backgroundColor: '#ef4444'};

      case "NotFinished":
      default:
        return {backgroundColor: '#6b7280'};
    }
  };

 const getStatusText = (status) => {
  switch (status) {
    case "Authorized":
    case "PaymentConfirmed":
      return "Aprovado";

    case "Pending":
    case "Scheduled":
      return "Pendente";

    case "Denied":
    case "Voided":
    case "Refunded":
    case "Aborted":
    case "FAILED":
    case "Failed":
      return "Falhou";

    case "NotFinished":
      return "Não finalizado";

    default:
      return status; // fallback para qualquer valor inesperado
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-120px)] p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={Eye}
        title="Detalhes do Pedido"
        subtitle={`Pedido #${order.id.slice(0, 8)}... - ${order.eventName}`}
        onBack={onBack}
      />

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-3 border-b border-gray-300">
          <h3 className="text-gray-700 text-lg font-semibold m-0 mb-3 md:mb-0">{order.eventName}</h3>
          <span className={`${getStatusColor(order.paymentStatus)} text-white px-3 py-1 rounded-xl text-xs font-semibold uppercase`}>
            {getStatusText(order.paymentStatus)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Pedido:</span>
            <span className="text-gray-700 font-semibold text-sm">#{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Cliente:</span>
            <span className="text-gray-700 font-semibold text-sm">{order.clientName}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Email:</span>
            <span className="text-gray-700 font-semibold text-sm">{order.clientEmail || 'Não informado'}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Total:</span>
            <span className="text-green-600 font-bold text-base">R$ {order.totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Parcelas:</span>
            <span className="text-gray-700 font-semibold text-sm">{order.installments}x</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
            <span className="font-medium text-gray-500 text-sm">Data do Pedido:</span>
            <span className="text-gray-700 font-semibold text-sm">{formatDate(order.createdAt)}</span>
          </div>
          {order.transactionId && (
            <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded transition-colors hover:bg-gray-200">
              <span className="font-medium text-gray-500 text-sm">ID Transação:</span>
              <span className="text-gray-700 font-semibold text-sm">{order.transactionId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Ingressos */}
      <div className="mt-8">
        {/* Header dos Ingressos */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(22, 87, 67, 0.1)'}}>
              <Ticket className="w-6 h-6" style={{color: '#165743'}} />
            </div>
            <div>
              <h3 className="text-gray-800 text-xl font-bold m-0">Seus Ingressos</h3>
              <p className="text-gray-500 text-sm m-0">
                {order.tickets && order.tickets.length > 0
                  ? `${order.tickets.length} ingresso${order.tickets.length > 1 ? 's' : ''} disponível${order.tickets.length > 1 ? 'eis' : ''}`
                  : 'Processando ingressos...'
                }
              </p>
            </div>
          </div>
          {order.tickets && order.tickets.length > 0 && (
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 text-sm flex items-center gap-2"
                onClick={() => {
                  order.tickets.forEach(ticket => window.open(ticket.qrCodeUrl, '_blank'));
                }}
              >
                <Download className="w-4 h-4" />
                Baixar Todos
              </button>
            </div>
          )}
        </div>

        {order.tickets && order.tickets.length > 0 ? (
          /* Grid de Ingressos */
          <div className="space-y-4">
            {order.tickets.map((ticket, index) => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
                {/* Header Compacto */}
                <div className="px-4 py-3 border-b border-gray-100" style={{background: 'linear-gradient(135deg, #165743 0%, rgba(22, 87, 67, 0.85) 100%)'}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Ticket className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm m-0">Ingresso #{index + 1}</h4>
                        <p className="text-white text-opacity-90 text-xs m-0">{ticket.ticketTypeName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      ticket.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.status === 'ACTIVE' ? '✓ Ativo' : ticket.status}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Responsivo */}
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* QR Code */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 flex-shrink-0">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                        <img
                          src={ticket.qrCodeUrl}
                          alt={`QR Code do ingresso ${index + 1}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 block"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden justify-center items-center w-16 h-16 sm:w-20 sm:h-20">
                          <div className="text-center text-gray-400">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                            <span className="text-xs">QR indisponível</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-white border-0 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all duration-200 text-xs flex items-center gap-1 hover:opacity-90 flex-shrink-0"
                        style={{backgroundColor: 'rgb(255, 122, 0)'}}
                        onClick={() => window.open(ticket.qrCodeUrl, '_blank')}
                      >
                        <Download className="w-3 h-3" />
                        Baixar
                      </button>
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Portador:</span>
                          <span className="font-semibold text-gray-800 text-right">{ticket.customerName}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Evento:</span>
                          <span className="font-semibold text-gray-800 text-right">{ticket.eventName}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Data:</span>
                          <span className="font-semibold text-gray-800 text-right">{formatDate(ticket.startDateEvent)}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-medium flex-shrink-0 mr-2">Tipo:</span>
                          <span className="font-semibold text-gray-800 text-right">{ticket.ticketTypeName}</span>
                        </div>

                        {ticket.validatedAt && (
                          <div className="flex justify-between items-start">
                            <span className="text-green-600 font-medium flex-shrink-0 mr-2">✅ Validado:</span>
                            <span className="font-semibold text-green-800 text-right">{formatDate(ticket.validatedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="pt-2 border-t border-gray-100">
                        {ticket.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span className="text-green-800 font-medium text-xs">Ingresso válido e pronto para uso!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                            <span className="text-yellow-800 font-medium text-xs">Status: {ticket.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mensagem quando não há ingressos */
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-blue-800 font-bold text-lg mb-2">Ingressos em Processamento</h4>
                <p className="text-blue-700 text-sm leading-relaxed mb-1">
                  Seus ingressos estão sendo gerados automaticamente.
                </p>
                <p className="text-blue-600 text-xs">
                  Este processo pode levar alguns minutos. Atualize a página em instantes.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;