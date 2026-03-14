javascript:(function(){
    if(window.latweWrapperActive) return alert("Оболочка уже работает!");
    window.latweWrapperActive = true;

    /* 1. СТИЛИ ОБОЛОЧКИ */
    const style = document.createElement('style');
    style.innerHTML = `
        #latwe-setup-btn { position: fixed; bottom: 20px; right: 20px; z-index: 10000; background: #ff9900; color: white; border: none; padding: 15px; border-radius: 50%; cursor: pointer; font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        
        /* Состояние когда демон активирует кнопки */
        body.latwe-mode #body { display: flex !important; flex-direction: row !important; align-items: flex-start !important; }
        body.latwe-mode .login.container { width: 30% !important; min-width: 320px !important; margin: 20px !important; }
        
        /* Контейнер для кнопок (правая часть) */
        #latwe-panel { display: none; width: 65%; height: 95vh; overflow-y: auto; padding: 20px; background: #fdfdfd; border-left: 2px solid #eee; }
        body.latwe-mode #latwe-panel { display: block !important; }
        
        /* Скрываем оригинал, если он мешает */
        body.latwe-mode #aft-logo, body.latwe-mode #menu-header { opacity: 0.3; }
    `;
    document.head.appendChild(style);

    /* 2. СОЗДАНИЕ ПАНЕЛИ И КНОПКИ НАСТРОЙКИ */
    const panel = document.createElement('div');
    panel.id = 'latwe-panel';
    document.body.appendChild(panel);

    const setupBtn = document.createElement('button');
    setupBtn.id = 'latwe-setup-btn';
    setupBtn.innerText = '⚙️';
    document.body.appendChild(setupBtn);

    let targetInputSelector = null;

    /* 3. API ДЛЯ СКРИПТОВ */
    window.LatweAPI = {
        submit: function(code) {
            const input = document.querySelector(targetInputSelector);
            if(input) {
                input.value = code;
                const form = input.closest('form') || document.forms[0];
                if(form) form.submit();
            } else {
                alert("Ошибка: Поле ввода не найдено. Нажмите ⚙️ чтобы пересканировать.");
            }
        }
    };

    /* 4. ЛОГИКА КНОПКИ (SNAPSHOT И ЗАГРУЗКА) */
    setupBtn.onclick = function() {
        // Ищем активное поле ввода на странице
        const visibleInputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'))
                                   .filter(i => i.offsetWidth > 0 && i.offsetHeight > 0);
        
        if(visibleInputs.length === 0) {
            alert("Поле ввода не найдено! Откройте страницу с таском и попробуйте снова.");
            return;
        }

        const input = visibleInputs[0];
        // Формируем селектор (по ID или по Name)
        targetInputSelector = input.id ? `#${input.id}` : `input[name="${input.name}"]`;
        
        const scriptUrl = prompt("Снимок поля сделан ("+targetInputSelector+").\nВставьте URL вашего скрипта (или оставьте пустым для проверки локально):");
        
        if(scriptUrl) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            document.head.appendChild(script);
        }
        
        alert("Демон запущен. Теперь он будет показывать кнопки, когда видит поле " + targetInputSelector);
    };

    /* 5. ДЕМОН (100мс) */
    setInterval(() => {
        if(!targetInputSelector) return;
        
        const input = document.querySelector(targetInputSelector);
        const isVisible = input && input.offsetWidth > 0;

        if(isVisible) {
            document.body.classList.add('latwe-mode');
            // Если старый скрипт создал #toolbox, перемещаем его в нашу панель
            const oldToolbox = document.getElementById('toolbox');
            if(oldToolbox && oldToolbox.parentElement !== panel) {
                panel.appendChild(oldToolbox);
            }
        } else {
            document.body.classList.remove('latwe-mode');
        }
    }, 100);

    console.log("Оболочка-демон готова. Нажми на шестеренку, когда увидишь поле ввода.");
})();
