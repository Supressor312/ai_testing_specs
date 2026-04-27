// ==UserScript==
// @name         StatsHelper (Reactive Architecture Edition)
// @namespace    bomba.stats.helper
// @version      8.0.0
// @description  Principal Engineered UserScript with Reactive State, EventBus, and CSS Variables
// @match        https://trex-prod-eu.aka.amazon.com/*
// @run-at       document-end
// @sandbox      raw
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. CORE CONSTANTS & CONFIGURATION
    // ==========================================
    const CONFIG = {
        SCRIPT_VERSION: '8.0.0',
        SCRIPT_NAME: 'Helper (Reactive)',
        SCRIPT_ID_PREFIX: 'statsHelper_v8_0_0_',
        DEBUG_MODE: true,
        UI_UPDATE_INTERVAL_MS: 1000,
        FONT_FAMILY_OPTIONS: {
            default: 'Segoe UI, Roboto, Arial, sans-serif',
            monospace: 'Consolas, Monaco, Courier New, monospace',
            sans_serif_thin: 'Roboto, Helvetica Neue, Arial, sans-serif',
        },
        SETTINGS_PANEL_BACKGROUND_COLOR: 'rgba(245, 245, 245, 0.95)',
        SETTINGS_PANEL_TEXT_COLOR: '#141414',
        SETTINGS_PANEL_ACCENT_COLOR: '#141414',
        SETTINGS_PANEL_INITIAL_WIDTH_PX: 450,
        SETTINGS_PANEL_MIN_WIDTH_PX: 380,
        SETTINGS_PANEL_MAX_WIDTH_PX: 1000,
        SETTINGS_PANEL_ACCESS_SEQUENCE:['B', 'O', 'M', 'B', 'A'],
        KNOWN_TAB_TYPES: {
            CRET: { key: 'CRET', displayNameKey: 'tabName_CRET', baseColorHex: '#0078D7', urlKeyword: 'CRETURN' },
            REFURB: { key: 'REFURB', displayNameKey: 'tabName_REFURB', baseColorHex: '#FFA500', urlKeyword: 'CRETURN_REFURB' },
            WHD: { key: 'WHD', displayNameKey: 'tabName_WHD', baseColorHex: '#1EB41E', urlKeyword: 'WAREHOUSE_DEALS' },
        },
        UNKNOWN_TAB_TYPE_KEY: 'UNKNOWN',
        DEFAULT_UNKNOWN_TAB_DETAILS: { key: 'UNKNOWN', displayNameKey: 'tabName_UNKNOWN', baseColorHex: '#808080' },
        UNKNOWN_TAB_INSTANCE_ID_PREFIX: 'unknownTabInstance_',
        MAX_PAGE_OVERLAY_OPACITY_PERCENT: 15,
        SHIFT_TIMES_UTC_PLUS_2: {
            DAY_SHIFT_START_H: 6, DAY_SHIFT_START_M: 19, DAY_SHIFT_END_H: 17, DAY_SHIFT_END_M: 55,
            NIGHT_SHIFT_START_H: 18, NIGHT_SHIFT_START_M: 19, NIGHT_SHIFT_END_H: 5, NIGHT_SHIFT_END_M: 55,
        },
        DEFAULT_CALCULATION_START_TIMES: { DAY: { H: 6, M: 30 }, NIGHT: { H: 18, M: 30 } },
        LUNCH_OPTIONS_BASE:[
            { text_key: 'lunch_day1', start: '1120', end: '1150', type: 'day' },
            { text_key: 'lunch_day2', start: '1150', end: '1220', type: 'day' },
            { text_key: 'lunch_day3', start: '1220', end: '1250', type: 'day' },
            { text_key: 'lunch_day4', start: '1250', end: '1320', type: 'day' },
            { text_key: 'lunch_night1', start: '2320', end: '2350', type: 'night' },
            { text_key: 'lunch_night2', start: '2350', end: '0020', type: 'night' },
            { text_key: 'lunch_night3', start: '0020', end: '0050', type: 'night' },
            { text_key: 'lunch_night4', start: '0050', end: '0120', type: 'night' },
        ],
        DEFAULT_LUNCH_INDEX_DAY: 3,
        DEFAULT_LUNCH_INDEX_NIGHT: 7,
        STORAGE_KEY_USER_CONFIG: 'userConfig',
        STORAGE_KEY_SESSION_CONFIG: 'sessionConfig',
        STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS: 'allLocalTabConfigs',
        STORAGE_PREFIX_TAB_COUNTER: 'counter_',
        SESSION_STORAGE_TAB_INSTANCE_ID_KEY: 'tabInstanceId',
        SYNC_INTERVAL_MS: 2300,
        SYNC_JITTER_MS: 1000,
        PRE_TRIGGER_REGEX: /poniżej|видите ниже|Transparency/i,
        AUTO_TRIGGER_REGEX: /Przypisz (nowy|ponownie)|канирование номера LP:|Przedmiot wysłano do (?!PROBLEM-SOLVE\b).+/i,
        TRIGGER_OBSERVE_AREA_SELECTOR: 'body',
        DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS: 50,
        MIN_TRIGGER_DEBOUNCE_MS: 50,
        MAX_TRIGGER_DEBOUNCE_MS: 200,
        AVAILABLE_SHORTCUT_KEYS:[
            { code: 'None', name_key: 'key_None' }, { code: 'ShiftRight', name_key: 'key_ShiftRight' },
            { code: 'ControlRight', name_key: 'key_ControlRight' }, { code: 'AltRight', name_key: 'key_AltRight' },
            { code: 'ScrollLock', name_key: 'key_ScrollLock' }, { code: 'Pause', name_key: 'key_PauseBreak' },
            { code: 'Insert', name_key: 'key_Insert' }, { code: 'Numpad0', name_key: 'key_Numpad0' },
            { code: 'NumpadMultiply', name_key: 'key_NumpadMultiply' }, { code: 'NumpadSubtract', name_key: 'key_NumpadSubtract' },
            { code: 'NumpadAdd', name_key: 'key_NumpadAdd' }, { code: 'F10', name_key: 'key_F10' },
        ],
        DEFAULT_LANGUAGE: 'pl',
        AVAILABLE_LANGUAGES:[{ code: 'pl', name: 'Polski' }, { code: 'en', name: 'English' }, { code: 'ru', name: 'Русский' }],
    };

    // Default configuration for lines (visible, color, alpha (0-100), fontSize, extra sub-configs)
    const DEFAULT_LINE_CONFIG = {
        line1_currentTab: { visible: false, colorHex: '#808080', alpha: 60, fontSize: 14 },
        line2_globalSummary: { 
            visible: true, colorHex: '#808080', alpha: 60, fontSize: 14,
            multicolor: true,
            customColors: { CRET: '#0078D7', REFURB: '#FFA500', WHD: '#1EB41E' }
        },
        line3_shiftInfo: { visible: false, colorHex: '#808080', alpha: 60, fontSize: 14 },
        line4_lunchInfo: { visible: false, colorHex: '#808080', alpha: 60, fontSize: 14 },
        line5_realTimeClock: { visible: false, colorHex: '#808080', alpha: 60, fontSize: 14 }
    };

    const DEFAULT_LOCAL_CONFIG = {
        statsWindowFontFamily: 'monospace',
        linesConfig: JSON.parse(JSON.stringify(DEFAULT_LINE_CONFIG)), // Deep copy
        pageOverlayOpacity: 0,
        pageIndicatorTextVisible: false,
        statsWindowPosition: { top: '0px', left: 'calc(17% - 1px)' },
        statsWindowBgColorHex: '#ffffff',
        statsWindowBgAlpha: 0,
    };

    // ==========================================
    // 2. I18N DICTIONARIES
    // ==========================================
    const LANG_STRINGS = {
        en: {
            scriptLoaded: '${scriptName} v${version} Loaded.', yes: 'Yes', no: 'No', notApplicable: 'NA',
            error_items_per_hour_unavailable: '~0.0/h (short work time)', fromUnit: 'from', inUnit: 'in',
            hoursShort: 'h', minutesShort: 'm', secondsShort: 's', statsPerHourUnit: '/h', completedUnit: 'done',
            tabName_CRET: 'CRET', tabName_REFURB: 'REFURB', tabName_WHD: 'WHD', tabName_UNKNOWN: 'UNKNOWN',
            statsLine1_current: '${tabName} ${itemsPerHour}${statsPerHourUnit} (${count} ${completedUnit} ${inUnit} ${workTimeFormatted})',
            statsLine2_global_separator: ' ',
            statsLine2_global_tab_format: '${tabName} ${itemsPerHour}${statsPerHourUnit}(${count})',
            statsLine2_global_total_format: '= ~${totalItemsPerHour}${statsPerHourUnit} (${totalCount})',
            statsLine3_shift: '${shiftType} Shift (${shiftStartTime})', statsLine4_lunch: 'Lunch #${lunchNumber} (${lunchStartTime} - ${lunchEndTime})',
            statsLine5_clock: '[ ${currentTime} ]', shift_day: 'DAY', shift_night: 'NIGHT',
            lunch_day1: 'Day Lunch 1 (11:20-11:50)', lunch_day2: 'Day Lunch 2 (11:50-12:20)', lunch_day3: 'Day Lunch 3 (12:20-12:50)', lunch_day4: 'Day Lunch 4 (12:50-13:20)',
            lunch_night1: 'Night Lunch 1 (23:20-23:50)', lunch_night2: 'Night Lunch 2 (23:50-00:20)', lunch_night3: 'Night Lunch 3 (00:20-00:50)', lunch_night4: 'Night Lunch 4 (00:50-01:20)',
            settingsPanelTitle: '${scriptName} Settings', settings_applyAndCloseButton: 'Apply & Close', settings_applyButton: 'Apply',
            settings_resetAllDataButton: 'Reset All Script Data', settings_resetWindowPositionButton: 'Reset Window Position',
            settings_manualCounterInputLabel: 'Set count', section_general: 'General', section_currentTab: 'Current Tab Settings (${tabInstanceId})',
            section_visualAids: 'Page Visual Aids (for ${tabName})', section_statsWindow: 'Statistics Window Styling',
            section_globalStats: 'Global Statistics (Known Types)', section_keyboardShortcuts: 'Keyboard Shortcuts',
            section_autoIncrement: 'Auto-Increment', section_lunchSelection: 'Lunch Break Selection', section_otherCustomTabs: 'Other Configured Custom Tabs',
            language: 'Language', customTabDisplayName: 'Display Name', customTabIncludeInGlobal: 'Include this tab in global sum',
            overlayOpacity: 'Overlay Opacity: ${value}%', showPageIndicator: 'Show Page Indicator Text', windowBgSettings: 'Window Background',
            lineSettings_currentTab: 'Line 1: Current Tab Stats', lineSettings_globalSummary: 'Line 2: Global Summary',
            lineSettings_shiftInfo: 'Line 3: Shift Information', lineSettings_lunchInfo: 'Line 4: Lunch Information', lineSettings_realTimeClock: 'Line 5: Real-Time Clock',
            fontFamily: 'Font Family', fontSize: 'Font Size: ${value}px', dragStatsWindowButton: 'Make Stats Window Draggable', dragStatsWindowActiveButton: 'Window is Draggable (Click to Pin)',
            includeInGlobal_known: 'Include ${tabName}', incrementKey: 'Increment (+1) Key', decrementKey: 'Decrement (-1) Key', scanIntervalAutoIncrement: 'Scan Interval: ${value}ms',
            noCustomTabsConfigured: 'No other custom tabs configured yet.', customTabEntryFormat: '${displayName} (${instanceId_short}) - Included: ${isIncludedStr}',
            fontFamily_default: 'Default (System UI)', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Thin Sans-Serif',
            key_None: 'Disabled', key_ShiftRight: 'Right Shift', key_ControlRight: 'Right Ctrl', key_AltRight: 'Right Alt', key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert',
            key_Numpad0: 'Numpad 0', key_NumpadMultiply: 'Numpad *', key_NumpadSubtract: 'Numpad -', key_NumpadAdd: 'Numpad +', key_F10: 'F10',
            initialNotification_currentTab: 'Current Tab:', initialNotification_shiftStart: 'Shift Start:',
            multicolorMode: 'Multi-Color Departments', tabColors: 'Dept. Colors:'
        },
        pl: {
            scriptLoaded: '${scriptName} v${version} Załadowany.', yes: 'Tak', no: 'Nie', notApplicable: 'BD',
            error_items_per_hour_unavailable: '~0.0/h (za krótki czas)', fromUnit: 'od', inUnit: 'w',
            hoursShort: 'g', minutesShort: 'm', secondsShort: 's', statsPerHourUnit: '/h', completedUnit: 'zrobione',
            tabName_CRET: 'CRET', tabName_REFURB: 'REFURB', tabName_WHD: 'WHD', tabName_UNKNOWN: 'NIEZNANA',
            statsLine1_current: '${tabName} ${itemsPerHour}${statsPerHourUnit} (${count} ${completedUnit} ${inUnit} ${workTimeFormatted})',
            statsLine2_global_separator: ' ', statsLine2_global_tab_format: '${tabName} ${itemsPerHour}${statsPerHourUnit}(${count})', statsLine2_global_total_format: '= ~${totalItemsPerHour}${statsPerHourUnit} (${totalCount})',
            statsLine3_shift: '${shiftType} zmiana (${shiftStartTime})', statsLine4_lunch: 'Przerwa #${lunchNumber} (${lunchStartTime} - ${lunchEndTime})', statsLine5_clock: '[ ${currentTime} ]',
            shift_day: 'DZIENNA', shift_night: 'NOCNA', lunch_day1: 'Przerwa dzienna 1 (11:20-11:50)', lunch_day2: 'Przerwa dzienna 2 (11:50-12:20)', lunch_day3: 'Przerwa dzienna 3 (12:20-12:50)', lunch_day4: 'Przerwa dzienna 4 (12:50-13:20)',
            lunch_night1: 'Przerwa nocna 1 (23:20-23:50)', lunch_night2: 'Przerwa nocna 2 (23:50-00:20)', lunch_night3: 'Przerwa nocna 3 (00:20-00:50)', lunch_night4: 'Przerwa nocna 4 (00:50-01:20)',
            settingsPanelTitle: 'Ustawienia ${scriptName}', settings_applyAndCloseButton: 'Zastosuj i Zamknij', settings_applyButton: 'Zastosuj',
            settings_resetAllDataButton: 'Zresetuj Wszystkie Dane', settings_resetWindowPositionButton: 'Zresetuj Pozycję Okna',
            settings_manualCounterInputLabel: 'Ustaw licznik', section_general: 'Ogólne', section_currentTab: 'Ustawienia Bieżącej Karty (${tabInstanceId})',
            section_visualAids: 'Pomoce Wizualne (dla ${tabName})', section_statsWindow: 'Stylizacja Okna Statystyk', section_globalStats: 'Statystyki Globalne',
            section_keyboardShortcuts: 'Skróty Klawiszowe', section_autoIncrement: 'Auto-Inkrementacja', section_lunchSelection: 'Wybór Przerwy', section_otherCustomTabs: 'Inne Skonfigurowane Karty',
            language: 'Język', customTabDisplayName: 'Nazwa Wyświetlana', customTabIncludeInGlobal: 'Wlicz do sumy globalnej', overlayOpacity: 'Przezroczystość Nakładki: ${value}%',
            showPageIndicator: 'Pokaż Wskaźnik Tekstowy', windowBgSettings: 'Tło Okna', lineSettings_currentTab: 'Linia 1: Statystyki Bieżącej Karty',
            lineSettings_globalSummary: 'Linia 2: Podsumowanie Globalne', lineSettings_shiftInfo: 'Linia 3: Informacje o Zmianie', lineSettings_lunchInfo: 'Linia 4: Informacje o Przerwie', lineSettings_realTimeClock: 'Linia 5: Zegar Czasu Rzeczywistego',
            fontFamily: 'Czcionka', fontSize: 'Rozmiar Czcionki: ${value}px', dragStatsWindowButton: 'Uaktywnij Przeciąganie', dragStatsWindowActiveButton: 'Okno Przeciągalne (Kliknij by Przypiąć)',
            includeInGlobal_known: 'Wlicz ${tabName}', incrementKey: 'Inkrementacja (+1)', decrementKey: 'Dekrementacja (-1)', scanIntervalAutoIncrement: 'Skanowanie: ${value}ms',
            noCustomTabsConfigured: 'Brak innych kart.', customTabEntryFormat: '${displayName} (${instanceId_short}) - Włączona: ${isIncludedStr}',
            fontFamily_default: 'Domyślna', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Cienka Sans-Serif',
            key_None: 'Wyłączony', key_ShiftRight: 'Prawy Shift', key_ControlRight: 'Prawy Ctrl', key_AltRight: 'Prawy Alt', key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert',
            key_Numpad0: 'Num 0', key_NumpadMultiply: 'Num *', key_NumpadSubtract: 'Num -', key_NumpadAdd: 'Num +', key_F10: 'F10',
            initialNotification_currentTab: 'Bieżąca Karta:', initialNotification_shiftStart: 'Początek Zmiany:',
            multicolorMode: 'Wielokolorowe Działy', tabColors: 'Kolory Działów:'
        },
        ru: {
            scriptLoaded: '${scriptName} v${version} Загружен.', yes: 'Да', no: 'Нет', notApplicable: 'Н/Д',
            error_items_per_hour_unavailable: '~0.0/ч (мало времени)', fromUnit: 'от', inUnit: 'за',
            hoursShort: 'ч', minutesShort: 'м', secondsShort: 'с', statsPerHourUnit: '/ч', completedUnit: 'готово',
            tabName_CRET: 'CRET', tabName_REFURB: 'REFURB', tabName_WHD: 'WHD', tabName_UNKNOWN: 'НЕИЗВЕСТНО',
            statsLine1_current: '${tabName} ${itemsPerHour}${statsPerHourUnit} (${count} ${completedUnit} ${inUnit} ${workTimeFormatted})',
            statsLine2_global_separator: ' ', statsLine2_global_tab_format: '${tabName} ${itemsPerHour}${statsPerHourUnit}(${count})', statsLine2_global_total_format: '= ~${totalItemsPerHour}${statsPerHourUnit} (${totalCount})',
            statsLine3_shift: '${shiftType} смена (${shiftStartTime})', statsLine4_lunch: 'Перерыв #${lunchNumber} (${lunchStartTime} - ${lunchEndTime})', statsLine5_clock: '[ ${currentTime} ]',
            shift_day: 'ДНЕВНАЯ', shift_night: 'НОЧНАЯ', lunch_day1: 'Перерыв днем 1 (11:20-11:50)', lunch_day2: 'Перерыв днем 2 (11:50-12:20)', lunch_day3: 'Перерыв днем 3 (12:20-12:50)', lunch_day4: 'Перерыв днем 4 (12:50-13:20)',
            lunch_night1: 'Перерыв ночью 1 (23:20-23:50)', lunch_night2: 'Перерыв ночью 2 (23:50-00:20)', lunch_night3: 'Перерыв ночью 3 (00:20-00:50)', lunch_night4: 'Перерыв ночью 4 (00:50-01:20)',
            settingsPanelTitle: 'Настройки ${scriptName}', settings_applyAndCloseButton: 'Применить и Закрыть', settings_applyButton: 'Применить',
            settings_resetAllDataButton: 'Сбросить все данные', settings_resetWindowPositionButton: 'Сбросить позицию окна',
            settings_manualCounterInputLabel: 'Счетчик', section_general: 'Общие', section_currentTab: 'Текущая вкладка (${tabInstanceId})',
            section_visualAids: 'Визуальные эффекты (для ${tabName})', section_statsWindow: 'Стилизация окна статистики', section_globalStats: 'Глобальная статистика',
            section_keyboardShortcuts: 'Горячие клавиши', section_autoIncrement: 'Авто-инкремент', section_lunchSelection: 'Выбор перерыва', section_otherCustomTabs: 'Другие пользовательские вкладки',
            language: 'Язык', customTabDisplayName: 'Отображаемое имя', customTabIncludeInGlobal: 'Включить в глобальную сумму', overlayOpacity: 'Непрозрачность наложения: ${value}%',
            showPageIndicator: 'Показать текстовый индикатор', windowBgSettings: 'Фон окна', lineSettings_currentTab: 'Линия 1: Статистика текущей вкладки',
            lineSettings_globalSummary: 'Линия 2: Глобальная сводка', lineSettings_shiftInfo: 'Линия 3: Информация о смене', lineSettings_lunchInfo: 'Линия 4: Информация о перерыве', lineSettings_realTimeClock: 'Линия 5: Часы',
            fontFamily: 'Шрифт', fontSize: 'Размер шрифта: ${value}px', dragStatsWindowButton: 'Включить перетаскивание', dragStatsWindowActiveButton: 'Окно перемещается (Кликните для фиксации)',
            includeInGlobal_known: 'Включить ${tabName}', incrementKey: 'Кнопка инкремента (+1)', decrementKey: 'Кнопка декремента (-1)', scanIntervalAutoIncrement: 'Интервал сканирования: ${value}мс',
            noCustomTabsConfigured: 'Других вкладок не настроено.', customTabEntryFormat: '${displayName} (${instanceId_short}) - Включено: ${isIncludedStr}',
            fontFamily_default: 'По умолчанию', fontFamily_monospace: 'Моноширинный', fontFamily_sans_serif_thin: 'Тонкий без засечек',
            key_None: 'Отключено', key_ShiftRight: 'Правый Shift', key_ControlRight: 'Правый Ctrl', key_AltRight: 'Правый Alt', key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert',
            key_Numpad0: 'Num 0', key_NumpadMultiply: 'Num *', key_NumpadSubtract: 'Num -', key_NumpadAdd: 'Num +', key_F10: 'F10',
            initialNotification_currentTab: 'Текущая вкладка:', initialNotification_shiftStart: 'Начало смены:',
            multicolorMode: 'Разноцветные отделы', tabColors: 'Цвета отделов:'
        }
    };

    // ==========================================
    // 3. UTILITIES & DOM GENERATOR
    // ==========================================
    const Utils = {
        log(...args) { if (CONFIG.DEBUG_MODE) console.log(`[${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION}]`, ...args); },
        error(...args) { console.error(`[${CONFIG.SCRIPT_NAME} ERROR]`, ...args); },
        generateId(prefix = '') { return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`; },
        isObject(item) { return (item && typeof item === 'object' && !Array.isArray(item)); },
        deepMerge(target, source) {
            const output = { ...target };
            if (Utils.isObject(target) && Utils.isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (Utils.isObject(source[key])) {
                        if (!(key in target)) Object.assign(output, { [key]: source[key] });
                        else output[key] = Utils.deepMerge(target[key], source[key]);
                    } else { output[key] = source[key]; }
                });
            }
            return output;
        },
        debounce(func, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '128, 128, 128';
        },
        formatTime(dateObject, showSeconds = true, separator = '') {
            if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) return showSeconds ? `00${separator}00${separator}00` : `00${separator}00`;
            const h = String(dateObject.getHours()).padStart(2, '0');
            const m = String(dateObject.getMinutes()).padStart(2, '0');
            if (!showSeconds) return `${h}${separator}${m}`;
            const s = String(dateObject.getSeconds()).padStart(2, '0');
            return `${h}${separator}${m}${separator}${s}`;
        },
        timeStringToDate(timeStr, baseDate = new Date(), crossesMidnight = false) {
            const h = parseInt(timeStr.substring(0, 2), 10);
            const m = parseInt(timeStr.substring(2, 4), 10);
            const d = new Date(baseDate);
            d.setHours(h, m, 0, 0);
            if (crossesMidnight) d.setDate(d.getDate() + 1);
            return d;
        },
        formatDuration(ms) {
            if (isNaN(ms) || ms <= 0) return I18n.get('notApplicable');
            let s = Math.floor(ms / 1000); let m = Math.floor(s / 60); let h = Math.floor(m / 60);
            s %= 60; m %= 60;
            const hS = I18n.get('hoursShort'), mS = I18n.get('minutesShort'), sS = I18n.get('secondsShort');
            if (h > 0) return `${h}${hS} ${String(m).padStart(2, '0')}${mS}`;
            else if (m > 0) return `${m}${mS} ${String(s).padStart(2, '0')}${sS}`;
            return `${s}${sS}`;
        }
    };

    /**
     * Hyperscript-like DOM Generator. Enforces Zero-Trust DOM rendering.
     * Prevents XSS natively by exclusively using appendChild and setAttribute.
     */
    function h(tag, props = {}, ...children) {
        const el = document.createElement(tag);
        for (const[k, v] of Object.entries(props)) {
            if (k.startsWith('on') && typeof v === 'function') {
                el.addEventListener(k.substring(2).toLowerCase(), v);
            } else if (k === 'style' && typeof v === 'object') {
                Object.assign(el.style, v);
            } else if (k === 'dataset' && typeof v === 'object') {
                for (const[dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
            } else if (k === 'className') {
                el.className = v;
            } else if (k === 'id') {
                el.id = v.startsWith(CONFIG.SCRIPT_ID_PREFIX) ? v : CONFIG.SCRIPT_ID_PREFIX + v;
            } else {
                el[k] = v;
            }
        }
        const append = (child) => {
            if (Array.isArray(child)) child.forEach(append);
            else if (child instanceof Node) el.appendChild(child);
            else if (child !== null && child !== undefined) el.appendChild(document.createTextNode(String(child)));
        };
        children.forEach(append);
        return el;
    }

    // ==========================================
    // 4. ARCHITECTURE: EventBus & Reactive State
    // ==========================================
    class EventBus {
        constructor() { this.listeners = {}; }
        on(event, callback) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(callback);
            return () => this.off(event, callback);
        }
        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
        emit(event, payload) {
            if (!this.listeners[event]) return;
            this.listeners[event].forEach(cb => {
                try { cb(payload); } catch (e) { Utils.error(`Event handler error for ${event}`, e); }
            });
        }
    }

    const bus = new EventBus();

    function createReactive(target, path = "") {
        if (Utils.isObject(target)) {
            for (const key of Object.keys(target)) {
                if (Utils.isObject(target[key])) {
                    target[key] = createReactive(target[key], path ? `${path}.${key}` : key);
                }
            }
        }

        return new Proxy(target, {
            get(obj, prop) {
                return obj[prop];
            },
            set(obj, prop, value) {
                const fullPath = path ? `${path}.${prop}` : prop;
                const oldValue = obj[prop];
                
                if (oldValue !== value) {
                    if (Utils.isObject(value)) {
                        obj[prop] = createReactive(value, fullPath);
                    } else {
                        obj[prop] = value;
                    }
                    
                    bus.emit(`store:changed`, { path: fullPath, value: obj[prop], oldValue });
                    bus.emit(`store:changed:${fullPath}`, { value: obj[prop], oldValue });
                }
                return true;
            }
        });
    }

    // Define Base State Structure
    const baseState = {
        initialized: false,
        currentTabType: CONFIG.UNKNOWN_TAB_TYPE_KEY,
        currentTabInstanceId: null,
        tabCounters: {},
        userConfig: {
            language: CONFIG.DEFAULT_LANGUAGE,
            globalStatsContributionKnown: Object.keys(CONFIG.KNOWN_TAB_TYPES).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
            keyboardShortcuts: { INCREMENT: 'None', DECREMENT: 'None' },
            triggerMutationDebounceMs: CONFIG.DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS,
            settingsPanelWidth: CONFIG.SETTINGS_PANEL_INITIAL_WIDTH_PX,
            customTabSettings: {},
            defaultLocalTabConfig: Utils.deepMerge({}, DEFAULT_LOCAL_CONFIG),
        },
        localTabConfig: Utils.deepMerge({}, DEFAULT_LOCAL_CONFIG),
        sessionConfig: {
            shiftType: null, shiftCalculatedStartTime: null, selectedLunchIndex: null, activeTabInstances: {}, sessionLastActivityTimestamp: null,
        },
        uiFlags: { isSettingsPanelVisible: false, isStatsWindowDragging: false, autoTriggerFound: false }
    };

    const store = createReactive(baseState);

    // ==========================================
    // 5. MANAGERS
    // ==========================================

    const I18n = {
        get(key, replacements = {}) {
            const lang = store.userConfig.language || CONFIG.DEFAULT_LANGUAGE;
            const pack = LANG_STRINGS[lang] || LANG_STRINGS[CONFIG.DEFAULT_LANGUAGE];
            let str = pack[key] !== undefined ? pack[key] : LANG_STRINGS[CONFIG.DEFAULT_LANGUAGE][key];
            if (!str) return `[${key}]`;
            for (const r in replacements) str = str.replace(new RegExp(`\\$\\{${r}\\}`, 'g'), replacements[r]);
            return str.replace(/\$\{version\}/g, CONFIG.SCRIPT_VERSION).replace(/\$\{scriptName\}/g, CONFIG.SCRIPT_NAME);
        },
        getTabName(idOrKey) {
            if (CONFIG.KNOWN_TAB_TYPES[idOrKey]) return I18n.get(CONFIG.KNOWN_TAB_TYPES[idOrKey].displayNameKey);
            if (store.userConfig.customTabSettings[idOrKey]) return store.userConfig.customTabSettings[idOrKey].displayName;
            if (idOrKey.startsWith(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX)) {
                return `${I18n.get(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${idOrKey.substring(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length, CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length + 5)})`;
            }
            return idOrKey;
        }
    };

    const StorageManager = {
        getKey(key, session = false) { return `${CONFIG.SCRIPT_ID_PREFIX}${key}`; },
        saveState() {
            if (!store.initialized) return;
            localStorage.setItem(this.getKey(CONFIG.STORAGE_KEY_USER_CONFIG), JSON.stringify(store.userConfig));
            localStorage.setItem(this.getKey(CONFIG.STORAGE_KEY_SESSION_CONFIG), JSON.stringify(store.sessionConfig));
            
            let allLocals = JSON.parse(localStorage.getItem(this.getKey(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS)) || "{}");
            allLocals[store.currentTabInstanceId] = store.localTabConfig;
            localStorage.setItem(this.getKey(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS), JSON.stringify(allLocals));
        },
        saveCounter(tabKey, count) {
            localStorage.setItem(this.getKey(CONFIG.STORAGE_PREFIX_TAB_COUNTER + tabKey), count);
        },
        loadAll() {
            try {
                const uc = JSON.parse(localStorage.getItem(this.getKey(CONFIG.STORAGE_KEY_USER_CONFIG)) || "null");
                if (uc) Object.assign(store.userConfig, Utils.deepMerge(store.userConfig, uc));
                
                const sc = JSON.parse(localStorage.getItem(this.getKey(CONFIG.STORAGE_KEY_SESSION_CONFIG)) || "null");
                if (sc) Object.assign(store.sessionConfig, Utils.deepMerge(store.sessionConfig, sc));

                const allLocals = JSON.parse(localStorage.getItem(this.getKey(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS)) || "{}");
                if (allLocals[store.currentTabInstanceId]) {
                    Object.assign(store.localTabConfig, Utils.deepMerge(store.localTabConfig, allLocals[store.currentTabInstanceId]));
                }

                const prefix = this.getKey(CONFIG.STORAGE_PREFIX_TAB_COUNTER);
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(prefix)) {
                        const tabKey = key.substring(prefix.length);
                        store.tabCounters[tabKey] = parseInt(localStorage.getItem(key), 10) || 0;
                    }
                }
            } catch (e) { Utils.error("Storage load failed", e); }
        },
        listen() {
            window.addEventListener('storage', (e) => {
                if (!e.key || !e.key.startsWith(CONFIG.SCRIPT_ID_PREFIX)) return;
                const localKey = e.key.substring(CONFIG.SCRIPT_ID_PREFIX.length);
                if (localKey.startsWith(CONFIG.STORAGE_PREFIX_TAB_COUNTER)) {
                    const tabKey = localKey.substring(CONFIG.STORAGE_PREFIX_TAB_COUNTER.length);
                    const val = parseInt(e.newValue, 10) || 0;
                    if (store.tabCounters[tabKey] !== val) store.tabCounters[tabKey] = val;
                } else if (!store.uiFlags.isSettingsPanelVisible) {
                    this.debouncedLoad();
                }
            });
        },
        debouncedLoad: Utils.debounce(function() { StorageManager.loadAll(); }, 300)
    };

    const ShiftManager = {
        update() {
            const now = new Date();
            const minutes = now.getHours() * 60 + now.getMinutes();
            const ST = CONFIG.SHIFT_TIMES_UTC_PLUS_2;
            const CST = CONFIG.DEFAULT_CALCULATION_START_TIMES;

            const dStart = ST.DAY_SHIFT_START_H * 60 + ST.DAY_SHIFT_START_M;
            const dEnd = ST.DAY_SHIFT_END_H * 60 + ST.DAY_SHIFT_END_M;
            const nStart = ST.NIGHT_SHIFT_START_H * 60 + ST.NIGHT_SHIFT_START_M;
            const nEnd = ST.NIGHT_SHIFT_END_H * 60 + ST.NIGHT_SHIFT_END_M;

            let sType = null;
            let sTime = new Date(now);

            if (minutes >= dStart && minutes < dEnd) {
                sType = 'day'; sTime.setHours(CST.DAY.H, CST.DAY.M, 0, 0);
            } else if (
                (nStart > nEnd && (minutes >= nStart || minutes < nEnd)) ||
                (nStart < nEnd && (minutes >= nStart && minutes < nEnd))
            ) {
                sType = 'night'; sTime.setHours(CST.NIGHT.H, CST.NIGHT.M, 0, 0);
                if (now.getHours() < 12 && CST.NIGHT.H >= 12) sTime.setDate(now.getDate() - 1);
            }

            if (store.sessionConfig.shiftType !== sType) {
                store.sessionConfig.shiftType = sType;
                store.sessionConfig.shiftCalculatedStartTime = sType ? sTime.getTime() : null;
                const defLunch = sType === 'day' ? CONFIG.DEFAULT_LUNCH_INDEX_DAY : CONFIG.DEFAULT_LUNCH_INDEX_NIGHT;
                store.sessionConfig.selectedLunchIndex = defLunch;
                StorageManager.saveState();
            }
        },
        getWorkTime() {
            if (!store.sessionConfig.shiftCalculatedStartTime) return { workedMs: 0, lunchMs: 0 };
            const now = Date.now();
            const start = store.sessionConfig.shiftCalculatedStartTime;
            let elapsed = Math.max(0, now - start);
            let lunchMs = 0;

            const idx = store.sessionConfig.selectedLunchIndex;
            if (idx !== null && CONFIG.LUNCH_OPTIONS_BASE[idx]) {
                const opt = CONFIG.LUNCH_OPTIONS_BASE[idx];
                const shiftDate = new Date(start);
                
                let lStartObj = Utils.timeStringToDate(opt.start, shiftDate, opt.type==='night' && parseInt(opt.start.substring(0,2)) < 12 && shiftDate.getHours() >= 12);
                let lEndObj = Utils.timeStringToDate(opt.end, shiftDate, opt.type==='night' && parseInt(opt.end.substring(0,2)) < 12 && shiftDate.getHours() >= 12);

                if (lEndObj < lStartObj) lEndObj.setDate(lEndObj.getDate() + 1);

                const aStart = Math.max(start, lStartObj.getTime());
                const aEnd = Math.min(now, lEndObj.getTime());
                if (aEnd > aStart) lunchMs = aEnd - aStart;
            }
            return { workedMs: Math.max(0, elapsed - lunchMs), lunchMs };
        }
    };
	
	const DragDropManager = {
        init() {
            this.el = document.getElementById(CONFIG.SCRIPT_ID_PREFIX + 'statsWindow');
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;

            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);

            if (this.el) {
                this.el.addEventListener('mousedown', this.onMouseDown);
            } else {
                Utils.error('DragDropManager: Target element not found in DOM.');
            }
        },
        onMouseDown(e) {
            if (!store.uiFlags.isStatsWindowDragging || e.button !== 0) return;
            
            this.isDragging = true;
            const rect = this.el.getBoundingClientRect();
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;
            
            this.el.style.cursor = 'grabbing';
            this.el.style.transition = 'none'; 
            
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        },
        onMouseMove(e) {
            if (!this.isDragging) return;
            e.preventDefault(); 

            let x = e.clientX - this.offsetX;
            let y = e.clientY - this.offsetY;

            const maxX = window.innerWidth - this.el.offsetWidth;
            const maxY = window.innerHeight - this.el.offsetHeight;
            
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            this.el.style.left = `${x}px`;
            this.el.style.top = `${y}px`;
        },
        onMouseUp(e) {
            if (!this.isDragging) return;
            this.isDragging = false;
            
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);

            this.el.style.transition = 'top 0.2s, left 0.2s, background-color 0.2s'; 

            store.localTabConfig.statsWindowPosition = {
                left: this.el.style.left,
                top: this.el.style.top
            };

            store.uiFlags.isStatsWindowDragging = false;
            StorageManager.saveState();
        }
    };

    // ==========================================
    // 6. UI & RENDERERS
    // ==========================================
    const CSSManager = {
        init() {
            this.styleEl = h('style', { id: 'reactiveStyles' });
            document.head.appendChild(this.styleEl);
            this.updateAll();
            bus.on('store:changed', () => this.updateAll());
        },
        updateAll() {
            const lc = store.localTabConfig;
            let css = `:root {
                --sh-overlay-opacity: ${lc.pageOverlayOpacity / 100};
                --sh-bg-color: rgba(${Utils.hexToRgb(lc.statsWindowBgColorHex)}, ${lc.statsWindowBgAlpha / 100});
                --sh-font: ${CONFIG.FONT_FAMILY_OPTIONS[lc.statsWindowFontFamily] || CONFIG.FONT_FAMILY_OPTIONS.default};
            `;
            
            Object.keys(lc.linesConfig).forEach(k => {
                const cfg = lc.linesConfig[k];
                css += `
                --sh-${k}-color: rgba(${Utils.hexToRgb(cfg.colorHex)}, ${cfg.alpha / 100});
                --sh-${k}-size: ${cfg.fontSize}px;
                --sh-${k}-display: ${cfg.visible ? 'block' : 'none'};
                `;
            });
            css += `}`;
            this.styleEl.textContent = css;
        }
    };

    const StatsWindowRenderer = {
        init() {
            this.el = h('div', {
                id: 'statsWindow',
                style: {
                    position: 'fixed', padding: '5px 10px', borderRadius: '5px', zIndex: '2147483640',
                    pointerEvents: 'none', userSelect: 'none', whiteSpace: 'pre',
                    transition: 'top 0.2s, left 0.2s, background-color 0.2s',
                    backgroundColor: 'var(--sh-bg-color)',
                    fontFamily: 'var(--sh-font)',
                    top: store.localTabConfig.statsWindowPosition.top,
                    left: store.localTabConfig.statsWindowPosition.left
                }
            });
            
            this.lines = {};['line1_currentTab', 'line2_globalSummary', 'line3_shiftInfo', 'line4_lunchInfo', 'line5_realTimeClock'].forEach(k => {
                const line = h('div', {
                    style: {
                        color: `var(--sh-${k}-color)`,
                        fontSize: `var(--sh-${k}-size)`,
                        display: `var(--sh-${k}-display)`,
                        lineHeight: '1.3', minHeight: '1em'
                    }
                });
                this.lines[k] = line;
                this.el.appendChild(line);
            });
            document.body.appendChild(this.el);
            bus.on('store:changed', () => this.renderContent());
            setInterval(() => this.renderContent(), 10000);
			
            bus.on('store:changed:uiFlags.isStatsWindowDragging', (data) => {
                const isDragActive = data.value;
                if (isDragActive) {
                    this.el.style.pointerEvents = 'auto';
                    this.el.style.cursor = 'grab';
                    this.el.style.outline = '2px dashed #FFA500';
                    this.el.style.outlineOffset = '2px';
                    this.el.style.backgroundColor = 'rgba(230, 230, 230, 0.95)';
                    this.el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                } else {
                    this.el.style.pointerEvents = 'none';
                    this.el.style.cursor = 'default';
                    this.el.style.outline = 'none';
                    this.el.style.boxShadow = 'none';
                    this.el.style.backgroundColor = 'var(--sh-bg-color)';
                }
            });
        },
        renderContent() {
            const { workedMs } = ShiftManager.getWorkTime();
            const hWorked = workedMs / 3600000;
            const cid = store.currentTabInstanceId;
            const cCount = store.tabCounters[cid] || 0;
            const getIph = (c) => hWorked > 0.0027 ? (c / hWorked).toFixed(1) : (c > 0 ? I18n.get('error_items_per_hour_unavailable') : '0.0');

            // Line 1: Current Tab
            this.lines.line1_currentTab.textContent = I18n.get('statsLine1_current', {
                tabName: I18n.getTabName(cid), itemsPerHour: getIph(cCount), statsPerHourUnit: I18n.get('statsPerHourUnit'),
                count: cCount, completedUnit: I18n.get('completedUnit'), inUnit: I18n.get('inUnit'),
                workTimeFormatted: Utils.formatDuration(workedMs)
            });

            // Line 2: Global
            this.lines.line2_globalSummary.innerHTML = '';
            let gTotal = 0;
            const allKeys =[...Object.keys(CONFIG.KNOWN_TAB_TYPES), ...Object.keys(store.userConfig.customTabSettings)];
            const fragments =[];
            const line2Cfg = store.localTabConfig.linesConfig.line2_globalSummary;

            allKeys.forEach(k => {
                const isKnown = !!CONFIG.KNOWN_TAB_TYPES[k];
                const included = isKnown ? store.userConfig.globalStatsContributionKnown[k] : store.userConfig.customTabSettings[k].includeInGlobal;
                const count = store.tabCounters[k] || 0;
                const active = store.sessionConfig.activeTabInstances[k] || count > 0;
                
                if (included && active) {
                    gTotal += count;
                    const text = I18n.get('statsLine2_global_tab_format', {
                        tabName: I18n.getTabName(k).substring(0, 10),
                        itemsPerHour: getIph(count), statsPerHourUnit: I18n.get('statsPerHourUnit'), count: count
                    });
                    
                    const span = h('span', { textContent: text });
                    
                    if (isKnown && line2Cfg.multicolor) {
                        const hex = line2Cfg.customColors[k] || CONFIG.KNOWN_TAB_TYPES[k].baseColorHex;
                        const rgb = Utils.hexToRgb(hex);
                        // Blend custom distinct color with Line 2 global Alpha setting
                        span.style.color = `rgba(${rgb}, ${line2Cfg.alpha / 100})`;
                        span.style.fontWeight = 'bold';
                        
                        // Dynamically scale text shadow based on overall alpha to prevent visual smudging
                        const shadowAlpha = Math.min(0.5, line2Cfg.alpha / 100);
                        span.style.textShadow = `0 0 2px rgba(0,0,0,${shadowAlpha})`;
                    }
                    
                    fragments.push(span);
                    fragments.push(document.createTextNode(I18n.get('statsLine2_global_separator')));
                }
            });
            
            if (fragments.length > 0) {
                fragments.forEach(f => this.lines.line2_globalSummary.appendChild(f));
                this.lines.line2_globalSummary.appendChild(document.createTextNode(
                    I18n.get('statsLine2_global_total_format', {
                        totalItemsPerHour: getIph(gTotal), statsPerHourUnit: I18n.get('statsPerHourUnit'), totalCount: gTotal
                    })
                ));
            }

            // Line 3: Shift
            const sType = store.sessionConfig.shiftType;
            const sStart = store.sessionConfig.shiftCalculatedStartTime ? Utils.formatTime(new Date(store.sessionConfig.shiftCalculatedStartTime), false, ':') : I18n.get('notApplicable');
            this.lines.line3_shiftInfo.textContent = I18n.get('statsLine3_shift', {
                shiftType: sType ? I18n.get(`shift_${sType}`) : I18n.get('notApplicable'),
                shiftStartTime: sStart
            });

            // Line 4: Lunch
            let lStr = I18n.get('notApplicable');
            const lIdx = store.sessionConfig.selectedLunchIndex;
            if (lIdx !== null && CONFIG.LUNCH_OPTIONS_BASE[lIdx]) {
                const opt = CONFIG.LUNCH_OPTIONS_BASE[lIdx];
                const typeArr = CONFIG.LUNCH_OPTIONS_BASE.filter(l => l.type === opt.type);
                lStr = I18n.get('statsLine4_lunch', {
                    lunchNumber: typeArr.indexOf(opt) + 1,
                    lunchStartTime: `${opt.start.substring(0,2)}:${opt.start.substring(2,4)}`,
                    lunchEndTime: `${opt.end.substring(0,2)}:${opt.end.substring(2,4)}`
                });
            }
            this.lines.line4_lunchInfo.textContent = lStr;

            // Line 5: Time
            this.lines.line5_realTimeClock.textContent = I18n.get('statsLine5_clock', { currentTime: Utils.formatTime(new Date(), true, ':') });
        }
    };

    const UIBuilder = {
        row(labelStr, ...controls) {
            return h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '10px', flexWrap: 'nowrap' } },
                labelStr ? h('label', { textContent: labelStr + ':', style: { minWidth: '150px', fontWeight: '500', marginRight: '10px' } }) : null,
                h('div', { style: { display: 'flex', alignItems: 'center', flexGrow: '1', gap: '8px' } }, ...controls)
            );
        },
        section(title) {
            return h('div', { className: 'sh-section', style: { marginBottom: '20px', borderBottom: `1px dashed ${CONFIG.SETTINGS_PANEL_TEXT_COLOR}33`, paddingBottom: '15px' } },
                h('h3', { textContent: title, style: { margin: '0 0 12px 0', fontSize: '1.15em', color: CONFIG.SETTINGS_PANEL_ACCENT_COLOR } })
            );
        },
        slider(min, max, value, onChange, labelFormatter) {
            const lbl = h('span', { textContent: labelFormatter(value), style: { minWidth: '70px', fontSize: '0.9em' } });
            const inp = h('input', {
                type: 'range', min, max, value, style: { flexGrow: '1' },
                onInput: (e) => { lbl.textContent = labelFormatter(e.target.value); onChange(e.target.value); }
            });
            return[inp, lbl];
        },
        colorPickerWithAlpha(hex, alpha, onColorChange, onAlphaChange) {
            const picker = h('input', {
                type: 'color', value: hex, style: { width: '40px', height: '24px', padding: '0', border: '1px solid #ccc', cursor: 'pointer' },
                onChange: (e) => onColorChange(e.target.value)
            });
            const [alphaSlider, alphaLabel] = this.slider(0, 100, alpha, onAlphaChange, v => `${v}%`);
            return h('div', { style: { display: 'flex', alignItems: 'center', gap: '5px', flexGrow: '1' } }, picker, alphaSlider, alphaLabel);
        },
        button(text, onClick, cssOverrides = {}) {
            return h('button', {
                textContent: text, onClick,
                style: { padding: '6px 12px', background: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', ...cssOverrides }
            });
        },
        select(options, value, onChange) {
            const sel = h('select', { onChange: (e) => onChange(e.target.value), style: { padding: '4px', borderRadius: '4px', border: '1px solid #ccc' } });
            options.forEach(opt => sel.appendChild(h('option', { value: opt.value, textContent: opt.text, selected: String(opt.value) === String(value) })));
            return sel;
        },
        checkbox(label, checked, onChange) {
            const chk = h('input', { type: 'checkbox', checked, onChange: (e) => onChange(e.target.checked), style: { transform: 'scale(1.2)', marginRight: '8px', cursor: 'pointer' } });
            return h('label', { style: { display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: '1' } }, chk, h('span', { textContent: label }));
        },
        numberInput(val, onChange) {
            return h('input', { type: 'number', min: 0, value: val, onChange: (e) => onChange(parseInt(e.target.value, 10) || 0), style: { width: '80px', padding: '4px', textAlign: 'right' }});
        }
    };

    const SettingsPanel = {
        init() {
            this.el = h('div', {
                id: 'settingsPanel',
                style: {
                    position: 'fixed', top: '10px', right: '10px', width: `${store.userConfig.settingsPanelWidth}px`,
                    height: 'calc(100vh - 30px)', backgroundColor: CONFIG.SETTINGS_PANEL_BACKGROUND_COLOR,
                    color: CONFIG.SETTINGS_PANEL_TEXT_COLOR, border: `1px solid ${CONFIG.SETTINGS_PANEL_ACCENT_COLOR}`,
                    zIndex: '2147483646', overflowY: 'auto', padding: '15px', paddingLeft: '25px', display: 'none',
                    boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s', transform: 'translateX(110%)'
                }
            });
            document.body.appendChild(this.el);
        },
        toggle() {
            store.uiFlags.isSettingsPanelVisible = !store.uiFlags.isSettingsPanelVisible;
            if (store.uiFlags.isSettingsPanelVisible) {
                this.render();
                this.el.style.display = 'block';
                setTimeout(() => this.el.style.transform = 'translateX(0)', 10);
            } else {
                this.el.style.transform = 'translateX(110%)';
                StorageManager.saveState();
                setTimeout(() => this.el.style.display = 'none', 200);
            }
        },
        render() {
            this.el.innerHTML = '';
            this.el.appendChild(h('h2', { textContent: I18n.get('settingsPanelTitle'), style: { textAlign: 'center', marginTop: '0' } }));

            // 1. General
            const secGen = UIBuilder.section(I18n.get('section_general'));
            secGen.appendChild(UIBuilder.row(I18n.get('language'), UIBuilder.select(CONFIG.AVAILABLE_LANGUAGES.map(l => ({ value: l.code, text: l.name })), store.userConfig.language, v => { store.userConfig.language = v; this.render(); })));
            secGen.appendChild(UIBuilder.button(I18n.get('settings_resetAllDataButton'), () => { if(confirm('Reset all?')) { localStorage.clear(); location.reload(); } }, { background: '#d9534f', width: '100%', marginTop: '10px' }));
            this.el.appendChild(secGen);

            // 2. Custom Tab Naming
            if (store.currentTabType === CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                const secCur = UIBuilder.section(I18n.get('section_currentTab', { tabInstanceId: store.currentTabInstanceId.substring(0, 8) + '...' }));
                const cust = store.userConfig.customTabSettings[store.currentTabInstanceId] || { displayName: store.currentTabInstanceId, includeInGlobal: true };
                secCur.appendChild(UIBuilder.row(I18n.get('customTabDisplayName'), h('input', { type: 'text', value: cust.displayName, onInput: e => {
                    store.userConfig.customTabSettings[store.currentTabInstanceId] = { ...cust, displayName: e.target.value };
                }, style: { flexGrow: '1', padding: '4px' } })));
                secCur.appendChild(UIBuilder.row('', UIBuilder.checkbox(I18n.get('customTabIncludeInGlobal'), cust.includeInGlobal, v => {
                    store.userConfig.customTabSettings[store.currentTabInstanceId].includeInGlobal = v;
                })));
                this.el.appendChild(secCur);
            }

            // 3. Visual Aids
            const secVis = UIBuilder.section(I18n.get('section_visualAids', { tabName: I18n.getTabName(store.currentTabInstanceId) }));
            secVis.appendChild(UIBuilder.row('', ...UIBuilder.slider(0, CONFIG.MAX_PAGE_OVERLAY_OPACITY_PERCENT, store.localTabConfig.pageOverlayOpacity, v => store.localTabConfig.pageOverlayOpacity = v, v => I18n.get('overlayOpacity', { value: v }))));
            secVis.appendChild(UIBuilder.row('', UIBuilder.checkbox(I18n.get('showPageIndicator'), store.localTabConfig.pageIndicatorTextVisible, v => store.localTabConfig.pageIndicatorTextVisible = v)));
            this.el.appendChild(secVis);

            // 4. Stats Window Styling
            const secWin = UIBuilder.section(I18n.get('section_statsWindow'));
            
            secWin.appendChild(UIBuilder.row(I18n.get('windowBgSettings'), UIBuilder.colorPickerWithAlpha(
                store.localTabConfig.statsWindowBgColorHex, store.localTabConfig.statsWindowBgAlpha,
                hex => store.localTabConfig.statsWindowBgColorHex = hex, alpha => store.localTabConfig.statsWindowBgAlpha = alpha
            )));

            const fontOpts = Object.keys(CONFIG.FONT_FAMILY_OPTIONS).map(k => ({ value: k, text: I18n.get(`fontFamily_${k}`) }));
            secWin.appendChild(UIBuilder.row(I18n.get('fontFamily'), UIBuilder.select(fontOpts, store.localTabConfig.statsWindowFontFamily, v => store.localTabConfig.statsWindowFontFamily = v)));
            
            // Individual Lines Settings (Now strictly rendered for ALL lines, agnostic of visbility)
            Object.keys(DEFAULT_LINE_CONFIG).forEach(lineKey => {
                const cfg = store.localTabConfig.linesConfig[lineKey];
                const lineBox = h('div', { style: { border: '1px solid #ddd', padding: '8px', marginBottom: '8px', borderRadius: '4px' } });
                
                lineBox.appendChild(UIBuilder.row('', UIBuilder.checkbox(I18n.get(`lineSettings_${lineKey.split('_')[1]}`), cfg.visible, v => store.localTabConfig.linesConfig[lineKey].visible = v)));
                
                // Color, Alpha, and Size controls are permanently bound to DOM regardless of checkbox state
                lineBox.appendChild(UIBuilder.row('Color/Alpha', UIBuilder.colorPickerWithAlpha(
                    cfg.colorHex, cfg.alpha, 
                    hex => store.localTabConfig.linesConfig[lineKey].colorHex = hex,
                    alpha => store.localTabConfig.linesConfig[lineKey].alpha = alpha
                )));
                lineBox.appendChild(UIBuilder.row('Size', ...UIBuilder.slider(8, 36, cfg.fontSize, v => store.localTabConfig.linesConfig[lineKey].fontSize = v, v => `${v}px`)));

                // Special handling for Global Summary Line (Line 2) Multicolors
                if (lineKey === 'line2_globalSummary') {
                    const subBox = h('div', { style: { marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #ccc' } });
                    
                    subBox.appendChild(UIBuilder.row('', UIBuilder.checkbox(I18n.get('multicolorMode'), cfg.multicolor, v => {
                        store.localTabConfig.linesConfig[lineKey].multicolor = v;
                        this.render(); // Force localized render to toggle opacity on color pickers
                    })));
                    
                    const colorRow = h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '25px', opacity: cfg.multicolor ? '1' : '0.4', pointerEvents: cfg.multicolor ? 'auto' : 'none', transition: 'opacity 0.2s' } });
                    colorRow.appendChild(h('span', { textContent: I18n.get('tabColors'), style: { fontSize: '0.9em' } }));
                    
                    Object.keys(CONFIG.KNOWN_TAB_TYPES).forEach(k => {
                        const cPickerWrapper = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' } });
                        cPickerWrapper.appendChild(h('span', { textContent: k, style: { fontSize: '0.7em', color: '#666' } }));
                        cPickerWrapper.appendChild(h('input', {
                            type: 'color', 
                            value: cfg.customColors[k] || CONFIG.KNOWN_TAB_TYPES[k].baseColorHex,
                            title: k,
                            style: { width: '26px', height: '26px', padding: '0', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' },
                            onChange: (e) => store.localTabConfig.linesConfig.line2_globalSummary.customColors[k] = e.target.value
                        }));
                        colorRow.appendChild(cPickerWrapper);
                    });
                    
                    subBox.appendChild(colorRow);
                    lineBox.appendChild(subBox);
                }

                secWin.appendChild(lineBox);
            });

            const isDragActive = store.uiFlags.isStatsWindowDragging;
            const dragBtnText = isDragActive ? I18n.get('dragStatsWindowActiveButton') : I18n.get('dragStatsWindowButton');
            const dragBtnOverrides = isDragActive 
                ? { background: '#FFA500', color: '#141414', outline: '2px solid #141414', fontWeight: 'bold' } 
                : {};

            secWin.appendChild(UIBuilder.button(dragBtnText, () => {
                store.uiFlags.isStatsWindowDragging = !store.uiFlags.isStatsWindowDragging;
                this.render();
            }, { width: '100%', marginTop: '10px', transition: 'all 0.2s', ...dragBtnOverrides }));
			
			secWin.appendChild(UIBuilder.button(I18n.get('settings_resetWindowPositionButton'), () => {
                store.localTabConfig.statsWindowPosition = { ...DEFAULT_LOCAL_CONFIG.statsWindowPosition };
                const statsWin = document.getElementById(CONFIG.SCRIPT_ID_PREFIX + 'statsWindow');
                if (statsWin) {
                    statsWin.style.top = store.localTabConfig.statsWindowPosition.top;
                    statsWin.style.left = store.localTabConfig.statsWindowPosition.left;
                }
                if (store.uiFlags.isStatsWindowDragging) {
                    store.uiFlags.isStatsWindowDragging = false;
                }
                this.render();
            }, { width: '100%', marginTop: '5px' }));
			this.el.appendChild(secWin);

            // 5. Global Stats & Manual Counters
            const secGlob = UIBuilder.section(I18n.get('section_globalStats'));
            Object.values(CONFIG.KNOWN_TAB_TYPES).forEach(t => {
                const row = h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '5px', gap: '10px' } });
                row.appendChild(UIBuilder.checkbox(I18n.get('includeInGlobal_known', { tabName: I18n.get(t.displayNameKey) }), store.userConfig.globalStatsContributionKnown[t.key], v => store.userConfig.globalStatsContributionKnown[t.key] = v));
                row.appendChild(h('span', { textContent: I18n.get('settings_manualCounterInputLabel') + ':' }));
                row.appendChild(UIBuilder.numberInput(store.tabCounters[t.key] || 0, v => { store.tabCounters[t.key] = v; StorageManager.saveCounter(t.key, v); }));
                secGlob.appendChild(row);
            });
            this.el.appendChild(secGlob);

            // 6. Keyboard Shortcuts
            const secKeys = UIBuilder.section(I18n.get('section_keyboardShortcuts'));
            const keyOpts = CONFIG.AVAILABLE_SHORTCUT_KEYS.map(k => ({ value: k.code, text: I18n.get(k.name_key) }));
            secKeys.appendChild(UIBuilder.row(I18n.get('incrementKey'), UIBuilder.select(keyOpts, store.userConfig.keyboardShortcuts.INCREMENT, v => store.userConfig.keyboardShortcuts.INCREMENT = v)));
            secKeys.appendChild(UIBuilder.row(I18n.get('decrementKey'), UIBuilder.select(keyOpts, store.userConfig.keyboardShortcuts.DECREMENT, v => store.userConfig.keyboardShortcuts.DECREMENT = v)));
            this.el.appendChild(secKeys);

            // 7. Auto-Increment
            const secAuto = UIBuilder.section(I18n.get('section_autoIncrement'));
            secAuto.appendChild(UIBuilder.row('', ...UIBuilder.slider(CONFIG.MIN_TRIGGER_DEBOUNCE_MS, CONFIG.MAX_TRIGGER_DEBOUNCE_MS, store.userConfig.triggerMutationDebounceMs, v => store.userConfig.triggerMutationDebounceMs = v, v => I18n.get('scanIntervalAutoIncrement', { value: v }))));
            this.el.appendChild(secAuto);

            // 8. Lunch Selection
            const secLunch = UIBuilder.section(I18n.get('section_lunchSelection'));
            const sType = store.sessionConfig.shiftType || 'day';
            const lOpts = CONFIG.LUNCH_OPTIONS_BASE.map((o, i) => ({ value: i, text: I18n.get(o.text_key), type: o.type })).filter(o => o.type === sType);
            secLunch.appendChild(UIBuilder.row('', UIBuilder.select(lOpts, store.sessionConfig.selectedLunchIndex, v => store.sessionConfig.selectedLunchIndex = parseInt(v))));
            this.el.appendChild(secLunch);

            // Close
            this.el.appendChild(h('hr', { style: { margin: '20px 0' } }));
            this.el.appendChild(UIBuilder.button(I18n.get('settings_applyAndCloseButton'), () => this.toggle(), { width: '100%', padding: '10px', fontSize: '1.1em' }));
        }
    };

    // Overlay & Indicator Renderer
    const VisualsRenderer = {
        init() {
            this.overlay = h('div', { style: { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '1', pointerEvents: 'none', transition: 'background-color 0.4s', backgroundColor: 'var(--sh-bg-overlay, transparent)' } });
            this.indicator = h('div', { style: { position: 'fixed', top: '50%', right: '100px', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'bottom right', fontSize: '5vw', fontWeight: 'bold', zIndex: '2', pointerEvents: 'none', transition: 'opacity 0.4s', opacity: '0' } });
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.indicator);
            bus.on('store:changed', () => this.update());
        },
        update() {
            const lc = store.localTabConfig;
            const cInfo = CONFIG.KNOWN_TAB_TYPES[store.currentTabType] || CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS;
            
            if (lc.pageOverlayOpacity > 0) {
                this.overlay.style.backgroundColor = `rgba(${Utils.hexToRgb(cInfo.baseColorHex)}, ${lc.pageOverlayOpacity / 100})`;
            } else {
                this.overlay.style.backgroundColor = 'transparent';
            }

            if (lc.pageIndicatorTextVisible) {
                this.indicator.textContent = I18n.getTabName(store.currentTabInstanceId).toUpperCase();
                this.indicator.style.color = `rgba(${Utils.hexToRgb(cInfo.baseColorHex)}, 0.2)`;
                this.indicator.style.opacity = '1';
            } else {
                this.indicator.style.opacity = '0';
            }
        }
    };

    // ==========================================
    // 7. INPUT & TRIGGERS
    // ==========================================
    const InputManager = {
        seqBuffer:[],
        init() {
            document.addEventListener('keydown', (e) => {
                if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

                if (store.userConfig.keyboardShortcuts.INCREMENT !== 'None' && e.code === store.userConfig.keyboardShortcuts.INCREMENT) {
                    this.modifyCounter(1); e.preventDefault();
                } else if (store.userConfig.keyboardShortcuts.DECREMENT !== 'None' && e.code === store.userConfig.keyboardShortcuts.DECREMENT) {
                    this.modifyCounter(-1); e.preventDefault();
                }

                if (e.key.length === 1) {
                    this.seqBuffer.push(e.key.toUpperCase());
                    if (this.seqBuffer.length > CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length) this.seqBuffer.shift();
                    if (this.seqBuffer.join('') === CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.join('')) {
                        SettingsPanel.toggle();
                        this.seqBuffer =[];
                    }
                }
            }, true);
        },
        modifyCounter(delta) {
            const cid = store.currentTabInstanceId;
            const cur = store.tabCounters[cid] || 0;
            const next = Math.max(0, cur + delta);
            store.tabCounters[cid] = next;
            StorageManager.saveCounter(cid, next);
            StatsWindowRenderer.renderContent();
        }
    };

    const AutoTrigger = {
        observer: null,
        init() {
            this.observer = new MutationObserver(Utils.debounce(() => this.scan(), store.userConfig.triggerMutationDebounceMs));
            this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            bus.on('store:changed:userConfig.triggerMutationDebounceMs', () => {
                this.observer.disconnect();
                this.observer = new MutationObserver(Utils.debounce(() => this.scan(), store.userConfig.triggerMutationDebounceMs));
                this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            });
        },
        scan() {
            const txt = document.body.innerText || '';
            if (CONFIG.PRE_TRIGGER_REGEX.test(txt)) store.uiFlags.itemInProgress = true;
            if (CONFIG.AUTO_TRIGGER_REGEX.test(txt)) {
                if (store.uiFlags.itemInProgress && !store.uiFlags.autoTriggerFound) {
                    InputManager.modifyCounter(1);
                    store.uiFlags.autoTriggerFound = true;
                    store.uiFlags.itemInProgress = false;
                }
            } else {
                store.uiFlags.autoTriggerFound = false;
            }
        }
    };

    // ==========================================
    // 8. BOOTSTRAP
    // ==========================================
    const Main = {
		identifyTab() {
            const fullUrl = window.location.href.toUpperCase();
            
            // 1. Извлекаем параметр gradingMode регулярным выражением.
            // Это обходит ограничения URLSearchParams, если параметры спрятаны за хэшем (SPA routing).
            const match = fullUrl.match(/[?&#]GRADINGMODE=([^&#]*)/);
            const gradingMode = match ? match[1] : null;

            Utils.log(`[DIAGNOSTICS] Full URL: ${fullUrl}`);
            Utils.log(`[DIAGNOSTICS] Extracted gradingMode: ${gradingMode}`);

            let known;
            if (gradingMode) {
                // Точное совпадение
                known = Object.values(CONFIG.KNOWN_TAB_TYPES).find(t => gradingMode === t.urlKeyword.toUpperCase());
                Utils.log(`[DIAGNOSTICS] Strict match attempt result:`, known ? known.key : 'NOT_FOUND');
            } 
            
            if (!known) {
                // Фолбэк по подстроке. 
                // КРИТИЧЕСКИ ВАЖНО: Сортируем ключи по длине по убыванию.
                // Это гарантирует, что CRETURN_REFURB (14 символов) проверится ДО CRETURN (7 символов).
                const sortedTypes = Object.values(CONFIG.KNOWN_TAB_TYPES).sort((a, b) => b.urlKeyword.length - a.urlKeyword.length);
                known = sortedTypes.find(t => fullUrl.includes(t.urlKeyword.toUpperCase()));
                Utils.log(`[DIAGNOSTICS] Fallback substring match result:`, known ? known.key : 'NOT_FOUND');
            }

            if (known) {
                store.currentTabType = known.key;
                store.currentTabInstanceId = known.key;
            } else {
                store.currentTabType = CONFIG.UNKNOWN_TAB_TYPE_KEY;
                store.currentTabInstanceId = sessionStorage.getItem(StorageManager.getKey(CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY)) || Utils.generateId(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX);
                sessionStorage.setItem(StorageManager.getKey(CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY), store.currentTabInstanceId);
                if (!store.userConfig.customTabSettings[store.currentTabInstanceId]) {
                    store.userConfig.customTabSettings[store.currentTabInstanceId] = { displayName: `Tab (${store.currentTabInstanceId.substring(19, 23)})`, includeInGlobal: true };
                }
            }
            
            Utils.log(`[DIAGNOSTICS] Final assigned tab type: ${store.currentTabType}`);
            store.sessionConfig.activeTabInstances[store.currentTabInstanceId] = Date.now();
        },
        init() {
            if (window[CONFIG.SCRIPT_ID_PREFIX + 'INIT']) return;
            window[CONFIG.SCRIPT_ID_PREFIX + 'INIT'] = true;

            StorageManager.loadAll();
            this.identifyTab();
            ShiftManager.update();
            store.initialized = true;
            StorageManager.saveState();

            CSSManager.init();
            StatsWindowRenderer.init();
			DragDropManager.init();
            SettingsPanel.init();
            VisualsRenderer.init();
            InputManager.init();
            AutoTrigger.init();
            StorageManager.listen();

            StatsWindowRenderer.renderContent();

            Utils.log(`Fully loaded. Reactive state active.`);
        }
    };






// ==========================================
    // 9. EMPLOYEE PRESETS (ПЕРСОНАЛЬНЫЕ КОНФИГИ)
    // ==========================================
	
	
///НАЧАЛО КОНФИГА ДЛЯ ЮЗЕРА
/*
		const originalInit = Main.init;
    
		Main.init = function() {
        // 1. Вызываем оригинальное ядро (подгрузка памяти, определение смен)
        originalInit.call(Main);

        // 2. ФОРСИРОВАННЫЙ ПЕРЕРЫВ №4 

		
		
        // Индекс 3 для дневной смены (12:50-13:20), Индекс 7 для ночной (00:50-01:20)
		//индексы 0-3 для дневной, индексы 4-7 для ночной
        const isNight = store.sessionConfig.shiftType === 'night';
        store.sessionConfig.selectedLunchIndex = isNight ? 7 : 3;

        // 3. ИНДИВИДУАЛЬНЫЕ НАСТРОЙКИ В ЗАВИСИМОСТИ ОТ ТЕКУЩЕГО ОТДЕЛА
        const tab = store.currentTabType; // Может быть 'CRET', 'REFURB', 'WHD' или 'UNKNOWN'

        if (tab === 'CRET') {
            // --- Пример: Настройка для вкладки CRET ---
            
            // Включаем только Строку 1 и Строку 2
            store.localTabConfig.linesConfig.line1_currentTab.visible = true;
            store.localTabConfig.linesConfig.line2_globalSummary.visible = true;
            store.localTabConfig.linesConfig.line3_shiftInfo.visible = false;
            store.localTabConfig.linesConfig.line4_lunchInfo.visible = false;
            store.localTabConfig.linesConfig.line5_realTimeClock.visible = false;

            // Настройка Строки 1: Прозрачность 53%, Цвет черный (#000000)
            store.localTabConfig.linesConfig.line1_currentTab.alpha = 53;
            store.localTabConfig.linesConfig.line1_currentTab.colorHex = '#000000';

            // Настройка Строки 2: Включить мультиколор и задать свои цвета
            store.localTabConfig.linesConfig.line2_globalSummary.multicolor = true;
            store.localTabConfig.linesConfig.line2_globalSummary.customColors.CRET = '#0078D7';
            store.localTabConfig.linesConfig.line2_globalSummary.customColors.REFURB = '#FF0000'; 
            store.localTabConfig.linesConfig.line2_globalSummary.customColors.WHD = '#FF0000'; 
			
            // Позиция окна на экране (Левый верхний угол с небольшим отступом)
            store.localTabConfig.statsWindowPosition.top = '15px';
            store.localTabConfig.statsWindowPosition.left = '15%';

            // Глобальные галочки
            store.userConfig.globalStatsContributionKnown.CRET = true;
            store.userConfig.globalStatsContributionKnown.REFURB = true;
            store.userConfig.globalStatsContributionKnown.WHD = true;

        } else if (tab === 'REFURB') {
            // --- Пример: Настройка для вкладки REFURB ---
            store.localTabConfig.linesConfig.line1_currentTab.visible = true;
            store.localTabConfig.linesConfig.line1_currentTab.colorHex = '#FFA500'; // Оранжевый
            store.localTabConfig.linesConfig.line1_currentTab.alpha = 100; // Полная непрозрачность
            
            // Считать в глобальную сумму всё
            store.userConfig.globalStatsContributionKnown.CRET = true;
            store.userConfig.globalStatsContributionKnown.REFURB = true;
            store.userConfig.globalStatsContributionKnown.WHD = true;
        }

        // 4. Фиксация состояния (гарантирует сохранение в localStorage и рендер)
        StorageManager.saveState();
    };

*/
// можно убрать комментарий и добавить конфиги


///КОНЕЦ КОНФИГА ДЛЯ ЮЗЕРА


    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Main.init());
    else Main.init();

})();
