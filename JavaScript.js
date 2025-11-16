document.addEventListener('DOMContentLoaded', () => {
    // --- Dummy Data for Missions (Projects) ---
    const missions = [
        {
            id: 'mission_dcas',
            title: 'AI-DCAS – Face Recognition Attendance System',
            status: 'completed',
            description: 'Sistem kehadiran berasaskan pengecaman wajah yang dapat menguruskan database pelajar secara real-time dan offline. Mengintegrasikan OpenCV, Raspberry Pi, dan database SQLite.',
            technologies: 'Python, OpenCV, SQLite, Flask, Raspberry Pi, face_recognition library',
            skills: 'Computer Vision, Backend Development, Embedded Systems, Database Management',
            duration: '4 Months',
            link: 'https://github.com/itswinzie/AI-DCAS',
            dataType: 'image', // 'chart', 'image', 'robot-sim', 'ai-output'
            dataContent: 'https://via.placeholder.com/600x300/0d1a2f/00f0ff?text=AI-DCAS+System+Screenshot' // Placeholder image
        },
        {
            id: 'mission_kaira',
            title: 'Kaira – AI Assistant for Automation',
            status: 'in-progress',
            description: 'Pembantu AI untuk automasi tugas harian, kawalan IoT, dan integrasi projek lain. Bertujuan untuk menjadi hub automasi pusat.',
            technologies: 'Python, Raspberry Pi, API Integration, Automation Scripts, Speech Recognition',
            skills: 'AI Development, IoT Integration, Scripting, Natural Language Processing (Basic)',
            duration: '2 Months (ongoing)',
            link: 'https://github.com/itswinzie/Kaira',
            dataType: 'ai-output',
            dataContent: 'Kaira Core Module Status: Initiated. Task automation sequence active. Integrating external APIs for weather and smart home control. Listening for voice commands...'
        },
        {
            id: 'mission_pi_electronics',
            title: 'Raspberry Pi & Electronics Projects',
            status: 'completed',
            description: 'Eksperimen projek elektronik termasuk streaming kamera Pi → Mini PC, sensor automasi, dan prototaip robotik. Meliputi pelbagai aplikasi perkakasan.',
            technologies: 'Raspberry Pi, Arduino, ESP32, Sensors, Python, C++',
            skills: 'Hardware Interfacing, Microcontroller Programming, IoT Prototyping, Debugging',
            duration: '6 Months (ongoing collection)',
            link: 'https://github.com/itswinzie/RaspberryPi-Electronics-Projects',
            dataType: 'chart',
            dataContent: {
                labels: ['Sensor Readings', 'Camera Stream', 'Motor Control', 'Wireless Comm'],
                datasets: [
                    {
                        label: 'Project Complexity',
                        data: [70, 85, 60, 75], // Dummy complexity
                        backgroundColor: 'rgba(0, 240, 255, 0.2)',
                        borderColor: '#00f0ff',
                        borderWidth: 1
                    }
                ]
            }
        },
        // Tambahkan proyek pendidikan di sini jika ingin terpisah dari education-item di left-panel
        // {
        //     id: 'mission_education',
        //     title: 'Diploma Kejuruteraan Komputer',
        //     status: 'in-progress',
        //     description: 'Sedang menuntut Diploma Kejuruteraan Komputer di Politeknik Sultan Mizan Zainal Abidin. Fokus pada pembangunan projek akhir semester dan pencapaian akademik.',
        //     technologies: 'Curriculum-based learning, Project Development Tools',
        //     skills: 'Problem Solving, Academic Research, Project Management, Team Collaboration',
        //     duration: 'Sehingga 2026',
        //     link: '#', // No specific repo for overall diploma
        //     dataType: 'ai-output',
        //     dataContent: 'Current GPA: [Target 4.0]. Key areas of study: AI, Robotics, IoT, Data Structures, Programming Paradigms.'
        // }
    ];

    // --- DOM Elements ---
    const missionList = document.getElementById('mission-list');
    const contentPanels = document.querySelectorAll('.content-panel');
    const mainNavItems = document.querySelectorAll('.main-nav .nav-item');
    const missionLogFeed = document.getElementById('mission-log-feed');

    const totalMissions = document.getElementById('total-missions');
    const completedMissions = document.getElementById('completed-missions');
    const inProgressMissions = document.getElementById('in-progress-missions');

    const missionTitle = document.getElementById('mission-title');
    const missionDescription = document.getElementById('mission-description');
    const missionStatus = document.getElementById('mission-status');
    const missionTech = document.getElementById('mission-tech');
    const missionSkills = document.getElementById('mission-skills');
    const missionDuration = document.getElementById('mission-duration');
    const missionLink = document.getElementById('mission-link');
    const missionImage = document.getElementById('mission-image');
    const robotSimPlaceholder = document.getElementById('robot-sim-placeholder');
    const aiOutput = document.getElementById('ai-output');
    const missionChartDetailCanvas = document.getElementById('mission-chart-detail');
    let missionDetailChart = null; // To store Chart.js instance

    // --- Functions ---

    // Append log entry
    function appendLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const li = document.createElement('li');
        li.className = `log-entry ${type}`;
        li.textContent = `[${timestamp}] ${message}`;
        missionLogFeed.prepend(li); // Add to top
        if (missionLogFeed.children.length > 50) { // Keep log concise
            missionLogFeed.removeChild(missionLogFeed.lastChild);
        }
    }

    // Load missions into left panel
    function loadMissions() {
        missionList.innerHTML = ''; // Clear existing
        missions.forEach(mission => {
            const li = document.createElement('li');
            li.setAttribute('data-mission-id', mission.id);
            li.innerHTML = `<span class="status-dot ${mission.status.replace(' ', '-')}"></span>${mission.title}`;
            li.addEventListener('click', () => selectMission(mission.id));
            missionList.appendChild(li);
        });
        appendLog('Mission manifest loaded. Awaiting command.', 'success');
    }

    // Select and display a mission
    function selectMission(id) {
        const selectedMission = missions.find(m => m.id === id);
        if (!selectedMission) {
             appendLog(`Error: Mission ID '${id}' not found.`, 'error');
             return;
        }

        // Update active class in mission list
        document.querySelectorAll('#mission-list li').forEach(item => item.classList.remove('active'));
        document.querySelector(`#mission-list li[data-mission-id="${id}"]`).classList.add('active');

        // Show mission detail panel
        showPanel('mission-detail-panel');

        // Update details
        missionTitle.textContent = selectedMission.title;
        missionDescription.textContent = selectedMission.description;
        missionStatus.textContent = selectedMission.status.toUpperCase();
        missionStatus.style.color = selectedMission.status === 'completed' ? '#0f0' : selectedMission.status === 'in-progress' ? '#ffaa00' : '#888';
        missionTech.textContent = selectedMission.technologies;
        missionSkills.textContent = selectedMission.skills;
        missionDuration.textContent = selectedMission.duration;
        missionLink.href = selectedMission.link;
        missionLink.textContent = selectedMission.link === '#' ? '[ACCESS DENIED / LINK UNAVAILABLE]' : '>> VIEW PROJECT REPOSITORY / DEMO <<';
        missionLink.style.color = selectedMission.link === '#' ? '#f00' : '#00f0ff';


        // Clear previous data content displays
        missionImage.style.display = 'none';
        robotSimPlaceholder.style.display = 'none';
        aiOutput.style.display = 'none';
        missionChartDetailCanvas.style.display = 'none';
        if (missionDetailChart) {
            missionDetailChart.destroy();
            missionDetailChart = null;
        }

        // Display specific data content based on dataType
        if (selectedMission.dataType === 'image') {
            missionImage.src = selectedMission.dataContent;
            missionImage.style.display = 'block';
             appendLog(`Mission '${selectedMission.title}': Visual data rendered.`, 'info');
        } else if (selectedMission.dataType === 'robot-sim') {
            robotSimPlaceholder.style.display = 'flex';
            robotSimPlaceholder.textContent = `[ROBOTIC SIMULATOR ONLINE] > ${selectedMission.dataContent}`;
            appendLog(`Mission '${selectedMission.title}': Robotic simulation engaged.`, 'info');
        } else if (selectedMission.dataType === 'ai-output') {
            aiOutput.textContent = selectedMission.dataContent;
            aiOutput.style.display = 'block';
             appendLog(`Mission '${selectedMission.title}': AI log stream active.`, 'info');
        } else if (selectedMission.dataType === 'chart' && selectedMission.dataContent) {
            missionChartDetailCanvas.style.display = 'block';
            missionDetailChart = new Chart(missionChartDetailCanvas, {
                type: 'bar', // Changed to bar for variety, can be line or radar
                data: selectedMission.dataContent,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#00f0ff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(0, 240, 255, 0.1)' },
                            ticks: { color: '#00f0ff' }
                        },
                        y: {
                            grid: { color: 'rgba(0, 240, 255, 0.1)' },
                            ticks: { color: '#00f0ff' }
                        }
                    }
                }
            });
            appendLog(`Mission '${selectedMission.title}': Data visualization chart rendered.`, 'info');
        }
        appendLog(`Mission '${selectedMission.title}' loaded into main display.`, 'success');
    }

    // Show specific main content panel
    function showPanel(panelId) {
        contentPanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(panelId).classList.add('active');

        // Update active class in main nav
        mainNavItems.forEach(item => item.classList.remove('active'));
        const navItem = document.querySelector(`.main-nav .nav-item[data-panel="${panelId.replace('-panel', '')}"]`);
        if (navItem) {
            navItem.classList.add('active');
        } else if (panelId === 'mission-detail-panel') {
            // If mission detail is active, highlight the 'MISSIONS' nav item
            document.querySelector('.main-nav .nav-item[data-panel="missions"]').classList.add('active');
        }
        appendLog(`Display panel switched to '${panelId.replace('-', ' ').toUpperCase()}'.`, 'info');
    }

    // Initialize Overview Panel Stats
    function updateOverviewStats() {
        totalMissions.textContent = missions.length;
        completedMissions.textContent = missions.filter(m => m.status === 'completed').length;
        inProgressMissions.textContent = missions.filter(m => m.status === 'in-progress').length;
        appendLog('Overview statistics updated.', 'info');
    }

    // Dummy Skill Chart for Overview
    function initSkillChart() {
        const ctx = document.getElementById('skill-chart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Programming', 'AI/ML', 'IoT', 'Robotics', 'Electronics', 'Project Mgmt'],
                datasets: [{
                    label: 'Core Competency',
                    data: [90, 85, 80, 75, 88, 70], // Dummy skill levels
                    backgroundColor: 'rgba(0, 240, 255, 0.2)',
                    borderColor: '#00f0ff',
                    pointBackgroundColor: '#00f0ff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00f0ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#00f0ff'
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(0, 240, 255, 0.2)'
                        },
                        grid: {
                            color: 'rgba(0, 240, 255, 0.2)'
                        },
                        pointLabels: {
                            color: '#00f0ff'
                        },
                        ticks: {
                            display: false, // Hide numeric ticks
                            backdropColor: 'transparent',
                            color: '#00f0ff'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
        appendLog('Skill matrix chart rendered.', 'info');
    }

    // --- Event Listeners ---
    mainNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const panelId = item.getAttribute('data-panel') + '-panel';
            showPanel(panelId);
        });
    });

    // --- Initial Load ---
    loadMissions();
    updateOverviewStats();
    initSkillChart();
    showPanel('overview-panel'); // Show overview by default
    if (missions.length > 0) {
        selectMission(missions[0].id); // Select first mission by default
    } else {
        appendLog('No missions found in manifest. Please add data.', 'warning');
    }
});