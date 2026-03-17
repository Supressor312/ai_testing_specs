(function () {
    // 1. Защита от двойного запуска
    if (window.universalTaskiDaemon) return;
    window.universalTaskiDaemon = true;

    // 2. Внедрение стилей и анимаций
    const css = document.createElement("style");
    css.innerHTML = `
        /* Сужаем основной контент */
        html, body {
            width: calc(100% - 320px) !important;
            overflow-x: hidden !important;
        }
        
        /* Анимация пульсации */
        @keyframes pulse-green {
            0% { box-shadow: 0 0 2px rgba(50, 205, 50, 0.2); border-color: inherit; }
            50% { box-shadow: 0 0 15px rgba(50, 205, 50, 0.9), 0 0 5px rgba(50, 205, 50, 0.5); border-color: #32cd32 !important; }
            100% { box-shadow: 0 0 2px rgba(50, 205, 50, 0.2); border-color: inherit; }
        }

        .latwe-target-input {
            animation: pulse-green 4s infinite ease-in-out !important;
            transition: all 0.5s ease !important;
            outline: none !important;
        }

        /* Универсальная боковая панель */
        #universal-toolbox {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 320px !important;
            height: 100vh !important;
            background: #f4f4f4 !important;
            border-left: 3px solid #32cd32 !important;
            z-index: 2147483647 !important;
            overflow-y: auto !important;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1) !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            color: #333 !important;
            padding: 15px !important;
            box-sizing: border-box !important;
        }
        #universal-toolbox .row { margin-bottom: 20px; }
        #universal-toolbox .row > h1 {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            text-align: center;
        }
        #universal-toolbox .roles {
            display: flex;
            flex-flow: row wrap;
            gap: 6px;
        }
        #universal-toolbox button.role-btn {
            flex: 1 1 calc(50% - 6px);
            padding: 12px 5px;
            font-size: 11px;
            cursor: pointer;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 6px;
            transition: all 0.2s;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        #universal-toolbox button.role-btn:hover { 
            background: #32cd32; 
            color: white; 
            border-color: #32cd32;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(50, 205, 50, 0.3);
        }
        #universal-toolbox button.role-btn:active { transform: translateY(0); }
    `;
    document.head.appendChild(css);

    // 3. База кодов
    const codes = [
        { title: 'Customer Returns', roles: [ {name: 'Team Lead', code: 'LRTN'}, {name: 'Unloader', code: 'CRUNLD'}, {name: 'WS', code: 'CRSDCNTF'}, {name: 'Instructor', code: 'CRAMB'}, {name: '5s ', code: 'CR5S'}, {name: 'Speciality PS', code: 'SPPROJ1'}, {name: 'Apparel', code: 'SCRET09'}, {name: 'Speciality', code: 'SCRET03'}, {name: 'Virtual Remove', code: 'SCRET12'}, {name: 'Ekspresy', code: 'SCRFB04'}, {name: 'Unified Grading', code: 'SCRET10'}, {name: 'Ostre', code: 'SCRET02'}, {name: 'CRet sort TTS/TTA', code: 'CRSORT'}, {name: 'Process-guide Cret', code: 'PRGCRET'}, {name: 'Audyt Cret', code: 'CRAUDIT'} ] },
        { title: 'Vendor Returns', roles: [ {name: 'Team Lead', code: 'LVRET'}, {name: 'Waterspider', code: 'VRWS'}, {name: 'Remove' , code: 'VRLQ'}, {name: 'ProblemSolve' , code: 'TRVPS'}, {name: 'INSTRUKTOR', code: 'VRAMB'}, {name: 'Donacja', code: 'ICQDMP'} ] },
        { title: 'Transfer in Dock', roles: [ {name: 'Team Lead', code: 'LRTN'}, {name: 'Waterspider', code: 'CRSDCNTF'}, {name: 'Unloader', code: 'CRUNLD'}, {name: 'Dock Clerk', code: 'RSVDC'}, {name: 'Pit Operator', code: 'CRBPS'} ] },
        { title: 'Transfer Out Ship', roles: [ {name: 'TeamLeader', code: 'TOTOL'}, {name: 'ShippingClerk', code: 'SHPCL'}, {name: 'IndoorMarshal', code: 'OUTCRW'}, {name: 'Sortacja Likwidatorów', code: 'VRSORT'}, {name: 'PIT', code: 'MTTL'}, {name: 'ErgoPack', code: 'TOPACK'}, {name: 'SortacjaHazmaty', code: 'PSTOPS'} ] },
        { title: 'WHD', roles: [ {name: 'Team Lead', code: 'LPAWD'}, {name: 'WS', code: 'WHDWTSP'}, {name: 'Audyt', code: 'WDQA'}, {name: 'Sort', code: 'WDSORT'}, {name: 'Problem Solve', code: 'WDPS'}, {name: 'Telefony', code: 'WDGRADA'}, {name: 'Rutery', code: 'WDGRADC'}, {name: 'BMVD', code: 'BKGRD'}, {name: 'Memory items', code: 'DSKGRD'}, {name: 'Non Tech Grading', code: 'HLGRD'}, {name: 'TechGrading ID7', code: 'TECHGR'}, {name: 'Memory items DYSKI', code: 'WDREBX'}, {name: 'Drones', code: 'CEGRAD'}, {name: 'Cameras', code: 'CAMGRAD'}, {name: 'Audio', code: 'AUDGRAD'}, {name: 'PC components', code: 'PCACGRAD'}, {name: 'Consoles, Gaming Gear', code: 'GAMGRAD'} ] },
        { title: 'Refurb', roles: [ {name: 'Process Guide ', code: 'PRGCRET'}, {name: 'Sweeper ', code: 'SCRFB10'}, {name: 'Water Spider ', code: 'CRSDCNTF'}, {name: 'Sort Tool (69)', code: 'SCRFB16'}, {name: 'Manual Sort', code: 'SPPROJI'}, {name: 'Ostre', code: 'SCRFB02 '}, {name: 'HeatGun', code: 'SCRFB08'}, {name: 'ShrinkWrap', code: 'SCRFB01'}, {name: 'REF', code: 'CRETREF'}, {name: 'HG&REF', code: 'SCRFB05 '}, {name: 'Peer Trainer', code: 'SCRFB03'}, {name: 'Apparells', code: 'SCRFB06'}, {name: 'Audyty ', code: 'SCRFB09'} ] },
        { title: 'Speciality', roles: [ {name: 'Audio ', code: 'SCRFB13'}, {name: 'Rutery ', code: 'SCRFB17'}, {name: 'Telefony ', code: 'SCRFB11'}, {name: 'Kamery', code: 'SCRFB15'}, {name: 'SmartWach / GPS', code: 'SCRFB14'}, {name: 'Konsole ', code: 'SCRFB02'}, {name: 'Technicale', code: 'SCRFB12'} ] },
        { title: 'HR/OTHER', roles: [ {name: 'ISTOP', code: 'ISTOP'}, {name: 'MSTOP', code: 'MSTOP'}, {name: 'SEV', code: 'SEV1_2'}, {name: 'RSG', code: 'STNASCSFTCOM'}, {name: 'KSR', code: 'STNFSITR'}, {name: 'ENGAGE', code: 'OPSEMPENG'}, {name: '1:1', code: 'OPSAAENG'}, {name: 'Dodatkowa przerва', code: 'HRACCOM'}, {name: 'Spotkania з HR', code: 'HRMISC'}, {name: 'Safety Ambassador', code: 'SFTASC'}, {name: 'Over Staffing', code: 'OVERSTA'}, {name: 'Urodziny', code: 'HRGROUP'}, {name: 'Engage', code: 'ENGAGE'} ] }
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

    // 5. Механизм фонового отслеживания поля ввода
    let currentTargetInput = null;

    setInterval(() => {
        const input = getFirstVisibleInput();
        
        if (input !== currentTargetInput) {
            // Если цель сменилась, убираем подсветку со старой
            if (currentTargetInput) {
                currentTargetInput.classList.remove('latwe-target-input');
            }
            // Вешаем на новую
            if (input) {
                input.classList.add('latwe-target-input');
                console.log("Новое поле захвачено скриптом");
            }
            currentTargetInput = input;
        }
    }, 1000); // Раз в секунду проверяем наличие полей

    // 6. Усиленная логика вставки и мгновенной отправки
    function fillAndSubmit(code) {
        const input = currentTargetInput || getFirstVisibleInput();
        if (!input) return;

        input.focus();
        
        // Вставляем текст (обход React)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, code);
        } else {
            input.value = code;
        }
        
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Действие 1: Отправка через форму
        const form = input.closest('form');
        if (form) {
            try {
                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    form.submit();
                }
            } catch (e) {}
        }

        // Действие 2: Сверхбыстрая эмуляция Enter (через 50мс)
        setTimeout(() => {
            const events = ['keydown', 'keypress', 'keyup'];
            events.forEach(type => {
                input.dispatchEvent(new KeyboardEvent(type, {
                    bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13
                }));
            });
        }, 50); 
    }

    // 7. Построение интерфейса
    const toolbox = document.createElement('div');
    toolbox.id = "universal-toolbox";
    
    let toolboxHTML = '<div style="text-align:center; margin-bottom:15px; font-weight:bold; color:#32cd32;">● SCANNER READY</div>';
    for (let shift of codes) {
        toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
        for (let role of shift.roles) {
            toolboxHTML += '<button class="role-btn" data-code="' + role.code + '">' + role.name + '</button>';
        }
        toolboxHTML += '</div></div>';
    }
    toolbox.innerHTML = toolboxHTML;
    document.documentElement.appendChild(toolbox);

    // 8. Обработчики событий
    toolbox.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            fillAndSubmit(this.getAttribute('data-code'));
        });
    });

    console.log("Универсальный скрипт с визуальным захватом цели запущен!");
})();
