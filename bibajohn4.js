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
            z-index: 2147483647 !important;
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

    // 3. База кодов (полная версия)
    const codes = [
        { title: 'Customer Returns', roles: [ {name: 'Team Lead', code: 'LRTN'}, {name: 'Unloader', code: 'CRUNLD'}, {name: 'WS', code: 'CRSDCNTF'}, {name: 'Instructor', code: 'CRAMB'}, {name: '5s ', code: 'CR5S'}, {name: 'Speciality PS', code: 'SPPROJ1'}, {name: 'Apparel', code: 'SCRET09'}, {name: 'Speciality', code: 'SCRET03'}, {name: 'Virtual Remove', code: 'SCRET12'}, {name: 'Ekspresy', code: 'SCRFB04'}, {name: 'Unified Grading', code: 'SCRET10'}, {name: 'Ostre', code: 'SCRET02'}, {name: 'CRet sort TTS/TTA', code: 'CRSORT'}, {name: 'Process-guide Cret', code: 'PRGCRET'}, {name: 'Audyt Cret', code: 'CRAUDIT'} ] },
        { title: 'Vendor Returns', roles: [ {name: 'Team Lead', code: 'LVRET'}, {name: 'Waterspider', code: 'VRWS'}, {name: 'Remove' , code: 'VRLQ'}, {name: 'ProblemSolve' , code: 'TRVPS'}, {name: 'INSTRUKTOR', code: 'VRAMB'}, {name: 'Donacja', code: 'ICQDMP'} ] },
        { title: 'Transfer in Dock', roles: [ {name: 'Team Lead', code: 'LRTN'}, {name: 'Waterspider', code: 'CRSDCNTF'}, {name: 'Unloader', code: 'CRUNLD'}, {name: 'Dock Clerk', code: 'RSVDC'}, {name: 'Pit Operator', code: 'CRBPS'} ] },
        { title: 'Transfer Out Ship', roles: [ {name: 'TeamLeader', code: 'TOTOL'}, {name: 'ShippingClerk', code: 'SHPCL'}, {name: 'IndoorMarshal', code: 'OUTCRW'}, {name: 'Sortacja Likwidatorów', code: 'VRSORT'}, {name: 'PIT', code: 'MTTL'}, {name: 'ErgoPack', code: 'TOPACK'}, {name: 'SortacjaHazmaty', code: 'PSTOPS'} ] },
        { title: 'WHD', roles: [ {name: 'Team Lead', code: 'LPAWD'}, {name: 'WS', code: 'WHDWTSP'}, {name: 'Audyt', code: 'WDQA'}, {name: 'Sort', code: 'WDSORT'}, {name: 'Problem Solve', code: 'WDPS'}, {name: 'Telefony', code: 'WDGRADA'}, {name: 'Rutery', code: 'WDGRADC'}, {name: 'BMVD', code: 'BKGRD'}, {name: 'Memory items', code: 'DSKGRD'}, {name: 'Non Tech Grading', code: 'HLGRD'}, {name: 'TechGrading ID7', code: 'TECHGR'}, {name: 'Memory items DYSKI', code: 'WDREBX'}, {name: 'Drones', code: 'CEGRAD'}, {name: 'Cameras', code: 'CAMGRAD'}, {name: 'Audio', code: 'AUDGRAD'}, {name: 'PC components', code: 'PCACGRAD'}, {name: 'Consoles, Gaming Gear', code: 'GAMGRAD'} ] },
        { title: 'Refurb', roles: [ {name: 'Process Guide ', code: 'PRGCRET'}, {name: 'Sweeper ', code: 'SCRFB10'}, {name: 'Water Spider ', code: 'CRSDCNTF'}, {name: 'Sort Tool (69)', code: 'SCRFB16'}, {name: 'Manual Sort', code: 'SPPROJI'}, {name: 'Ostre', code: 'SCRFB02 '}, {name: 'HeatGun', code: 'SCRFB08'}, {name: 'ShrinkWrap', code: 'SCRFB01'}, {name: 'REF', code: 'CRETREF'}, {name: 'HG&REF', code: 'SCRFB05 '}, {name: 'Peer Trainer', code: 'SCRFB03'}, {name: 'Apparells', code: 'SCRFB06'}, {name: 'Audyty ', code: 'SCRFB09'} ] },
        { title: 'Speciality', roles: [ {name: 'Audio ', code: 'SCRFB13'}, {name: 'Rutery ', code: 'SCRFB17'}, {name: 'Telefony ', code: 'SCRFB11'}, {name: 'Kamery', code: 'SCRFB15'}, {name: 'SmartWach / GPS', code: 'SCRFB14'}, {name: 'Konsole ', code: 'SCRFB02'}, {name: 'Technicale', code: 'SCRFB12'} ] },
        { title: 'HR/OTHER', roles: [ {name: 'ISTOP', code: 'ISTOP'}, {name: 'MSTOP', code: 'MSTOP'}, {name: 'SEV', code: 'SEV1_2'}, {name: 'RSG', code: 'STNASCSFTCOM'}, {name: 'KSR', code: 'STNFSITR'}, {name: 'ENGAGE', code: 'OPSEMPENG'}, {name: '1:1', code: 'OPSAAENG'}, {name: 'Dodatkowa przerwa', code: 'HRACCOM'}, {name: 'Spotkania z HR', code: 'HRMISC'}, {name: 'Safety Ambassador', code: 'SFTASC'}, {name: 'Over Staffing', code: 'OVERSTA'}, {name: 'Urodziny', code: 'HRGROUP'}, {name: 'Engage', code: 'ENGAGE'} ] }
    ];

    // 4. Поиск первого видимого инпута
    function getFirstVisibleInput() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
        for (let input of inputs) {
            const rect = input.getBoundingClientRect();
            const style = window.getComputedStyle(input);
            if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0') {
                return input;
            }
        }
        return null;
    }

    // 5. Усиленная логика вставки текста и отправки
    function fillAndSubmit(code) {
        const input = getFirstVisibleInput();
        if (!input) {
            console.warn("Видимое поле ввода не найдено на этой странице!");
            return;
        }

        input.focus();
        
        // Вставляем текст
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, code);
        } else {
            input.value = code;
        }
        
        // Оповещаем сайт об изменении
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Действие 1: Пробуем отправить классическую форму (если она есть)
        const form = input.closest('form');
        if (form) {
            try {
                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    form.submit();
                }
            } catch (e) {
                console.warn("Не удалось отправить через форму, переходим к эмуляции Enter", e);
            }
        }

        // Действие 2: С микрозадержкой эмулируем полное нажатие Enter
        // Timeout нужен, чтобы браузер/фреймворк успел "переварить" вставленный текст
        setTimeout(() => {
            const enterEvents = [
                new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 }),
                new KeyboardEvent('keypress', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 }),
                new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 })
            ];
            
            enterEvents.forEach(ev => input.dispatchEvent(ev));
            console.log("Данные отправлены. Код:", code);
        }, 50); 
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

    // 7. Навешиваем обработчики
    toolbox.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            const code = this.getAttribute('data-code');
            fillAndSubmit(code);
        });
    });

    console.log("Универсальный скрипт LatweTaski загружен!");
})();
