class TelegramApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.initApp();
    }

    initApp() {
        // Растягиваем WebApp на весь экран
        this.tg.expand();
        
        // Настраиваем кнопку "Назад"
        this.setupBackButton();
        
        // Настраиваем обработчики навигации
        this.setupNavigation();
        
        // Настраиваем кнопки
        this.setupButtons();
    }

    setupBackButton() {
        if (this.tg.platform !== 'unknown') {
            this.tg.BackButton.show();
            this.tg.BackButton.onClick(() => {
                this.tg.close();
            });
        }
    }

    setupNavigation() {
        // Подсветка активной страницы
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'profile.html') {
            document.getElementById('nav-profile').classList.add('active');
            document.getElementById('nav-main').classList.remove('active');
        } else {
            document.getElementById('nav-main').classList.add('active');
            document.getElementById('nav-profile').classList.remove('active');
        }
    }

    setupButtons() {
        // Обработчик кнопки пополнения
        const depositBtn = document.getElementById('deposit-btn');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => {
                this.tg.showPopup({
                    title: "Пополнение баланса",
                    message: "Эта функция будет доступна в следующем обновлении",
                    buttons: [{ type: 'cancel', text: 'Закрыть' }]
                });
            });
        }

        // Обработчик кнопки кошелька
        const walletBtn = document.getElementById('wallet-btn');
        if (walletBtn) {
            walletBtn.addEventListener('click', () => {
                this.tg.showPopup({
                    title: "Подключение кошелька",
                    message: "Выберите способ подключения:",
                    buttons: [
                        { id: 'ton', text: 'TON Wallet' },
                        { id: 'other', text: 'Другой' },
                        { type: 'cancel' }
                    ]
                }, (id) => {
                    if (id) {
                        this.tg.showAlert(`Выбран способ: ${id}`);
                    }
                });
            });
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new TelegramApp();
});
