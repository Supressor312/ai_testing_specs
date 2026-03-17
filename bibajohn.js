(function () {
    // 1. Защита от двойного запуска демона
    if (window.latweTaskiDaemon) return;
    window.latweTaskiDaemon = true;

    // 2. Внедрение стилей
    const css = document.createElement("style");
    css.innerHTML = `
        /* Стили, которые применяются только когда мы вешаем класс .latwe-active на body */
        #body.latwe-active {
            display: flex !important;
            flex-flow: row nowrap !important;
            align-content: space-around !important;
            justify-content: space-around !important;
        }
        #body.latwe-active > .login {
            margin: 10px;
            width: 25%;
            max-width: 300px;
            max-height: 450px;
        }
        
        /* Стили нашей панели */
        #latwe-toolbox {
            flex-grow: 9;
            font-size: 100%;
            display: flex;
            flex-flow: column nowrap;
            align-content: center;
            justify-content: center;
            overflow-y: auto;
            max-height: 100vh;
            padding-left: 20px;
        }
        #latwe-toolbox.hidden {
            display: none !important;
        }
        #latwe-toolbox .row { margin-bottom: 10px; }
        #latwe-toolbox .row > h1 {
            align-content: center;
            padding: 10px;
            margin: auto;
            width: 50%;
            font-size: 1.2rem;
            border-bottom: 2px solid #ccc;
        }
        #latwe-toolbox .roles {
            display: flex;
            flex-flow: row wrap;
            align-content: space-between;
            justify-content: start;
            padding: 5px 8px;
        }
        #latwe-toolbox button.role-btn {
            margin: .25rem;
            align-items: center;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: .25rem;
            box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
            box-sizing: border-box;
            color: rgba(0, 0, 0, 0.85);
            cursor: pointer;
            display: inline-flex;
            font-size: 14px;
            font-weight: 600;
            justify-content: center;
            line-height: 1.15;
            min-height: 3rem;
            padding: 0 15px;
            position: relative;
            text-decoration: none;
            transition: all 250ms;
            background: #f0f0f0;
        }
        #latwe-toolbox button.role-btn:hover { background: #3cb0fd; color: white; }
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
        { title: 'HR/OTHER', roles: [ {name: 'ISTOP', code: 'ISTOP'}, {name: 'MSTOP', code: 'MSTOP'}, {name: 'SEV', code: 'SEV1_2'}, {name: 'RSG', code: 'STNASCSFTCOM'}, {name: 'KSR', code: 'STNFSITR'}, {name: 'ENGAGE', code: 'OPSEMPENG'}, {name: '1:1', code: 'OPSAAENG'}, {name: 'Dodatkowa przerwa', code: 'HRACCOM'}, {name: 'Spotkania z HR', code: 'HRMISC'}, {name: 'Safety Ambassador', code: 'SFTASC'}, {name: 'Over Staffing', code: 'OVERSTA'}, {name: 'Urodziny', code: 'HRGROUP'}, {name: 'Engage', code: 'ENGAGE'} ] }
    ];

    // 4. Логика генерации UI кнопок
    function buildToolbox() {
        const toolbox = document.createElement('div');
        toolbox.id = "latwe-toolbox";
        toolbox.className = "hidden"; // По умолчанию скрыто
        
        let toolboxHTML = '';
        for (let shift of codes) {
            toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
            for (let role of shift.roles) {
                toolboxHTML += '<button class="role-btn" data-code="' + role.code + '">' + role.name + '</button>';
            }
            toolboxHTML += '</div></div>';
        }
        toolbox.innerHTML = toolboxHTML;
        
        // Навешиваем клики
        toolbox.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const input = document.getElementById('calmCode');
                const form = document.querySelector('form[action="/do/laborTrackingKiosk"]');
                
                if (input && form) {
                    input.value = code;
                    form.submit();
                }
            });
        });
        
        document.getElementById('body').appendChild(toolbox);
        return toolbox;
    }

    // 5. Демон: проверка состояния каждые 100мс
    setInterval(() => {
        const bodyEl = document.getElementById('body');
        if (!bodyEl) return;

        let toolbox = document.getElementById('latwe-toolbox');
        if (!toolbox) {
            toolbox = buildToolbox(); // Генерируем, если сайт удалил наши кнопки
        }

        // Ключевая логика: ищем инпут и проверяем, для таска ли он
        const calmInput = document.getElementById('calmCode');
        const header = document.getElementById('calmCodeGuidance');
        
        let isTaskStep = false;

        if (calmInput) {
            // Проверяем по плейсхолдеру ИЛИ по заголовку над ним
            const placeholder = calmInput.placeholder || "";
            const headerText = header ? header.innerText : "";
            
            if (placeholder.includes('Kod pracy') || headerText.includes('Zeskanuj kod pracy')) {
                isTaskStep = true;
            }
        }

        // Если это окно ввода таска — применяем магию
        if (isTaskStep) {
            bodyEl.classList.add('latwe-active'); // Включаем Flex сдвиг влево
            toolbox.classList.remove('hidden');   // Показываем кнопки
            
            // Защита от кривых встроенных стилей Amazon, которые могут ломать вёрстку
            const loginBox = document.querySelector('#body > .login');
            if (loginBox && loginBox.style.cssText) {
                loginBox.style.cssText = ''; 
            }
        } else {
            // Если это окно бейджика, или окно пропало — возвращаем оригинальный вид
            bodyEl.classList.remove('latwe-active'); // Убираем сдвиг, возвращаем центрирование
            toolbox.classList.add('hidden');         // Прячем кнопки
        }

    }, 100);

    console.log("Daemon LatweTaski works!");
})();
