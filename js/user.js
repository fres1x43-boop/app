class UserManager {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.initUser();
    }

    async initUser() {
        try {
            // Ждем инициализации Telegram WebApp
            await this.waitForTelegramInit();
            
            const user = this.tg.initDataUnsafe?.user;
            const usernameElements = document.querySelectorAll('#username, #profile-name');
            const avatarElements = document.querySelectorAll('#user-avatar, #profile-avatar');
            const userIdElement = document.getElementById('user-id');

            if (user) {
                // Устанавливаем имя пользователя
                const userName = user.first_name || 'Пользователь';
                usernameElements.forEach(el => el.textContent = userName);
                
                // Устанавливаем ID пользователя
                if (userIdElement) {
                    userIdElement.textContent = `ID: ${user.id}`;
                }
                
                // Устанавливаем аватар
                const avatarUrl = user.photo_url || this.generateDefaultAvatar(userName);
                avatarElements.forEach(el => {
                    el.src = avatarUrl;
                    el.onerror = () => {
                        el.src = this.generateDefaultAvatar(userName);
                    };
                });
            } else {
                // Гостевой режим
                usernameElements.forEach(el => el.textContent = 'Гость');
                if (userIdElement) userIdElement.textContent = 'ID: не авторизован';
                avatarElements.forEach(el => el.src = this.generateDefaultAvatar('G'));
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
            document.getElementById('username').textContent = 'Ошибка загрузки';
        }
    }

    waitForTelegramInit() {
        return new Promise((resolve) => {
            if (window.Telegram && window.Telegram.WebApp) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.Telegram && window.Telegram.WebApp) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    generateDefaultAvatar(initials) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Генерация цвета на основе инициалов
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        // Рисуем фон
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем инициалы
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials.charAt(0).toUpperCase(), canvas.width/2, canvas.height/2);
        
        return canvas.toDataURL();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserManager();
});
