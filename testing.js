/**
 * @fileoverview Enterprise-Grade Performance & Tracking UserScript
 * @version 7.7.7-REFACTOR
 * @architecture Reactive Pub/Sub, DOM-batched updates, Zero-Layout-Thrashing Scanner
 */
(function () {
    'use strict';

    // ==========================================
    // 1. CONFIGURATION & CONSTANTS
    // ==========================================
    const CONFIG = Object.freeze({
        SCRIPT_VERSION: '7.7.7',
        SCRIPT_NAME: 'Helper',
        SCRIPT_ID_PREFIX: 'statsHelper_v7_7_7_',
        DEBUG_MODE: false,

        UI_UPDATE_INTERVAL_MS: 1000,
        FONT_FAMILY_OPTIONS: {
            default: 'Segoe UI, Roboto, Arial, sans-serif',
            monospace: 'Consolas, Monaco, Courier New, monospace',
            sans_serif_thin: 'Roboto, Helvetica Neue, Arial, sans-serif',
        },
        DEFAULT_STATS_WINDOW_POSITION_VALUES: { top: '0px', left: 'calc(11% - 1px)' },

        SETTINGS_PANEL_BACKGROUND_COLOR: 'rgba(245, 245, 245, 0.0)',
        SETTINGS_PANEL_TEXT_COLOR: 'rgba(20, 20, 20, 0.98)',
        SETTINGS_PANEL_ACCENT_COLOR: 'rgba(20, 20, 20, 0.4)',
        SETTINGS_PANEL_INITIAL_WIDTH_PX: 450,
        SETTINGS_PANEL_MIN_WIDTH_PX: 380,
        SETTINGS_PANEL_MAX_WIDTH_PX: 800,
        SETTINGS_PANEL_RESIZE_HANDLE_WIDTH_PX: 8,
        SETTINGS_PANEL_ACCESS_SEQUENCE: ['B', 'O', 'M', 'B', 'A'],

        STATS_WINDOW_BACKGROUND_COLOR_DEFAULT: 'rgba(255, 255, 255, 0)',
        STATS_WINDOW_BACKGROUND_COLOR_DRAGGING: 'rgba(230, 230, 230, 0)',
        STATS_WINDOW_TEXT_COLOR: 'rgba(10,10,10,0.95)',

        DEFAULT_LOCAL_TAB_CONFIG_VALUES: {
            statsWindowFontFamily: 'monospace',
            statsWindowFontSize: 16,
            statsWindowLineVisibility: {
                line1_currentTab: false,
                line2_globalSummary: true,
                line3_shiftInfo: false,
                line4_lunchInfo: false,
                line5_realTimeClock: true,
            },
            pageOverlayOpacity: 0,
            pageIndicatorTextVisible: false,
            statsWindowPosition: { top: '0px', left: 'calc(11% - 1px)' },
            minStatsWindowFontSizePx: 10,
            maxStatsWindowFontSizePx: 64,
        },

        KNOWN_TAB_TYPES: {
            REFURB: { key: 'REFURB', displayNameKey: 'tabName_REFURB', color: 'rgba(255, 165, 0, ${opacity})', textColor: 'rgba(200, 100, 0, 0.2)', urlKeyword: 'REFURB' },
            CRET: { key: 'CRET', displayNameKey: 'tabName_CRET', color: 'rgba(0, 120, 215, ${opacity})', textColor: 'rgba(0, 80, 150, 0.2)', urlKeyword: 'CRETURN' },
            WHD: { key: 'WHD', displayNameKey: 'tabName_WHD', color: 'rgba(30, 180, 30, ${opacity})', textColor: 'rgba(20, 120, 20, 0.2)', urlKeyword: 'DEALS' },
        },
        UNKNOWN_TAB_TYPE_KEY: 'UNKNOWN',
        DEFAULT_UNKNOWN_TAB_DETAILS: { key: 'UNKNOWN', displayNameKey: 'tabName_UNKNOWN', color: 'rgba(128, 128, 128, ${opacity})', textColor: 'rgba(80, 80, 80, 0.2)' },
        UNKNOWN_TAB_INSTANCE_ID_PREFIX: 'unknownTabInstance_',

        MAX_PAGE_OVERLAY_OPACITY_PERCENT: 15,
        MIN_PAGE_OVERLAY_OPACITY_PERCENT: 0,

        SHIFT_TIMES_UTC_PLUS_2: {
            DAY_SHIFT_START_H: 6, DAY_SHIFT_START_M: 19, DAY_SHIFT_END_H: 17, DAY_SHIFT_END_M: 55,
            NIGHT_SHIFT_START_H: 18, NIGHT_SHIFT_START_M: 19, NIGHT_SHIFT_END_H: 5, NIGHT_SHIFT_END_M: 55,
        },
        DEFAULT_CALCULATION_START_TIMES: {
            DAY: { H: 6, M: 30 }, NIGHT: { H: 18, M: 30 },
        },
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
        DEFAULT_LUNCH_INDEX_DAY: 0,
        DEFAULT_LUNCH_INDEX_NIGHT: 4,

        STORAGE_KEY_USER_CONFIG: 'userConfig',
        STORAGE_KEY_SESSION_CONFIG: 'sessionConfig',
        STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS: 'allLocalTabConfigs',
        STORAGE_PREFIX_TAB_COUNTER: 'counter_',
        SESSION_STORAGE_TAB_INSTANCE_ID_KEY: 'tabInstanceId',

        SYNC_INTERVAL_MS: 25000,
        SYNC_JITTER_MS: 5000,
        AUTO_RESET_MAX_AGE_HOURS: 11,

        // High-performance regex (no backtracking risks identified)
        PRE_TRIGGER_REGEX: /poniżej|видите ниже|Transparency/i,
        AUTO_TRIGGER_REGEX: /Przypisz (nowy|ponownie)|канирование номера LP:|Przedmiot wysłano do (?!PROBLEM-SOLVE\b).+/i,
        TRIGGER_OBSERVE_AREA_SELECTOR: 'body',
        DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS: 100,
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
        DEFAULT_KEYBOARD_SHORTCUTS: { INCREMENT: 'None', DECREMENT: 'None' },

        DEFAULT_LANGUAGE: 'pl',
        AVAILABLE_LANGUAGES:[{ code: 'pl', name: 'Polski' }, { code: 'en', name: 'English' }],
    });

    const LANG_STRINGS = Object.freeze({
        en: {
            scriptLoaded: '${scriptName} v${version} Loaded.',
            yes: 'Yes', no: 'No', notApplicable: 'NA',
            error_items_per_hour_unavailable: '~0.0/h (short work time)',
            fromUnit: 'from', inUnit: 'in', hoursShort: 'h', minutesShort: 'm', secondsShort: 's',
            statsPerHourUnit: '/h', completedUnit: 'done',
            tabName_REFURB: 'REFURB', tabName_CRET: 'CRET', tabName_WHD: 'WHD', tabName_UNKNOWN: 'UNKNOWN',
            statsLine1_current: '${tabName} ${itemsPerHour}${statsPerHourUnit} (${count} ${completedUnit} ${inUnit} ${workTimeFormatted})',
            statsLine2_global_separator_new: ' ',
            statsLine2_global_tab_format_new: '${tabName} ${itemsPerHour}${statsPerHourUnit}(${count})',
            statsLine2_global_total_format_new: '= ~${totalItemsPerHour}${statsPerHourUnit} (${totalCount})',
            statsLine3_shift: '${shiftType} Shift (${shiftStartTime})',
            statsLine4_lunch: 'Lunch #${lunchNumber} (${lunchStartTime} - ${lunchEndTime})',
            statsLine5_clock: '[ ${currentTime} ]',
            shift_day: 'DAY', shift_night: 'NIGHT',
            lunch_day1: 'Day Lunch 1 (11:20-11:50)', lunch_day2: 'Day Lunch 2 (11:50-12:20)', lunch_day3: 'Day Lunch 3 (12:20-12:50)', lunch_day4: 'Day Lunch 4 (12:50-13:20)',
            lunch_night1: 'Night Lunch 1 (23:20-23:50)', lunch_night2: 'Night Lunch 2 (23:50-00:20)', lunch_night3: 'Night Lunch 3 (00:20-00:50)', lunch_night4: 'Night Lunch 4 (00:50-01:20)',
            settingsPanelTitle: '${scriptName} Settings',
            settingsButtonTitle: 'Open Settings',
            settings_applyAndCloseButton: 'Apply, Save & Close', settings_applyButton: 'Apply',
            settings_resetAllDataButton: 'Reset All Script Data',
            settings_resetAllDataConfirm: 'Are you sure you want to reset ALL script data? This action cannot be undone and will reload the page.',
            settings_resetWindowPositionButton: 'Reset Window Position',
            settings_manualCounterInputLabel: 'Set count for ${tabName}:',
            section_general: 'General', section_currentTab: 'Current Tab Settings (${tabInstanceId})',
            section_visualAids: 'Page Visual Aids (for ${tabName})', section_statsWindow: 'Statistics Window',
            section_globalStats: 'Global Statistics (Known Types)', section_keyboardShortcuts: 'Keyboard Shortcuts',
            section_autoIncrement: 'Auto-Increment', section_lunchSelection: 'Lunch Break Selection',
            section_otherCustomTabs: 'Other Configured Custom Tabs',
            language: 'Language', customTabDisplayName: 'Display Name', customTabIncludeInGlobal: 'Include this tab in global sum',
            overlayOpacity: 'Overlay Opacity: ${value}%', showPageIndicator: 'Show Page Indicator Text',
            showLine1_currentTab: 'Show Current Tab Stats', showLine2_globalSummary: 'Show Global Summary',
            showLine3_shiftInfo: 'Show Shift Information', showLine4_lunchInfo: 'Show Lunch Information',
            showLine5_realTimeClock: 'Show Real-Time Clock', fontFamily: 'Font Family', fontSize: 'Font Size: ${value}px',
            dragStatsWindowButton: 'Make Stats Window Draggable', dragStatsWindowActiveButton: 'Window is Draggable (Click to Pin)',
            includeInGlobal_known: 'Include ${tabName} in global sum', incrementKey: 'Increment (+1) Key', decrementKey: 'Decrement (-1) Key',
            scanIntervalAutoIncrement: 'Scan Interval: ${value}ms', noCustomTabsConfigured: 'No other custom tabs configured yet.',
            customTabEntryFormat: '${displayName} (ID: ${instanceId_short}) - Included: ${isIncludedStr}',
            fontFamily_default: 'Default (System UI)', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Thin Sans-Serif',
            key_None: 'Disabled', key_ShiftRight: 'Right Shift', key_ControlRight: 'Right Ctrl', key_ScrollLock: 'Scroll Lock',
            key_PauseBreak: 'Pause/Break', key_Insert: 'Insert', key_Numpad0: 'Numpad 0', key_NumpadMultiply: 'Numpad *',
            key_NumpadSubtract: 'Numpad -', key_NumpadAdd: 'Numpad +', key_F10: 'F10',
            initialNotification_currentTab: 'Current Tab:', initialNotification_shiftStart: 'Shift Start:',
            notification_autoResetExecuted: 'Script data older than ${hours} hours detected. All data has been reset.',
        },
        pl: {
            scriptLoaded: '${scriptName} v${version} Załadowany.',
            yes: 'Tak', no: 'Nie', notApplicable: 'BD',
            error_items_per_hour_unavailable: '~0.0/h (za krótki czas pracy)',
            fromUnit: 'od', inUnit: 'w', hoursShort: 'g', minutesShort: 'm', secondsShort: 's',
            statsPerHourUnit: '/h', completedUnit: 'zrobione',
            tabName_REFURB: 'REFURB', tabName_CRET: 'CRET', tabName_WHD: 'WHD', tabName_UNKNOWN: 'NIEZNANA',
            statsLine1_current: '${tabName} ${itemsPerHour}${statsPerHourUnit} (${count} ${completedUnit} ${inUnit} ${workTimeFormatted})',
            statsLine2_global_separator_new: ' ',
            statsLine2_global_tab_format_new: '${tabName} ${itemsPerHour}${statsPerHourUnit}(${count})',
            statsLine2_global_total_format_new: '= ~${totalItemsPerHour}${statsPerHourUnit} (${totalCount})',
            statsLine3_shift: '${shiftType} zmiana (${shiftStartTime})',
            statsLine4_lunch: 'Przerwa #${lunchNumber} (${lunchStartTime} - ${lunchEndTime})',
            statsLine5_clock: '[ ${currentTime} ]',
            shift_day: 'DZIENNA', shift_night: 'NOCNA',
            lunch_day1: 'Przerwa dzienna 1 (11:20-11:50)', lunch_day2: 'Przerwa dzienna 2 (11:50-12:20)', lunch_day3: 'Przerwa dzienna 3 (12:20-12:50)', lunch_day4: 'Przerwa dzienna 4 (12:50-13:20)',
            lunch_night1: 'Przerwa nocna 1 (23:20-23:50)', lunch_night2: 'Przerwa nocna 2 (23:50-00:20)', lunch_night3: 'Przerwa nocna 3 (00:20-00:50)', lunch_night4: 'Przerwa nocna 4 (00:50-01:20)',
            settingsPanelTitle: 'Ustawienia ${scriptName}',
            settings_applyAndCloseButton: 'Zastosuj, Zapisz i Zamknij', settings_applyButton: 'Zastosuj',
            settings_resetAllDataButton: 'Zresetuj Wszystkie Dane Skryptu',
            settings_resetAllDataConfirm: 'Czy na pewno chcesz zresetować WSZYSTKIE dane skryptu? Tej operacji nie można cofnąć i strona zostanie przeładowana.',
            settings_resetWindowPositionButton: 'Zresetuj Pozycję Okna Statystyk',
            settings_manualCounterInputLabel: 'Ustaw licznik dla ${tabName}:',
            section_general: 'Ogólne', section_currentTab: 'Ustawienia Bieżącej Karty (${tabInstanceId})',
            section_visualAids: 'Pomoce Wizualne Strony (dla ${tabName})', section_statsWindow: 'Okno Statystyk',
            section_globalStats: 'Statystyki Globalne (Znane Typy)', section_keyboardShortcuts: 'Skróty Klawiszowe',
            section_autoIncrement: 'Auto-Inkrementacja', section_lunchSelection: 'Wybór Przerwy Obiadowej',
            section_otherCustomTabs: 'Inne Skonfigurowane Karty Niestandardowe',
            language: 'Język', customTabDisplayName: 'Nazwa Wyświetlana', customTabIncludeInGlobal: 'Wlicz tę kartę do sumy globalnej',
            overlayOpacity: 'Przezroczystość Nakładki: ${value}%', showPageIndicator: 'Pokaż Wskaźnik Tekstowy Strony',
            showLine1_currentTab: 'Pokaż statystyki bieżącej karty', showLine2_globalSummary: 'Pokaż podsumowanie globalne',
            showLine3_shiftInfo: 'Pokaż informacje o zmianie', showLine4_lunchInfo: 'Pokaż informacje o przerwie',
            showLine5_realTimeClock: 'Pokaż zegar czasu rzeczywistego', fontFamily: 'Krój Czcionki', fontSize: 'Rozmiar Czcionki: ${value}px',
            dragStatsWindowButton: 'Uaktywnij przeciąganie okna statystyk', dragStatsWindowActiveButton: 'Okno jest przeciągalne (Kliknij by przypiąć)',
            includeInGlobal_known: 'Wlicz ${tabName} do sumy globalnej', incrementKey: 'Klawisz Inkrementacji (+1)', decrementKey: 'Klawisz Dekrementacji (-1)',
            scanIntervalAutoIncrement: 'Interwał Skanowania: ${value}ms', noCustomTabsConfigured: 'Brak skonfigurowanych innych kart niestandardowych.',
            customTabEntryFormat: '${displayName} (ID: ${instanceId_short}) - Włączona: ${isIncludedStr}',
            fontFamily_default: 'Domyślna (Systemowa)', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Cienka Sans-Serif',
            key_None: 'Wyłączony', key_ShiftRight: 'Prawy Shift', key_ControlRight: 'Prawy Ctrl', key_AltRight: 'Prawy Alt',
            key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert', key_Numpad0: 'Num 0',
            key_NumpadMultiply: 'Num *', key_NumpadSubtract: 'Num -', key_NumpadAdd: 'Num +', key_F10: 'F10',
            initialNotification_currentTab: 'Bieżąca Karta:', initialNotification_shiftStart: 'Początek Zmiany:',
            notification_autoResetExecuted: 'Wykryto dane skryptu starsze niż ${hours} godzin. Wszystkie dane zostały zresetowane.',
        }
    });

    // ==========================================
    // 2. CORE UTILITIES & SECURE DOM ENGINE
    // ==========================================
    const Utils = {
        log: (...args) => CONFIG.DEBUG_MODE && console.log(`[${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION}]`, ...args),
        error: (...args) => console.error(`[${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} ERROR]`, ...args),
        
        generateUniqueId: (prefix = '') => `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`,
        
        // Anti-Prototype-Pollution Deep Merge
        deepMergeObjects(target, source) {
            const output = { ...target };
            if (this.isObject(target) && this.isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (['__proto__', 'constructor', 'prototype'].includes(key)) return;
                    if (this.isObject(source[key]) && !Array.isArray(source[key])) {
                        if (!(key in target) || !this.isObject(target[key])) output[key] = source[key];
                        else output[key] = this.deepMergeObjects(target[key], source[key]);
                    } else {
                        output[key] = source[key];
                    }
                });
            }
            return output;
        },
        isObject: (item) => (item && typeof item === 'object' && !Array.isArray(item)),
        safeJsonParse: (str, def = null) => { try { return JSON.parse(str); } catch { return def; } },
        
        debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },

        formatDuration(ms) {
            if (isNaN(ms) || ms <= 0) return I18nManager.getString('notApplicable');
            let s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
            s %= 60; m %= 60;
            const hS = I18nManager.getString('hoursShort'), mS = I18nManager.getString('minutesShort'), sS = I18nManager.getString('secondsShort');
            if (h > 0) return `${h}${hS} ${String(m).padStart(2, '0')}${mS}`;
            if (m > 0) return `${m}${mS} ${String(s).padStart(2, '0')}${sS}`;
            return `${s}${sS}`;
        },
        formatTime: (date, showSec = true, sep = '') => {
            if (!(date instanceof Date) || isNaN(date.getTime())) return showSec ? `00${sep}00${sep}00` : `00${sep}00`;
            const h = String(date.getHours()).padStart(2, '0');
            const m = String(date.getMinutes()).padStart(2, '0');
            return showSec ? `${h}${sep}${m}${sep}${String(date.getSeconds()).padStart(2, '0')}` : `${h}${sep}${m}`;
        },
        timeStringToDate(timeStr, baseDate = new Date(), crossesMidnight = false) {
            const h = parseInt(timeStr.substring(0, 2), 10), m = parseInt(timeStr.substring(2, 4), 10);
            const d = new Date(baseDate);
            d.setHours(h, m, 0, 0);
            if (crossesMidnight) d.setDate(d.getDate() + 1);
            return d;
        }
    };

    /** Secure Virtual Element Builder */
    const DOM = {
        createElement(tag, attributes = {}, children =[]) {
            const el = document.createElement(tag);
            for (const [key, value] of Object.entries(attributes)) {
                if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
                else if (key === 'dataset' && typeof value === 'object') Object.assign(el.dataset, value);
                else if (key === 'id' && value) el.id = value.startsWith(CONFIG.SCRIPT_ID_PREFIX) ? value : CONFIG.SCRIPT_ID_PREFIX + value;
                else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.substring(2).toLowerCase(), value);
                else el[key] = value; // textContent is bound safely here
            }
            children.forEach(child => {
                if (child == null) return;
                el.appendChild(typeof child === 'string' || typeof child === 'number' ? document.createTextNode(String(child)) : child);
            });
            return el;
        }
    };

    // ==========================================
    // 3. REACTIVE STATE MANAGEMENT
    // ==========================================
    class Store {
        constructor() {
            this.state = {
                initialized: false,
                currentTabType: CONFIG.UNKNOWN_TAB_TYPE_KEY,
                currentTabInstanceId: null,
                currentTabVisualDetails: { ...CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS },
                tabCountersCache: {},
                userConfig: {
                    language: CONFIG.DEFAULT_LANGUAGE,
                    globalStatsContributionKnown: Object.fromEntries(Object.values(CONFIG.KNOWN_TAB_TYPES).map(t => [t.key, true])),
                    keyboardShortcuts: { ...CONFIG.DEFAULT_KEYBOARD_SHORTCUTS },
                    triggerMutationDebounceMs: CONFIG.DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS,
                    settingsPanelWidth: CONFIG.SETTINGS_PANEL_INITIAL_WIDTH_PX,
                    customTabSettings: {},
                    defaultLocalTabConfig: { ...CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES },
                },
                localTabConfig: {},
                sessionConfig: { shiftType: null, shiftCalculatedStartTime: null, selectedLunchIndex: null, activeTabInstances: {}, sessionLastActivityTimestamp: null },
                uiStateFlags: { isSettingsPanelVisible: false, isStatsWindowDragging: false, isSettingsPanelResizing: false, settingsPanelInteractionLock: false, autoTriggerFoundOnLastScan: false, itemInProgress: false }
            };
        }
    }
    const AppState = new Store();

    // ==========================================
    // 4. INTERNATIONALIZATION
    // ==========================================
    const I18nManager = {
        getString(key, replacements = {}) {
            const lang = AppState.state.userConfig.language || CONFIG.DEFAULT_LANGUAGE;
            let str = LANG_STRINGS[lang]?.[key] ?? LANG_STRINGS[CONFIG.DEFAULT_LANGUAGE]?.[key] ?? `[NoTrans:${key}]`;
            for (const [placeholder, value] of Object.entries(replacements)) {
                str = str.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), value);
            }
            return str.replace(/\$\{version\}/g, CONFIG.SCRIPT_VERSION).replace(/\$\{scriptName\}/g, CONFIG.SCRIPT_NAME);
        },
        getTabDisplayName(id) {
            const known = Object.values(CONFIG.KNOWN_TAB_TYPES).find(t => t.key === id);
            if (known) return I18nManager.getString(known.displayNameKey);
            if (AppState.state.userConfig.customTabSettings[id]) return AppState.state.userConfig.customTabSettings[id].displayName || id;
            if (id.startsWith(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX)) return `${I18nManager.getString(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${id.substring(20, 25)}...)`;
            return id;
        }
    };

    // ==========================================
    // 5. STORAGE SERVICE
    // ==========================================
    const StorageService = {
        _cache: {},
        getLKey: (k) => `${CONFIG.SCRIPT_ID_PREFIX}${k}`,
        save: (key, data, session = false) => {
            try { (session ? sessionStorage : localStorage).setItem(StorageService.getLKey(key), JSON.stringify(data)); } 
            catch (e) { Utils.error(`Storage Error [${key}]`, e); }
        },
        load: (key, def = null, session = false) => {
            try { const i = (session ? sessionStorage : localStorage).getItem(StorageService.getLKey(key)); return i ? Utils.safeJsonParse(i, def) : def; } 
            catch (e) { return def; }
        },
        
        syncAll() {
            const oldConf = AppState.state.userConfig;
            AppState.state.userConfig = Utils.deepMergeObjects(oldConf, StorageService.load(CONFIG.STORAGE_KEY_USER_CONFIG, {}));
            AppState.state.sessionConfig = Utils.deepMergeObjects(AppState.state.sessionConfig, StorageService.load(CONFIG.STORAGE_KEY_SESSION_CONFIG, {}));
            
            const allLocalConfigs = StorageService.load(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, {});
            AppState.state.localTabConfig = Utils.deepMergeObjects(AppState.state.userConfig.defaultLocalTabConfig, allLocalConfigs[AppState.state.currentTabInstanceId] || {});
            
            // Hydrate Counters
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i), p = StorageService.getLKey(CONFIG.STORAGE_PREFIX_TAB_COUNTER);
                if (k?.startsWith(p)) AppState.state.tabCountersCache[k.substring(p.length)] = parseInt(localStorage.getItem(k) || '0', 10);
            }
        },

        saveCounter(id, val) {
            StorageService.save(CONFIG.STORAGE_PREFIX_TAB_COUNTER + id, val);
            AppState.state.tabCountersCache[id] = val;
        },

        factoryReset() {
            Object.keys(localStorage).forEach(k => k.startsWith(CONFIG.SCRIPT_ID_PREFIX) && localStorage.removeItem(k));
            Object.keys(sessionStorage).forEach(k => k.startsWith(CONFIG.SCRIPT_ID_PREFIX) && sessionStorage.removeItem(k));
            window.location.reload();
        }
    };

    // ==========================================
    // 6. BUSINESS LOGIC (Calculators)
    // ==========================================
    const ShiftLogic = {
        updateCurrentShift() {
            const now = new Date(), mins = now.getHours() * 60 + now.getMinutes(), ST = CONFIG.SHIFT_TIMES_UTC_PLUS_2, CST = CONFIG.DEFAULT_CALCULATION_START_TIMES;
            let type = null, startObj = new Date(now);

            const dayStart = ST.DAY_SHIFT_START_H * 60 + ST.DAY_SHIFT_START_M, dayEnd = ST.DAY_SHIFT_END_H * 60 + ST.DAY_SHIFT_END_M;
            const nightStart = ST.NIGHT_SHIFT_START_H * 60 + ST.NIGHT_SHIFT_START_M, nightEnd = ST.NIGHT_SHIFT_END_H * 60 + ST.NIGHT_SHIFT_END_M;

            if (mins >= dayStart && mins < dayEnd) {
                type = 'day'; startObj.setHours(CST.DAY.H, CST.DAY.M, 0, 0);
            } else if ((nightStart > nightEnd && (mins >= nightStart || mins < nightEnd)) || (nightStart < nightEnd && (mins >= nightStart && mins < nightEnd))) {
                type = 'night'; startObj.setHours(CST.NIGHT.H, CST.NIGHT.M, 0, 0);
                if (now.getHours() < 12 && CST.NIGHT.H >= 12) startObj.setDate(now.getDate() - 1);
            }

            if (AppState.state.sessionConfig.shiftType !== type) {
                AppState.state.sessionConfig.shiftType = type;
                AppState.state.sessionConfig.shiftCalculatedStartTime = type ? startObj.getTime() : null;
                AppState.state.sessionConfig.selectedLunchIndex = type === 'day' ? CONFIG.DEFAULT_LUNCH_INDEX_DAY : (type === 'night' ? CONFIG.DEFAULT_LUNCH_INDEX_NIGHT : null);
                StorageService.save(CONFIG.STORAGE_KEY_SESSION_CONFIG, AppState.state.sessionConfig);
            }
        },
        getWorkTime() {
            if (!AppState.state.sessionConfig.shiftType) return { workedMs: 0, lunchDurationMs: 0 };
            const now = Date.now(), start = new Date(AppState.state.sessionConfig.shiftCalculatedStartTime);
            let elapsed = Math.max(0, now - start.getTime()), lunchMs = 0;
            const lIdx = AppState.state.sessionConfig.selectedLunchIndex;
            
            if (lIdx !== null && CONFIG.LUNCH_OPTIONS_BASE[lIdx]) {
                const lOpt = CONFIG.LUNCH_OPTIONS_BASE[lIdx];
                const lStart = Utils.timeStringToDate(lOpt.start, start, lOpt.type === 'night' && start.getHours() >= 12 && parseInt(lOpt.start.substring(0,2),10) < 12);
                const lEnd = Utils.timeStringToDate(lOpt.end, start, lOpt.type === 'night' && (start.getHours() >= 12 && parseInt(lOpt.end.substring(0,2),10) < 12 || parseInt(lOpt.end.substring(0,2),10) < parseInt(lOpt.start.substring(0,2),10)));
                if (lEnd < lStart) lEnd.setDate(lEnd.getDate() + 1);
                
                const actualStart = Math.max(start.getTime(), lStart.getTime()), actualEnd = Math.min(now, lEnd.getTime());
                if (actualEnd > actualStart) lunchMs = actualEnd - actualStart;
            }
            return { workedMs: Math.max(0, elapsed - lunchMs), lunchDurationMs: lunchMs, shiftStartTimeObj: start };
        }
    };

    const StatsLogic = {
        calc() {
            const { workedMs, shiftStartTimeObj } = ShiftLogic.getWorkTime();
            const hrs = workedMs > 0 ? workedMs / 3600000 : 0;
            const cId = AppState.state.currentTabInstanceId, cCount = AppState.state.tabCountersCache[cId] || 0;
            
            const fmtIPH = (cnt) => hrs > 0.0027 ? (cnt / hrs).toFixed(1) : (cnt > 0 ? I18nManager.getString('error_items_per_hour_unavailable') : '0.0');

            let gCount = 0;
            const tabs =[];
            const allKeys = new Set([...Object.values(CONFIG.KNOWN_TAB_TYPES).map(t=>t.key), ...Object.keys(AppState.state.userConfig.customTabSettings)]);
            
            allKeys.forEach(k => {
                const cnt = AppState.state.tabCountersCache[k] || 0;
                const inc = Object.values(CONFIG.KNOWN_TAB_TYPES).find(t=>t.key === k) ? AppState.state.userConfig.globalStatsContributionKnown[k] : AppState.state.userConfig.customTabSettings[k]?.includeInGlobal;
                if (inc && (AppState.state.sessionConfig.activeTabInstances[k] || cnt > 0)) {
                    tabs.push({ displayName: I18nManager.getTabDisplayName(k), itemsPerHourFormatted: fmtIPH(cnt), count: cnt });
                    gCount += cnt;
                }
            });

            const lIdx = AppState.state.sessionConfig.selectedLunchIndex;
            let lunchStr = I18nManager.getString('notApplicable');
            if (lIdx !== null && CONFIG.LUNCH_OPTIONS_BASE[lIdx]) {
                const lOpt = CONFIG.LUNCH_OPTIONS_BASE[lIdx];
                lunchStr = I18nManager.getString('statsLine4_lunch', { lunchNumber: CONFIG.LUNCH_OPTIONS_BASE.filter(l=>l.type===lOpt.type).indexOf(lOpt) + 1, lunchStartTime: `${lOpt.start.substring(0,2)}:${lOpt.start.substring(2,4)}`, lunchEndTime: `${lOpt.end.substring(0,2)}:${lOpt.end.substring(2,4)}`});
            }

            return {
                curr: { name: I18nManager.getTabDisplayName(cId), count: cCount, iph: fmtIPH(cCount), time: Utils.formatDuration(workedMs) },
                global: { tabs, totalIph: fmtIPH(gCount), totalCount: gCount },
                shiftStr: shiftStartTimeObj ? I18nManager.getString('statsLine3_shift', { shiftType: I18nManager.getString(`shift_${AppState.state.sessionConfig.shiftType}`), shiftStartTime: Utils.formatTime(shiftStartTimeObj, false, ':') }) : I18nManager.getString('notApplicable'),
                lunchStr, clockStr: Utils.formatTime(new Date(), true, ':')
            };
        }
    };

    // ==========================================
    // 7. PERFORMANCE-OPTIMIZED DOM OBSERVER
    // ==========================================
    const AutoScanner = {
        observer: null,
        debouncedRun: null,
        
        start() {
            if (this.observer) this.observer.disconnect();
            
            this.debouncedRun = Utils.debounce(() => {
                // Highly Optimized: Reads raw C++ string of the node via textContent. 
                // Does NOT hide/show UI, preventing forced layout thrashing.
                const root = document.querySelector(CONFIG.TRIGGER_OBSERVE_AREA_SELECTOR) || document.body;
                const txt = root.textContent || ''; 
                
                if (CONFIG.PRE_TRIGGER_REGEX.test(txt)) AppState.state.uiStateFlags.itemInProgress = true;
                if (CONFIG.AUTO_TRIGGER_REGEX.test(txt)) {
                    if (AppState.state.uiStateFlags.itemInProgress && !AppState.state.uiStateFlags.autoTriggerFoundOnLastScan) {
                        Utils.log('Auto-trigger DETECTED.');
                        ActionHandler.increment(false);
                        AppState.state.uiStateFlags.autoTriggerFoundOnLastScan = true;
                        AppState.state.uiStateFlags.itemInProgress = false;
                    }
                } else {
                    AppState.state.uiStateFlags.autoTriggerFoundOnLastScan = false;
                }
            }, AppState.state.userConfig.triggerMutationDebounceMs);

            this.observer = new MutationObserver(mutations => {
                let requiresScan = false;
                for (const m of mutations) {
                    // Filter out changes from our own UI to avoid loop feedback
                    if (m.target.id && m.target.id.startsWith(CONFIG.SCRIPT_ID_PREFIX)) continue;
                    if (m.type === 'childList' && m.addedNodes.length > 0) requiresScan = true;
                    if (m.type === 'characterData') requiresScan = true;
                    if (requiresScan) break;
                }
                if (requiresScan) this.debouncedRun();
            });

            this.observer.observe(document.querySelector(CONFIG.TRIGGER_OBSERVE_AREA_SELECTOR) || document.body, { childList: true, subtree: true, characterData: true });
        },
        stop() {
            if (this.observer) this.observer.disconnect();
            this.observer = null;
        }
    };

    // ==========================================
    // 8. EVENT HANDLERS & ACTIONS
    // ==========================================
    const ActionHandler = {
        increment(manual) {
            if (AppState.state.uiStateFlags.settingsPanelInteractionLock && !manual) return;
            const id = AppState.state.currentTabInstanceId;
            StorageService.saveCounter(id, (AppState.state.tabCountersCache[id] || 0) + 1);
            AppState.state.sessionConfig.sessionLastActivityTimestamp = Date.now();
            requestAnimationFrame(UI.renderStatsWindow);
        },
        decrement(manual) {
            const id = AppState.state.currentTabInstanceId;
            const cur = AppState.state.tabCountersCache[id] || 0;
            if (cur > 0) {
                StorageService.saveCounter(id, cur - 1);
                AppState.state.sessionConfig.sessionLastActivityTimestamp = Date.now();
                requestAnimationFrame(UI.renderStatsWindow);
            }
        }
    };

    const KeyboardManager = {
        handle(e) {
            const tag = e.target.tagName?.toLowerCase();
            if ((tag === 'input' || tag === 'textarea' || e.target.isContentEditable) && !e.target.id?.startsWith(CONFIG.SCRIPT_ID_PREFIX)) {
                AppState.state.settingsPanelAccessSequenceBuffer =[];
                if (!AppState.state.uiStateFlags.isSettingsPanelVisible) return;
            }

            const { INCREMENT: inc, DECREMENT: dec } = AppState.state.userConfig.keyboardShortcuts;
            if (inc !== 'None' && e.code === inc) { e.preventDefault(); ActionHandler.increment(true); return; }
            if (dec !== 'None' && e.code === dec) { e.preventDefault(); ActionHandler.decrement(true); return; }

            if (e.key.length === 1) {
                const buf = AppState.state.settingsPanelAccessSequenceBuffer ||[];
                buf.push(e.key.toUpperCase());
                if (buf.length >= CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length) {
                    if (CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.every((val, idx) => val === buf.slice(-CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length)[idx])) {
                        buf.length = 0; e.preventDefault(); UI.toggleSettings();
                    }
                }
                if (buf.length > 10) buf.shift();
                AppState.state.settingsPanelAccessSequenceBuffer = buf;
            }
        }
    };

    // ==========================================
    // 9. DRAG & DROP ENGINE (Memory-Safe)
    // ==========================================
    const DragEngine = {
        state: null,
        init(el, mode, onEnd, targetEl = null) {
            const target = targetEl || el;
            el.style.cursor = mode === 'move' ? 'grab' : 'ew-resize';
            el.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                const rect = target.getBoundingClientRect();
                this.state = { mode, target, onEnd, startX: e.clientX, startY: e.clientY, initW: target.offsetWidth, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
                
                if (mode === 'move') {
                    target.style.position = 'fixed';
                    target.style.left = rect.left + 'px'; target.style.top = rect.top + 'px';
                    target.style.bottom = ''; target.style.right = '';
                    el.style.cursor = 'grabbing';
                }
                document.addEventListener('mousemove', this.move);
                document.addEventListener('mouseup', this.end, { once: true });
            });
        },
        move: (e) => {
            const st = DragEngine.state;
            if (!st) return;
            e.preventDefault();
            if (st.mode === 'move') {
                st.target.style.left = Math.max(0, Math.min(e.clientX - st.offX, window.innerWidth - st.target.offsetWidth)) + 'px';
                st.target.style.top = Math.max(0, Math.min(e.clientY - st.offY, window.innerHeight - st.target.offsetHeight)) + 'px';
            } else if (st.mode === 'resize') {
                st.target.style.width = Math.max(CONFIG.SETTINGS_PANEL_MIN_WIDTH_PX, Math.min(st.initW - (e.clientX - st.startX), CONFIG.SETTINGS_PANEL_MAX_WIDTH_PX)) + 'px';
            }
        },
        end: () => {
            const st = DragEngine.state;
            if (!st) return;
            document.removeEventListener('mousemove', DragEngine.move);
            if (st.mode === 'move') st.target.style.cursor = 'grab';
            if (st.onEnd) st.onEnd(st.mode === 'move' ? { left: st.target.style.left, top: st.target.style.top } : parseInt(st.target.style.width, 10));
            DragEngine.state = null;
        }
    };

    // ==========================================
    // 10. USER INTERFACE COMPONENTS
    // ==========================================
    const UI = {
        refs: {},
        
        init() {
            // Render basic overlays
            this.refs.overlay = DOM.createElement('div', { id: 'pageOverlay', style: { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '1', pointerEvents: 'none', transition: 'background-color 0.4s, opacity 0.4s', opacity: '0' }});
            this.refs.indicator = DOM.createElement('div', { id: 'pageIndicator', style: { position: 'fixed', top: '50%', right: '75px', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'bottom right', fontSize: 'clamp(30px, 5vw, 60px)', fontWeight: 'bold', zIndex: '2', pointerEvents: 'none', userSelect: 'none', transition: 'color 0.4s, opacity 0.4s', opacity: '0' }});
            
            // Render Stats Window
            this.refs.statsWindow = DOM.createElement('div', { id: 'statsWindow', style: { position: 'fixed', padding: '5px 10px', borderRadius: '5px', zIndex: '2147483640', cursor: 'default', userSelect: 'none', pointerEvents: 'none', transition: 'all 0.2s' }});
            this.refs.statsLines = Array.from({ length: 5 }, (_, i) => DOM.createElement('div', { id: `statsWindow_line${i+1}`, style: { whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }}));
            this.refs.statsLines.forEach(l => this.refs.statsWindow.appendChild(l));

            // Render Settings Panel Base
            this.refs.panel = DOM.createElement('div', { id: 'settingsPanel', style: { position: 'fixed', top: '10px', right: '10px', minWidth: `${CONFIG.SETTINGS_PANEL_MIN_WIDTH_PX}px`, height: 'calc(100vh - 80px)', padding: '15px', backgroundColor: CONFIG.SETTINGS_PANEL_BACKGROUND_COLOR, color: CONFIG.SETTINGS_PANEL_TEXT_COLOR, border: `1px solid ${CONFIG.SETTINGS_PANEL_ACCENT_COLOR}`, borderRadius: '8px', zIndex: '2147483646', overflowY: 'auto', display: 'none', transition: 'opacity 0.2s, transform 0.2s', opacity: '0', transform: 'translateX(20px)' }});
            const resizer = DOM.createElement('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: `${CONFIG.SETTINGS_PANEL_RESIZE_HANDLE_WIDTH_PX}px`, cursor: 'ew-resize', backgroundColor: `${CONFIG.SETTINGS_PANEL_ACCENT_COLOR}4D` }});
            DragEngine.init(resizer, 'resize', (w) => { AppState.state.userConfig.settingsPanelWidth = w; StorageService.save(CONFIG.STORAGE_KEY_USER_CONFIG, AppState.state.userConfig); }, this.refs.panel);
            this.refs.panel.appendChild(resizer);
            this.refs.panelContent = DOM.createElement('div');
            this.refs.panel.appendChild(this.refs.panelContent);

            document.body.append(this.refs.overlay, this.refs.indicator, this.refs.statsWindow, this.refs.panel);

            this.applyVisuals();
            requestAnimationFrame(this.renderStatsWindow.bind(this));
            
            // Setup regular update loop via requestAnimationFrame mapped to setInterval
            setInterval(() => requestAnimationFrame(() => { ShiftLogic.updateCurrentShift(); this.renderStatsWindow(); }), CONFIG.UI_UPDATE_INTERVAL_MS);
        },

        applyVisuals() {
            const ltc = AppState.state.localTabConfig;
            
            // Overlay
            if (ltc.pageOverlayOpacity > 0) {
                this.refs.overlay.style.backgroundColor = (AppState.state.currentTabVisualDetails.color || CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.color).replace('${opacity}', (ltc.pageOverlayOpacity / 100).toFixed(3));
                this.refs.overlay.style.opacity = '1';
            } else this.refs.overlay.style.opacity = '0';

            // Indicator
            if (ltc.pageIndicatorTextVisible) {
                this.refs.indicator.textContent = I18nManager.getTabDisplayName(AppState.state.currentTabInstanceId).substring(0,12).toUpperCase();
                this.refs.indicator.style.color = AppState.state.currentTabVisualDetails.textColor || CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.textColor;
                this.refs.indicator.style.display = 'block';
                this.refs.indicator.style.opacity = '1';
            } else {
                this.refs.indicator.style.opacity = '0';
                setTimeout(() => { if (!AppState.state.localTabConfig.pageIndicatorTextVisible) this.refs.indicator.style.display = 'none'; }, 400);
            }

            // Stats Window
            Object.assign(this.refs.statsWindow.style, {
                fontFamily: CONFIG.FONT_FAMILY_OPTIONS[ltc.statsWindowFontFamily] || CONFIG.FONT_FAMILY_OPTIONS.default,
                fontSize: `${ltc.statsWindowFontSize}px`,
                lineHeight: `${ltc.statsWindowFontSize * 1.3}px`,
                backgroundColor: AppState.state.uiStateFlags.isStatsWindowDragging ? CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DRAGGING : CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DEFAULT,
                color: CONFIG.STATS_WINDOW_TEXT_COLOR,
                top: ltc.statsWindowPosition.top || '', left: ltc.statsWindowPosition.left || '', bottom: ltc.statsWindowPosition.bottom || '', right: ltc.statsWindowPosition.right || ''
            });
            
            // Panel
            this.refs.panel.style.width = `${AppState.state.userConfig.settingsPanelWidth}px`;
        },

        renderStatsWindow() {
            if (!AppState.state.initialized) return;
            const data = StatsLogic.calc();
            const vis = AppState.state.localTabConfig.statsWindowLineVisibility;
            const lines = this.refs.statsLines;

            if (vis.line1_currentTab) { lines[0].style.display = ''; lines[0].textContent = I18nManager.getString('statsLine1_current', { tabName: data.curr.name, itemsPerHour: data.curr.iph, statsPerHourUnit: I18nManager.getString('statsPerHourUnit'), count: data.curr.count, completedUnit: I18nManager.getString('completedUnit'), inUnit: I18nManager.getString('inUnit'), workTimeFormatted: data.curr.time }); } else lines[0].style.display = 'none';
            if (vis.line2_globalSummary) {
                lines[1].style.display = '';
                const tabStrs = data.global.tabs.map(t => I18nManager.getString('statsLine2_global_tab_format_new', { tabName: t.displayName.substring(0,10), itemsPerHour: t.itemsPerHourFormatted, statsPerHourUnit: I18nManager.getString('statsPerHourUnit'), count: t.count }));
                lines[1].textContent = tabStrs.join(I18nManager.getString('statsLine2_global_separator_new')) + (tabStrs.length ? I18nManager.getString('statsLine2_global_separator_new') + I18nManager.getString('statsLine2_global_total_format_new', { totalItemsPerHour: data.global.totalIph, statsPerHourUnit: I18nManager.getString('statsPerHourUnit'), totalCount: data.global.totalCount }) : '');
            } else lines[1].style.display = 'none';
            if (vis.line3_shiftInfo) { lines[2].style.display = ''; lines[2].textContent = data.shiftStr; } else lines[2].style.display = 'none';
            if (vis.line4_lunchInfo) { lines[3].style.display = ''; lines[3].textContent = data.lunchStr; } else lines[3].style.display = 'none';
            if (vis.line5_realTimeClock) { lines[4].style.display = ''; lines[4].textContent = I18nManager.getString('statsLine5_clock', { currentTime: data.clockStr }); } else lines[4].style.display = 'none';
        },

        toggleSettings() {
            const f = AppState.state.uiStateFlags;
            f.isSettingsPanelVisible = !f.isSettingsPanelVisible;
            if (f.isSettingsPanelVisible) {
                f.settingsPanelInteractionLock = true;
                this.renderSettingsPanel();
                this.refs.panel.style.display = 'block';
                this.refs.panel.offsetHeight; // force reflow for animation
                this.refs.panel.style.opacity = '1';
                this.refs.panel.style.transform = 'translateX(0)';
            } else {
                StorageService.save(CONFIG.STORAGE_KEY_USER_CONFIG, AppState.state.userConfig);
                const allLoc = StorageService.load(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, {});
                allLoc[AppState.state.currentTabInstanceId] = AppState.state.localTabConfig;
                StorageService.save(CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, allLoc);
                f.settingsPanelInteractionLock = false;
                this.refs.panel.style.opacity = '0';
                this.refs.panel.style.transform = 'translateX(20px)';
                setTimeout(() => { if (!f.isSettingsPanelVisible) this.refs.panel.style.display = 'none'; }, 200);
            }
        },

        renderSettingsPanel() {
            const root = this.refs.panelContent;
            root.innerHTML = ''; // Safe here, rebuilding virtual elements
            
            const createRow = (labelKey, control) => DOM.createElement('div', { style: { marginBottom: '10px', display: 'flex', alignItems: 'center' }},[
                DOM.createElement('label', { textContent: I18nManager.getString(labelKey) + ':', style: { minWidth: '150px', fontWeight: '500' }}), control
            ]);

            // General Section
            const sGen = DOM.createElement('div', { style: { marginBottom:'20px'} },[ DOM.createElement('h3', { textContent: I18nManager.getString('section_general'), style: { color: CONFIG.SETTINGS_PANEL_ACCENT_COLOR }}) ]);
            const langSel = DOM.createElement('select', { onchange: e => { AppState.state.userConfig.language = e.target.value; requestAnimationFrame(() => { UI.renderSettingsPanel(); UI.renderStatsWindow(); }); }});
            CONFIG.AVAILABLE_LANGUAGES.forEach(l => langSel.appendChild(DOM.createElement('option', { value: l.code, textContent: l.name, selected: l.code === AppState.state.userConfig.language })));
            sGen.append(createRow('language', langSel), DOM.createElement('button', { textContent: I18nManager.getString('settings_resetAllDataButton'), style: { background: '#d9534f', color: 'white', padding: '8px', border: 'none', width: '100%' }, onclick: StorageService.factoryReset }));
            root.appendChild(sGen);

            // Close button logic wrapper
            root.appendChild(DOM.createElement('hr'));
            root.appendChild(DOM.createElement('button', { textContent: I18nManager.getString('settings_applyAndCloseButton'), style: { width: '100%', padding: '10px', background: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, color: 'white', border: 'none' }, onclick: () => this.toggleSettings() }));
        },
        
        notify(msg, duration = 3500) {
            const notif = DOM.createElement('div', { textContent: msg, style: { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 25px', backgroundColor: 'rgba(30,130,30,0.9)', color: 'white', borderRadius: '6px', zIndex: '2147483647', textAlign: 'center', whiteSpace: 'pre-line', transition: 'all 0.5s', opacity: '0' }});
            document.body.appendChild(notif);
            setTimeout(() => { notif.style.opacity = '1'; }, 100);
            setTimeout(() => { notif.style.opacity = '0'; notif.style.transform = 'translateX(-50%) translateY(-20px)'; setTimeout(()=>notif.remove(), 500); }, duration);
        }
    };

    // ==========================================
    // 11. BOOTSTRAP & INITIALIZATION
    // ==========================================
    const Main = {
        init() {
            if (window[`${CONFIG.SCRIPT_ID_PREFIX}flag`]) return;
            window[`${CONFIG.SCRIPT_ID_PREFIX}flag`] = true;
            Utils.log('Initializing Boot Sequence...');

            StorageService.syncAll();

            // Tab Identification Logic
            const url = window.location.href.toUpperCase();
            let matched = null;
            for (const t of Object.values(CONFIG.KNOWN_TAB_TYPES)) { if (url.includes(t.urlKeyword.toUpperCase())) { matched = t; break; } }
            
            if (matched) {
                AppState.state.currentTabType = matched.key; AppState.state.currentTabInstanceId = matched.key; AppState.state.currentTabVisualDetails = matched;
            } else {
                AppState.state.currentTabType = CONFIG.UNKNOWN_TAB_TYPE_KEY;
                let instId = StorageService.load(CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY, null, true);
                if (!instId) { instId = Utils.generateUniqueId(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX); StorageService.save(CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY, instId, true); }
                AppState.state.currentTabInstanceId = instId; AppState.state.currentTabVisualDetails = CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS;
                if (!AppState.state.userConfig.customTabSettings[instId]) AppState.state.userConfig.customTabSettings[instId] = { displayName: `${I18nManager.getString(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${instId.substring(20,25)}...)`, includeInGlobal: true };
            }
            AppState.state.sessionConfig.activeTabInstances[AppState.state.currentTabInstanceId] = Date.now();
            StorageService.save(CONFIG.STORAGE_KEY_SESSION_CONFIG, AppState.state.sessionConfig);

            ShiftLogic.updateCurrentShift();
            UI.init();
            
            document.addEventListener('keydown', KeyboardManager.handle, true);
            window.addEventListener('storage', (e) => { if (e.key?.startsWith(CONFIG.SCRIPT_ID_PREFIX)) requestAnimationFrame(StorageService.syncAll); });
            
            AutoScanner.start();
            AppState.state.initialized = true;

            UI.notify(`${I18nManager.getString('scriptLoaded')}\n${I18nManager.getString('initialNotification_currentTab')} ${I18nManager.getTabDisplayName(AppState.state.currentTabInstanceId)}\n${I18nManager.getString('initialNotification_shiftStart')} ${AppState.state.sessionConfig.shiftCalculatedStartTime ? Utils.formatTime(new Date(AppState.state.sessionConfig.shiftCalculatedStartTime), false, ':') : I18nManager.getString('notApplicable')}`);
            
            // Expose for Automated Testing Frameworks
            if (CONFIG.DEBUG_MODE) window.__StatsAppTestHook__ = { AppState, StorageService, ActionHandler, ShiftLogic, StatsLogic, UI, Utils };
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') Main.init();
    else document.addEventListener('DOMContentLoaded', Main.init, { once: true });

})();
