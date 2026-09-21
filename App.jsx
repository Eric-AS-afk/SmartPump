import React, { useState, useEffect } from 'react';

// ============================================================================
// 1. DICCIONARIO Y CONFIGURACIÓN DE PRECIOS POR GALÓN
// ============================================================================
const INITIAL_FUEL_PRICES = {
  SUPER: { id: 'SUPER', name: 'Gasolina Súper (95 Octanos)', price: 38.50 },
  REGULAR: { id: 'REGULAR', name: 'Gasolina Regular (88 Octanos)', price: 37.00 },
  DIESEL: { id: 'DIESEL', name: 'Diésel Ultra Bajo en Azufre', price: 34.50 }
};

// Estilo común para asegurar legibilidad en controles de formulario
const inputSelectStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #cbd5e0',
  backgroundColor: '#ffffff',
  color: '#1a202c',
  fontSize: '0.9rem'
};

// ============================================================================
// 2. VISTA PRINCIPAL: MONITOR CENTRAL DE DISPENSADORES Y BOMBAS
// ============================================================================
function MainMenuView({ pumps, fuelPrices, onAuthorize, onEmergencyStop, onResumePump }) {
  const [selectedPump, setSelectedPump] = useState(1);
  const [targetQuetzales, setTargetQuetzales] = useState(100.0); // Valor por defecto en Quetzales (Q100.00)

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (targetQuetzales > 0) {
      onAuthorize(selectedPump, parseFloat(targetQuetzales));
    }
  };

  const selectedFuelKey = pumps.find(p => p.id === selectedPump)?.fuelKey || 'SUPER';
  const selectedPrice = fuelPrices[selectedFuelKey]?.price || 38.50;
  const estimatedGallons = targetQuetzales > 0 ? (targetQuetzales / selectedPrice).toFixed(2) : '0.00';

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a252f', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem' }}>
        Monitor y Control de Bombas en Tiempo Real (Monto en Quetzales)
      </h2>

      {/* Consola de Autorización Manual */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#2b6cb0' }}>Autorizar Despacho de Combustible</h3>
        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#2d3748' }}>Dispensador:</label>
            <select 
              value={selectedPump} 
              onChange={(e) => setSelectedPump(Number(e.target.value))}
              style={inputSelectStyle}
            >
              {pumps.map(p => (
                <option key={p.id} value={p.id} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>
                  Bomba #{p.id} - {fuelPrices[p.fuelKey].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#2d3748' }}>Monto Solicitado (Q):</label>
            <input 
              type="number" 
              step="5" 
              min="5" 
              max="2000" 
              value={targetQuetzales} 
              onChange={(e) => setTargetQuetzales(e.target.value)}
              style={{ ...inputSelectStyle, width: '130px', fontWeight: 'bold' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '1.2rem', padding: '0.5rem', background: '#edf2f7', borderRadius: '4px' }}>
            Equivalente estimado: <strong>{estimatedGallons} Galones</strong> (a Q{selectedPrice.toFixed(2)}/Gal)
          </div>

          <button 
            type="submit" 
            style={{ marginTop: '1.2rem', padding: '0.55rem 1.2rem', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Iniciar Despacho
          </button>
        </form>
      </div>

      {/* Grid de Bombas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {pumps.map((pump) => {
          const isDispensing = pump.state === 'DESPACHANDO';
          const isPaused = pump.state === 'PAUSADO';
          const fuel = fuelPrices[pump.fuelKey];

          return (
            <div 
              key={pump.id} 
              style={{ 
                border: isDispensing ? '2px solid #3182ce' : isPaused ? '2px solid #e53e3e' : '1px solid #cbd5e0', 
                borderRadius: '8px', 
                padding: '1.25rem', 
                background: isDispensing ? '#ebf8ff' : isPaused ? '#fff5f5' : '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: '#1a202c' }}>Bomba #{pump.id}</h3>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  background: isDispensing ? '#bee3f8' : isPaused ? '#fed7d7' : '#c6f6d5',
                  color: isDispensing ? '#2b6cb0' : isPaused ? '#9b2c2c' : '#22543d'
                }}>
                  {pump.state}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '0.25rem 0' }}>
                <strong>Tipo:</strong> {fuel.name}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '0.25rem 0' }}>
                <strong>Precio/Galón:</strong> Q{fuel.price.toFixed(2)}
              </p>

              <div style={{ margin: '1rem 0', background: '#1a202c', color: '#48bb78', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Total: Q{pump.currentTotal.toFixed(2)}</div>
                <div style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{pump.currentGallons.toFixed(2)} Galones</div>
              </div>

              {isDispensing && (
                <button 
                  onClick={() => onEmergencyStop(pump.id)} 
                  style={{ width: '100%', padding: '0.5rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  PARO DE EMERGENCIA
                </button>
              )}

              {isPaused && (
                <button 
                  onClick={() => onResumePump(pump.id)} 
                  style={{ width: '100%', padding: '0.5rem', background: '#38a169', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  REANUDAR DESPACHO
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 3. MÓDULO: GESTIÓN E INSPECCIÓN DE BOMBAS Y TARIFAS
// ============================================================================
function PumpManagementView({ pumps, fuelPrices, onUpdatePrice, onChangePumpFuel }) {
  const [editingPriceKey, setEditingPriceKey] = useState('SUPER');
  const [newPrice, setNewPrice] = useState(fuelPrices.SUPER.price);

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    onUpdatePrice(editingPriceKey, parseFloat(newPrice));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestión Técnica y Configuración de Bombas</h2>
      
      {/* Configuración de Tarifas */}
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <h3>Actualizar Precios por Galón</h3>
        <form onSubmit={handlePriceSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={editingPriceKey} 
            onChange={(e) => {
              setEditingPriceKey(e.target.value);
              setNewPrice(fuelPrices[e.target.value].price);
            }}
            style={inputSelectStyle}
          >
            {Object.keys(fuelPrices).map(k => (
              <option key={k} value={k} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>{fuelPrices[k].name}</option>
            ))}
          </select>
          <input 
            type="number" 
            step="0.10" 
            value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)}
            style={{ ...inputSelectStyle, width: '100px' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Guardar Precio por Galón
          </button>
        </form>
      </div>

      {/* Asignación de Combustible a Bombas */}
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3>Configuración de Mangueras / Dispensadores</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#edf2f7', textAlign: 'left', color: '#212a39' }}>
              <th style={{ padding: '0.75rem' }}>ID Bomba</th>
              <th style={{ padding: '0.75rem' }}>Tipo Asignado</th>
              <th style={{ padding: '0.75rem' }}>Estado Actual</th>
              <th style={{ padding: '0.75rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pumps.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', color: '#2d3748' }}>
                <td style={{ padding: '0.75rem' }}>Bomba #{p.id}</td>
                <td style={{ padding: '0.75rem' }}>{fuelPrices[p.fuelKey].name}</td>
                <td style={{ padding: '0.75rem' }}>{p.state}</td>
                <td style={{ padding: '0.75rem' }}>
                  <select 
                    value={p.fuelKey} 
                    onChange={(e) => onChangePumpFuel(p.id, e.target.value)}
                    disabled={p.state === 'DESPACHANDO'}
                    style={inputSelectStyle}
                  >
                    {Object.keys(fuelPrices).map(k => (
                      <option key={k} value={k} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>{fuelPrices[k].name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MÓDULO: FACTURACIÓN Y PAGOS DE DESPACHOS
// ============================================================================
function BillingView({ pendingTickets, onProcessPayment }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [clientName, setClientName] = useState('');
  const [nit, setNit] = useState('CF');
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');

  const handlePay = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    onProcessPayment({
      ticketId: selectedTicket.id,
      pumpId: selectedTicket.pumpId,
      clientName: clientName || 'Consumidor Final',
      nit: nit || 'CF',
      paymentMethod,
      fuelName: selectedTicket.fuelName,
      gallons: selectedTicket.gallons,
      total: selectedTicket.total,
      date: new Date().toLocaleString()
    });

    setSelectedTicket(null);
    setClientName('');
    setNit('CF');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Módulo de Facturación y Cobro</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Lista de Tiques Pendientes de Pago */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>Despachos Pendientes de Cobro</h3>
          {pendingTickets.length === 0 ? (
            <p style={{ color: '#718096' }}>No hay consumos pendientes por cobrar.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '6px', 
                    border: selectedTicket?.id === ticket.id ? '2px solid #3182ce' : '1px solid #cbd5e0',
                    cursor: 'pointer',
                    background: selectedTicket?.id === ticket.id ? '#ebf8ff' : '#f7fafc'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#1a202c' }}>Bomba #{ticket.pumpId} - {ticket.fuelName}</div>
                  <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                    Total: <strong>Q{ticket.total.toFixed(2)}</strong> | Volumen: {ticket.gallons.toFixed(2)} Gal
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario de Emisión de Factura */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>Generar Factura</h3>
          {selectedTicket ? (
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#2d3748' }}>Cliente:</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="Nombre del cliente" 
                  style={{ ...inputSelectStyle, width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#2d3748' }}>NIT / DPI:</label>
                <input 
                  type="text" 
                  value={nit} 
                  onChange={(e) => setNit(e.target.value)} 
                  style={{ ...inputSelectStyle, width: '100%', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#2d3748' }}>Forma de Pago:</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ ...inputSelectStyle, width: '100%', marginTop: '0.25rem' }}
                >
                  <option value="EFECTIVO" style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Efectivo</option>
                  <option value="TARJETA" style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Tarjeta de Crédito / Débito</option>
                </select>
              </div>

              <div style={{ background: '#edf2f7', padding: '1rem', borderRadius: '6px', color: '#2d3748' }}>
                <div><strong>Subtotal:</strong> Q{(selectedTicket.total / 1.12).toFixed(2)}</div>
                <div><strong>IVA (12%):</strong> Q{(selectedTicket.total - (selectedTicket.total / 1.12)).toFixed(2)}</div>
                <div style={{ fontSize: '1.2rem', color: '#2b6cb0', marginTop: '0.5rem' }}>
                  <strong>Total a Cobrar: Q{selectedTicket.total.toFixed(2)}</strong>
                </div>
              </div>

              <button type="submit" style={{ padding: '0.75rem', background: '#38a169', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Procesar Pago e Imprimir Factura
              </button>
            </form>
          ) : (
            <p style={{ color: '#718096' }}>Seleccione un despacho de la lista para cobrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. MÓDULO: CONTROL DE TANQUES SUBTERRÁNEOS E INVENTARIO
// ============================================================================
function InventoryView({ tanks, onRefillTank }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Control de Tanques Subterráneos (Galones)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tanks.map(tank => {
          const percentage = ((tank.currentGallons / tank.capacity) * 100).toFixed(1);
          const isLow = percentage < 20;

          return (
            <div key={tank.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#1a202c' }}>Tanque #{tank.id} - {tank.fuelName}</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isLow ? '#e53e3e' : '#2d3748' }}>
                {tank.currentGallons.toFixed(2)} / {tank.capacity} Gal
              </div>

              <div style={{ background: '#edf2f7', height: '20px', borderRadius: '10px', overflow: 'hidden', margin: '1rem 0' }}>
                <div 
                  style={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    background: isLow ? '#e53e3e' : '#3182ce',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#718096' }}>
                <span>Nivel: {percentage}%</span>
                {isLow && <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>¡ALERTA DE STOCK BAJO!</span>}
              </div>

              <button 
                onClick={() => onRefillTank(tank.id)} 
                style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: '#4a5568', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cisterna: Reabastecer Tanque
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MÓDULO: ESTADO DE CUENTA Y CIERRE DE CAJA
// ============================================================================
function CashClosingView({ invoices }) {
  const totalSales = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalEfectivo = invoices.filter(i => i.paymentMethod === 'EFECTIVO').reduce((acc, i) => acc + i.total, 0);
  const totalTarjeta = invoices.filter(i => i.paymentMethod === 'TARJETA').reduce((acc, i) => acc + i.total, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Arqueo y Cierre de Caja</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Total Recaudado</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2b6cb0' }}>Q{totalSales.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Total Efectivo</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>Q{totalEfectivo.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Total Tarjeta</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#805ad5' }}>Q{totalTarjeta.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#718096', fontSize: '0.85rem' }}>Transacciones</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>{invoices.length}</div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3>Historial de Ventas Auditadas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#edf2f7', textAlign: 'left', color: '#2d3748' }}>
              <th style={{ padding: '0.5rem' }}>Fecha</th>
              <th style={{ padding: '0.5rem' }}>Cliente</th>
              <th style={{ padding: '0.5rem' }}>NIT</th>
              <th style={{ padding: '0.5rem' }}>Combustible</th>
              <th style={{ padding: '0.5rem' }}>Volumen</th>
              <th style={{ padding: '0.5rem' }}>Método</th>
              <th style={{ padding: '0.5rem' }}>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', color: '#2d3748' }}>
                <td style={{ padding: '0.5rem' }}>{inv.date}</td>
                <td style={{ padding: '0.5rem' }}>{inv.clientName}</td>
                <td style={{ padding: '0.5rem' }}>{inv.nit}</td>
                <td style={{ padding: '0.5rem' }}>{inv.fuelName}</td>
                <td style={{ padding: '0.5rem' }}>{inv.gallons.toFixed(2)} Gal</td>
                <td style={{ padding: '0.5rem' }}>{inv.paymentMethod}</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Q{inv.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// 7. MÓDULO: REGISTRO DE INCIDENCIAS Y SOPORTE
// ============================================================================
function IncidentsView({ incidents, onAddIncident, onResolveIncident }) {
  const [pumpId, setPumpId] = useState(1);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;
    onAddIncident({
      id: Date.now(),
      pumpId,
      description,
      status: 'PENDIENTE',
      date: new Date().toLocaleString()
    });
    setDescription('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Bitácora de Mantenimiento e Incidencias</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>Reportar Falla</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#2d3748' }}>Bomba con Desperfecto:</label>
              <select value={pumpId} onChange={(e) => setPumpId(Number(e.target.value))} style={{ ...inputSelectStyle, width: '100%' }}>
                <option value={1} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Bomba #1</option>
                <option value={2} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Bomba #2</option>
                <option value={3} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Bomba #3</option>
                <option value={4} style={{ color: '#1a202c', backgroundColor: '#ffffff' }}>Bomba #4</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#2d3748' }}>Descripción del Incidente:</label>
              <textarea 
                rows="4" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Ej: Fuga leve en manguera o falla de lectura digital." 
                style={{ ...inputSelectStyle, width: '100%' }}
              />
            </div>

            <button type="submit" style={{ padding: '0.5rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Registrar Ticket de Soporte
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>Reportes de Mantenimiento</h3>
          {incidents.length === 0 ? (
            <p style={{ color: '#718096' }}>No hay incidencias reportadas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incidents.map(inc => (
                <div key={inc.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: inc.status === 'RESUELTO' ? '#f0fff4' : '#fffaf0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span style={{ color: '#1a202c' }}>Bomba #{inc.pumpId}</span>
                    <span style={{ color: inc.status === 'RESUELTO' ? '#38a169' : '#dd6b20' }}>{inc.status}</span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#2d3748' }}>{inc.description}</p>
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{inc.date}</div>
                  
                  {inc.status === 'PENDIENTE' && (
                    <button 
                      onClick={() => onResolveIncident(inc.id)} 
                      style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#38a169', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Marcar como Resuelto
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. COMPONENTE RAÍZ (APP ENTRY) - ESTADO GLOBAL E INTEGRACIÓN COMPLETA
// ============================================================================
export default function App() {
  const [currentTab, setCurrentTab] = useState('menu');

  // Precios Globales por Galón
  const [fuelPrices, setFuelPrices] = useState(INITIAL_FUEL_PRICES);

  // Estado Inicial de las Bombas (Mantenimiento por Quetzales a Galones)
  const [pumps, setPumps] = useState([
    { id: 1, fuelKey: 'SUPER', state: 'INACTIVO', currentTotal: 0.0, targetTotal: 0.0, currentGallons: 0.0, targetGallons: 0.0 },
    { id: 2, fuelKey: 'REGULAR', state: 'INACTIVO', currentTotal: 0.0, targetTotal: 0.0, currentGallons: 0.0, targetGallons: 0.0 },
    { id: 3, fuelKey: 'DIESEL', state: 'INACTIVO', currentTotal: 0.0, targetTotal: 0.0, currentGallons: 0.0, targetGallons: 0.0 },
    { id: 4, fuelKey: 'SUPER', state: 'INACTIVO', currentTotal: 0.0, targetTotal: 0.0, currentGallons: 0.0, targetGallons: 0.0 }
  ]);

  // Tanques Subterráneos
  const [tanks, setTanks] = useState([
    { id: 1, fuelKey: 'SUPER', fuelName: 'Gasolina Súper', capacity: 3000, currentGallons: 2200 },
    { id: 2, fuelKey: 'REGULAR', fuelName: 'Gasolina Regular', capacity: 3000, currentGallons: 1100 },
    { id: 3, fuelKey: 'DIESEL', fuelName: 'Diésel', capacity: 4000, currentGallons: 3100 }
  ]);

  const [pendingTickets, setPendingTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Loop de simulación de llenado en tiempo real basado en Quetzales
  useEffect(() => {
    const interval = setInterval(() => {
      setPumps(prevPumps =>
        prevPumps.map(pump => {
          if (pump.state === 'DESPACHANDO') {
            const price = fuelPrices[pump.fuelKey].price;
            const moneyIncrement = 5.0; // Incrementa de Q5.00 por ciclo (300ms)
            const gallonIncrement = moneyIncrement / price;

            const nextTotal = pump.currentTotal + moneyIncrement;
            const nextGallons = pump.currentGallons + gallonIncrement;

            // Descontar del Tanque Subterráneo
            setTanks(prevTanks => prevTanks.map(t => {
              if (t.fuelKey === pump.fuelKey) {
                return { ...t, currentGallons: Math.max(0, t.currentGallons - gallonIncrement) };
              }
              return t;
            }));

            if (nextTotal >= pump.targetTotal) {
              const finalTotal = pump.targetTotal;
              const finalGallons = finalTotal / price;

              setPendingTickets(prev => [
                ...prev,
                {
                  id: Date.now(),
                  pumpId: pump.id,
                  fuelName: fuelPrices[pump.fuelKey].name,
                  gallons: finalGallons,
                  total: finalTotal
                }
              ]);

              return {
                ...pump,
                state: 'INACTIVO',
                currentTotal: finalTotal,
                currentGallons: finalGallons
              };
            }

            return {
              ...pump,
              currentTotal: nextTotal,
              currentGallons: nextGallons
            };
          }
          return pump;
        })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [fuelPrices]);

  // Operaciones de Control
  const handleAuthorize = (pumpId, targetQuetzales) => {
    setPumps(prev => prev.map(p => {
      if (p.id === pumpId) {
        const price = fuelPrices[p.fuelKey].price;
        return {
          ...p,
          state: 'DESPACHANDO',
          currentTotal: 0.0,
          targetTotal: targetQuetzales,
          currentGallons: 0.0,
          targetGallons: targetQuetzales / price
        };
      }
      return p;
    }));
  };

  const handleEmergencyStop = (pumpId) => {
    setPumps(prev => prev.map(p => p.id === pumpId ? { ...p, state: 'PAUSADO' } : p));
  };

  const handleResumePump = (pumpId) => {
    setPumps(prev => prev.map(p => p.id === pumpId ? { ...p, state: 'DESPACHANDO' } : p));
  };

  const handleUpdatePrice = (fuelKey, newPrice) => {
    setFuelPrices(prev => ({
      ...prev,
      [fuelKey]: { ...prev[fuelKey], price: newPrice }
    }));
  };

  const handleChangePumpFuel = (pumpId, newFuelKey) => {
    setPumps(prev => prev.map(p => p.id === pumpId ? { ...p, fuelKey: newFuelKey } : p));
  };

  const handleProcessPayment = (invoiceData) => {
    setInvoices(prev => [invoiceData, ...prev]);
    setPendingTickets(prev => prev.filter(t => t.id !== invoiceData.ticketId));
  };

  const handleRefillTank = (tankId) => {
    setTanks(prev => prev.map(t => t.id === tankId ? { ...t, currentGallons: t.capacity } : t));
  };

  const handleAddIncident = (incident) => {
    setIncidents(prev => [incident, ...prev]);
  };

  const handleResolveIncident = (incidentId) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'RESUELTO' } : i));
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'menu':
        return (
          <MainMenuView 
            pumps={pumps} 
            fuelPrices={fuelPrices} 
            onAuthorize={handleAuthorize} 
            onEmergencyStop={handleEmergencyStop} 
            onResumePump={handleResumePump}
          />
        );
      case 'residentes':
        return (
          <PumpManagementView 
            pumps={pumps} 
            fuelPrices={fuelPrices} 
            onUpdatePrice={handleUpdatePrice} 
            onChangePumpFuel={handleChangePumpFuel} 
          />
        );
      case 'pagos':
        return (
          <BillingView 
            pendingTickets={pendingTickets} 
            onProcessPayment={handleProcessPayment} 
          />
        );
      case 'multas':
        return (
          <InventoryView 
            tanks={tanks} 
            onRefillTank={handleRefillTank} 
          />
        );
      case 'estado-cuenta':
        return <CashClosingView invoices={invoices} />;
      case 'quejas':
        return (
          <IncidentsView 
            incidents={incidents} 
            onAddIncident={handleAddIncident} 
            onResolveIncident={handleResolveIncident} 
          />
        );
      default:
        return (
          <MainMenuView 
            pumps={pumps} 
            fuelPrices={fuelPrices} 
            onAuthorize={handleAuthorize} 
            onEmergencyStop={handleEmergencyStop} 
            onResumePump={handleResumePump}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f7fafc' }}>
      <header style={{ background: '#1a202c', color: '#ffffff', padding: '1rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
          SGBG - Sistema de Control y Gestión Centralizada de Gasolinera
        </h1>
      </header>

      <nav style={{ background: '#2d3748', padding: '0.5rem 2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setCurrentTab('menu')} style={navButtonStyle(currentTab === 'menu')}>Menú Principal</button>
        <button onClick={() => setCurrentTab('residentes')} style={navButtonStyle(currentTab === 'residentes')}>Bombas</button>
        <button onClick={() => setCurrentTab('pagos')} style={navButtonStyle(currentTab === 'pagos')}>
          Pagos / Facturación {pendingTickets.length > 0 && `(${pendingTickets.length})`}
        </button>
        <button onClick={() => setCurrentTab('multas')} style={navButtonStyle(currentTab === 'multas')}>Inventario Tanques</button>
        <button onClick={() => setCurrentTab('estado-cuenta')} style={navButtonStyle(currentTab === 'estado-cuenta')}>Cierre de Caja</button>
        <button onClick={() => setCurrentTab('quejas')} style={navButtonStyle(currentTab === 'quejas')}>Incidencias</button>
      </nav>

      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>

      <footer style={{ padding: '1rem', background: '#edf2f7', textAlign: 'center', fontSize: '0.8rem', color: '#718096', borderTop: '1px solid #e2e8f0' }}>
        SGBG System © 2026 - Control de Despacho de Combustible v2.0
      </footer>
    </div>
  );
}

const navButtonStyle = (isActive) => ({
  background: isActive ? '#3182ce' : 'transparent',
  color: '#ffffff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: 'background 0.2s ease-in-out'
});