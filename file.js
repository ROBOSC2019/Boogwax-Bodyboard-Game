const state = {
  currentView: 'home',
  waxLevel: 100,
  sessions: [],
};

// --- INITIALIZE APP ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateWaxUI();
  setEventListeners();
  renderView('home');
  loadConditions();
});

// --- EVENT LISTENERS ---
function setEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      renderView(e.target.dataset.view);
    });
  });

  document.getElementById('startSession').addEventListener('click', openSessionModal);
  document.getElementById('logSession').addEventListener('click', openSessionModal);

  document.querySelector('.close').addEventListener('click', closeSessionModal);
  document.getElementById('sessionForm').addEventListener('submit', saveSession);

  document.getElementById('refreshConditions').addEventListener('click', loadConditions);
  document.getElementById('rewaxBtn').addEventListener('click', handleRewax);
  document.getElementById('resetData').addEventListener('click', resetGameData);
}

// --- NAVIGATION ---
function renderView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${view}-view`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`).classList.add('active');
  state.currentView = view;

  if (view === 'sessions') renderSessions();
  if (view === 'spots') renderSpots();
}

// --- WAX SYSTEM ---
function updateWaxUI() {
  const fill = document.getElementById('waxFill');
  const status = document.getElementById('waxStatus');
  const hint = document.getElementById('waxHint');

  fill.style.height = `${state.waxLevel}%`;

  // change color depending on level
  if (state.waxLevel > 60)
    fill.style.background = 'radial-gradient(circle at 50% 20%, #ffffff, #cbd5e1)';
  else if (state.waxLevel > 30)
    fill.style.background = 'radial-gradient(circle at 50% 20%, #e2e8f0, #94a3b8)';
  else
    fill.style.background = 'radial-gradient(circle at 50% 20%, #f8fafc, #64748b)';

  status.textContent = `Wax Level: ${state.waxLevel.toFixed(0)}%`;
  hint.textContent = state.waxLevel < 20 ? '⚠️ Wax up! Your board’s slipping!' : '';
}

function handleRewax() {
  state.waxLevel = 100;
  saveData();
  updateWaxUI();

  const fill = document.getElementById('waxFill');
  fill.classList.add('glow');
  setTimeout(() => fill.classList.remove('glow'), 1000);
}

// --- CONDITIONS (simulated) ---
function loadConditions() {
  const waveHeight = (Math.random() * 4 + 1).toFixed(1);
  const wind = Math.floor(Math.random() * 20 + 5);
  const tideStates = ['Low', 'Rising', 'High', 'Falling'];
  document.getElementById('waveHeight').textContent = `${waveHeight} ft`;
  document.getElementById('wind').textContent = `${wind} mph`;
  document.getElementById('tide').textContent = tideStates[Math.floor(Math.random() * tideStates.length)];
}

// --- SPOTS (sample) ---
function renderSpots() {
  const list = document.getElementById('spotsList');
  const spots = [
    { name: 'Pipeline', desc: 'Legendary reef break in Hawaii 🌴' },
    { name: 'Wedge', desc: 'Powerful shore break in Newport Beach 🇺🇸' },
    { name: 'Shark Island', desc: 'Heavy reef slab in Australia 🦈' }
  ];
  list.innerHTML = spots
    .map(s => `<div class="spot-item"><h3>${s.name}</h3><p>${s.desc}</p></div>`)
    .join('');
}

// --- SESSIONS ---
function renderSessions() {
  const list = document.getElementById('sessionsList');
  if (state.sessions.length === 0) {
    list.innerHTML = '<p>No sessions yet. Start surfing!</p>';
    return;
  }
  list.innerHTML = state.sessions
    .map(s => `<div class="session-item">
      <h3>${s.spot}</h3>
      <p>Hours: ${s.hours} | Waves: ${s.waves}</p>
    </div>`)
    .join('');
}

function openSessionModal() {
  document.getElementById('sessionModal').classList.add('active');
}
function closeSessionModal() {
  document.getElementById('sessionModal').classList.remove('active');
  document.getElementById('sessionForm').reset();
}

function saveSession(e) {
  e.preventDefault();
  const spot = document.getElementById('sessionSpot').value;
  const hours = parseFloat(document.getElementById('sessionHours').value);
  const waves = parseInt(document.getElementById('sessionWaves').value);
  state.sessions.unshift({ spot, hours, waves, date: Date.now() });

  // wax depletion logic
  const depletion = Math.floor(Math.random() * 10) + 15;
  state.waxLevel = Math.max(0, state.waxLevel - depletion);

  saveData();
  closeSessionModal();
  renderSessions();
  updateWaxUI();
  alert('Session logged!');
}

// --- DATA ---
function saveData() {
  localStorage.setItem('waveRider', JSON.stringify(state));
}
function loadData() {
  const data = localStorage.getItem('waveRider');
  if (data) Object.assign(state, JSON.parse(data));
}
function resetGameData() {
  if (confirm('Are you sure you want to reset all data?')) {
    localStorage.removeItem('waveRider');
    location.reload();
  }
}
