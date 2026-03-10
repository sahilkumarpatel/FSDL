document.addEventListener('DOMContentLoaded', () => {
    // Current Date logic
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', dateOptions);

    // Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            sections.forEach(sec => sec.classList.remove('active-section'));
            document.getElementById(targetId).classList.add('active-section');
        });
    });

    // Search Logic
    const searchInput = document.getElementById('search-input');
    const locationName = document.getElementById('location-name');
    const currentTemp = document.getElementById('current-temp');
    const mapIframe = document.getElementById('map-iframe');

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            const query = searchInput.value.trim();
            locationName.textContent = query;
            currentTemp.textContent = Math.floor(Math.random() * (36) + -5); // -5 to +30 degrees approx
            mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
            searchInput.value = '';

            // Switch to Dashboard if currently elsewhere to see weather updates
            document.querySelector('[data-target="dashboard-section"]').click();
        }
    });

    // Generate Calendar Days (Mock 30 days)
    const calendarDatesContainer = document.getElementById('calendar-dates-container');
    const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-snowflake'];
    const daysInMonth = 30; // simplify to 30 for visualization

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');

        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        let iconColor = '#8b949e';
        if (randomIcon === 'fa-sun') iconColor = '#f0883e';
        else if (randomIcon === 'fa-cloud-rain') iconColor = '#58a6ff';
        else if (randomIcon === 'fa-snowflake') iconColor = '#f0f6fc';

        dayDiv.innerHTML = `
            <span>${i}</span>
            <i class="fa-solid ${randomIcon}" style="color: ${iconColor};"></i>
        `;
        calendarDatesContainer.appendChild(dayDiv);
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    let isDark = true; // default

    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            htmlElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        updateChartsTheme();
    });

    // Chart.js Default Settings
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.color = '#8b949e';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(22, 27, 34, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#f0f6fc';
    Chart.defaults.plugins.tooltip.bodyColor = '#8b949e';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.displayColors = false;

    // Helper: generate gradient for charts
    function createGradient(ctx, color1, color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    const gridColorDark = 'rgba(255, 255, 255, 0.05)';
    const gridColorLight = 'rgba(0, 0, 0, 0.05)';

    // Temperature Chart (Responsive Line Chart)
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const tempGradient = createGradient(tempCtx, 'rgba(88, 166, 255, 0.5)', 'rgba(88, 166, 255, 0.0)');

    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [15, 14, 13, 16, 21, 24, 22, 18],
                borderColor: '#58a6ff',
                backgroundColor: tempGradient,
                borderWidth: 3,
                pointBackgroundColor: '#161b22',
                pointBorderColor: '#58a6ff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColorDark, drawBorder: false }
                },
                y: {
                    grid: { color: gridColorDark, drawBorder: false },
                    ticks: { callback: (value) => value + '°' }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // Precipitation Bar Chart
    const rainCtx = document.getElementById('rainChart').getContext('2d');
    const rainChart = new Chart(rainCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Precipitation (%)',
                data: [10, 20, 60, 40, 15, 5, 0],
                backgroundColor: '#a371f7',
                borderRadius: 8,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    grid: { color: gridColorDark, drawBorder: false },
                    ticks: { callback: (value) => value + '%' }
                }
            }
        }
    });

    // Air Quality Doughnut Chart
    const aqiCtx = document.getElementById('aqiChart').getContext('2d');
    const aqiChart = new Chart(aqiCtx, {
        type: 'doughnut',
        data: {
            labels: ['Good AQI', 'Remaining'],
            datasets: [{
                data: [42, 58], // 42 out of 100 for example
                backgroundColor: [
                    '#3fb950',
                    'rgba(255, 255, 255, 0.05)'
                ],
                borderWidth: 0,
                cutout: '80%',
                borderRadius: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // Precipitation Types Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Rain', 'Snow', 'Clear', 'Cloudy'],
            datasets: [{
                data: [30, 10, 40, 20],
                backgroundColor: [
                    '#58a6ff',
                    '#a371f7',
                    '#3fb950',
                    '#8b949e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#8b949e', font: { family: "'Outfit', sans-serif" } } }
            }
        }
    });

    // Function to update Charts theme dynamically
    function updateChartsTheme() {
        const gridColor = isDark ? gridColorDark : gridColorLight;
        const textColor = isDark ? '#8b949e' : '#57606a';
        const tooltipBg = isDark ? 'rgba(22, 27, 34, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        const tooltipTitle = isDark ? '#f0f6fc' : '#24292f';
        const bgRemaining = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        // global updates
        Chart.defaults.color = textColor;
        Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
        Chart.defaults.plugins.tooltip.titleColor = tooltipTitle;
        Chart.defaults.plugins.tooltip.bodyColor = textColor;

        // Temp Chart
        tempChart.options.scales.x.grid.color = gridColor;
        tempChart.options.scales.y.grid.color = gridColor;
        tempChart.update();

        // Rain Chart
        rainChart.options.scales.y.grid.color = gridColor;
        rainChart.update();

        // AQI Chart
        aqiChart.data.datasets[0].backgroundColor[1] = bgRemaining;
        aqiChart.update();

        // Pie Chart
        pieChart.options.plugins.legend.labels.color = textColor;
        pieChart.update();
    }

    // Tab filtering interaction for Temp chart
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            const target = e.target;
            target.classList.add('active');

            const range = target.getAttribute('data-range');
            if (range === 'today') {
                tempChart.data.labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
                tempChart.data.datasets[0].data = [15, 14, 13, 16, 21, 24, 22, 18];
            } else if (range === 'week') {
                tempChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                tempChart.data.datasets[0].data = [18, 20, 22, 24, 23, 19, 17];
            }
            tempChart.update();
        });
    });
});
