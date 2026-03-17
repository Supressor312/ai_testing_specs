(function () {
    // 1. Защита от двойного запуска
    if (window.universalTaskiDaemon) return;
    window.universalTaskiDaemon = true;

    // 2. Внедрение универсальных стилей
    const css = document.createElement("style");
    css.innerHTML = `
        /* Сужаем основной контент, чтобы освободить место справа */
        html, body {
            width: calc(100% - 320px) !important;
            overflow-x: hidden !important;
        }
        
        /* Универсальная боковая панель */
        #universal-toolbox {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 320px !important;
            height: 100vh !important;
            background: #f9f9f9 !important;
            border-left: 2px solid #ccc !important;
            z-index: 2147483647 !important; /* Максимально возможный z-index */
            overflow-y: auto !important;
            box-shadow: -2px 0 10px rgba(0,0,0,0.2) !important;
            font-family: Arial, sans-serif !important;
            color: #333 !important;
            padding: 15px !important;
            box-sizing: border-box !important;
        }
        #universal-toolbox .row { margin-bottom: 15px; }
        #universal-toolbox .row > h1 {
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin: 0 0 10px 0;
            text-align: center;
        }
        #universal-toolbox .roles {
            display: flex;
            flex-flow: row wrap;
            gap: 5px;
        }
        #universal-toolbox button.role-btn {
            flex: 1 1 calc(50% - 5px);
            padding: 10px 5px;
            font-size: 12px;
            cursor: pointer;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: background 0.2s;
            text-align: center;
            font-weight: bold;
        }
        #universal-toolbox button.role-btn:hover { background: #3cb0fd; color: white; border-color: #3cb0fd; }
    `;
    document.head.appendChild(css);

    // 3. База кодов
    const codes = [
        { title: 'Customer Returns', roles: [ {name: 'Team Lead', code: 'LRTN'}, {name: 'Unloader', code: 'CRUNLD'}, {name: 'WS', code: 'CRSDCNTF'}, {name: 'Instructor', code: 'CRAMB'}, {name: '5s ', code: 'CR5S'} ] },
        { title: 'Vendor Returns', roles: [ {name: 'Team Lead', code: 'LVRET'}, {name: 'Waterspider', code: 'VRWS'}, {name: 'Remove' , code: 'VRLQ'}, {name: 'ProblemSolve' , code: 'TRVPS'} ] },
        { title: 'HR/OTHER', roles: [ {name: 'ISTOP', code: 'ISTOP'}, {name: 'SEV', code: 'SEV1_2'}, {name: 'Engage', code: 'ENGAGE'} ] }
        // Я сократил список для удобства, можешь вернуть полный массив из своего оригинала
    ];

    // 4. Поиск первого видимого инпута
    function getFirstVisibleInput() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
        for (let input of inputs) {
            const rect = input.getBoundingClientRect();
            const style = window.getComputedStyle(input);
            // Проверяем, что элемент физически занимает место на экране и не скрыт
            if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0') {
                return input;
            }
        }
        return null;
    }

    // 5. Логика вставки текста и эмуляции Enter
    function fillAndSubmit(code) {
        const input = getFirstVisibleInput();
        if (!input) {
            console.warn("Видимое поле ввода не найдено на этой странице!");
            alert("Поле ввода не найдено!");
            return;
        }

        input.focus();
        
        // Хак для обхода защиты React/Vue (они игнорируют обычное input.value = '...')
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, code);
        } else {
            input.value = code;
        }
        
        // Инициируем события ввода, чтобы сайт понял, что текст изменился
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Пытаемся найти форму и отправить её
        const form = input.closest('form');
        if (form) {
            if (typeof form.requestSubmit === 'function') {
                form.requestSubmit(); // Правильный метод для HTML5 (учитывает валидацию)
            } else {
                form.submit();
            }
            console.log("Форма отправлена с кодом:", code);
        } else {
            // Если инпут висит без формы (как поиск на YouTube), эмулируем нажатие клавиши Enter
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13
            });
            input.dispatchEvent(enterEvent);
            console.log("Сэмулировано нажатие Enter с кодом:", code);
        }
    }

    // 6. Построение UI
    const toolbox = document.createElement('div');
    toolbox.id = "universal-toolbox";
    
    let toolboxHTML = '';
    for (let shift of codes) {
        toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
        for (let role of shift.roles) {
            toolboxHTML += '<button class="role-btn" data-code="' + role.code + '">' + role.name + '</button>';
        }
        toolboxHTML += '</div></div>';
    }
    toolbox.innerHTML = toolboxHTML;
    document.documentElement.appendChild(toolbox);

    // 7. Навешиваем обработчики на кнопки
    toolbox.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем дефолтное поведение кнопки
            const code = this.getAttribute('data-code');
            fillAndSubmit(code);
        });
    });

    console.log("Универсальный скрипт успешно загружен!");
})();
