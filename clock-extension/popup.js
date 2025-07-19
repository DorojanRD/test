let currentDate = new Date();
let currentView = 'clock';

function updateClock() {
    const now = new Date();
    
    // Formatează ora
    const time = now.toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Formatează data
    const date = now.toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Actualizează elementele HTML
    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;
    
    // Actualizează componentele individuale
    document.getElementById('currentHour').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('currentMinute').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('currentSecond').textContent = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('currentYear').textContent = now.getFullYear();
    
    // Calculează ziua din an
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('dayOfYear').textContent = dayOfYear;
}

function generateCalendar(date) {
    const calendar = document.getElementById('calendar');
    const title = document.getElementById('calendarTitle');
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Actualizează titlul
    title.textContent = date.toLocaleDateString('ro-RO', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Curăță calendarul
    calendar.innerHTML = '';
    
    // Adaugă headerele pentru zilele săptămânii
    const dayHeaders = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
    dayHeaders.forEach(day => {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'calendar-header';
        headerDiv.textContent = day;
        calendar.appendChild(headerDiv);
    });
    
    // Prima zi a lunii și ultima zi a lunii
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Prima zi a săptămânii (0 = duminică, 1 = luni, etc.)
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Ajustare pentru luni ca prima zi
    
    // Adaugă zilele din luna precedentă
    for (let i = startDay - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = prevDate.getDate();
        calendar.appendChild(dayDiv);
    }
    
    // Adaugă zilele lunii curente
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        // Marchează ziua curentă
        const today = new Date();
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayDiv.classList.add('today');
        }
        
        calendar.appendChild(dayDiv);
    }
    
    // Completează cu zilele din luna următoare
    const totalCells = calendar.children.length - 7; // Minus headerele
    const remainingCells = 42 - totalCells; // 6 săptămâni x 7 zile
    
    for (let day = 1; day <= remainingCells; day++) {
        const nextDate = new Date(year, month + 1, day);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = nextDate.getDate();
        calendar.appendChild(dayDiv);
    }
}

function switchView(view) {
    const clockSection = document.getElementById('clockSection');
    const calendarSection = document.getElementById('calendarSection');
    const clockBtn = document.getElementById('showClock');
    const calendarBtn = document.getElementById('showCalendar');
    
    if (view === 'clock') {
        clockSection.style.display = 'block';
        calendarSection.style.display = 'none';
        clockBtn.className = 'btn btn-primary w-100 active';
        calendarBtn.className = 'btn btn-outline-primary w-100';
        currentView = 'clock';
    } else {
        clockSection.style.display = 'none';
        calendarSection.style.display = 'block';
        clockBtn.className = 'btn btn-outline-primary w-100';
        calendarBtn.className = 'btn btn-primary w-100 active';
        currentView = 'calendar';
        generateCalendar(currentDate);
    }
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners pentru butoane
    document.getElementById('showClock').addEventListener('click', () => switchView('clock'));
    document.getElementById('showCalendar').addEventListener('click', () => switchView('calendar'));
    
    // Event listeners pentru navigarea calendarului
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    // Start cu view-ul de ceas
    switchView('clock');
    
    // Actualizează ceasul imediat și apoi la fiecare secundă
    updateClock();
    setInterval(updateClock, 1000);
});