/* ============================================
   LIMASSOL CHARITY RUN — ADMIN DASHBOARD JS
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    // Admin password — change this to your desired password
    const ADMIN_PASSWORD = 'admin2026';

    // Supabase configuration
    const SUPABASE_URL = 'https://rugxsvceksogunhqxwxd.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3hzdmNla3NvZ3VuaHF4d3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjYzODQsImV4cCI6MjA5MjAwMjM4NH0.FrOhyTeicRZW_mXse28zm6XDJALbhj0obB5qfHJNv78';

    // ========================================
    // STATE
    // ========================================
    let allData = [];
    let filteredData = [];
    let sortColumn = 'registrationDate';
    let sortDirection = 'desc';
    let isDemo = false;

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const demoBanner = document.getElementById('demo-banner');
    const demoBannerClose = document.getElementById('demo-banner-close');
    const loadingOverlay = document.getElementById('loading-overlay');
    const tableBody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state');
    const noResultsState = document.getElementById('no-results-state');
    const filterSearch = document.getElementById('filter-search');
    const filterDistance = document.getElementById('filter-distance');
    const filterTshirt = document.getElementById('filter-tshirt');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const showingCount = document.getElementById('showing-count');

    // Stat elements
    const statTotal = document.getElementById('stat-total');
    const stat1km = document.getElementById('stat-1km');
    const stat5km = document.getElementById('stat-5km');
    const stat10km = document.getElementById('stat-10km');
    const statRevenue = document.getElementById('stat-revenue');

    // ========================================
    // 1. LOGIN SYSTEM
    // ========================================

    function checkSession() {
        const loggedIn = sessionStorage.getItem('lcr-admin-logged-in');
        if (loggedIn === 'true') {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
        if (loginPassword) loginPassword.value = '';
        if (loginError) loginError.classList.remove('visible');
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
        sessionStorage.setItem('lcr-admin-logged-in', 'true');
        loadData();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const password = loginPassword.value.trim();

            if (password === ADMIN_PASSWORD) {
                loginError.classList.remove('visible');
                showDashboard();
            } else {
                loginError.classList.add('visible');
                loginPassword.value = '';
                loginPassword.focus();

                // Shake animation
                const card = document.querySelector('.login-card');
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = 'shake 0.5s ease';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('lcr-admin-logged-in');
            showLogin();
        });
    }

    // ========================================
    // 2. DATA LOADING (Supabase)
    // ========================================

    async function loadData() {
        await fetchSupabaseData();
    }

    function loadDemoData() {
        isDemo = true;
        allData = [];
        demoBanner.style.display = 'flex';
        applyFiltersAndRender();
    }

    async function fetchSupabaseData() {
        isDemo = false;
        demoBanner.style.display = 'none';
        showLoading(true);

        try {
            var response = await fetch(SUPABASE_URL + '/rest/v1/registrations?select=*&order=created_at.desc', {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_KEY,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data: ' + response.status);
            }

            var data = await response.json();

            // Map Supabase column names to the format the dashboard expects
            allData = data.map(function(row) {
                return {
                    firstName: row.first_name || '',
                    lastName: row.last_name || '',
                    email: row.email || '',
                    phone: row.phone || '',
                    distance: row.distance || '',
                    tshirtSize: row.tshirt_size || '',
                    emergencyName: row.emergency_name || '',
                    emergencyPhone: row.emergency_phone || '',
                    registrationDate: row.registration_date || row.created_at || '',
                    language: row.language || 'EN'
                };
            });

            applyFiltersAndRender();
        } catch (error) {
            console.error('Error fetching Supabase data:', error);
            loadDemoData();
        } finally {
            showLoading(false);
        }
    }

    // ========================================
    // 3. CSV PARSING
    // ========================================

    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(function (line) {
            return line.trim() !== '';
        });

        if (lines.length < 2) return [];

        const headers = parseCSVLine(lines[0]);
        var data = [];

        for (var i = 1; i < lines.length; i++) {
            var values = parseCSVLine(lines[i]);
            var row = {};

            for (var j = 0; j < headers.length; j++) {
                var header = headers[j].trim();
                row[header] = (values[j] || '').trim();
            }

            // Only add rows that have at least a first name or email
            if (row.firstName || row.email) {
                data.push(row);
            }
        }

        return data;
    }

    function parseCSVLine(line) {
        var result = [];
        var current = '';
        var inQuotes = false;

        for (var i = 0; i < line.length; i++) {
            var char = line[i];

            if (inQuotes) {
                if (char === '"') {
                    if (i + 1 < line.length && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
        }

        result.push(current);
        return result;
    }

    // ========================================
    // 4. FILTERING & SORTING
    // ========================================

    function applyFiltersAndRender() {
        var searchTerm = (filterSearch.value || '').toLowerCase().trim();
        var distanceFilter = filterDistance.value;
        var tshirtFilter = filterTshirt.value;

        filteredData = allData.filter(function (row) {
            // Search filter (name or email)
            var matchesSearch = true;
            if (searchTerm) {
                var fullName = ((row.firstName || '') + ' ' + (row.lastName || '')).toLowerCase();
                var email = (row.email || '').toLowerCase();
                matchesSearch = fullName.indexOf(searchTerm) !== -1 || email.indexOf(searchTerm) !== -1;
            }

            // Distance filter
            var matchesDistance = true;
            if (distanceFilter) {
                matchesDistance = (row.distance || '') === distanceFilter;
            }

            // T-shirt filter
            var matchesTshirt = true;
            if (tshirtFilter) {
                matchesTshirt = (row.tshirtSize || '') === tshirtFilter;
            }

            return matchesSearch && matchesDistance && matchesTshirt;
        });

        // Sort
        sortData();

        // Render
        updateStats();
        renderTable();
        updateShowingCount();
    }

    function sortData() {
        filteredData.sort(function (a, b) {
            var valA, valB;

            switch (sortColumn) {
                case 'name':
                    valA = ((a.firstName || '') + ' ' + (a.lastName || '')).toLowerCase();
                    valB = ((b.firstName || '') + ' ' + (b.lastName || '')).toLowerCase();
                    break;
                case 'email':
                    valA = (a.email || '').toLowerCase();
                    valB = (b.email || '').toLowerCase();
                    break;
                case 'phone':
                    valA = (a.phone || '').toLowerCase();
                    valB = (b.phone || '').toLowerCase();
                    break;
                case 'distance':
                    valA = parseDistanceKm(a.distance);
                    valB = parseDistanceKm(b.distance);
                    break;
                case 'tshirtSize':
                    valA = tshirtSizeOrder(a.tshirtSize);
                    valB = tshirtSizeOrder(b.tshirtSize);
                    break;
                case 'registrationDate':
                    valA = a.registrationDate || '';
                    valB = b.registrationDate || '';
                    break;
                case 'language':
                    valA = (a.language || '').toLowerCase();
                    valB = (b.language || '').toLowerCase();
                    break;
                default:
                    return 0;
            }

            var comparison = 0;
            if (valA < valB) comparison = -1;
            if (valA > valB) comparison = 1;

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    function parseDistanceKm(distance) {
        if (!distance) return 0;
        var match = distance.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function tshirtSizeOrder(size) {
        var order = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };
        return order[size] || 0;
    }

    // ========================================
    // 5. STATS CALCULATION
    // ========================================

    function updateStats() {
        var total = filteredData.length;
        var count1km = 0;
        var count5km = 0;
        var count10km = 0;

        filteredData.forEach(function (row) {
            var km = parseDistanceKm(row.distance);
            if (km === 1) count1km++;
            else if (km === 5) count5km++;
            else if (km === 10) count10km++;
        });

        var revenue = total * 50;

        animateNumber(statTotal, total);
        animateNumber(stat1km, count1km);
        animateNumber(stat5km, count5km);
        animateNumber(stat10km, count10km);
        statRevenue.textContent = '€' + revenue.toLocaleString();
    }

    function animateNumber(element, target) {
        if (!element) return;

        var current = parseInt(element.textContent.replace(/[^0-9]/g, ''), 10) || 0;
        if (current === target) {
            element.textContent = target;
            return;
        }

        var duration = 400;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var value = Math.floor(current + (target - current) * easeOutCubic(progress));
            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ========================================
    // 6. TABLE RENDERING
    // ========================================

    function renderTable() {
        if (!tableBody) return;

        // Clear table
        tableBody.innerHTML = '';

        // Show/hide empty states
        var tableSection = document.querySelector('.table-section');
        var tableWrapper = document.querySelector('.table-wrapper');

        if (allData.length === 0) {
            emptyState.style.display = 'block';
            noResultsState.style.display = 'none';
            tableWrapper.style.display = 'none';
            return;
        }

        if (filteredData.length === 0) {
            emptyState.style.display = 'none';
            noResultsState.style.display = 'block';
            tableWrapper.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        noResultsState.style.display = 'none';
        tableWrapper.style.display = 'block';

        // Build rows
        filteredData.forEach(function (row, index) {
            var tr = document.createElement('tr');

            // Index
            var tdIndex = document.createElement('td');
            tdIndex.textContent = index + 1;
            tr.appendChild(tdIndex);

            // Name
            var tdName = document.createElement('td');
            tdName.textContent = (row.firstName || '') + ' ' + (row.lastName || '');
            tr.appendChild(tdName);

            // Email
            var tdEmail = document.createElement('td');
            var emailLink = document.createElement('a');
            emailLink.href = 'mailto:' + (row.email || '');
            emailLink.textContent = row.email || '';
            emailLink.style.color = 'var(--accent)';
            tdEmail.appendChild(emailLink);
            tr.appendChild(tdEmail);

            // Phone
            var tdPhone = document.createElement('td');
            tdPhone.textContent = row.phone || '';
            tr.appendChild(tdPhone);

            // Distance
            var tdDistance = document.createElement('td');
            var distanceBadge = document.createElement('span');
            distanceBadge.className = 'distance-badge';
            var km = parseDistanceKm(row.distance);
            if (km === 1) distanceBadge.classList.add('distance-badge-1km');
            else if (km === 5) distanceBadge.classList.add('distance-badge-5km');
            else if (km === 10) distanceBadge.classList.add('distance-badge-10km');
            distanceBadge.textContent = row.distance || 'N/A';
            tdDistance.appendChild(distanceBadge);
            tr.appendChild(tdDistance);

            // T-Shirt Size
            var tdTshirt = document.createElement('td');
            var tshirtBadge = document.createElement('span');
            tshirtBadge.className = 'tshirt-badge';
            tshirtBadge.textContent = row.tshirtSize || 'N/A';
            tdTshirt.appendChild(tshirtBadge);
            tr.appendChild(tdTshirt);

            // Emergency Contact
            var tdEmergency = document.createElement('td');
            var emergencyDiv = document.createElement('div');
            emergencyDiv.className = 'emergency-info';
            var emergencyNameSpan = document.createElement('div');
            emergencyNameSpan.className = 'emergency-name';
            emergencyNameSpan.textContent = row.emergencyName || 'N/A';
            var emergencyPhoneSpan = document.createElement('div');
            emergencyPhoneSpan.className = 'emergency-phone';
            emergencyPhoneSpan.textContent = row.emergencyPhone || '';
            emergencyDiv.appendChild(emergencyNameSpan);
            emergencyDiv.appendChild(emergencyPhoneSpan);
            tdEmergency.appendChild(emergencyDiv);
            tr.appendChild(tdEmergency);

            // Registration Date
            var tdDate = document.createElement('td');
            tdDate.textContent = formatDate(row.registrationDate);
            tr.appendChild(tdDate);

            // Language
            var tdLang = document.createElement('td');
            var langBadge = document.createElement('span');
            langBadge.className = 'lang-badge';
            var lang = (row.language || 'EN').toUpperCase();
            if (lang === 'RU') {
                langBadge.classList.add('lang-badge-ru');
            } else {
                langBadge.classList.add('lang-badge-en');
            }
            langBadge.textContent = lang;
            tdLang.appendChild(langBadge);
            tr.appendChild(tdLang);

            tableBody.appendChild(tr);
        });

        // Update sort indicators
        updateSortIndicators();
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';

        try {
            var date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;

            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var year = date.getFullYear();
            var hours = String(date.getHours()).padStart(2, '0');
            var minutes = String(date.getMinutes()).padStart(2, '0');

            return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
        } catch (e) {
            return dateStr;
        }
    }

    function updateShowingCount() {
        if (!showingCount) return;
        showingCount.textContent = 'Showing ' + filteredData.length + ' of ' + allData.length + ' registrations';
    }

    // ========================================
    // 7. TABLE SORTING
    // ========================================

    function updateSortIndicators() {
        var headers = document.querySelectorAll('.participants-table thead th.sortable');
        headers.forEach(function (th) {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.getAttribute('data-sort') === sortColumn) {
                th.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    // Attach sort click handlers
    var sortableHeaders = document.querySelectorAll('.participants-table thead th.sortable');
    sortableHeaders.forEach(function (th) {
        th.addEventListener('click', function () {
            var column = th.getAttribute('data-sort');
            if (column === 'index') return; // Don't sort by index

            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }

            applyFiltersAndRender();
        });
    });

    // ========================================
    // 8. FILTER EVENT LISTENERS
    // ========================================

    if (filterSearch) {
        var searchTimeout;
        filterSearch.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                applyFiltersAndRender();
            }, 250);
        });
    }

    if (filterDistance) {
        filterDistance.addEventListener('change', function () {
            applyFiltersAndRender();
        });
    }

    if (filterTshirt) {
        filterTshirt.addEventListener('change', function () {
            applyFiltersAndRender();
        });
    }

    // ========================================
    // 9. CSV EXPORT
    // ========================================

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function () {
            exportToCSV();
        });
    }

    function exportToCSV() {
        if (filteredData.length === 0) {
            alert('No data to export.');
            return;
        }

        var headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Distance', 'T-Shirt Size', 'Emergency Name', 'Emergency Phone', 'Registration Date', 'Language'];
        var csvRows = [headers.join(',')];

        filteredData.forEach(function (row) {
            var values = [
                escapeCSVField(row.firstName || ''),
                escapeCSVField(row.lastName || ''),
                escapeCSVField(row.email || ''),
                escapeCSVField(row.phone || ''),
                escapeCSVField(row.distance || ''),
                escapeCSVField(row.tshirtSize || ''),
                escapeCSVField(row.emergencyName || ''),
                escapeCSVField(row.emergencyPhone || ''),
                escapeCSVField(formatDate(row.registrationDate)),
                escapeCSVField(row.language || '')
            ];
            csvRows.push(values.join(','));
        });

        var csvContent = csvRows.join('\n');
        var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);

        var today = new Date();
        var dateStr = today.getFullYear() + '-' +
                      String(today.getMonth() + 1).padStart(2, '0') + '-' +
                      String(today.getDate()).padStart(2, '0');

        var link = document.createElement('a');
        link.href = url;
        link.download = 'limassol-charity-run-participants-' + dateStr + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function escapeCSVField(field) {
        if (field === null || field === undefined) return '""';
        var str = String(field);
        if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    // ========================================
    // 10. REFRESH DATA
    // ========================================

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            var icon = refreshBtn.querySelector('.fa-sync-alt');
            if (icon) icon.classList.add('spinning');

            loadData().then(function () {
                setTimeout(function () {
                    if (icon) icon.classList.remove('spinning');
                }, 600);
            }).catch(function () {
                if (icon) icon.classList.remove('spinning');
            });
        });
    }

    // ========================================
    // 11. DEMO BANNER CLOSE
    // ========================================

    if (demoBannerClose) {
        demoBannerClose.addEventListener('click', function () {
            demoBanner.style.display = 'none';
        });
    }

    // ========================================
    // 12. LOADING OVERLAY
    // ========================================

    function showLoading(show) {
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    // ========================================
    // 13. SHAKE ANIMATION (for wrong password)
    // ========================================
    var style = document.createElement('style');
    style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }';
    document.head.appendChild(style);

    // ========================================
    // INITIALIZE
    // ========================================
    checkSession();

})();