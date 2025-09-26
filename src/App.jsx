import React, { useState, useEffect } from 'react';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState('tickets');
  const [currentPage, setCurrentPage] = useState('buy-tickets');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-gray-800 text-3xl font-bold m-0">ExpoFlora</h1>
          <nav className="flex gap-8 items-center">
            <a
              href="#"
              className={`${currentPage === 'buy-tickets' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'} no-underline font-medium px-4 py-2 rounded-md transition-all duration-200 hover:text-gray-600 hover:bg-gray-50`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('buy-tickets'); setCurrentStep('tickets'); }}
            >
              Comprar Ingressos
            </a>
            <a
              href="#"
              className={`${currentPage === 'my-orders' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'} no-underline font-medium px-4 py-2 rounded-md transition-all duration-200 hover:text-gray-600 hover:bg-gray-50`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('my-orders'); }}
            >
              Meus Pedidos
            </a>
            <a
              href="#"
              className={`${currentPage === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'} no-underline font-medium px-4 py-2 rounded-md transition-all duration-200 hover:text-gray-600 hover:bg-gray-50`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('history'); }}
            >
              Histórico
            </a>
          </nav>
          <div className="text-gray-600 bg-gray-200 px-4 py-2 rounded-full text-sm font-medium">
            Usuário: {customerId.slice(0, 8)}...
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-[calc(100vh-120px)]">
        {currentPage === 'buy-tickets' && (
          <>
            <div className="flex justify-center mb-8 gap-4 flex-nowrap">
              <div className={`px-6 py-3 bg-white ${currentStep === 'tickets' ? 'bg-red-600 bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' : 'text-gray-500 border-gray-200'} border-2 rounded-lg font-semibold transition-all duration-300 relative flex-shrink-0 min-w-[140px] text-center`}>
                1. Ingressos
              </div>
              <div className={`px-6 py-3 bg-white ${currentStep === 'checkout' ? 'bg-blue-600 text-blue-500 border-blue-600 shadow-lg shadow-blue-200' : 'text-gray-500 border-gray-200'} border-2 rounded-lg font-semibold transition-all duration-300 relative flex-shrink-0 min-w-[140px] text-center`}>
                2. Pagamento
              </div>
            </div>

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

        {currentPage === 'history' && (
          <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-gray-800 mb-4 text-3xl font-bold">Histórico de Atividades</h2>
            <p className="text-gray-500 text-lg m-0">Em breve...</p>
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
    setQuantities({ ...quantities, [ticket.id]: 1 });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl p-12 bg-white rounded-xl shadow-sm">Carregando ingressos...</div>;
  }

  return (
    <div className="relative">
      <div>
        <h2 className="text-gray-800 mb-6 text-3xl font-bold">Ingressos Disponíveis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600">
              <h3 className="text-gray-800 text-xl font-semibold mb-3">{ticket.name}</h3>
              <p className="text-gray-500 mb-5 leading-relaxed text-sm">{ticket.description}</p>
              <div className="text-3xl font-bold text-green-600 mb-3">R$ {ticket.price.toFixed(2)}</div>
              <div className="text-gray-500 text-sm mb-6 p-2 bg-gray-50 rounded-md border-l-4 border-cyan-500">
                Disponível: {ticket.availableQuantity} unidades
              </div>
              <div className="flex flex-row gap-4 mb-4">
                <div className="flex items-center gap-4 flex-nowrap">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                    <button
                      className="bg-gray-50 border-0 w-9 h-9 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(ticket.id, Math.max(1, (quantities[ticket.id] || 1) - 1))}
                      disabled={(quantities[ticket.id] || 1) <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-12 h-9 border-0 text-center font-semibold bg-white text-gray-600 focus:outline-none"
                      min="1"
                      max={ticket.availableQuantity}
                      value={quantities[ticket.id] || 1}
                      onChange={(e) => handleQuantityChange(ticket.id, Math.min(ticket.availableQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    />
                    <button
                      className="bg-gray-50 border-0 w-9 h-9 flex items-center justify-center cursor-pointer font-semibold text-lg text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(ticket.id, Math.min(ticket.availableQuantity, (quantities[ticket.id] || 1) + 1))}
                      disabled={(quantities[ticket.id] || 1) >= ticket.availableQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAddToCart(ticket)}
                    className="bg-blue-600 text-white border-0 px-6 py-3 rounded-lg cursor-pointer font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    disabled={!ticket.active || ticket.availableQuantity === 0}
                  >
                    Adicionar 
                  </button>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 block">
          <button
            className="bg-blue-600 text-white border-0 rounded-full px-6 py-4 font-semibold cursor-pointer shadow-lg shadow-blue-300 transition-all duration-300 flex items-center gap-2 min-w-30 justify-center hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-400"
            onClick={() => setShowCartDropdown(!showCartDropdown)}
          >
            🛒 Carrinho
            {getTotalItems() > 0 && <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-1">{getTotalItems()}</span>}
          </button>

          {showCartDropdown && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-xl shadow-xl min-w-80 max-w-96 max-h-96 overflow-y-auto z-50">
              <div className="p-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50 rounded-t-xl">
                Carrinho de Compras
              </div>
              <div className="p-4">
                {cart.map(item => (
                  <div key={item.ticketTypeId} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-b-0">
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border-2 border-gray-200 rounded-md bg-white">
                        <button
                          className="bg-gray-50 border-0 w-7 h-7 flex items-center justify-center cursor-pointer font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800"
                          onClick={() => updateCartQuantity(item.ticketTypeId, Math.max(0, item.quantity - 1))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="w-10 h-7 border-0 text-center font-semibold bg-white text-gray-600"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.ticketTypeId, Math.max(0, parseInt(e.target.value) || 0))}
                        />
                        <button
                          className="bg-gray-50 border-0 w-7 h-7 flex items-center justify-center cursor-pointer font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800"
                          onClick={() => updateCartQuantity(item.ticketTypeId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="bg-red-600 text-white border-0 w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-700 hover:scale-110"
                        onClick={() => removeFromCart(item.ticketTypeId)}
                        title="Remover item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t-2 border-blue-600 text-center font-bold text-gray-700 text-lg">
                  Total: R$ {getTotalPrice().toFixed(2)}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  className="w-full bg-green-600 text-white border-0 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5"
                  onClick={() => {
                    setShowCartDropdown(false);
                    onProceedToCheckout();
                  }}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          )}
        </div>
      )}
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
          className="bg-blue-600 text-white border-0 px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer mt-6 transition-all duration-200 shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300"
        >
          Fazer Novo Pedido
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-gray-800 mb-6 text-xl font-bold border-b-2 border-gray-200 pb-3">Resumo do Pedido</h3>
          {cart.map(item => (
            <div key={item.ticketTypeId} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-b-0">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-700 font-semibold">{item.quantity}x R$ {item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-6 pt-6 border-t-2 border-blue-600 text-gray-800 text-xl font-bold text-center">
            Total: R$ {getTotalPrice().toFixed(2)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-gray-800 mb-6 text-xl font-bold border-b-2 border-gray-200 pb-3">Dados do Pagamento</h3>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-600 text-sm">Número do Cartão</label>
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 bg-white focus:outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-600 text-sm">Nome no Cartão</label>
            <input
              type="text"
              value={paymentData.cardHolderName}
              onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
              placeholder="Nome como no cartão"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 bg-white focus:outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-600 text-sm">Validade</label>
              <input
                type="text"
                value={paymentData.cardExpiry}
                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                placeholder="MM/AAAA"
                maxLength="7"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 bg-white focus:outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-600 text-sm">CVV</label>
              <input
                type="text"
                value={paymentData.cardCVV}
                onChange={(e) => handleInputChange('cardCVV', e.target.value)}
                placeholder="123"
                maxLength="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 bg-white focus:outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-600 text-sm">Parcelas</label>
            <select
              value={paymentData.installments}
              onChange={(e) => setPaymentData({ ...paymentData, installments: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-200 bg-white focus:outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100"
            >
              <option value={1}>1x R$ {getTotalPrice().toFixed(2)}</option>
              <option value={2}>2x R$ {(getTotalPrice() / 2).toFixed(2)}</option>
              <option value={3}>3x R$ {(getTotalPrice() / 3).toFixed(2)}</option>
            </select>
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
              className="flex-2 bg-green-600 text-white border-0 px-4 py-3 rounded-lg text-base font-bold cursor-pointer transition-all duration-200 shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
      case 'APPROVED':
      case 'PAID':
        return 'bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'Aprovado';
      case 'PENDING':
        return 'Pendente';
      case 'FAILED':
        return 'Falhou';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl p-12 bg-white rounded-xl shadow-sm">Carregando pedidos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-gray-800 mb-8 text-4xl font-bold text-center">Meus Pedidos</h2>
      {orders.length === 0 ? (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
          <p className="text-gray-500 text-lg m-0">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-50">
                <h3 className="text-gray-800 text-xl font-semibold m-0">{order.eventName}</h3>
                <span className={`${getStatusColor(order.paymentStatus)} text-white px-3 py-1 rounded-xl text-xs font-semibold uppercase`}>
                  {getStatusText(order.paymentStatus)}
                </span>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Pedido</span>
                  <strong className="text-gray-800">#{order.id.slice(0, 8)}...</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Total</span>
                  <strong className="text-gray-800">R$ {order.totalValue.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Data</span>
                  <span className="text-gray-800">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Parcelas</span>
                  <span className="text-gray-800">{order.installments}x</span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">ID Transação</span>
                    <span className="text-gray-800">{order.transactionId}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  className="flex-1 px-3 py-3 border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm bg-gray-500 text-white hover:bg-gray-600 hover:-translate-y-0.5"
                  onClick={() => onViewOrder(order)}
                >
                  Ver Detalhes
                </button>
                {(order.paymentStatus === 'APPROVED' || order.paymentStatus === 'PAID') && (
                  <button
                    className="flex-1 px-3 py-3 border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5"
                    onClick={() => onViewOrder(order)}
                  >
                    Ver Ingressos
                  </button>
                )}
                {order.paymentStatus === 'FAILED' && (
                  <button className="flex-1 px-3 py-3 border-0 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5">
                    Tentar Novamente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetails = ({ order, onBack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'Aprovado';
      case 'PENDING':
        return 'Pendente';
      case 'FAILED':
        return 'Falhou';
      default:
        return status;
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
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-120px)] p-8">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-600">
        <button
          className="bg-gray-50 text-gray-600 border border-gray-300 px-4 py-2 rounded font-medium cursor-pointer transition-all duration-200 text-sm hover:bg-gray-200 hover:border-gray-400"
          onClick={onBack}
        >
          ← Voltar aos Pedidos
        </button>
        <h2 className="text-gray-700 text-2xl font-semibold m-0">Detalhes do Pedido</h2>
      </div>

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

      {order.tickets && order.tickets.length > 0 && (
        <div className="mt-8">
          <h3 className="text-gray-700 text-xl font-semibold mb-6 pb-4 border-b border-gray-300">Ingressos ({order.tickets.length})</h3>
          <div className="flex flex-col gap-4">
            {order.tickets.map((ticket, index) => (
              <div key={ticket.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm transition-all duration-200 flex flex-col md:flex-row gap-6 items-start hover:shadow-md hover:border-blue-600">
                <div className="flex-shrink-0 w-full md:w-30 text-center order-2 md:order-1">
                  <div className="mb-2">
                    <img
                      src={ticket.qrCodeUrl}
                      alt={`QR Code do ingresso ${index + 1}`}
                      className="w-25 h-25 border border-gray-300 rounded bg-white p-1 mx-auto block"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden justify-center items-center w-25 h-25 bg-gray-50 border border-dashed border-gray-300 rounded mx-auto">
                      <div className="text-center text-gray-500">
                        <span className="block font-medium mb-1 text-xs">QR indisponível</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-blue-600 text-white border-0 px-2 py-1 rounded font-medium cursor-pointer transition-all duration-200 text-xs w-full hover:bg-blue-700"
                    onClick={() => window.open(ticket.qrCodeUrl, '_blank')}
                  >
                    Download
                  </button>
                </div>

                <div className="flex-1 flex flex-col order-1 md:order-2">
                  <div className="flex flex-row justify-between items-center mb-4 pb-3 border-b border-gray-300">
                    <h4 className="text-gray-700 text-base font-semibold m-0">Ingresso #{index + 1}</h4>
                    <span className={`${ticket.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'} px-2 py-1 rounded text-xs font-semibold uppercase border`}>
                      {ticket.status === 'ACTIVE' ? 'Ativo' : ticket.status}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="font-medium text-gray-500 text-xs">Tipo:</span>
                      <span className="text-gray-700 font-semibold text-xs">{ticket.ticketTypeName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="font-medium text-gray-500 text-xs">Cliente:</span>
                      <span className="text-gray-700 font-semibold text-xs">{ticket.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="font-medium text-gray-500 text-xs">Evento:</span>
                      <span className="text-gray-700 font-semibold text-xs">{ticket.eventName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="font-medium text-gray-500 text-xs">Data do Evento:</span>
                      <span className="text-gray-700 font-semibold text-xs">{formatDate(ticket.startDateEvent)}</span>
                    </div>
                    {ticket.validatedAt && (
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-500 text-xs">Validado em:</span>
                        <span className="text-gray-700 font-semibold text-xs">{formatDate(ticket.validatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;