import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Settings, LogOut, CheckCircle, XCircle, Trash2, Plus, Edit, Users, Building, PieChart } from 'lucide-react';

const AdminPanel = ({ user, auth }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Access denied handled in render
    }
  }, [user, navigate]);

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('aurelia_token')}`,
    'Content-Type': 'application/json'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch('http://localhost:5000/api/admin/stats', { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setBookings(data.recentBookings);
        }
      } else if (activeTab === 'bookings') {
        const res = await fetch('http://localhost:5000/api/admin/bookings', { headers: getHeaders() });
        if (res.ok) setBookings(await res.json());
      } else if (activeTab === 'rooms') {
        const res = await fetch('http://localhost:5000/api/rooms');
        if (res.ok) setRooms(await res.json());
      } else if (activeTab === 'hotels') {
        const res = await fetch('http://localhost:5000/api/admin/hotels', { headers: getHeaders() });
        if (res.ok) setHotels(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch('http://localhost:5000/api/admin/users', { headers: getHeaders() });
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'reports') {
        const res = await fetch('http://localhost:5000/api/admin/reports', { headers: getHeaders() });
        if (res.ok) setReports(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch data for tab:', activeTab, e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [activeTab, user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to delete booking', e);
    }
  };

  const handleUserRoleChange = async (id, role) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to update user role', e);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '100px auto' }}>
          <h2 style={{ color: 'var(--gold-primary)', marginBottom: '20px' }}>Admin Access Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>You must be logged in as an administrator to view this page.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel">
        <div className="admin-brand">
          <h2 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>Aurelia</h2>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Admin Portal</span>
        </div>
        
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`admin-nav-item ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}>
            <Building size={18} /> Manage Hotels
          </button>
          <button className={`admin-nav-item ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            <BedDouble size={18} /> Manage Rooms
          </button>
          <button className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <CalendarCheck size={18} /> Bookings
          </button>
          <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Users
          </button>
          <button className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <PieChart size={18} /> Reports & Analytics
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user.name.charAt(0)}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={() => { auth.logout(); navigate('/'); }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '400' }}>
            {activeTab === 'dashboard' && 'Platform Overview'}
            {activeTab === 'hotels' && 'Hotel Properties'}
            {activeTab === 'rooms' && 'Rooms & Suites'}
            {activeTab === 'bookings' && 'Reservation Management'}
            {activeTab === 'users' && 'User Administration'}
            {activeTab === 'reports' && 'Business Intelligence'}
          </h1>
          <div className="admin-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
              <div className="loading-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--gold-primary)', borderRightColor: 'var(--gold-primary)' }}></div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && stats && (
                <div className="dashboard-view">
                  <div className="stats-grid">
                    <div className="stat-card glass-panel">
                      <div className="stat-icon"><LayoutDashboard size={20} color="var(--gold-primary)" /></div>
                      <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                      <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="stat-card glass-panel">
                      <div className="stat-icon"><CalendarCheck size={20} color="var(--gold-primary)" /></div>
                      <div className="stat-value">{stats.activeStays}</div>
                      <div className="stat-label">Active Stays</div>
                    </div>
                    <div className="stat-card glass-panel">
                      <div className="stat-icon"><Users size={20} color="var(--gold-primary)" /></div>
                      <div className="stat-value">{stats.totalUsers}</div>
                      <div className="stat-label">Registered Users</div>
                    </div>
                    <div className="stat-card glass-panel">
                      <div className="stat-icon"><Building size={20} color="var(--gold-primary)" /></div>
                      <div className="stat-value">{stats.totalHotels}</div>
                      <div className="stat-label">Properties Managed</div>
                    </div>
                  </div>

                  <h3 style={{ marginTop: '40px', marginBottom: '20px', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)' }}>Recent Reservations</h3>
                  <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--border-radius-md)' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Guest</th>
                          <th>Suite</th>
                          <th>Hotel</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>{b.booking_ref}</td>
                            <td>{b.guest_name}</td>
                            <td>{b.room_id?.name || b.room_id}</td>
                            <td>{b.hotelId?.name || 'Aurelia Resort'}</td>
                            <td>
                              <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No recent bookings</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hotels Tab */}
              {activeTab === 'hotels' && (
                <div className="hotels-view">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                     <button className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Plus size={16} /> Add Hotel
                     </button>
                  </div>
                  <div className="admin-rooms-grid">
                    {hotels.map(hotel => (
                      <div key={hotel._id} className="glass-panel admin-room-card">
                        <div className="admin-room-img" style={{ backgroundImage: `url(${hotel.images?.[0] || 'https://via.placeholder.com/400'})` }}>
                           <span className="room-badge">{hotel.rating} ★</span>
                        </div>
                        <div className="admin-room-content">
                          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', margin: '0 0 5px 0' }}>{hotel.name}</h4>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                            {hotel.location}
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" style={{ flex: 1, padding: '6px' }}><Edit size={14} style={{ display: 'inline', marginRight: '4px' }}/> Edit</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '6px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}><Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }}/> Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="users-view">
                  <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--border-radius-md)' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id}>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                            <td>
                              <select 
                                value={u.role}
                                onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                                style={{ background: 'transparent', color: 'var(--gold-primary)', border: '1px solid rgba(47, 93, 122, 0.3)', borderRadius: '4px', padding: '4px' }}
                                disabled={u.email === 'admin@aurelia.com'}
                              >
                                <option value="user" style={{ background: '#000' }}>User</option>
                                <option value="admin" style={{ background: '#000' }}>Admin</option>
                              </select>
                            </td>
                            <td>
                              {u.email !== 'admin@aurelia.com' && (
                                <button className="icon-btn action-delete" onClick={() => handleDeleteUser(u._id)} title="Delete User">
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && reports && (
                <div className="reports-view">
                  <div className="stats-grid">
                    <div className="stat-card glass-panel">
                      <h3 style={{ color: 'var(--gold-primary)', marginBottom: '15px' }}>Booking Status Breakdown</h3>
                      {reports.bookingsByStatus.map(s => (
                        <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span>{s._id} ({s.count})</span>
                          <span style={{ color: 'var(--gold-light)' }}>${s.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="stat-card glass-panel">
                      <h3 style={{ color: 'var(--gold-primary)', marginBottom: '15px' }}>Monthly Revenue</h3>
                      {reports.monthlyRevenue.length > 0 ? (
                        reports.monthlyRevenue.map((r, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>{r._id.month}/{r._id.year}</span>
                            <span style={{ color: 'var(--gold-light)' }}>${r.revenue.toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: 'var(--text-muted)' }}>Not enough data for monthly trends.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="bookings-view">
                  <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--border-radius-md)' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Guest Details</th>
                          <th>Suite / Hotel</th>
                          <th>Stay Details</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>{b.booking_ref}</td>
                            <td>
                              <div>{b.guest_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user_email}</div>
                            </td>
                            <td>
                              <div>{b.room_id?.name || b.room_id}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.hotelId?.name || 'Aurelia Resort'}</div>
                            </td>
                            <td style={{ fontSize: '0.8rem' }}>
                              <div>In: {b.check_in}</div>
                              <div>Out: {b.check_out}</div>
                            </td>
                            <td style={{ color: 'var(--gold-primary)' }}>${b.total_price.toLocaleString()}</td>
                            <td>
                              <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {b.status === 'Pending' && (
                                  <button className="icon-btn action-approve" onClick={() => handleStatusChange(b._id, 'Confirmed')} title="Confirm">
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                {b.status !== 'Cancelled' && (
                                  <button className="icon-btn action-cancel" onClick={() => handleStatusChange(b._id, 'Cancelled')} title="Cancel">
                                    <XCircle size={16} />
                                  </button>
                                )}
                                <button className="icon-btn action-delete" onClick={() => handleDeleteBooking(b._id)} title="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <div className="rooms-view">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                     <button className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Plus size={16} /> Add Suite
                     </button>
                  </div>
                  <div className="admin-rooms-grid">
                    {rooms.map(room => (
                      <div key={room.id} className="glass-panel admin-room-card">
                        <div className="admin-room-img" style={{ backgroundImage: `url(${room.images[0]})` }}>
                           {room.badge && <span className="room-badge">{room.badge}</span>}
                        </div>
                        <div className="admin-room-content">
                          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', margin: '0 0 5px 0' }}>{room.name}</h4>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                            {room.hotelId?.name || 'Aurelia Resort'}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                            <span>{room.type}</span>
                            <span style={{ color: 'var(--gold-primary)' }}>${room.price}/night</span>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" style={{ flex: 1, padding: '6px' }}><Edit size={14} style={{ display: 'inline', marginRight: '4px' }}/> Edit</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '6px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}><Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }}/> Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
