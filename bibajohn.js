(function () {
    // 1. Защита от двойного запуска
    if (window.latweTaskiRunning) {
        console.log("LatweTaski");
        return;
    }
    window.latweTaskiRunning = true;

    // 2. Внедрение стилей (с проверкой на существование)
    if (!document.getElementById("latwe-styles")) {
        const css = document.createElement("style");
        css.id = "latwe-styles";
        css.innerHTML = `
            #body {
                display: flex;
                flex-flow: row nowrap;
                align-content: space-around;
                justify-content: space-around;
            }
            #body > .login {
                margin: 10px;
                width: 25%;
                max-width: 300px;
                max-height: 450px;
            }
            #latwe-toolbox {
                flex-grow: 9;
                font-size: 100%;
                display: flex;
                flex-flow: column nowrap;
                align-content: center;
                justify-content: center;
                overflow-y: auto;
                max-height: 90vh;
                padding-left: 20px;
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
                flex-flow: row wrap; /* Изменил на wrap, чтобы кнопки не уезжали за экран */
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
    }

    // 3. База кодов
    const codes = [
        {
            title: 'Customer Returns',
            roles: [
                {name: 'Team Lead', code: 'LRTN'}, {name: 'Unloader', code: 'CRUNLD'},
                {name: 'WS', code: 'CRSDCNTF'}, {name: 'Instructor', code: 'CRAMB'},
                {name: '5s ', code: 'CR5S'}, {name: 'Speciality PS', code: 'SPPROJ1'},
                {name: 'Apparel', code: 'SCRET09'}, {name: 'Speciality', code: 'SCRET03'},
                {name: 'Virtual Remove', code: 'SCRET12'}, {name: 'Ekspresy', code: 'SCRFB04'},
                {name: 'Unified Grading', code: 'SCRET10'}, {name: 'Ostre', code: 'SCRET02'},
                {name: 'CRet sort TTS/TTA', code: 'CRSORT'}, {name: 'Process-guide Cret', code: 'PRGCRET'},
                {name: 'Audyt Cret', code: 'CRAUDIT'},
            ]
        },
        {
            title: 'Vendor Returns',
            roles: [
                {name: 'Team Lead', code: 'LVRET'}, {name: 'Waterspider', code: 'VRWS'},
                {name: 'Remove' , code: 'VRLQ'}, {name: 'ProblemSolve' , code: 'TRVPS'},
                {name: 'INSTRUKTOR', code: 'VRAMB'}, {name: 'Donacja', code: 'ICQDMP'},
            ]
        },
        {
            title: 'Transfer in Dock',
            roles: [
                {name: 'Team Lead', code: 'LRTN'}, {name: 'Waterspider', code: 'CRSDCNTF'},
                {name: 'Unloader', code: 'CRUNLD'}, {name: 'Dock Clerk', code: 'RSVDC'},
                {name: 'Pit Operator', code: 'CRBPS'},
            ]
        },
        {
            title: 'Transfer Out Ship',
            roles: [
                {name: 'TeamLeader', code: 'TOTOL'}, {name: 'ShippingClerk', code: 'SHPCL'},
                {name: 'IndoorMarshal', code: 'OUTCRW'}, {name: 'Sortacja Likwidatorów', code: 'VRSORT'},
                {name: 'PIT', code: 'MTTL'}, {name: 'ErgoPack', code: 'TOPACK'},
                {name: 'SortacjaHazmaty', code: 'PSTOPS'},
            ]
        },
        {
            title: 'WHD',
            roles: [
                {name: 'Team Lead', code: 'LPAWD'}, {name: 'WS', code: 'WHDWTSP'},
                {name: 'Audyt', code: 'WDQA'}, {name: 'Sort', code: 'WDSORT'},
                {name: 'Problem Solve', code: 'WDPS'}, {name: 'Telefony', code: 'WDGRADA'},
                {name: 'Rutery', code: 'WDGRADC'}, {name: 'BMVD', code: 'BKGRD'},
                {name: 'Memory items', code: 'DSKGRD'}, {name: 'Non Tech Grading', code: 'HLGRD'},
                {name: 'TechGrading ID7', code: 'TECHGR'}, {name: 'Memory items DYSKI', code: 'WDREBX'},
                {name: 'Drones', code: 'CEGRAD'}, {name: 'Cameras', code: 'CAMGRAD'},
                {name: 'Audio', code: 'AUDGRAD'}, {name: 'PC components', code: 'PCACGRAD'},
                {name: 'Consoles, Gaming Gear', code: 'GAMGRAD'},
            ]
        },
        {
            title: 'Refurb',
            roles: [
                {name: 'Process Guide ', code: 'PRGCRET'}, {name: 'Sweeper ', code: 'SCRFB10'},
                {name: 'Water Spider ', code: 'CRSDCNTF'}, {name: 'Sort Tool (69)', code: 'SCRFB16'},
                {name: 'Manual Sort', code: 'SPPROJI'}, {name: 'Ostre', code: 'SCRFB02'},
                {name: 'HeatGun', code: 'SCRFB08'}, {name: 'ShrinkWrap', code: 'SCRFB01'},
                {name: 'REF', code: 'CRETREF'}, {name: 'HG&REF', code: 'SCRFB05 '},
                {name: 'Peer Trainer', code: 'SCRFB03'}, {name: 'Apparells', code: 'SCRFB06'},
                {name: 'Audyty ', code: 'SCRFB09'},
            ]
        },
        {
            title: 'Speciality',
            roles: [
                {name: 'Audio ', code: 'SCRFB13'}, {name: 'Rutery ', code: 'SCRFB17'},
                {name: 'Telefony ', code: 'SCRFB11'}, {name: 'Kamery', code: 'SCRFB15'},
                {name: 'SmartWach / GPS', code: 'SCRFB14'}, {name: 'Konsole ', code: 'SCRFB02'},
                {name: 'Technicale', code: 'SCRFB12'},
            ]
        },
        {
            title: 'HR/OTHER',
            roles: [
                {name: 'ISTOP', code: 'ISTOP'}, {name: 'MSTOP', code: 'MSTOP'},
                {name: 'SEV', code: 'SEV1_2'}, {name: 'RSG', code: 'STNASCSFTCOM'},
                {name: 'KSR', code: 'STNFSITR'}, {name: 'ENGAGE', code: 'OPSEMPENG'},
                {name: '1:1', code: 'OPSAAENG'}, {name: 'Dodatkowa przerwa', code: 'HRACCOM'},
                {name: 'Spotkania z HR', code: 'HRMISC'}, {name: 'Safety Ambassador', code: 'SFTASC'},
                {name: 'Over Staffing', code: 'OVERSTA'}, {name: 'Urodziny', code: 'HRGROUP'},
                {name: 'Engage', code: 'ENGAGE'},
            ]
        }
    ];

    // 4. Логика отправки (с защитой от пропажи формы)
    function submitTask(code) {
        const inputField = document.getElementById('calmCode');
        const form = document.querySelector('form[action="/do/laborTrackingKiosk"]');

        if (inputField && form) {
            // Идеальный сценарий: форма и поле на месте
            inputField.value = code;
            form.submit();
        } else {
            // Резервный сценарий: интерфейс пропал. Создаем виртуальную форму.
            console.log("Оригинальная форма не найдена. Создаю виртуальную отправку для кода: " + code);
            const fallbackForm = document.createElement('form');
            fallbackForm.method = 'POST';
            fallbackForm.action = '/do/laborTrackingKiosk';

            const whId = document.createElement('input');
            whId.type = 'hidden';
            whId.name = 'warehouseId';
            whId.value = 'LCJ4'; // Значение из твоего HTML

            const calmInput = document.createElement('input');
            calmInput.type = 'hidden';
            calmInput.name = 'calmCode';
            calmInput.value = code;

            fallbackForm.appendChild(whId);
            fallbackForm.appendChild(calmInput);
            document.body.appendChild(fallbackForm);
            fallbackForm.submit();
        }
    }

    // 5. Функция построения UI
    function renderToolbox() {
        const bodyEl = document.getElementById('body');
        if (!bodyEl) return; // Если самого тела нет, ждем

        // Если тулбокс уже есть, ничего не делаем
        if (document.getElementById('latwe-toolbox')) return;

        const toolbox = document.createElement('div');
        toolbox.id = "latwe-toolbox";
        
        let toolboxHTML = '';
        for (let shift of codes) {
            toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
            for (let role of shift.roles) {
                toolboxHTML += '<button class="role-btn" data-code="' + role.code + '">' + role.name + '</button>';
            }
            toolboxHTML += '</div></div>';
        }
        toolbox.innerHTML = toolboxHTML;
        bodyEl.appendChild(toolbox);

        // Навешиваем обработчики кликов
        const buttons = toolbox.querySelectorAll('.role-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                submitTask(this.getAttribute('data-code'));
            });
        });
    }

    // 6. Непрерывная проверка (Core Loop)
    // Раз в 500мс скрипт проверяет, не сломал ли сайт нашу верстку, и чинит ее.
    setInterval(() => {
        // Убираем кривые стили у логин-бокса, если они появляются
        const loginBox = document.querySelector('#body > .login');
        if (loginBox && loginBox.style.length > 0) {
            loginBox.removeAttribute('style');
        }
        
        // Отрисовываем тулбокс, если он пропал
        renderToolbox();
    }, 500);

    console.log("LatweTaski");
})();
