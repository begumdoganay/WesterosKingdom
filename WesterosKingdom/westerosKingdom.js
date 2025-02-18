class WesterosExperience {
    constructor() {
        this.audioEnabled = false;
        this.audio = null;
        this.currentLanguage = localStorage.getItem('language') || 'tr';
        this.translations = {
            tr: {
                title: "Westeros Krallığı",
                subtitle: "Yedi Krallığın Kapıları",
                placeholder: "Asil İsminizi Yazınız, Leyd/Lord",
                enterButton: "Krallığa Giriş",
                welcome: "Hoş Geldiniz",
                leaveButton: "Krallıktan Ayrıl",
                quotes: [
                    "Kış geliyor, ve ölüler onunla geliyor...",
                    "Yedi Krallık tek bir kılıcın gölgesinde birleşti.",
                    "Tahtların oyununda, ya kazanırsın ya da ölürsün.",
                    "Ejderhaların dansı başlıyor..."
                ],
                regions: ['⚔️ Kışyarı', '🏰 Kralıskapı', '🗡️ Casterly Kayası', '🏹 Eyrie'],
                days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
            },
            en: {
                title: "Kingdom of Westeros",
                subtitle: "Gates of the Seven Kingdoms",
                placeholder: "Enter Your Noble Name, Lady/Lord",
                enterButton: "Enter the Realm",
                welcome: "Welcome",
                leaveButton: "Leave the Realm",
                quotes: [
                    "Wınter ıs comıng, and the dead come wıth ıt...",
                    "Seven Kıngdoms unıted under one sword.",
                    "In the game of thrones, you wın or you dıe.",
                    "The dance of dragons begıns..."
                ],
                regions: ['⚔️ Wınterfell', '🏰 Kıng\'s Landıng', '🗡️ Casterly Rock', '🏹 The Eyrıe'],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            de: {
                title: "Königreich Westeros",
                subtitle: "Tore der Sieben Königreiche",
                placeholder: "Geben Sie Ihren edlen Namen ein, Lady/Lord",
                enterButton: "Betreten Sie das Reich",
                welcome: "Wıllkommen",
                leaveButton: "Verlassen Sie das Reich",
                quotes: [
                    "Der Wınter naht, und die Toten kommen mıt ıhm...",
                    "Sıeben Könıgreıche vereınt unter einem Schwert.",
                    "Im Spiel der Throne gewınnst du oder stırbst.",
                    "Der Tanz der Drachen begınnt..."
                ],
                regions: ['⚔️ Wınterfell', '🏰 Könıgsmund', '🗡️ Casterlystein', '🏹 Hohenehr'],
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
            }
        };

        this.initializeElements();
        this.setupEventListeners();
        this.updateContent();
        this.startClock();
    }

    initializeElements() {
        this.loginScreen = document.getElementById('loginScreen');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.nameInput = document.getElementById('nameInput');
        this.welcomeName = document.getElementById('welcomeName');
        this.welcomeText = document.getElementById('welcomeText');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.quote = document.getElementById('quote');
        this.regionDisplay = document.getElementById('regionDisplay');
        this.volumeSlider = document.getElementById('volumeSlider');
    }

    setupEventListeners() {
        // Dil değiştirme butonları
        document.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });

        // Giriş butonu
        document.querySelector('#loginScreen .submit-button').addEventListener('click', () => {
            this.enterRealm();
        });

        // Çıkış butonu
        document.querySelector('#welcomeScreen .submit-button').addEventListener('click', () => {
            this.leaveRealm();
        });

        // Enter tuşu ile giriş
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.enterRealm();
            }
        });

        // Ses kontrolleri
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
            audioToggle.addEventListener('mouseover', () => {
                if (this.volumeSlider) this.volumeSlider.style.display = 'block';
            });
        }

        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                if (this.audio) {
                    this.audio.volume = e.target.value / 100;
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (this.volumeSlider && !e.target.matches('#audioToggle, #volumeSlider')) {
                this.volumeSlider.style.display = 'none';
            }
        });
    }

    setupAudio() {
    if (!this.audio) {
        this.audio = new Audio('got-theme.mp3');
        this.audio.loop = true;
        // Başlangıç ses seviyesini düşük ayarla (0.1 = %10 ses)
        this.audio.volume = 0.1;
        
        
        // Volume slider kontrolü
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            // Slider'ı başlangıç ses seviyesine ayarla
            volumeSlider.value = this.audio.volume * 100;
            
            // Slider değiştiğinde sesi güncelle
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value / 100;
            });
        }
    }
}

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const iconElement = document.querySelector('#audioToggle i');

        if (this.audioEnabled) {
            this.setupAudio();
            this.audio.play().catch(console.error);
            iconElement.setAttribute('data-lucide', 'volume-2');
        } else {
            this.audio?.pause();
            iconElement.setAttribute('data-lucide', 'volume-x');
        }
        lucide.createIcons();
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        document.querySelectorAll('.lang-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        this.updateContent();
    }

    updateContent() {
        const content = this.translations[this.currentLanguage];
        
        document.querySelector('.title').textContent = content.title;
        document.querySelector('.subtitle').textContent = content.subtitle;
        this.nameInput.placeholder = content.placeholder;
        document.querySelector('#loginScreen .submit-button').textContent = content.enterButton;
        
        if (this.welcomeName.textContent) {
            this.welcomeText.textContent = `${content.welcome},`;
            this.setRandomQuote();
            this.setRandomRegion();
        }
        
        document.querySelector('#welcomeScreen .submit-button').textContent = content.leaveButton;
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dayName = this.translations[this.currentLanguage].days[now.getDay()];
        
        // Tam tarih formatı için
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const fullDate = `${day}/${month}/${year}`;

        this.hoursElement.textContent = hours;
        this.minutesElement.textContent = minutes;

        // Saniye ekle
        let secondsElement = document.querySelector('.seconds-block');
        if (!secondsElement) {
            secondsElement = document.createElement('div');
            secondsElement.className = 'time-block seconds-block';
            const separator = document.createElement('div');
            separator.className = 'time-separator';
            separator.textContent = ':';
            this.minutesElement.parentNode.appendChild(separator);
            this.minutesElement.parentNode.appendChild(secondsElement);
        }
        secondsElement.textContent = seconds;

        // Gün ve tarih gösterimi
        const clockDisplay = document.querySelector('.clock-display');
        let dateContainer = document.querySelector('.date-container');
        
        if (!dateContainer) {
            dateContainer = document.createElement('div');
            dateContainer.className = 'date-container';
            clockDisplay.parentNode.insertBefore(dateContainer, clockDisplay.nextSibling);
            
            const dayDisplay = document.createElement('div');
            dayDisplay.className = 'time-block day-display';
            
            const dateDisplay = document.createElement('div');
            dateDisplay.className = 'time-block date-display';
            
            dateContainer.appendChild(dayDisplay);
            dateContainer.appendChild(dateDisplay);
        }

        const dayDisplay = dateContainer.querySelector('.day-display');
        const dateDisplay = dateContainer.querySelector('.date-display');
        
        dayDisplay.textContent = dayName;
        dateDisplay.textContent = fullDate;
    }

    setRandomQuote() {
        const quotes = this.translations[this.currentLanguage].quotes;
        this.quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }

    setRandomRegion() {
        const regions = this.translations[this.currentLanguage].regions;
        this.regionDisplay.textContent = regions[Math.floor(Math.random() * regions.length)];
    }

    enterRealm() {
        const name = this.nameInput.value.trim();
        if (!name) return;

        if (!this.audioEnabled) {
            this.toggleAudio(); // Giriş yapıldığında müziği başlat
        }

        this.loginScreen.style.display = 'none';
        this.welcomeScreen.style.display = 'block';
        this.welcomeName.textContent = name;
        this.welcomeText.textContent = `${this.translations[this.currentLanguage].welcome},`;
        
        this.setRandomQuote();
        this.setRandomRegion();
    }

    leaveRealm() {
        if (this.audioEnabled) {
            this.toggleAudio(); // Çıkış yapıldığında müziği durdur
        }

        this.loginScreen.style.display = 'block';
        this.welcomeScreen.style.display = 'none';
        this.nameInput.value = '';
    }
}

// Sayfanın yüklenmesi tamamlandığında deneyimi başlat
document.addEventListener('DOMContentLoaded', () => {
    window.westerosExperience = new WesterosExperience();
});
