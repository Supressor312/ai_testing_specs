(function() {
    'use strict';

    const CONFIG = {
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
        LUNCH_OPTIONS_BASE: [
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
        AUTO_RESET_MAX_AGE_HOURS: 14,
        
        PRE_TRIGGER_REGEX: /poniżej|видите ниже/i,
        AUTO_TRIGGER_REGEX: /Przypisz (nowy|ponownie)|канирование номера LP:|Przedmiot wysłano do (?!PROBLEM-SOLVE\b).+/i, 
        TRIGGER_OBSERVE_AREA_SELECTOR: 'body',
        DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS: 100, 
        MIN_TRIGGER_DEBOUNCE_MS: 50, 
        MAX_TRIGGER_DEBOUNCE_MS: 200,

        AVAILABLE_SHORTCUT_KEYS: [
            { code: 'None', name_key: 'key_None' },
            { code: 'ShiftRight', name_key: 'key_ShiftRight' }, { code: 'ControlRight', name_key: 'key_ControlRight' },
            { code: 'AltRight', name_key: 'key_AltRight' }, { code: 'ScrollLock', name_key: 'key_ScrollLock' },
            { code: 'Pause', name_key: 'key_PauseBreak' }, { code: 'Insert', name_key: 'key_Insert' },
            { code: 'Numpad0', name_key: 'key_Numpad0' }, { code: 'NumpadMultiply', name_key: 'key_NumpadMultiply' },
            { code: 'NumpadSubtract', name_key: 'key_NumpadSubtract' }, { code: 'NumpadAdd', name_key: 'key_NumpadAdd' },
            { code: 'F10', name_key: 'key_F10' },
        ],
        DEFAULT_KEYBOARD_SHORTCUTS: { INCREMENT: 'None', DECREMENT: 'None' }, 

        DEFAULT_LANGUAGE: 'pl', 
        AVAILABLE_LANGUAGES: [{ code: 'pl', name: 'Polski' }, { code: 'en', name: 'English' }],
        LANG_STRINGS: {

            en: {

                scriptLoaded: '${scriptName} v${version} Loaded.',
                yes: 'Yes', no: 'No',
                notApplicable: 'NA',
                error_items_per_hour_unavailable: '~0.0/h (short work time)',
                fromUnit: 'from', inUnit: 'in',
                hoursShort: 'h', minutesShort: 'm', secondsShort: 's',
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
                settings_applyAndCloseButton: 'Apply, Save & Close', 
                settings_applyButton: 'Apply', 
                settings_resetAllDataButton: 'Reset All Script Data', 
                settings_resetAllDataConfirm: 'Are you sure you want to reset ALL script data? This action cannot be undone and will reload the page.', 
                settings_resetWindowPositionButton: 'Reset Window Position', 
                settings_manualCounterInputLabel: 'Set count for ${tabName}:', 
                section_general: 'General',
                section_currentTab: 'Current Tab Settings (${tabInstanceId})',
                section_visualAids: 'Page Visual Aids (for ${tabName})', 
                section_statsWindow: 'Statistics Window', 
                section_globalStats: 'Global Statistics (Known Types)',
                section_keyboardShortcuts: 'Keyboard Shortcuts',
                section_autoIncrement: 'Auto-Increment',
                section_lunchSelection: 'Lunch Break Selection',
                section_otherCustomTabs: 'Other Configured Custom Tabs',

                language: 'Language',
                customTabDisplayName: 'Display Name',
                customTabIncludeInGlobal: 'Include this tab in global sum',
                overlayOpacity: 'Overlay Opacity: ${value}%',
                showPageIndicator: 'Show Page Indicator Text',
                showLine1_currentTab: 'Show Current Tab Stats',
                showLine2_globalSummary: 'Show Global Summary',
                showLine3_shiftInfo: 'Show Shift Information',
                showLine4_lunchInfo: 'Show Lunch Information',
                showLine5_realTimeClock: 'Show Real-Time Clock',
                fontFamily: 'Font Family',
                fontSize: 'Font Size: ${value}px',
                dragStatsWindowButton: 'Make Stats Window Draggable',
                dragStatsWindowActiveButton: 'Window is Draggable (Click to Pin)',
                includeInGlobal_known: 'Include ${tabName} in global sum',
                incrementKey: 'Increment (+1) Key',
                decrementKey: 'Decrement (-1) Key',
                scanIntervalAutoIncrement: 'Scan Interval: ${value}ms',
                noCustomTabsConfigured: 'No other custom tabs configured yet.',
                customTabEntryFormat: '${displayName} (ID: ${instanceId_short}) - Included: ${isIncludedStr}',

                fontFamily_default: 'Default (System UI)', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Thin Sans-Serif',

                key_None: 'Disabled', key_ShiftRight: 'Right Shift', key_ControlRight: 'Right Ctrl',
                key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert',
                key_Numpad0: 'Numpad 0', key_NumpadMultiply: 'Numpad *', key_NumpadSubtract: 'Numpad -',
                key_NumpadAdd: 'Numpad +', key_F10: 'F10',

                initialNotification_currentTab: 'Current Tab:',
                initialNotification_shiftStart: 'Shift Start:',
                notification_autoResetExecuted: 'Script data older than ${hours} hours detected. All data has been reset.', 
            },

            pl: {

                scriptLoaded: '${scriptName} v${version} Załadowany.',
                yes: 'Tak', no: 'Nie',
                notApplicable: 'BD', 
                error_items_per_hour_unavailable: '~0.0/h (za krótki czas pracy)',
                fromUnit: 'od', inUnit: 'w',
                hoursShort: 'g', minutesShort: 'm', secondsShort: 's',
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
                settings_applyAndCloseButton: 'Zastosuj, Zapisz i Zamknij',
                settings_applyButton: 'Zastosuj',
                settings_resetAllDataButton: 'Zresetuj Wszystkie Dane Skryptu',
                settings_resetAllDataConfirm: 'Czy na pewno chcesz zresetować WSZYSTKIE dane skryptu? Tej operacji nie można cofnąć i strona zostanie przeładowana.',
                settings_resetWindowPositionButton: 'Zresetuj Pozycję Okna Statystyk',
                settings_manualCounterInputLabel: 'Ustaw licznik dla ${tabName}:',
                section_general: 'Ogólne',
                section_currentTab: 'Ustawienia Bieżącej Karty (${tabInstanceId})',
                section_visualAids: 'Pomoce Wizualne Strony (dla ${tabName})',
                section_statsWindow: 'Okno Statystyk',
                section_globalStats: 'Statystyki Globalne (Znane Typy)',
                section_keyboardShortcuts: 'Skróty Klawiszowe',
                section_autoIncrement: 'Auto-Inkrementacja',
                section_lunchSelection: 'Wybór Przerwy Obiadowej',
                section_otherCustomTabs: 'Inne Skonfigurowane Karty Niestandardowe',

                language: 'Język',
                customTabDisplayName: 'Nazwa Wyświetlana',
                customTabIncludeInGlobal: 'Wlicz tę kartę do sumy globalnej',
                overlayOpacity: 'Przezroczystość Nakładki: ${value}%',
                showPageIndicator: 'Pokaż Wskaźnik Tekstowy Strony',
                showLine1_currentTab: 'Pokaż statystyki bieżącej karty',
                showLine2_globalSummary: 'Pokaż podsumowanie globalne',
                showLine3_shiftInfo: 'Pokaż informacje o zmianie',
                showLine4_lunchInfo: 'Pokaż informacje o przerwie',
                showLine5_realTimeClock: 'Pokaż zegar czasu rzeczywistego',
                fontFamily: 'Krój Czcionki',
                fontSize: 'Rozmiar Czcionki: ${value}px',
                dragStatsWindowButton: 'Uaktywnij przeciąganie okna statystyk',
                dragStatsWindowActiveButton: 'Okno jest przeciągalne (Kliknij by przypiąć)',
                includeInGlobal_known: 'Wlicz ${tabName} do sumy globalnej',
                incrementKey: 'Klawisz Inkrementacji (+1)',
                decrementKey: 'Klawisz Dekrementacji (-1)',
                scanIntervalAutoIncrement: 'Interwał Skanowania: ${value}ms',
                noCustomTabsConfigured: 'Brak skonfigurowanych innych kart niestandardowych.',
                customTabEntryFormat: '${displayName} (ID: ${instanceId_short}) - Włączona: ${isIncludedStr}',

                fontFamily_default: 'Domyślna (Systemowa)', fontFamily_monospace: 'Monospace', fontFamily_sans_serif_thin: 'Cienka Sans-Serif',

                key_None: 'Wyłączony', key_ShiftRight: 'Prawy Shift', key_ControlRight: 'Prawy Ctrl',
                key_AltRight: 'Prawy Alt', key_ScrollLock: 'Scroll Lock', key_PauseBreak: 'Pause/Break', key_Insert: 'Insert',
                key_Numpad0: 'Num 0', key_NumpadMultiply: 'Num *', key_NumpadSubtract: 'Num -',
                key_NumpadAdd: 'Num +', key_F10: 'F10',

                initialNotification_currentTab: 'Bieżąca Karta:',
                initialNotification_shiftStart: 'Początek Zmiany:',
                notification_autoResetExecuted: 'Wykryto dane skryptu starsze niż ${hours} godzin. Wszystkie dane zostały zresetowane.',
            }
        },
    };

    const state = {
        initialized: false,
        currentTabType: CONFIG.UNKNOWN_TAB_TYPE_KEY,
        currentTabInstanceId: null, 
        currentTabVisualDetails: { ...CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS }, 

        tabCountersCache: {}, 

        userConfig: {
            language: CONFIG.DEFAULT_LANGUAGE,
            globalStatsContributionKnown: {}, 
            keyboardShortcuts: { ...CONFIG.DEFAULT_KEYBOARD_SHORTCUTS },
            triggerMutationDebounceMs: CONFIG.DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS,
            settingsPanelWidth: CONFIG.SETTINGS_PANEL_INITIAL_WIDTH_PX,
            customTabSettings: {}, 
            defaultLocalTabConfig: { ...CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES }, 
        },

        localTabConfig: {

        },

        sessionConfig: {
            shiftType: null, 
            shiftCalculatedStartTime: null, 
            selectedLunchIndex: null, 
            activeTabInstances: {}, 
            sessionLastActivityTimestamp: null, 
        },

        domReferences: { 
            statsWindow: null,
            statsWindowLines: [], 

            settingsPanel: null,
            settingsPanelResizeHandle: null,
            pageOverlay: null,
            pageIndicator: null,
            initialNotification: null,
            settingsPanelControls: {} 
        },

        uiStateFlags: { 
            isSettingsPanelVisible: false,
            isStatsWindowDragging: false,
            isSettingsPanelResizing: false,
            settingsPanelInteractionLock: false, 
            autoTriggerFoundOnLastScan: false, 
            lastFullStorageReadTime: 0, 
            itemInProgress: false, 
        },

        mutationObserverInstance: null,
        syncIntervalId: null,
        uiUpdateIntervalId: null,
        keyboardListenerFunction: null, 
        settingsPanelAccessKeyListener: null, 
        settingsPanelAccessSequenceBuffer: [], 
        activeDragDrop: { 
            element: null, target: null, type: null,
            initialX: 0, initialY: 0, offsetX: 0, offsetY: 0, initialWidth: 0,
            onDragStart: null, onDrag: null, onDragEnd: null,
            boundDragMove: null, boundDragEnd: null,
        },
    };

    const Utils = {
        log(...args) {
            if (CONFIG.DEBUG_MODE) {
                console.log(`[${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION}]`, ...args);
            }
        },
        error(...args) {
            console.error(`[${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} ERROR]`, ...args);
        },
        createDOMElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            for (const key in attributes) {
                if (key === 'style' && typeof attributes[key] === 'object') {
                    Object.assign(element.style, attributes[key]);
                } else if (key === 'dataset' && typeof attributes[key] === 'object') {
                    Object.assign(element.dataset, attributes[key]);
                } else if (key === 'id' && attributes[key]) {

                    element.id = attributes[key].startsWith(CONFIG.SCRIPT_ID_PREFIX)
                                 ? attributes[key]
                                 : CONFIG.SCRIPT_ID_PREFIX + attributes[key];
                } else if (typeof attributes[key] === 'function' && key.startsWith('on')) {
                    element.addEventListener(key.substring(2).toLowerCase(), attributes[key]);
                } else {
                    element[key] = attributes[key];
                }
            }
            children.forEach(child => {
                if (child === null || typeof child === 'undefined') return;
                if (typeof child === 'string' || typeof child === 'number') {
                    element.appendChild(document.createTextNode(String(child)));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
            return element;
        },
        generateUniqueId(prefix = '') {
            return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
        },
        formatDuration(ms, lang = state.userConfig.language || CONFIG.DEFAULT_LANGUAGE) { 
            if (isNaN(ms) || ms <= 0) return I18nManager.getString('notApplicable');
            let s = Math.floor(ms / 1000);
            let m = Math.floor(s / 60);
            let h = Math.floor(m / 60);
            s %= 60; m %= 60;

            const hS = I18nManager.getString('hoursShort');
            const mS = I18nManager.getString('minutesShort');
            const sS = I18nManager.getString('secondsShort');

            if (h > 0) return `${h}${hS} ${String(m).padStart(2, '0')}${mS}`;
            else if (m > 0) return `${m}${mS} ${String(s).padStart(2, '0')}${sS}`;
            else return `${s}${sS}`;
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

            const hours = parseInt(timeStr.substring(0, 2), 10);
            const minutes = parseInt(timeStr.substring(2, 4), 10);
            const date = new Date(baseDate);
            date.setHours(hours, minutes, 0, 0);

            if (crossesMidnight) {
                date.setDate(date.getDate() + 1);
            }
            return date;
        },
        debounce(func, delay) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        },
        safeJsonParse(jsonString, defaultValue = null) {
            if (jsonString === null || typeof jsonString === 'undefined') return defaultValue;
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                Utils.error('JSON Parse error', e, 'String:', jsonString);
                return defaultValue;
            }
        },
        getTranslatedShortcutKey(keyCode) {
            const keyOption = CONFIG.AVAILABLE_SHORTCUT_KEYS.find(k => k.code === keyCode);
            return keyOption ? I18nManager.getString(keyOption.name_key) : keyCode;
        },
        deepMergeObjects(target, source) {
            const output = { ...target };
            if (Utils.isObject(target) && Utils.isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (Utils.isObject(source[key]) && !Array.isArray(source[key])) {
                        if (!(key in target) || !Utils.isObject(target[key])) {
                            output[key] = source[key];
                        } else {
                            output[key] = Utils.deepMergeObjects(target[key], source[key]);
                        }
                    } else {
                        output[key] = source[key]; 
                    }
                });
            }
            return output;
        },
        isObject(item) {
            return (item && typeof item === 'object' && !Array.isArray(item));
        },
        setNestedProperty(obj, path, value) {
            const keys = path.split('.');
            let current = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        },
        getNestedProperty(obj, path, defaultValue = undefined) {
            const keys = path.split('.');
            let current = obj;
            for (const key of keys) {
                if (!current || typeof current !== 'object' || !(key in current)) {
                    return defaultValue;
                }
                current = current[key];
            }
            return current;
        }
    };

    const I18nManager = {
        getString(key, replacements = {}) {
            const lang = state.userConfig.language || CONFIG.DEFAULT_LANGUAGE;
            const langPack = CONFIG.LANG_STRINGS[lang] || CONFIG.LANG_STRINGS[CONFIG.DEFAULT_LANGUAGE];
            let str = langPack[key];

            if (typeof str === 'undefined') {
                if (lang !== CONFIG.DEFAULT_LANGUAGE) {
                    const defaultLangPack = CONFIG.LANG_STRINGS[CONFIG.DEFAULT_LANGUAGE];
                    str = defaultLangPack[key];
                }
                if (typeof str === 'undefined') {
                    Utils.error(`I18n Key '${key}' missing in '${lang}' and default language '${CONFIG.DEFAULT_LANGUAGE}'.`);
                    return `[NoTrans:${key}]`;
                }
            }

            for (const placeholder in replacements) {
                str = str.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
            }
            str = str.replace(/\$\{version\}/g, CONFIG.SCRIPT_VERSION);
            str = str.replace(/\$\{scriptName\}/g, CONFIG.SCRIPT_NAME);
            return str;
        },
        getTabDisplayName(tabKeyOrInstanceId) {
            for (const type in CONFIG.KNOWN_TAB_TYPES) {
                if (CONFIG.KNOWN_TAB_TYPES[type].key === tabKeyOrInstanceId) {
                    return I18nManager.getString(CONFIG.KNOWN_TAB_TYPES[type].displayNameKey);
                }
            }
            if (state.userConfig.customTabSettings && state.userConfig.customTabSettings[tabKeyOrInstanceId]) {
                return state.userConfig.customTabSettings[tabKeyOrInstanceId].displayName || tabKeyOrInstanceId;
            }
            if (tabKeyOrInstanceId.startsWith(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX)) {
                const shortId = tabKeyOrInstanceId.substring(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length, CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length + 5);
                return `${I18nManager.getString(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${shortId}...)`;
            }
            return tabKeyOrInstanceId;
        }
    };

    const StorageManager = {
        _allLocalTabConfigsCache: null, 

        _getLocalStorageKey(keyName) { return `${CONFIG.SCRIPT_ID_PREFIX}${keyName}`; },
        _getSessionStorageKey(keyName) { return `${CONFIG.SCRIPT_ID_PREFIX}${keyName}`; },

        _saveToStorage(storage, key, data, isSession = false) {
            const fullKey = isSession ? StorageManager._getSessionStorageKey(key) : StorageManager._getLocalStorageKey(key);
            try {
                storage.setItem(fullKey, JSON.stringify(data));

            } catch (e) {
                Utils.error(`Failed to save to ${isSession ? 'SessionStorage' : 'LocalStorage'} [${key}]`, e);
            }
        },
        _loadFromStorage(storage, key, defaultValue = null, isSession = false) {
            const fullKey = isSession ? StorageManager._getSessionStorageKey(key) : StorageManager._getLocalStorageKey(key);
            try {
                const item = storage.getItem(fullKey);
                return item ? Utils.safeJsonParse(item, defaultValue) : defaultValue;
            } catch (e) {
                Utils.error(`Failed to load from ${isSession ? 'SessionStorage' : 'LocalStorage'} [${key}]`, e);
                return defaultValue;
            }
        },

        saveUserConfig() {
            StorageManager._saveToStorage(localStorage, CONFIG.STORAGE_KEY_USER_CONFIG, state.userConfig);
        },
        loadUserConfig() {
            const loadedConfig = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_USER_CONFIG, {});
            const defaultConfigStructure = {
                language: CONFIG.DEFAULT_LANGUAGE,
                globalStatsContributionKnown: {}, 
                keyboardShortcuts: { ...CONFIG.DEFAULT_KEYBOARD_SHORTCUTS },
                triggerMutationDebounceMs: CONFIG.DEFAULT_TRIGGER_MUTATION_DEBOUNCE_MS,
                settingsPanelWidth: CONFIG.SETTINGS_PANEL_INITIAL_WIDTH_PX,
                customTabSettings: {},
                defaultLocalTabConfig: { ...CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES },
            };
            Object.values(CONFIG.KNOWN_TAB_TYPES).forEach(type => {
                defaultConfigStructure.globalStatsContributionKnown[type.key] = true; 
            });

            state.userConfig = Utils.deepMergeObjects(defaultConfigStructure, loadedConfig);
            StorageManager._validateAndNormalizeUserConfig();
        },
        _validateAndNormalizeUserConfig() {
            const uc = state.userConfig;
            if (!CONFIG.AVAILABLE_LANGUAGES.find(l => l.code === uc.language)) {
                uc.language = CONFIG.DEFAULT_LANGUAGE;
            }
            uc.triggerMutationDebounceMs = Math.max(CONFIG.MIN_TRIGGER_DEBOUNCE_MS, Math.min(uc.triggerMutationDebounceMs, CONFIG.MAX_TRIGGER_DEBOUNCE_MS));
            uc.settingsPanelWidth = Math.max(CONFIG.SETTINGS_PANEL_MIN_WIDTH_PX, Math.min(uc.settingsPanelWidth, CONFIG.SETTINGS_PANEL_MAX_WIDTH_PX));

            for (const typeKey in uc.globalStatsContributionKnown) {
                uc.globalStatsContributionKnown[typeKey] = !!uc.globalStatsContributionKnown[typeKey];
            }
            Object.keys(uc.customTabSettings).forEach(instanceId => {
                if (typeof uc.customTabSettings[instanceId].includeInGlobal !== 'boolean') {
                    uc.customTabSettings[instanceId].includeInGlobal = true;
                }
            });

            uc.defaultLocalTabConfig = Utils.deepMergeObjects({...CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES}, uc.defaultLocalTabConfig || {});
        },

        saveCurrentTabLocalConfig() {
            if (!StorageManager._allLocalTabConfigsCache) {
                StorageManager._allLocalTabConfigsCache = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, {});
            }
            StorageManager._allLocalTabConfigsCache[state.currentTabInstanceId] = { ...state.localTabConfig };
            StorageManager._saveToStorage(localStorage, CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, StorageManager._allLocalTabConfigsCache);
        },
        loadCurrentTabLocalConfig() { 
            if (!StorageManager._allLocalTabConfigsCache) {
                StorageManager._allLocalTabConfigsCache = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, {});
            }
            const specificConfig = StorageManager._allLocalTabConfigsCache[state.currentTabInstanceId];

            state.localTabConfig = Utils.deepMergeObjects(
                { ...state.userConfig.defaultLocalTabConfig }, 
                specificConfig || {} 
            );

            state.localTabConfig.statsWindowFontSize = Math.max(CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.minStatsWindowFontSizePx, Math.min(state.localTabConfig.statsWindowFontSize, CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.maxStatsWindowFontSizePx));
            if (!CONFIG.FONT_FAMILY_OPTIONS[state.localTabConfig.statsWindowFontFamily]) {
                 state.localTabConfig.statsWindowFontFamily = state.userConfig.defaultLocalTabConfig.statsWindowFontFamily;
            }
        },
        _loadAllLocalTabConfigsIntoCache() { 
            StorageManager._allLocalTabConfigsCache = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS, {});
        },

        saveSessionConfig() {
            StorageManager._saveToStorage(localStorage, CONFIG.STORAGE_KEY_SESSION_CONFIG, state.sessionConfig);
        },
        loadSessionConfig() {
            const loadedConfig = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_SESSION_CONFIG, {});
            const defaultSessionStructure = {
                shiftType: null,
                shiftCalculatedStartTime: null,
                selectedLunchIndex: null,
                activeTabInstances: {},
                sessionLastActivityTimestamp: Date.now(), 
            };
            state.sessionConfig = Utils.deepMergeObjects(defaultSessionStructure, loadedConfig);
        },

        saveTabCounter(tabKey, count) {
            StorageManager._saveToStorage(localStorage, CONFIG.STORAGE_PREFIX_TAB_COUNTER + tabKey, count);
        },
        loadTabCounter(tabKey) {
            return parseInt(StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_PREFIX_TAB_COUNTER + tabKey, '0'), 10);
        },
        loadAllTabCounters() {

            const newCache = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const prefix = StorageManager._getLocalStorageKey(CONFIG.STORAGE_PREFIX_TAB_COUNTER);
                if (key && key.startsWith(prefix)) {
                    const tabKey = key.substring(prefix.length);
                    if (tabKey !== CONFIG.STORAGE_KEY_USER_CONFIG &&
                        tabKey !== CONFIG.STORAGE_KEY_SESSION_CONFIG &&
                        tabKey !== CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS) {
                        newCache[tabKey] = parseInt(localStorage.getItem(key), 10) || 0;
                    }
                }
            }
            state.tabCountersCache = newCache;

        },

        getTabInstanceId() { 
            let id = StorageManager._loadFromStorage(sessionStorage, CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY, null, true);
            if (!id) {
                id = Utils.generateUniqueId(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX);
                StorageManager._saveToStorage(sessionStorage, CONFIG.SESSION_STORAGE_TAB_INSTANCE_ID_KEY, id, true);
                Utils.log(`Generated new TabInstanceID for this session: ${id}`);
            }
            return id;
        },

        initStorageDefaults() {
            const userConfigKey = StorageManager._getLocalStorageKey(CONFIG.STORAGE_KEY_USER_CONFIG);
            if (localStorage.getItem(userConfigKey) === null) {
                Utils.log('First script run (or cleared storage for this version). Initializing default storage structures.');

                Object.values(CONFIG.KNOWN_TAB_TYPES).forEach(type => {
                    StorageManager.saveTabCounter(type.key, 0);
                });

            }
        },

        _performFullSyncRead() {

            const panelLock = state.uiStateFlags.settingsPanelInteractionLock;

            const prevLang = state.userConfig.language;
            const prevShortcuts = JSON.stringify(state.userConfig.keyboardShortcuts);
            const prevDebounce = state.userConfig.triggerMutationDebounceMs;
            const prevPanelWidth = state.userConfig.settingsPanelWidth;

            const prevShiftType = state.sessionConfig.shiftType;
            const prevLunchIndex = state.sessionConfig.selectedLunchIndex;
            const prevActiveTabs = JSON.stringify(state.sessionConfig.activeTabInstances);

            const loadedUserConfig = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_USER_CONFIG, {});
            const loadedSessionConfig = StorageManager._loadFromStorage(localStorage, CONFIG.STORAGE_KEY_SESSION_CONFIG, {});

            StorageManager._loadAllLocalTabConfigsIntoCache(); 

            StorageManager.loadAllTabCounters(); 
            state.uiStateFlags.lastFullStorageReadTime = Date.now();

            let panelRefreshNeeded = false;
            let panelControlsUpdateNeeded = false;

            if (!panelLock) { 

                const oldUserConfig = { ...state.userConfig };
                state.userConfig = Utils.deepMergeObjects(oldUserConfig, loadedUserConfig); 
                StorageManager._validateAndNormalizeUserConfig(); 

                const oldSessionConfig = { ...state.sessionConfig };
                state.sessionConfig = Utils.deepMergeObjects(oldSessionConfig, loadedSessionConfig);

                state.sessionConfig.activeTabInstances = state.sessionConfig.activeTabInstances || {};
                state.sessionConfig.sessionLastActivityTimestamp = state.sessionConfig.sessionLastActivityTimestamp || Date.now();

                if (state.userConfig.language !== prevLang) {
                    UIManager.refreshUIOnLanguageChange();
                    panelRefreshNeeded = true;
                }
                if (JSON.stringify(state.userConfig.keyboardShortcuts) !== prevShortcuts) {
                    KeyboardShortcutManager.attachKeyListeners();
                    panelControlsUpdateNeeded = true;
                }
                if (state.userConfig.triggerMutationDebounceMs !== prevDebounce) {
                    AutoTriggerManager.stopObserver(); AutoTriggerManager.startObserver();
                    panelControlsUpdateNeeded = true;
                }
                if (state.userConfig.settingsPanelWidth !== prevPanelWidth && state.domReferences.settingsPanel) {
                    state.domReferences.settingsPanel.style.width = `${state.userConfig.settingsPanelWidth}px`;
                }
                if (state.sessionConfig.shiftType !== prevShiftType || state.sessionConfig.selectedLunchIndex !== prevLunchIndex) {
                    if (state.sessionConfig.shiftType !== prevShiftType) panelRefreshNeeded = true;
                    else panelControlsUpdateNeeded = true;
                }
                if (JSON.stringify(state.sessionConfig.activeTabInstances) !== prevActiveTabs) {

                    if (state.uiStateFlags.isSettingsPanelVisible) {
                        SettingsPanelManager.updateOtherCustomTabsDisplay();
                        SettingsPanelManager.updateGlobalStatsSectionVisibility(); 
                    }
                }

                StorageManager.loadCurrentTabLocalConfig(); 
                UIManager.applyUserPreferencesToVisuals(); 
            } else {

                const tempSessionConfig = Utils.deepMergeObjects({ 
                    shiftType: state.sessionConfig.shiftType, 
                    selectedLunchIndex: state.sessionConfig.selectedLunchIndex,
                    activeTabInstances: {},
                    sessionLastActivityTimestamp: state.sessionConfig.sessionLastActivityTimestamp,
                }, loadedSessionConfig);

                if (JSON.stringify(tempSessionConfig.activeTabInstances) !== prevActiveTabs) {
                     state.sessionConfig.activeTabInstances = tempSessionConfig.activeTabInstances; 
                     if (state.uiStateFlags.isSettingsPanelVisible) {
                        SettingsPanelManager.updateOtherCustomTabsDisplay();
                        SettingsPanelManager.updateGlobalStatsSectionVisibility();
                     }
                }
            }

            if (state.uiStateFlags.isSettingsPanelVisible) {
                if (panelRefreshNeeded) SettingsPanelManager.populatePanel();
                else if (panelControlsUpdateNeeded) SettingsPanelManager.updateControlsFromState();

                SettingsPanelManager.updateOtherCustomTabsDisplay(); 
                SettingsPanelManager.updateGlobalStatsSectionVisibility(); 
            }
            UIManager.updateStatsWindowDisplay(); 
        },

        scheduleSync() {
            const syncIntervalWithJitter = CONFIG.SYNC_INTERVAL_MS + (Math.random() * CONFIG.SYNC_JITTER_MS);
            state.syncIntervalId = setInterval(() => {

                StorageManager._performFullSyncRead();
            }, syncIntervalWithJitter);
            Utils.log(`Storage sync scheduled every ~${Math.round(syncIntervalWithJitter / 1000)}s.`);
        },

        _debouncedPerformFullSyncRead: Utils.debounce(() => {

            StorageManager._performFullSyncRead();
        }, 300),

        handleStorageEvent(event) {
            if (!event.key || !event.key.startsWith(CONFIG.SCRIPT_ID_PREFIX)) return;
            Utils.log(`Storage event detected for key: ${event.key}`);

            const localKey = event.key.substring(CONFIG.SCRIPT_ID_PREFIX.length);

            if (localKey === CONFIG.STORAGE_KEY_USER_CONFIG ||
                localKey === CONFIG.STORAGE_KEY_SESSION_CONFIG ||
                localKey === CONFIG.STORAGE_KEY_ALL_LOCAL_TAB_CONFIGS) {
                StorageManager._debouncedPerformFullSyncRead();
            } else if (localKey.startsWith(CONFIG.STORAGE_PREFIX_TAB_COUNTER)) {

                const tabKeyFromEvent = localKey.substring(CONFIG.STORAGE_PREFIX_TAB_COUNTER.length);
                const newValue = event.newValue ? Utils.safeJsonParse(event.newValue, 0) : 0;

                if (state.uiStateFlags.settingsPanelInteractionLock && tabKeyFromEvent === state.currentTabInstanceId) {
                    Utils.log(`Settings panel lock: Ignoring external counter update for current tab ${tabKeyFromEvent}.`);
                    return;
                }

                if (state.tabCountersCache[tabKeyFromEvent] !== newValue) {
                    state.tabCountersCache[tabKeyFromEvent] = newValue;
                    UIManager.updateStatsWindowDisplay();
                    if (state.uiStateFlags.isSettingsPanelVisible) {
                        SettingsPanelManager.updateOtherCustomTabsDisplay();
                        SettingsPanelManager.updateGlobalStatsSectionVisibility(); 
                    }
                }
            }
        },

        performFullReset() {
            Utils.log("Performing full script data reset...");

            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CONFIG.SCRIPT_ID_PREFIX)) {
                    localStorage.removeItem(key);
                    Utils.log(`Removed from localStorage: ${key}`);
                }
            }

            for (let i = sessionStorage.length - 1; i >= 0; i--) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(CONFIG.SCRIPT_ID_PREFIX)) {
                    sessionStorage.removeItem(key);
                    Utils.log(`Removed from sessionStorage: ${key}`);
                }
            }
            window.location.reload();
        },

        checkAndPerformAutoReset() {

            const lastActivity = state.sessionConfig.sessionLastActivityTimestamp;
            const maxAgeMs = CONFIG.AUTO_RESET_MAX_AGE_HOURS * 60 * 60 * 1000;
            if (lastActivity && (Date.now() - lastActivity > maxAgeMs)) {
                Utils.error(`Data older than ${CONFIG.AUTO_RESET_MAX_AGE_HOURS} hours detected (last activity: ${new Date(lastActivity).toISOString()}). Performing auto-reset.`);
                NotificationManager.showPersistentNotification(I18nManager.getString('notification_autoResetExecuted', {hours: CONFIG.AUTO_RESET_MAX_AGE_HOURS}), 'error');

                setTimeout(() => StorageManager.performFullReset(), 2000);
                return true; 
            }

            state.sessionConfig.sessionLastActivityTimestamp = Date.now();

            return false; 
        },
        updateLastActivityTimestamp() {
            if(state.sessionConfig) { 
                state.sessionConfig.sessionLastActivityTimestamp = Date.now();
                StorageManager.saveSessionConfig(); 
            }
        }
    };

    const TabIdentifier = {
        identifyCurrentTab() {
            const url = window.location.href.toUpperCase();
            let foundKnownType = null;

            for (const typeKey in CONFIG.KNOWN_TAB_TYPES) {
                const typeDetails = CONFIG.KNOWN_TAB_TYPES[typeKey];
                if (url.includes(typeDetails.urlKeyword.toUpperCase())) {
                    foundKnownType = typeDetails;
                    break;
                }
            }

            if (foundKnownType) {
                state.currentTabType = foundKnownType.key;
                state.currentTabInstanceId = foundKnownType.key;
                state.currentTabVisualDetails = { ...foundKnownType };
            } else {
                state.currentTabType = CONFIG.UNKNOWN_TAB_TYPE_KEY;
                state.currentTabInstanceId = StorageManager.getTabInstanceId();
                state.currentTabVisualDetails = { ...CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS };

                if (!state.userConfig.customTabSettings[state.currentTabInstanceId]) {
                     const shortId = state.currentTabInstanceId.substring(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length, CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length + 5);
                    state.userConfig.customTabSettings[state.currentTabInstanceId] = {
                        displayName: `${I18nManager.getString(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${shortId}...)`,
                        includeInGlobal: true,
                    };

                }
            }

            StorageManager.loadCurrentTabLocalConfig(); 

            state.sessionConfig.activeTabInstances[state.currentTabInstanceId] = Date.now();

            Utils.log(`Tab identified: Type=${state.currentTabType}, InstanceID=${state.currentTabInstanceId}`);
        },
        getCurrentTabDisplayNameForVisuals() {
            if (state.currentTabType !== CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                return I18nManager.getString(state.currentTabVisualDetails.displayNameKey);
            }
            return I18nManager.getTabDisplayName(state.currentTabInstanceId); 
        }
    };

    const ShiftManager = {
        determineCurrentShift(forceConfigSave = false) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            const ST = CONFIG.SHIFT_TIMES_UTC_PLUS_2;
            const CST = CONFIG.DEFAULT_CALCULATION_START_TIMES;

            const dayShiftStartTotalMinutes = ST.DAY_SHIFT_START_H * 60 + ST.DAY_SHIFT_START_M;
            const dayShiftEndTotalMinutes = ST.DAY_SHIFT_END_H * 60 + ST.DAY_SHIFT_END_M;
            const nightShiftStartTotalMinutes = ST.NIGHT_SHIFT_START_H * 60 + ST.NIGHT_SHIFT_START_M;
            const nightShiftEndTotalMinutes = ST.NIGHT_SHIFT_END_H * 60 + ST.NIGHT_SHIFT_END_M; 

            let determinedShiftType = null;
            let calculatedShiftStartTime = new Date(now);

            if (currentTimeInMinutes >= dayShiftStartTotalMinutes && currentTimeInMinutes < dayShiftEndTotalMinutes) {
                determinedShiftType = 'day';
                calculatedShiftStartTime.setHours(CST.DAY.H, CST.DAY.M, 0, 0);
            } else if (
                (nightShiftStartTotalMinutes > nightShiftEndTotalMinutes && 
                    (currentTimeInMinutes >= nightShiftStartTotalMinutes || currentTimeInMinutes < nightShiftEndTotalMinutes)) ||
                (nightShiftStartTotalMinutes < nightShiftEndTotalMinutes && 
                    (currentTimeInMinutes >= nightShiftStartTotalMinutes && currentTimeInMinutes < nightShiftEndTotalMinutes))
            ) {
                determinedShiftType = 'night';
                calculatedShiftStartTime.setHours(CST.NIGHT.H, CST.NIGHT.M, 0, 0);
                if (now.getHours() < 12 && CST.NIGHT.H >= 12) { 
                    calculatedShiftStartTime.setDate(now.getDate() - 1);
                }
            }

            let configChanged = false;
            if (state.sessionConfig.shiftType !== determinedShiftType) {
                state.sessionConfig.shiftType = determinedShiftType;
                state.sessionConfig.shiftCalculatedStartTime = determinedShiftType ? calculatedShiftStartTime.getTime() : null;
                ShiftManager.selectDefaultLunchForShift(determinedShiftType);
                configChanged = true;
                Utils.log(`Shift changed to ${determinedShiftType || 'None'}. Calculated start: ${determinedShiftType ? Utils.formatTime(new Date(state.sessionConfig.shiftCalculatedStartTime)) : 'NA'}`);
            }

            if (forceConfigSave && !configChanged) configChanged = true;

            if (configChanged) {
                StorageManager.saveSessionConfig();
            }
        },

        selectDefaultLunchForShift(shiftType) {
            let newLunchIndex = null;
            if (shiftType === 'day') {
                newLunchIndex = CONFIG.DEFAULT_LUNCH_INDEX_DAY;
            } else if (shiftType === 'night') {
                newLunchIndex = CONFIG.DEFAULT_LUNCH_INDEX_NIGHT;
            }

            if (newLunchIndex !== null && (!CONFIG.LUNCH_OPTIONS_BASE[newLunchIndex] || CONFIG.LUNCH_OPTIONS_BASE[newLunchIndex].type !== shiftType)) {
                const firstValidForShift = CONFIG.LUNCH_OPTIONS_BASE.findIndex(l => l.type === shiftType);
                newLunchIndex = (firstValidForShift !== -1) ? firstValidForShift : null;
            }

            if (state.sessionConfig.selectedLunchIndex !== newLunchIndex) {
                state.sessionConfig.selectedLunchIndex = newLunchIndex;
                Utils.log(`Default lunch for ${shiftType || 'No'} shift selected: index ${newLunchIndex}`);
            }
        },

        getWorkTimeDetails() {
            if (!state.sessionConfig.shiftType || state.sessionConfig.shiftCalculatedStartTime === null) {
                return { workedMs: 0, lunchDurationMs: 0, totalElapsedMs: 0, shiftStartTimeObj: null, error: 'Shift not active' };
            }

            const nowTime = new Date().getTime();
            const shiftStartTimeObj = new Date(state.sessionConfig.shiftCalculatedStartTime);
            let totalElapsedMs = nowTime - shiftStartTimeObj.getTime();
            if (totalElapsedMs < 0) totalElapsedMs = 0;

            let lunchDurationMs = 0;
            const selectedLunchGlobalIndex = state.sessionConfig.selectedLunchIndex;

            if (selectedLunchGlobalIndex !== null && CONFIG.LUNCH_OPTIONS_BASE[selectedLunchGlobalIndex]) {
                const lunchOption = CONFIG.LUNCH_OPTIONS_BASE[selectedLunchGlobalIndex];
                const lunchBaseDate = new Date(shiftStartTimeObj);

                const lunchStartHour = parseInt(lunchOption.start.substring(0,2), 10);
                const lunchEndHour = parseInt(lunchOption.end.substring(0,2), 10);

                let lunchStartCrossesMidnight = false;
                let lunchEndCrossesMidnight = false;

                if (lunchOption.type === 'night') {
                    if (shiftStartTimeObj.getHours() >= 12 && lunchStartHour < 12) {
                        lunchStartCrossesMidnight = true;
                    }
                    if (shiftStartTimeObj.getHours() >= 12 && lunchEndHour < 12) {
                        lunchEndCrossesMidnight = true;
                    } else if (lunchEndHour < lunchStartHour) { 
                        lunchEndCrossesMidnight = true;
                    }
                }

                const lunchStartTimeObj = Utils.timeStringToDate(lunchOption.start, lunchBaseDate, lunchStartCrossesMidnight);
                let lunchEndTimeObj = Utils.timeStringToDate(lunchOption.end, lunchBaseDate, lunchEndCrossesMidnight);

                if (lunchEndTimeObj < lunchStartTimeObj) { 

                    if (lunchOption.type === 'night' && lunchEndTimeObj.getDate() === lunchStartTimeObj.getDate() && lunchEndTimeObj < lunchStartTimeObj ) {
                         lunchEndTimeObj.setDate(lunchEndTimeObj.getDate() + 1);
                    }
                }

                const actualLunchStart = Math.max(shiftStartTimeObj.getTime(), lunchStartTimeObj.getTime());
                const actualLunchEnd = Math.min(nowTime, lunchEndTimeObj.getTime());

                if (actualLunchEnd > actualLunchStart) {
                    lunchDurationMs = actualLunchEnd - actualLunchStart;
                }
            }

            const effectiveWorkedMs = Math.max(0, totalElapsedMs - lunchDurationMs);
            return { workedMs: effectiveWorkedMs, lunchDurationMs, totalElapsedMs, shiftStartTimeObj };
        }
    };

    const StatsCalculator = {
        calculateAllDisplayStats() {
            const { workedMs, shiftStartTimeObj } = ShiftManager.getWorkTimeDetails();
            const hoursWorked = workedMs > 0 ? workedMs / (1000 * 60 * 60) : 0;

            const currentTabKey = state.currentTabInstanceId;
            const currentTabCount = state.tabCountersCache[currentTabKey] || 0;
            let currentTabItemsPerHourStr = '0.0';
            if (hoursWorked > 0.0027) { 
                currentTabItemsPerHourStr = (currentTabCount / hoursWorked).toFixed(1);
            } else if (currentTabCount > 0) {
                currentTabItemsPerHourStr = I18nManager.getString('error_items_per_hour_unavailable');
            }

            const currentTabData = {
                displayName: I18nManager.getTabDisplayName(currentTabKey),
                count: currentTabCount,
                itemsPerHourFormatted: currentTabItemsPerHourStr,
                workTimeFormatted: Utils.formatDuration(workedMs),
            };

            const globalSummaryData = {
                tabs: [],
                totalItemsPerHourFormatted: '0.0',
                totalCount: 0,
            };
            let globalTotalIncludedItemsCount = 0;

            const allTrackedTabKeys = new Set([
                ...Object.values(CONFIG.KNOWN_TAB_TYPES).map(t => t.key),
                ...Object.keys(state.userConfig.customTabSettings)
            ]);

            allTrackedTabKeys.forEach(tabKey => {
                const count = state.tabCountersCache[tabKey] || 0;
                let itemsPerHour = 0;
                let itemsPerHourStr = '0.0';

                if (hoursWorked > 0.0027 && count > 0) {
                    itemsPerHour = count / hoursWorked;
                    itemsPerHourStr = itemsPerHour.toFixed(1);
                } else if (count > 0) {
                    itemsPerHourStr = I18nManager.getString('error_items_per_hour_unavailable');
                }

                let isIncludedInSum = false;
                const knownTypeDetails = Object.values(CONFIG.KNOWN_TAB_TYPES).find(t => t.key === tabKey);

                if (knownTypeDetails) {
                    isIncludedInSum = state.userConfig.globalStatsContributionKnown[tabKey] === true;
                } else if (state.userConfig.customTabSettings[tabKey]) {
                    isIncludedInSum = state.userConfig.customTabSettings[tabKey].includeInGlobal === true;
                }

                const isActiveOrHasCount = state.sessionConfig.activeTabInstances[tabKey] || count > 0;

                if (isIncludedInSum && isActiveOrHasCount) {
                    globalSummaryData.tabs.push({
                        displayName: I18nManager.getTabDisplayName(tabKey),
                        itemsPerHourFormatted: itemsPerHourStr,
                        count: count, 

                    });
                    globalTotalIncludedItemsCount += count;
                }
            });

            if (hoursWorked > 0.0027 && globalTotalIncludedItemsCount > 0) {
                globalSummaryData.totalItemsPerHourFormatted = (globalTotalIncludedItemsCount / hoursWorked).toFixed(1);
            }
            globalSummaryData.totalCount = globalTotalIncludedItemsCount;

            const shiftType = state.sessionConfig.shiftType;
            const shiftTypeStr = shiftType ? I18nManager.getString(`shift_${shiftType}`) : I18nManager.getString('notApplicable');
            const shiftStartTimeStr = shiftStartTimeObj ? Utils.formatTime(shiftStartTimeObj, false, ':') : I18nManager.getString('notApplicable');
            const shiftInfoString = I18nManager.getString('statsLine3_shift', {
                shiftType: shiftTypeStr,
                shiftStartTime: shiftStartTimeStr
            });

            let lunchInfoString = I18nManager.getString('notApplicable');
            const lunchIndex = state.sessionConfig.selectedLunchIndex;
            if (lunchIndex !== null && CONFIG.LUNCH_OPTIONS_BASE[lunchIndex]) {
                const lunchOpt = CONFIG.LUNCH_OPTIONS_BASE[lunchIndex];
                const lunchesOfSameType = CONFIG.LUNCH_OPTIONS_BASE.filter(l => l.type === lunchOpt.type);
                const lunchNumberInType = lunchesOfSameType.indexOf(lunchOpt) + 1;
                lunchInfoString = I18nManager.getString('statsLine4_lunch', {
                    lunchNumber: lunchNumberInType,
                    lunchStartTime: `${lunchOpt.start.substring(0,2)}:${lunchOpt.start.substring(2,4)}`, 
                    lunchEndTime: `${lunchOpt.end.substring(0,2)}:${lunchOpt.end.substring(2,4)}`,     
                });
            }

            const currentTimeString = Utils.formatTime(new Date(), true, ':');

            return {
                currentTabData,
                globalSummaryData,
                shiftInfoString,
                lunchInfoString,
                currentTimeString,
            };
        }
    };

    const UIManager = {
        initUI() {
            Utils.log('UIManager: Initializing UI components...');
            PageVisualsManager.initVisuals();
            StatsWindowManager.createWindow();

            SettingsPanelManager.createPanel();
            NotificationManager.showInitialNotification();

            UIManager.applyUserPreferencesToVisuals();
            UIManager.updateStatsWindowDisplay();

            UIManager.startPeriodicUIUpdates();
        },
        applyUserPreferencesToVisuals() { 
            StatsWindowManager.applyStyles();
            StatsWindowManager.applyPosition();
            PageVisualsManager.updateOverlay();
            PageVisualsManager.updateIndicatorText();
            if (state.domReferences.settingsPanel) { 
                state.domReferences.settingsPanel.style.width = `${state.userConfig.settingsPanelWidth}px`;
            }
        },
        updateStatsWindowDisplay() {
            if (!state.initialized || !state.domReferences.statsWindow) return;
            const displayStats = StatsCalculator.calculateAllDisplayStats();
            StatsWindowManager.updateContent(displayStats);
        },
        refreshUIOnLanguageChange() {
            Utils.log('Refreshing UI for language change...');
            if (state.uiStateFlags.isSettingsPanelVisible && state.domReferences.settingsPanel) {
                SettingsPanelManager.populatePanel();
            }
            UIManager.updateStatsWindowDisplay();
            NotificationManager.updateInitialNotificationLanguage();
            PageVisualsManager.updateIndicatorText(); 
        },
        startPeriodicUIUpdates() {
            if (state.uiUpdateIntervalId) clearInterval(state.uiUpdateIntervalId);
            state.uiUpdateIntervalId = setInterval(() => {
                if (state.localTabConfig.statsWindowLineVisibility.line5_realTimeClock && state.domReferences.statsWindowLines[4]) {
                    state.domReferences.statsWindowLines[4].textContent = I18nManager.getString('statsLine5_clock', {
                        currentTime: Utils.formatTime(new Date(), true, ':')
                    });
                }
                ShiftManager.determineCurrentShift(); 
                StorageManager.updateLastActivityTimestamp(); 
            }, CONFIG.UI_UPDATE_INTERVAL_MS);
        },
        toggleStatsWindowDragMode(enable) {
            if (!state.domReferences.statsWindow) return;

            const dragButtonId = CONFIG.SCRIPT_ID_PREFIX + 'dragStatsWindowButton';
            const button = state.domReferences.settingsPanelControls[dragButtonId];

            if (enable) {
                StatsWindowManager.setPointerEvents(false);
                state.domReferences.statsWindow.style.backgroundColor = CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DRAGGING;
                DragDropManager.makeDraggable(
                    state.domReferences.statsWindow,
                    () => { 
                        state.uiStateFlags.isStatsWindowDragging = true;
                        if (button) button.textContent = I18nManager.getString('dragStatsWindowActiveButton');
                        state.domReferences.statsWindow.style.zIndex = '2147483647';
                    },
                    null, 
                    (finalPos) => { 
                        state.uiStateFlags.isStatsWindowDragging = false;
                        if (button) button.textContent = I18nManager.getString('dragStatsWindowButton');
                        StatsWindowManager.setPointerEvents(true);
                        state.domReferences.statsWindow.style.backgroundColor = CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DEFAULT;
                        state.domReferences.statsWindow.style.zIndex = '2147483640';

                        state.localTabConfig.statsWindowPosition = { 
                            left: finalPos.left, top: finalPos.top,
                            right: null, bottom: null,
                        };
                        StorageManager.saveCurrentTabLocalConfig();
                    },
                    'move'
                );
                Utils.log('Stats window drag mode enabled.');
            } else {
                DragDropManager.stopDragging(state.domReferences.statsWindow);
                StatsWindowManager.setPointerEvents(true);
                state.domReferences.statsWindow.style.backgroundColor = CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DEFAULT;
                if (button) button.textContent = I18nManager.getString('dragStatsWindowButton');
                state.uiStateFlags.isStatsWindowDragging = false;
                Utils.log('Stats window drag mode disabled.');
            }
            if (button) button.dataset.active = String(enable);
        }
    };

    const StatsWindowManager = {
        createWindow() {
            state.domReferences.statsWindow = Utils.createDOMElement('div', {
                id: 'statsWindow',
                style: {
                    position: 'fixed', padding: '5px 10px', borderRadius: '5px',
                    zIndex: '2147483640', cursor: 'default', userSelect: 'none',
                    pointerEvents: 'none',
                    transition: 'top 0.2s ease-out, left 0.2s ease-out, bottom 0.2s ease-out, right 0.2s ease-out, font-size 0.2s, color 0.2s, line-height 0.2s, background-color 0.2s',
                    backgroundColor: CONFIG.STATS_WINDOW_BACKGROUND_COLOR_DEFAULT, 
                    boxShadow: '0 0 0px rgba(0,0,0,0.0)', 
                    color: CONFIG.STATS_WINDOW_TEXT_COLOR,
                }
            });
            state.domReferences.statsWindowLines = [];
            for (let i = 0; i < 5; i++) {
                const lineDiv = Utils.createDOMElement('div', {
                    id: `statsWindow_line${i + 1}`,
                    style: { whiteSpace: 'pre', minHeight: '1em', overflow: 'hidden', textOverflow: 'ellipsis' }
                });
                state.domReferences.statsWindowLines.push(lineDiv);
                state.domReferences.statsWindow.appendChild(lineDiv);
            }
            document.body.appendChild(state.domReferences.statsWindow);

        },
        updateContent(statsData) {
            if (!state.domReferences.statsWindow || state.domReferences.statsWindowLines.length < 5) return;

            const vis = state.localTabConfig.statsWindowLineVisibility; 
            const lines = state.domReferences.statsWindowLines;

            lines[0].style.display = vis.line1_currentTab ? '' : 'none';
            if (vis.line1_currentTab) {
                lines[0].textContent = I18nManager.getString('statsLine1_current', {
                    tabName: statsData.currentTabData.displayName,
                    itemsPerHour: statsData.currentTabData.itemsPerHourFormatted,
                    statsPerHourUnit: I18nManager.getString('statsPerHourUnit'),
                    count: statsData.currentTabData.count,
                    completedUnit: I18nManager.getString('completedUnit'),
                    inUnit: I18nManager.getString('inUnit'),
                    workTimeFormatted: statsData.currentTabData.workTimeFormatted,
                });
            }

            lines[1].style.display = vis.line2_globalSummary ? '' : 'none';
            if (vis.line2_globalSummary) {
                let summaryText = "";
                const tabContributions = statsData.globalSummaryData.tabs.map(tab => {

                    return I18nManager.getString('statsLine2_global_tab_format_new', {
                        tabName: tab.displayName.substring(0,10), 
                        itemsPerHour: tab.itemsPerHourFormatted,
                        statsPerHourUnit: I18nManager.getString('statsPerHourUnit'),
                        count: tab.count,
                    });
                });
                summaryText = tabContributions.join(I18nManager.getString('statsLine2_global_separator_new'));

                if (tabContributions.length > 0) { 
                    summaryText += (summaryText ? I18nManager.getString('statsLine2_global_separator_new') : '') +
                                   I18nManager.getString('statsLine2_global_total_format_new', {
                                       totalItemsPerHour: statsData.globalSummaryData.totalItemsPerHourFormatted,
                                       statsPerHourUnit: I18nManager.getString('statsPerHourUnit'),
                                       totalCount: statsData.globalSummaryData.totalCount
                                   });
                }
                lines[1].textContent = summaryText; 
            }

            lines[2].style.display = vis.line3_shiftInfo ? '' : 'none';
            if (vis.line3_shiftInfo) lines[2].textContent = statsData.shiftInfoString;

            lines[3].style.display = vis.line4_lunchInfo ? '' : 'none';
            if (vis.line4_lunchInfo) lines[3].textContent = statsData.lunchInfoString;

            lines[4].style.display = vis.line5_realTimeClock ? '' : 'none';
            if (vis.line5_realTimeClock) {
                lines[4].textContent = I18nManager.getString('statsLine5_clock', { currentTime: statsData.currentTimeString });
            }
        },
        applyStyles() { 
            if (!state.domReferences.statsWindow) return;
            const sw = state.domReferences.statsWindow;
            sw.style.fontFamily = CONFIG.FONT_FAMILY_OPTIONS[state.localTabConfig.statsWindowFontFamily] || CONFIG.FONT_FAMILY_OPTIONS.default;
            sw.style.fontSize = `${state.localTabConfig.statsWindowFontSize}px`;
            const baseLineHeight = state.localTabConfig.statsWindowFontSize * 1.3;
            sw.style.lineHeight = `${baseLineHeight}px`;
            sw.style.color = CONFIG.STATS_WINDOW_TEXT_COLOR;

            state.domReferences.statsWindowLines.forEach(line => {
                line.style.minHeight = `${Math.max(12, baseLineHeight * 0.8)}px`;
            });
        },
        applyPosition() { 
            if (!state.domReferences.statsWindow) return;
            const pos = state.localTabConfig.statsWindowPosition || { ...CONFIG.DEFAULT_STATS_WINDOW_POSITION_VALUES };
            state.domReferences.statsWindow.style.top = '';
            state.domReferences.statsWindow.style.left = '';
            state.domReferences.statsWindow.style.bottom = '';
            state.domReferences.statsWindow.style.right = '';
            Object.assign(state.domReferences.statsWindow.style, pos);
        },
        setPointerEvents(passThrough) {
            if (!state.domReferences.statsWindow) return;
            state.domReferences.statsWindow.style.pointerEvents = passThrough ? 'none' : 'auto';
        }
    };

    const SettingsPanelManager = {
        createPanel() {
            state.domReferences.settingsPanel = Utils.createDOMElement('div', {
                id: 'settingsPanel',
                style: {
                    position: 'fixed', top: '10px', right: '10px',
                    width: `${state.userConfig.settingsPanelWidth}px`, 
                    minWidth: `${CONFIG.SETTINGS_PANEL_MIN_WIDTH_PX}px`,
                    maxWidth: `${CONFIG.SETTINGS_PANEL_MAX_WIDTH_PX}px`,
                    height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)',
                    boxSizing: 'border-box', padding: '15px',
                    paddingLeft: `${CONFIG.SETTINGS_PANEL_RESIZE_HANDLE_WIDTH_PX + 15}px`,
                    backgroundColor: CONFIG.SETTINGS_PANEL_BACKGROUND_COLOR,
                    color: CONFIG.SETTINGS_PANEL_TEXT_COLOR,
                    border: `1px solid ${CONFIG.SETTINGS_PANEL_ACCENT_COLOR}`,
                    borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
                    zIndex: '2147483646', overflowY: 'auto', overflowX: 'hidden',
                    display: 'none', 
                    fontFamily: CONFIG.FONT_FAMILY_OPTIONS.default, fontSize: '14px',
                    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                    opacity: '0', transform: 'translateX(20px)',
                }
            });

            state.domReferences.settingsPanelResizeHandle = Utils.createDOMElement('div', {
                id: 'settingsPanelResizeHandle',
                style: {
                    position: 'absolute', left: '0', top: '0', bottom: '0',
                    width: `${CONFIG.SETTINGS_PANEL_RESIZE_HANDLE_WIDTH_PX}px`,
                    cursor: 'ew-resize', backgroundColor: `${CONFIG.SETTINGS_PANEL_ACCENT_COLOR}4D`
                }
            });
            state.domReferences.settingsPanel.appendChild(state.domReferences.settingsPanelResizeHandle);
            document.body.appendChild(state.domReferences.settingsPanel);

            DragDropManager.makeDraggable(
                state.domReferences.settingsPanelResizeHandle,
                EventHandler.SettingsPanel.handleResizeStart, null, EventHandler.SettingsPanel.handleResizeEnd,
                'resize-horizontal-left', state.domReferences.settingsPanel
            );
        },

        toggleVisibility() {
            state.uiStateFlags.isSettingsPanelVisible = !state.uiStateFlags.isSettingsPanelVisible;
            const panel = state.domReferences.settingsPanel;
            if (panel) {
                if (state.uiStateFlags.isSettingsPanelVisible) {
                    state.uiStateFlags.settingsPanelInteractionLock = true; 
                    Utils.log("Settings panel opened. Interaction lock ENABLED.");
                    panel.style.display = 'block';
                    panel.offsetHeight; 
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateX(0)';
                    SettingsPanelManager.populatePanel();
                } else {

                    EventHandler.SettingsPanel.handleApplyAndClose(); 
                }
            }
        },

        _createSectionElement(titleKey, titleParams = {}, sectionId = null) {
            const section = Utils.createDOMElement('div', {
                className: 'settings-section',
                style: { marginBottom: '20px', borderBottom: `1px dashed ${CONFIG.SETTINGS_PANEL_TEXT_COLOR}33`, paddingBottom: '15px' }
            }, [
                Utils.createDOMElement('h3', {
                    textContent: I18nManager.getString(titleKey, titleParams),
                    style: { marginTop: '0', marginBottom: '12px', fontSize: '1.15em', color: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, fontWeight: '600' }
                })
            ]);
            if(sectionId) section.id = CONFIG.SCRIPT_ID_PREFIX + sectionId;
            return section;
        },
        _createRowElement(labelTextKeyOrNode, controlElementOrArray, inputId, labelTextParams = {}) {
            let label;
            if(typeof labelTextKeyOrNode === 'string' && labelTextKeyOrNode) {
                label = Utils.createDOMElement('label', {
                    textContent: (I18nManager.getString(labelTextKeyOrNode, labelTextParams) + ':'),
                    htmlFor: inputId ? (CONFIG.SCRIPT_ID_PREFIX + inputId) : undefined,
                    style: { marginRight: '10px', display: 'inline-block', minWidth: '150px', verticalAlign: 'middle', flexShrink: 0, fontWeight: '500' }
                });
            } else if (labelTextKeyOrNode instanceof Node) {
                label = labelTextKeyOrNode; 
            }

            const rowDiv = Utils.createDOMElement('div', {
                style: { marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }
            });
            if (label) rowDiv.appendChild(label);

            const controlContainer = Utils.createDOMElement('div', { style: { display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }});
            if (Array.isArray(controlElementOrArray)) controlElementOrArray.forEach(c => controlContainer.appendChild(c));
            else if (controlElementOrArray) controlContainer.appendChild(controlElementOrArray);
            rowDiv.appendChild(controlContainer);
            return rowDiv;
        },
        _createControl(type, id, options = {}) {
            let control;
            const fullId = CONFIG.SCRIPT_ID_PREFIX + id;
            const commonStyle = { padding: '6px 8px', borderRadius: '4px', border: `1px solid ${CONFIG.SETTINGS_PANEL_TEXT_COLOR}44`, backgroundColor: '#fff', fontSize: 'inherit' };

            switch (type) {
                case 'select':
                    control = Utils.createDOMElement('select', { id: id, style: {...commonStyle, minWidth: '180px', flexGrow: 1}, ...options.attributes });
                    (options.selectOptions || []).forEach(opt => {
                        control.appendChild(Utils.createDOMElement('option', { value: opt.value, textContent: opt.text, selected: opt.value === options.selectedValue }));
                    });
                    break;
                case 'checkbox':
                    const checkboxInput = Utils.createDOMElement('input', { type: 'checkbox', id: id, style: { marginRight: '8px', verticalAlign: 'middle', accentColor: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, transform: 'scale(1.1)'}, ...options.attributes });
                    const labelText = options.labelTextKey ? I18nManager.getString(options.labelTextKey, options.labelTextParams || {}) : (options.labelText || '');
                    const checkboxLabel = Utils.createDOMElement('label', { textContent: labelText, htmlFor: fullId, style: { cursor: 'pointer', flexGrow: 1, fontWeight:'normal' } });
                    control = Utils.createDOMElement('div', { style: { display: 'flex', alignItems: 'center' } }, [checkboxInput, checkboxLabel]);
                    state.domReferences.settingsPanelControls[fullId] = checkboxInput; 
                    return control; 
                case 'slider':
                    const sliderInput = Utils.createDOMElement('input', { type: 'range', id: id, style: { verticalAlign: 'middle', flexGrow: 1, maxWidth: '150px', minWidth: '100px', accentColor: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, marginRight:'5px' }, ...options.attributes });
                    const sliderValueLabel = Utils.createDOMElement('span', { id: `${id}_valueLabel`, textContent: options.valueLabelFormatter(options.attributes.value), style: { minWidth: '70px', textAlign: 'left', fontSize: '0.9em' } });
                    sliderInput.oninput = (e) => { 
                        sliderValueLabel.textContent = options.valueLabelFormatter(Number(e.target.value));
                        if (options.onInputCallback) options.onInputCallback(e); 
                    };

                    control = [sliderInput, sliderValueLabel]; 
                    state.domReferences.settingsPanelControls[fullId] = sliderInput; 
                    return control;
                case 'textInput':
                    control = Utils.createDOMElement('input', { type: 'text', id: id, style: {...commonStyle, minWidth: '180px', flexGrow: 1}, ...options.attributes });
                    break;
                case 'numberInput': 
                     control = Utils.createDOMElement('input', { type: 'number', id: id, style: {...commonStyle, width: '80px', textAlign: 'right'}, ...options.attributes });
                     break;
                case 'button':
                    control = Utils.createDOMElement('button', { id: id, textContent: options.text, style: { ...commonStyle, backgroundColor: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, color: 'white', cursor: 'pointer', padding: '8px 12px', border:'none', ...options.styleOverrides }, ...options.attributes });
                    break;
                default: Utils.error('Unsupported control type in _createControl:', type); return null;
            }
            if (type !== 'checkbox' && type !== 'slider') { 
                state.domReferences.settingsPanelControls[fullId] = control;
            }
            return control;
        },

        populatePanel() {
            const panel = state.domReferences.settingsPanel;
            if (!panel) return;

            panel.innerHTML = ''; 
            panel.appendChild(state.domReferences.settingsPanelResizeHandle); 
            state.domReferences.settingsPanelControls = {}; 

            panel.appendChild(Utils.createDOMElement('h2', {
                textContent: I18nManager.getString('settingsPanelTitle'),
                style: { textAlign: 'center', marginTop: '0', marginBottom: '20px', color: CONFIG.SETTINGS_PANEL_ACCENT_COLOR, fontSize: '1.4em', fontWeight: '600' }
            }));

            const generalSection = SettingsPanelManager._createSectionElement('section_general');
            const langOptions = CONFIG.AVAILABLE_LANGUAGES.map(l => ({ value: l.code, text: l.name }));
            generalSection.appendChild(SettingsPanelManager._createRowElement('language',
                SettingsPanelManager._createControl('select', 'languageSelect', {
                    selectOptions: langOptions, selectedValue: state.userConfig.language,
                    attributes: { onchange: EventHandler.SettingsPanel.handleLanguageChange }
                }), 'languageSelect'
            ));
            generalSection.appendChild(SettingsPanelManager._createControl('button', 'resetAllDataButton', {
                text: I18nManager.getString('settings_resetAllDataButton'),
                attributes: { onclick: EventHandler.SettingsPanel.handleResetAllData },
                styleOverrides: { backgroundColor: '#d9534f', marginTop: '10px', width: '100%'}
            }));
            panel.appendChild(generalSection);

            if (state.currentTabType === CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                const ctSection = SettingsPanelManager._createSectionElement('section_currentTab', { tabInstanceId: state.currentTabInstanceId.substring(0,15) + '...' });
                const currentCustomSettings = state.userConfig.customTabSettings[state.currentTabInstanceId] || { displayName: state.currentTabInstanceId, includeInGlobal: true };
                ctSection.appendChild(SettingsPanelManager._createRowElement('customTabDisplayName',
                    SettingsPanelManager._createControl('textInput', 'customTabNameInput', {
                        attributes: { value: currentCustomSettings.displayName, onchange: EventHandler.SettingsPanel.handleCustomTabDisplayNameChange, placeholder: 'Enter tab name' }
                    }), 'customTabNameInput'
                ));
                ctSection.appendChild(SettingsPanelManager._createControl('checkbox', 'customTabIncludeGlobal', {
                    labelTextKey: 'customTabIncludeInGlobal',
                    attributes: { checked: currentCustomSettings.includeInGlobal, onchange: EventHandler.SettingsPanel.handleCustomTabIncludeGlobalChange }
                }));
                panel.appendChild(ctSection);
            }

            const vaSection = SettingsPanelManager._createSectionElement('section_visualAids', { tabName: TabIdentifier.getCurrentTabDisplayNameForVisuals() });
            vaSection.appendChild(SettingsPanelManager._createRowElement('overlayOpacity',
                SettingsPanelManager._createControl('slider', 'overlayOpacitySlider', {
                    attributes: { min: CONFIG.MIN_PAGE_OVERLAY_OPACITY_PERCENT, max: CONFIG.MAX_PAGE_OVERLAY_OPACITY_PERCENT, value: state.localTabConfig.pageOverlayOpacity, onchange: EventHandler.SettingsPanel.debouncedHandleOverlayOpacityChange },
                    valueLabelFormatter: (val) => I18nManager.getString('overlayOpacity', { value: val }),
                    onInputCallback: EventHandler.SettingsPanel.handleOverlayOpacityChange
                }), 'overlayOpacitySlider', { value: state.localTabConfig.pageOverlayOpacity }
            ));
            vaSection.appendChild(SettingsPanelManager._createControl('checkbox', 'showPageIndicatorCheckbox', {
                labelTextKey: 'showPageIndicator',
                attributes: { checked: state.localTabConfig.pageIndicatorTextVisible, onchange: EventHandler.SettingsPanel.handleIndicatorVisibilityChange }
            }));
            panel.appendChild(vaSection);

            const swdSection = SettingsPanelManager._createSectionElement('section_statsWindow');
            Object.keys(CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.statsWindowLineVisibility).forEach((lineKey, index) => {
                const i18nLabelKey = `showLine${index + 1}_${lineKey.substring(lineKey.indexOf('_') + 1)}`;
                swdSection.appendChild(SettingsPanelManager._createControl('checkbox', `showLine_${lineKey}`, {
                    labelTextKey: i18nLabelKey,
                    attributes: { checked: state.localTabConfig.statsWindowLineVisibility[lineKey], onchange: (e) => EventHandler.SettingsPanel.handleLineVisibilityChange(lineKey, e.target.checked) }
                }));
            });
            const fontOptions = Object.keys(CONFIG.FONT_FAMILY_OPTIONS).map(key => ({ value: key, text: I18nManager.getString(`fontFamily_${key}`) }));
            swdSection.appendChild(SettingsPanelManager._createRowElement('fontFamily',
                SettingsPanelManager._createControl('select', 'fontFamilySelect', {
                    selectOptions: fontOptions, selectedValue: state.localTabConfig.statsWindowFontFamily,
                    attributes: { onchange: EventHandler.SettingsPanel.handleFontFamilyChange }
                }), 'fontFamilySelect'
            ));
            swdSection.appendChild(SettingsPanelManager._createRowElement('fontSize',
                SettingsPanelManager._createControl('slider', 'fontSizeSlider', {
                    attributes: { min: CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.minStatsWindowFontSizePx, max: CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.maxStatsWindowFontSizePx, value: state.localTabConfig.statsWindowFontSize, onchange: EventHandler.SettingsPanel.debouncedHandleFontSizeChange },
                    valueLabelFormatter: (val) => I18nManager.getString('fontSize', { value: val }),
                    onInputCallback: EventHandler.SettingsPanel.handleFontSizeChange
                }), 'fontSizeSlider', { value: state.localTabConfig.statsWindowFontSize }
            ));
            swdSection.appendChild(SettingsPanelManager._createControl('button', 'dragStatsWindowButton', {
                text: I18nManager.getString(state.uiStateFlags.isStatsWindowDragging ? 'dragStatsWindowActiveButton' : 'dragStatsWindowButton'),
                attributes: { onclick: EventHandler.SettingsPanel.toggleDragMode, 'data-active': String(state.uiStateFlags.isStatsWindowDragging) },
                styleOverrides: { width: 'calc(100% - 100px)', marginTop: '5px', marginRight: '10px'}
            }));
             swdSection.appendChild(SettingsPanelManager._createControl('button', 'resetWindowPosButton', { 
                text: I18nManager.getString('settings_resetWindowPositionButton'),
                attributes: { onclick: EventHandler.SettingsPanel.handleResetWindowPosition },
                styleOverrides: { width: '100px', marginTop: '5px'} 
            }));
            panel.appendChild(swdSection);

            const gsSection = SettingsPanelManager._createSectionElement('section_globalStats', {}, 'globalStatsSection');
            SettingsPanelManager.updateGlobalStatsSectionVisibility(gsSection); 
            panel.appendChild(gsSection);

            const ksSection = SettingsPanelManager._createSectionElement('section_keyboardShortcuts');
            const shortcutKeyOptions = CONFIG.AVAILABLE_SHORTCUT_KEYS.map(k => ({ value: k.code, text: Utils.getTranslatedShortcutKey(k.code) }));
            ['INCREMENT', 'DECREMENT'].forEach(action => {
                ksSection.appendChild(SettingsPanelManager._createRowElement(action === 'INCREMENT' ? 'incrementKey' : 'decrementKey',
                    SettingsPanelManager._createControl('select', `shortcutKey_${action}`, {
                        selectOptions: shortcutKeyOptions, selectedValue: state.userConfig.keyboardShortcuts[action],
                        attributes: { onchange: (e) => EventHandler.SettingsPanel.handleShortcutKeyChange(action, e.target.value) }
                    }), `shortcutKey_${action}`
                ));
            });
            panel.appendChild(ksSection);

            const aiSection = SettingsPanelManager._createSectionElement('section_autoIncrement');
            aiSection.appendChild(SettingsPanelManager._createRowElement('scanIntervalAutoIncrement',
                SettingsPanelManager._createControl('slider', 'triggerIntervalSlider', {
                    attributes: { min: CONFIG.MIN_TRIGGER_DEBOUNCE_MS, max: CONFIG.MAX_TRIGGER_DEBOUNCE_MS, value: state.userConfig.triggerMutationDebounceMs, onchange: EventHandler.SettingsPanel.debouncedHandleTriggerIntervalChange },
                    valueLabelFormatter: (val) => I18nManager.getString('scanIntervalAutoIncrement', { value: val }),
                    onInputCallback: EventHandler.SettingsPanel.handleTriggerIntervalChange
                }), 'triggerIntervalSlider', { value: state.userConfig.triggerMutationDebounceMs }
            ));
            panel.appendChild(aiSection);

            const lunchSection = SettingsPanelManager._createSectionElement('section_lunchSelection');
            const currentShiftForLunchOpts = state.sessionConfig.shiftType || 'day'; 
            const lunchOptionsForSelect = CONFIG.LUNCH_OPTIONS_BASE
                .map((opt, index) => ({ ...opt, originalIndex: index }))
                .filter(opt => opt.type === currentShiftForLunchOpts)
                .map(opt => ({ value: String(opt.originalIndex), text: I18nManager.getString(opt.text_key) }));

            if (lunchOptionsForSelect.length > 0) {
                let currentSelectedLunch = state.sessionConfig.selectedLunchIndex !== null ? String(state.sessionConfig.selectedLunchIndex) : null;
                if (currentSelectedLunch === null || !lunchOptionsForSelect.find(opt => opt.value === currentSelectedLunch)) {
                    currentSelectedLunch = lunchOptionsForSelect[0].value; 
                }
                lunchSection.appendChild(SettingsPanelManager._createRowElement('', 
                    SettingsPanelManager._createControl('select', 'lunchSelect', {
                        selectOptions: lunchOptionsForSelect, selectedValue: currentSelectedLunch,
                        attributes: { onchange: EventHandler.SettingsPanel.handleLunchChange }
                    }), 'lunchSelect'
                ));
            } else {
                lunchSection.appendChild(Utils.createDOMElement('p', { textContent: I18nManager.getString('notApplicable'), style:{margin:'0', fontStyle:'italic'} }));
            }
            panel.appendChild(lunchSection);

            SettingsPanelManager.updateOtherCustomTabsDisplay(panel); 

            panel.appendChild(Utils.createDOMElement('hr', {style: {margin: '20px 0'}}));
            panel.appendChild(SettingsPanelManager._createControl('button', 'applyAndCloseButton', {
                 text: I18nManager.getString('settings_applyAndCloseButton'),
                 attributes: { onclick: EventHandler.SettingsPanel.handleApplyAndClose },
                 styleOverrides: { width: '100%', padding: '10px', fontSize: '1.1em', backgroundColor: CONFIG.SETTINGS_PANEL_ACCENT_COLOR }
            }));
        },

        updateGlobalStatsSectionVisibility(sectionToUpdate = null) {
            const sectionId = CONFIG.SCRIPT_ID_PREFIX + 'globalStatsSection';
            const panel = state.domReferences.settingsPanel;
            if (!panel && !sectionToUpdate) return;

            let section = sectionToUpdate || panel.querySelector(`#${sectionId}`);
            if (!section) return; 

            const titleElement = section.querySelector('h3');
            section.innerHTML = '';
            if (titleElement) section.appendChild(titleElement);

            Object.values(CONFIG.KNOWN_TAB_TYPES).forEach(type => {
                const isChecked = state.userConfig.globalStatsContributionKnown[type.key] === true;
                const currentCount = state.tabCountersCache[type.key] || 0;

                const checkboxControl = SettingsPanelManager._createControl('checkbox', `globalContrib_${type.key}`, {
                    labelTextKey: 'includeInGlobal_known',
                    labelTextParams: { tabName: I18nManager.getString(type.displayNameKey) },
                    attributes: { checked: isChecked, onchange: (e) => EventHandler.SettingsPanel.handleGlobalContribChangeKnown(type.key, e.target.checked) }
                });

                const inputLabel = Utils.createDOMElement('label', {
                    htmlFor: CONFIG.SCRIPT_ID_PREFIX + `manualCount_${type.key}`,
                    textContent: ` (${I18nManager.getString('settings_manualCounterInputLabel', { tabName: '' }).replace(':', '')} ${currentCount}): `, 
                    style: { marginLeft: '10px', fontStyle: 'italic', fontSize: '0.9em' }
                });
                const numberInput = SettingsPanelManager._createControl('numberInput', `manualCount_${type.key}`, {
                    attributes: { value: currentCount, min: "0" }
                });
                const applyButton = SettingsPanelManager._createControl('button', `applyCount_${type.key}`, {
                    text: I18nManager.getString('settings_applyButton'),
                    attributes: { onclick: (e) => EventHandler.SettingsPanel.handleManualCounterApply(type.key, CONFIG.SCRIPT_ID_PREFIX + `manualCount_${type.key}`) },
                    styleOverrides: { marginLeft: '5px', padding: '4px 8px', fontSize: '0.9em'}
                });

                const row = Utils.createDOMElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '5px'} },
                    [checkboxControl, inputLabel, numberInput, applyButton]
                );
                section.appendChild(row);
            });
        },

        updateOtherCustomTabsDisplay(panelToUpdate = state.domReferences.settingsPanel) {
            if (!panelToUpdate) return;
            const sectionId = CONFIG.SCRIPT_ID_PREFIX + 'otherCustomTabsSection';
            let section = panelToUpdate.querySelector(`#${sectionId}`);

            if (!section) {
                section = SettingsPanelManager._createSectionElement('section_otherCustomTabs', {}, 'otherCustomTabsSection');
                panelToUpdate.appendChild(section);
            } else {
                const titleElement = section.querySelector('h3');
                section.innerHTML = '';
                if (titleElement) section.appendChild(titleElement);
            }

            let hasOtherCustom = false;
            Object.entries(state.userConfig.customTabSettings).forEach(([instanceId, settings]) => {
                if (instanceId === state.currentTabInstanceId) return; 
                hasOtherCustom = true;

                const isIncludedStr = I18nManager.getString(settings.includeInGlobal ? 'yes' : 'no');
                const entryText = I18nManager.getString('customTabEntryFormat', {
                    displayName: settings.displayName,
                    instanceId_short: instanceId.substring(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length, CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length + 5) + '...',
                    isIncludedStr: isIncludedStr
                });

                const currentCount = state.tabCountersCache[instanceId] || 0;
                const { workedMs } = ShiftManager.getWorkTimeDetails(); 
                const hoursWorked = workedMs > 0 ? workedMs / (1000 * 60 * 60) : 0;
                let iphText = `0.0${I18nManager.getString('statsPerHourUnit')}`;
                if (hoursWorked > 0.0027 && currentCount > 0) {
                    iphText = (currentCount / hoursWorked).toFixed(1) + I18nManager.getString('statsPerHourUnit');
                } else if (currentCount > 0) {
                    iphText = I18nManager.getString('error_items_per_hour_unavailable');
                }

                const p = Utils.createDOMElement('p', {
                    textContent: `${entryText} (Count: ${currentCount}, IPH: ${iphText})`,
                    style: { fontSize: '0.9em', margin: '3px 0', paddingLeft: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                });
                section.appendChild(p);

                const inputLabel = Utils.createDOMElement('label', {
                    htmlFor: CONFIG.SCRIPT_ID_PREFIX + `manualCount_${instanceId}`,
                    textContent: ` (${I18nManager.getString('settings_manualCounterInputLabel', { tabName: '' }).replace(':', '')} ${currentCount}): `,
                    style: { marginLeft: '20px', fontStyle: 'italic', fontSize: '0.9em' }
                });
                 const numberInput = SettingsPanelManager._createControl('numberInput', `manualCount_${instanceId}`, {
                    attributes: { value: currentCount, min: "0" }
                });
                const applyButton = SettingsPanelManager._createControl('button', `applyCount_${instanceId}`, {
                    text: I18nManager.getString('settings_applyButton'),
                    attributes: { onclick: (e) => EventHandler.SettingsPanel.handleManualCounterApply(instanceId, CONFIG.SCRIPT_ID_PREFIX + `manualCount_${instanceId}`) },
                    styleOverrides: { marginLeft: '5px', padding: '4px 8px', fontSize: '0.9em'}
                });
                 const inputRow = Utils.createDOMElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '5px', paddingLeft: '30px'} },
                    [inputLabel, numberInput, applyButton]
                );
                section.appendChild(inputRow);
            });

            if (!hasOtherCustom) {
                section.appendChild(Utils.createDOMElement('p', { textContent: I18nManager.getString('noCustomTabsConfigured'), style: {fontStyle:'italic', margin:'3px 0', paddingLeft:'10px'} }));
            }
        },

        updateControlsFromState() { 
            if (!state.uiStateFlags.isSettingsPanelVisible || !state.domReferences.settingsPanel) return;
            Utils.log('SettingsPanelManager: Updating controls from state changes.');

            const panel = state.domReferences.settingsPanel;
            const controls = state.domReferences.settingsPanelControls;

            if (controls[CONFIG.SCRIPT_ID_PREFIX + 'languageSelect']) controls[CONFIG.SCRIPT_ID_PREFIX + 'languageSelect'].value = state.userConfig.language;

            if (state.currentTabType === CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                const currentSettings = state.userConfig.customTabSettings[state.currentTabInstanceId] || {};
                if (controls[CONFIG.SCRIPT_ID_PREFIX + 'customTabNameInput']) controls[CONFIG.SCRIPT_ID_PREFIX + 'customTabNameInput'].value = currentSettings.displayName || '';
                if (controls[CONFIG.SCRIPT_ID_PREFIX + 'customTabIncludeGlobal']) controls[CONFIG.SCRIPT_ID_PREFIX + 'customTabIncludeGlobal'].checked = !!currentSettings.includeInGlobal;
            }
            Object.values(CONFIG.KNOWN_TAB_TYPES).forEach(type => {
                const chkbox = controls[CONFIG.SCRIPT_ID_PREFIX + `globalContrib_${type.key}`];
                if (chkbox) chkbox.checked = !!state.userConfig.globalStatsContributionKnown[type.key];

                const numInput = controls[CONFIG.SCRIPT_ID_PREFIX + `manualCount_${type.key}`];
                if (numInput) numInput.value = state.tabCountersCache[type.key] || 0;

            });
            ['INCREMENT', 'DECREMENT'].forEach(action => {
                const select = controls[CONFIG.SCRIPT_ID_PREFIX + `shortcutKey_${action}`];
                if (select) select.value = state.userConfig.keyboardShortcuts[action];
            });
            const triggerSlider = controls[CONFIG.SCRIPT_ID_PREFIX + 'triggerIntervalSlider'];
            if (triggerSlider) {
                const newInterval = state.userConfig.triggerMutationDebounceMs;
                triggerSlider.value = newInterval;
                const label = panel.querySelector(`#${CONFIG.SCRIPT_ID_PREFIX}triggerIntervalSlider_valueLabel`);
                if (label) label.textContent = I18nManager.getString('scanIntervalAutoIncrement', { value: newInterval });
            }

            const opacitySlider = controls[CONFIG.SCRIPT_ID_PREFIX + 'overlayOpacitySlider'];
            if (opacitySlider) {
                const newOpacity = state.localTabConfig.pageOverlayOpacity;
                opacitySlider.value = newOpacity;
                const label = panel.querySelector(`#${CONFIG.SCRIPT_ID_PREFIX}overlayOpacitySlider_valueLabel`);
                if (label) label.textContent = I18nManager.getString('overlayOpacity', { value: newOpacity });
            }
            if (controls[CONFIG.SCRIPT_ID_PREFIX + 'showPageIndicatorCheckbox']) controls[CONFIG.SCRIPT_ID_PREFIX + 'showPageIndicatorCheckbox'].checked = !!state.localTabConfig.pageIndicatorTextVisible;

            Object.keys(CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.statsWindowLineVisibility).forEach(lineKey => {
                const chkbox = controls[CONFIG.SCRIPT_ID_PREFIX + `showLine_${lineKey}`];
                if (chkbox) chkbox.checked = !!state.localTabConfig.statsWindowLineVisibility[lineKey];
            });
            if (controls[CONFIG.SCRIPT_ID_PREFIX + 'fontFamilySelect']) controls[CONFIG.SCRIPT_ID_PREFIX + 'fontFamilySelect'].value = state.localTabConfig.statsWindowFontFamily;

            const fontSizeSlider = controls[CONFIG.SCRIPT_ID_PREFIX + 'fontSizeSlider'];
            if (fontSizeSlider) {
                const newSize = state.localTabConfig.statsWindowFontSize;
                fontSizeSlider.value = newSize;
                const label = panel.querySelector(`#${CONFIG.SCRIPT_ID_PREFIX}fontSizeSlider_valueLabel`);
                if (label) label.textContent = I18nManager.getString('fontSize', { value: newSize });
            }

            const lunchSelect = controls[CONFIG.SCRIPT_ID_PREFIX + 'lunchSelect'];
            if (lunchSelect && state.sessionConfig.selectedLunchIndex !== null) {

                const currentShiftForLunchOpts = state.sessionConfig.shiftType || 'day';
                const lunchOptionIsValid = Array.from(lunchSelect.options).some(opt =>
                    opt.value === String(state.sessionConfig.selectedLunchIndex) &&
                    CONFIG.LUNCH_OPTIONS_BASE[Number(opt.value)].type === currentShiftForLunchOpts
                );
                if (lunchOptionIsValid) {
                    lunchSelect.value = String(state.sessionConfig.selectedLunchIndex);
                } else if (lunchSelect.options.length > 0) { 
                    lunchSelect.value = lunchSelect.options[0].value;

                }
            }
            SettingsPanelManager.updateOtherCustomTabsDisplay(); 
            SettingsPanelManager.updateGlobalStatsSectionVisibility(); 
        }
    };

    const PageVisualsManager = {
        initVisuals() {
            state.domReferences.pageOverlay = Utils.createDOMElement('div', {
                id: 'pageOverlay', style: {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    zIndex: '1', pointerEvents: 'none',
                    transition: 'background-color 0.4s ease, opacity 0.4s ease',
                    opacity: '0',
                }
            });
            state.domReferences.pageIndicator = Utils.createDOMElement('div', {
                id: 'pageIndicator', style: {
                    position: 'fixed', top: '50%', right: '75px', transform: 'translateY(-50%) rotate(90deg)',
                    transformOrigin: 'bottom right', fontSize: 'clamp(30px, 5vw, 60px)',
                    fontWeight: 'bold', zIndex: '2', pointerEvents: 'none',
                    userSelect: 'none', display: 'none',
                    transition: 'color 0.4s ease, opacity 0.4s ease',
                    padding: '10px', borderRadius: '5px', letterSpacing: '2px',
                    opacity: '0',
                }
            });
            document.body.appendChild(state.domReferences.pageOverlay);
            document.body.appendChild(state.domReferences.pageIndicator);
        },
        updateOverlay() { 
            if (!state.domReferences.pageOverlay) return;
            const opacityPercent = state.localTabConfig.pageOverlayOpacity || 0;
            const visualDetails = state.currentTabVisualDetails;

            if (opacityPercent > 0) {
                const colorTemplate = visualDetails.color || CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.color;
                state.domReferences.pageOverlay.style.backgroundColor = colorTemplate.replace('${opacity}', (opacityPercent / 100).toFixed(3));
                state.domReferences.pageOverlay.style.opacity = '1';
            } else {
                state.domReferences.pageOverlay.style.opacity = '0';
            }
        },
        updateIndicatorText() { 
            if (!state.domReferences.pageIndicator) return;
            const isVisible = state.localTabConfig.pageIndicatorTextVisible === true;
            const visualDetails = state.currentTabVisualDetails;

            if (isVisible) {
                const tabDisplayName = TabIdentifier.getCurrentTabDisplayNameForVisuals();
                state.domReferences.pageIndicator.textContent = tabDisplayName.substring(0, 12).toUpperCase();
                state.domReferences.pageIndicator.style.color = visualDetails.textColor || CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.textColor;
                state.domReferences.pageIndicator.style.display = 'block';
                state.domReferences.pageIndicator.offsetHeight; 
                state.domReferences.pageIndicator.style.opacity = '1';
            } else {
                state.domReferences.pageIndicator.style.opacity = '0';
                setTimeout(() => {
                     if(!(state.localTabConfig.pageIndicatorTextVisible === true)) { 
                        state.domReferences.pageIndicator.style.display = 'none';
                     }
                }, 400);
            }
        }
    };

    const NotificationManager = {
        showInitialNotification() {
            const shiftStartTimeFormatted = state.sessionConfig.shiftCalculatedStartTime
                ? Utils.formatTime(new Date(state.sessionConfig.shiftCalculatedStartTime), false, ':')
                : I18nManager.getString('notApplicable');

            const message = `${I18nManager.getString('scriptLoaded')}\n` +
                            `${I18nManager.getString('initialNotification_currentTab')} ${TabIdentifier.getCurrentTabDisplayNameForVisuals()}\n` +
                            `${I18nManager.getString('initialNotification_shiftStart')} ${shiftStartTimeFormatted}`;

            NotificationManager.showPersistentNotification(message, 'success', 3500); 
        },
        updateInitialNotificationLanguage() {

            if (state.domReferences.initialNotification) {
                 const shiftStartTimeFormatted = state.sessionConfig.shiftCalculatedStartTime
                    ? Utils.formatTime(new Date(state.sessionConfig.shiftCalculatedStartTime), false, ':')
                    : I18nManager.getString('notApplicable');
                state.domReferences.initialNotification.textContent =
                    `${I18nManager.getString('scriptLoaded')}\n` +
                    `${I18nManager.getString('initialNotification_currentTab')} ${TabIdentifier.getCurrentTabDisplayNameForVisuals()}\n` +
                    `${I18nManager.getString('initialNotification_shiftStart')} ${shiftStartTimeFormatted}`;
            }
        },
        showPersistentNotification(message, type = 'info', duration = 0) { 
            if (state.domReferences.initialNotification) { 
                state.domReferences.initialNotification.remove();
                state.domReferences.initialNotification = null;
            }
            let bgColor = 'rgba(30,30,130,0.9)'; 
            if (type === 'success') bgColor = 'rgba(30,130,30,0.9)';
            if (type === 'error') bgColor = 'rgba(130,30,30,0.9)';

            state.domReferences.initialNotification = Utils.createDOMElement('div', {
                id: 'initialNotification', textContent: message,
                style: {
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    padding: '12px 25px', backgroundColor: bgColor, color: 'white',
                    borderRadius: '6px', zIndex: '2147483647', textAlign: 'center', whiteSpace: 'pre-line',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    fontSize: '14px', opacity: '0',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                }
            });
            document.body.appendChild(state.domReferences.initialNotification);

            setTimeout(() => {
                if (state.domReferences.initialNotification) {
                    state.domReferences.initialNotification.style.opacity = '1';
                    state.domReferences.initialNotification.style.transform = 'translateX(-50%) translateY(0)';
                }
            }, 100); 

            if (duration > 0) {
                setTimeout(() => {
                    if (state.domReferences.initialNotification) {
                        state.domReferences.initialNotification.style.opacity = '0';
                        state.domReferences.initialNotification.style.transform = 'translateX(-50%) translateY(-20px)';
                        setTimeout(() => {
                            if (state.domReferences.initialNotification) state.domReferences.initialNotification.remove();
                            state.domReferences.initialNotification = null;
                        }, 500);
                    }
                }, duration);
            }

        }
    };

    const DragDropManager = { 
        _dragMove(event) {
            if (!state.activeDragDrop.element || !state.activeDragDrop.target) return;
            event.preventDefault();

            const ad = state.activeDragDrop;

            if (ad.type === 'move') {
                let newX = event.clientX - ad.offsetX;
                let newY = event.clientY - ad.offsetY;
                const elWidth = ad.target.offsetWidth;
                const elHeight = ad.target.offsetHeight;
                newX = Math.max(0, Math.min(newX, window.innerWidth - elWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - elHeight));

                ad.target.style.left = newX + 'px';
                ad.target.style.top = newY + 'px';
                ad.target.style.bottom = '';
                ad.target.style.right = '';
            } else if (ad.type === 'resize-horizontal-left') {
                const dx = event.clientX - ad.initialX;
                let newWidth = ad.initialWidth - dx;
                newWidth = Math.max(CONFIG.SETTINGS_PANEL_MIN_WIDTH_PX, Math.min(newWidth, CONFIG.SETTINGS_PANEL_MAX_WIDTH_PX));
                ad.target.style.width = `${newWidth}px`;
            }
            if (ad.onDrag) ad.onDrag(event);
        },
        _dragEnd(event) {
            if (!state.activeDragDrop.element) return;
            const ad = state.activeDragDrop;

            document.removeEventListener('mousemove', ad.boundDragMove);
            document.removeEventListener('mouseup', ad.boundDragEnd);

            if (ad.element) {
                ad.element.style.cursor = (ad.type === 'move') ? 'grab' : (ad.type === 'resize-horizontal-left' ? 'ew-resize' : 'default');
            }

            if (ad.onDragEnd) {
                if (ad.type === 'move' && ad.target) {
                    ad.onDragEnd({ left: ad.target.style.left, top: ad.target.style.top });
                } else if (ad.type === 'resize-horizontal-left' && ad.target) {
                    ad.onDragEnd(parseInt(ad.target.style.width, 10));
                }
            }
            state.activeDragDrop = { element: null, target: null, type: null, initialX: 0, initialY: 0, offsetX: 0, offsetY: 0, initialWidth: 0, onDragStart: null, onDrag: null, onDragEnd: null, boundDragMove: null, boundDragEnd: null };
        },
        makeDraggable(elementToDrag, onDragStartCb, onDragCb, onDragEndCb, dragMode = 'move', targetForResizeOrMove = null) {
            if (!elementToDrag) return;
            const target = (dragMode.startsWith('resize') && targetForResizeOrMove) ? targetForResizeOrMove : elementToDrag;
            if (!target) { Utils.error("DragDropManager: Target for drag/resize is null."); return; }

            elementToDrag.style.cursor = (dragMode === 'move') ? 'grab' : (dragMode === 'resize-horizontal-left' ? 'ew-resize' : 'default');

            const onMouseDown = (event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                const ad = state.activeDragDrop;
                ad.element = elementToDrag;
                ad.target = target;
                ad.type = dragMode;
                ad.onDragStart = onDragStartCb;
                ad.onDrag = onDragCb;
                ad.onDragEnd = onDragEndCb;
                ad.initialX = event.clientX;
                ad.initialY = event.clientY;

                if (dragMode === 'move') {
                    const rect = ad.target.getBoundingClientRect();
                    ad.offsetX = event.clientX - rect.left;
                    ad.offsetY = event.clientY - rect.top;
                    ad.target.style.position = 'fixed'; 
                    ad.target.style.left = rect.left + 'px';
                    ad.target.style.top = rect.top + 'px';
                    ad.target.style.bottom = ''; 
                    ad.target.style.right = '';
                    elementToDrag.style.cursor = 'grabbing';
                } else if (dragMode === 'resize-horizontal-left') {
                    ad.initialWidth = ad.target.offsetWidth;
                }

                ad.boundDragMove = DragDropManager._dragMove.bind(DragDropManager);
                ad.boundDragEnd = DragDropManager._dragEnd.bind(DragDropManager);
                document.addEventListener('mousemove', ad.boundDragMove);
                document.addEventListener('mouseup', ad.boundDragEnd, { once: true });
                if (ad.onDragStart) ad.onDragStart(event);
            };
            elementToDrag.customOnMouseDown = onMouseDown; 
            elementToDrag.addEventListener('mousedown', onMouseDown);
        },
        stopDragging(elementToDrag) {
            if (elementToDrag && elementToDrag.customOnMouseDown) {
                elementToDrag.removeEventListener('mousedown', elementToDrag.customOnMouseDown);
                elementToDrag.customOnMouseDown = null;
                elementToDrag.style.cursor = 'default';
            }
            if (state.activeDragDrop.element === elementToDrag) { 
                DragDropManager._dragEnd(new MouseEvent('mouseup')); 
            }
        }
    };

    const AutoTriggerManager = { 
        _debouncedCheck: null,
        _checkForTrigger(targetNode) {
            if (!state.initialized) return;
            let uiHiddenForScan = false;
            const elementsToConceal = [state.domReferences.statsWindow, state.domReferences.settingsPanel, state.domReferences.initialNotification];
            const originalVisibilities = new Map();

            elementsToConceal.forEach(el => {
                if (el && el.style && targetNode.contains(el)) { 
                    originalVisibilities.set(el, el.style.visibility);
                    el.style.visibility = 'hidden';
                    uiHiddenForScan = true;
                }
            });

            const pageTextContent = targetNode.innerText || targetNode.textContent || '';

            if (uiHiddenForScan) {
                elementsToConceal.forEach(el => {
                    if (el && el.style && originalVisibilities.has(el)) {
                        el.style.visibility = originalVisibilities.get(el) || '';
                    }
                });
            }




            if (CONFIG.PRE_TRIGGER_REGEX.test(pageTextContent)) {
                state.uiStateFlags.itemInProgress = true;
            }
            
            if (CONFIG.AUTO_TRIGGER_REGEX.test(pageTextContent)) {
                if (state.uiStateFlags.itemInProgress && !state.uiStateFlags.autoTriggerFoundOnLastScan) {
                    Utils.log('Auto-trigger DETECTED. DONE!рус_222');
                    EventHandler.Actions.incrementCurrentTabCounter(false);
                    state.uiStateFlags.autoTriggerFoundOnLastScan = true;
                    state.uiStateFlags.itemInProgress = false;
                }
            } else {
                state.uiStateFlags.autoTriggerFoundOnLastScan = false;
            }
        },
        startObserver() {
            if (state.mutationObserverInstance) state.mutationObserverInstance.disconnect();
            const observeTargetNode = document.querySelector(CONFIG.TRIGGER_OBSERVE_AREA_SELECTOR) || document.body;
            AutoTriggerManager._debouncedCheck = Utils.debounce(() => {
                AutoTriggerManager._checkForTrigger(observeTargetNode);
            }, state.userConfig.triggerMutationDebounceMs); 

            state.mutationObserverInstance = new MutationObserver((mutationsList) => {
                AutoTriggerManager._debouncedCheck();
            });
            try {
                state.mutationObserverInstance.observe(observeTargetNode, { childList: true, subtree: true, characterData: true });
                Utils.log(`AutoTriggerManager started. Scan interval (debounce): ${state.userConfig.triggerMutationDebounceMs}ms on ${CONFIG.TRIGGER_OBSERVE_AREA_SELECTOR}`);
                AutoTriggerManager._checkForTrigger(observeTargetNode); 
            } catch(e) {
                 Utils.error('Failed to start MutationObserver for AutoTrigger:', e);
                 state.mutationObserverInstance = null;
            }
        },
        stopObserver() {
            if (state.mutationObserverInstance) {
                state.mutationObserverInstance.disconnect();
                state.mutationObserverInstance = null;
                Utils.log('AutoTriggerManager stopped.');
            }
            AutoTriggerManager._debouncedCheck = null; 
            state.uiStateFlags.autoTriggerFoundOnLastScan = false;
        }
    };

    const KeyboardShortcutManager = { 
        _handleShortcutKeyPress(event) {
            const targetTagName = event.target.tagName ? event.target.tagName.toLowerCase() : '';
            const isEditableField = (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable);
            const isScriptInput = event.target.id && event.target.id.startsWith(CONFIG.SCRIPT_ID_PREFIX);

            if (isEditableField && !isScriptInput && !state.uiStateFlags.isSettingsPanelVisible) { 

                return;
            }

            let actionTaken = false;
            if (state.userConfig.keyboardShortcuts.INCREMENT !== 'None' && event.code === state.userConfig.keyboardShortcuts.INCREMENT) {
                Utils.log(`Increment shortcut (${event.code}) triggered.`);
                EventHandler.Actions.incrementCurrentTabCounter(true);
                actionTaken = true;
            } else if (state.userConfig.keyboardShortcuts.DECREMENT !== 'None' && event.code === state.userConfig.keyboardShortcuts.DECREMENT) {
                Utils.log(`Decrement shortcut (${event.code}) triggered.`);
                EventHandler.Actions.decrementCurrentTabCounter(true);
                actionTaken = true;
            }

            if (actionTaken) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        _handleSettingsPanelAccessKeys(event) {

            const targetTagName = event.target.tagName ? event.target.tagName.toLowerCase() : '';
            const isEditableField = (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable);
            const isScriptInput = event.target.id && event.target.id.startsWith(CONFIG.SCRIPT_ID_PREFIX);

            if (isEditableField && !isScriptInput) {

                state.settingsPanelAccessSequenceBuffer = []; 
                return;
            }

            if (event.key.length > 1 && !(['Backspace', 'Delete'].includes(event.key))) { 

                return;
            }

            const keyPressed = event.key.toUpperCase();
            state.settingsPanelAccessSequenceBuffer.push(keyPressed);

            if (state.settingsPanelAccessSequenceBuffer.length >= CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length) {
                const recentKeys = state.settingsPanelAccessSequenceBuffer.slice(-CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length);
                if (CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.every((val, idx) => val === recentKeys[idx])) {
                    Utils.log('Settings panel access sequence detected!');
                    SettingsPanelManager.toggleVisibility();
                    state.settingsPanelAccessSequenceBuffer = []; 
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            if (state.settingsPanelAccessSequenceBuffer.length > CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE.length * 2) {
                state.settingsPanelAccessSequenceBuffer.shift(); 
            }
        },

        attachKeyListeners() {
            KeyboardShortcutManager.removeKeyListeners();
            state.keyboardListenerFunction = KeyboardShortcutManager._handleShortcutKeyPress;
            state.settingsPanelAccessKeyListener = KeyboardShortcutManager._handleSettingsPanelAccessKeys;

            document.addEventListener('keydown', state.keyboardListenerFunction, true);
            document.addEventListener('keydown', state.settingsPanelAccessKeyListener, true); 
            Utils.log('Keyboard listeners attached.', { shortcuts: { ...state.userConfig.keyboardShortcuts }, panelAccess: CONFIG.SETTINGS_PANEL_ACCESS_SEQUENCE });
        },
        removeKeyListeners() {
            if (state.keyboardListenerFunction) {
                document.removeEventListener('keydown', state.keyboardListenerFunction, true);
                state.keyboardListenerFunction = null;
            }
            if (state.settingsPanelAccessKeyListener) {
                document.removeEventListener('keydown', state.settingsPanelAccessKeyListener, true);
                state.settingsPanelAccessKeyListener = null;
            }
            Utils.log('Keyboard listeners removed.');
        }
    };

    const EventHandler = {
        Global: { 
            handleBeforeUnload() { Utils.log('Window unloading. Final state saved on actions/panel close.'); },
            handleStorageChange(event) { StorageManager.handleStorageEvent(event); },
            handleGlobalError(event) {  }
        },
        Actions: {
            incrementCurrentTabCounter(isManualTrigger) {
                if (!state.currentTabInstanceId) return;

                if (state.uiStateFlags.settingsPanelInteractionLock && !isManualTrigger) {
                    Utils.log(`Settings panel lock: Auto-increment for ${state.currentTabInstanceId} paused.`);
                    return;
                }
                const currentCount = state.tabCountersCache[state.currentTabInstanceId] || 0;
                const newCount = currentCount + 1;
                state.tabCountersCache[state.currentTabInstanceId] = newCount;
                StorageManager.saveTabCounter(state.currentTabInstanceId, newCount);
                UIManager.updateStatsWindowDisplay();
                StorageManager.updateLastActivityTimestamp();
                Utils.log(`Counter for ${state.currentTabInstanceId} incremented to ${newCount} (${isManualTrigger ? 'Manual' : 'Auto'})`);
            },
            decrementCurrentTabCounter(isManualTrigger) {
                if (!state.currentTabInstanceId) return;
                const currentCount = state.tabCountersCache[state.currentTabInstanceId] || 0;
                if (currentCount > 0) {
                    const newCount = currentCount - 1;
                    state.tabCountersCache[state.currentTabInstanceId] = newCount;
                    StorageManager.saveTabCounter(state.currentTabInstanceId, newCount);
                    UIManager.updateStatsWindowDisplay();
                    StorageManager.updateLastActivityTimestamp();
                    Utils.log(`Counter for ${state.currentTabInstanceId} decremented to ${newCount} (Manual)`);
                }
            }
        },
        SettingsPanel: {

            handleResizeStart() {  state.uiStateFlags.isSettingsPanelResizing = true; if(state.domReferences.settingsPanel) state.domReferences.settingsPanel.style.transition = 'none';},
            handleResizeEnd(newWidth) { 
                state.uiStateFlags.isSettingsPanelResizing = false;
                if(state.domReferences.settingsPanel) state.domReferences.settingsPanel.style.transition = '';
                state.userConfig.settingsPanelWidth = newWidth; 
                StorageManager.saveUserConfig();
                Utils.log(`Settings panel resized to ${newWidth}px`);
            },
            handleLanguageChange(event) { 
                state.userConfig.language = event.target.value;

                UIManager.refreshUIOnLanguageChange(); 
            },
            handleCustomTabDisplayNameChange(event) { 
                if (state.currentTabType === CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                    const newName = event.target.value.trim() || `${I18nManager.getString(CONFIG.DEFAULT_UNKNOWN_TAB_DETAILS.displayNameKey)} (${state.currentTabInstanceId.substring(CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length, CONFIG.UNKNOWN_TAB_INSTANCE_ID_PREFIX.length + 5)}...)`;
                    if (!state.userConfig.customTabSettings[state.currentTabInstanceId]) {
                        state.userConfig.customTabSettings[state.currentTabInstanceId] = { displayName: newName, includeInGlobal: true };
                    } else {
                        state.userConfig.customTabSettings[state.currentTabInstanceId].displayName = newName;
                    }

                    UIManager.updateStatsWindowDisplay(); 
                    PageVisualsManager.updateIndicatorText(); 

                    const currentTabSectionTitle = state.domReferences.settingsPanel.querySelector(`#${CONFIG.SCRIPT_ID_PREFIX}section_currentTab h3`);
                    if (currentTabSectionTitle) currentTabSectionTitle.textContent = I18nManager.getString('section_currentTab', { tabInstanceId: state.currentTabInstanceId.substring(0,15) + '...' });
                    const vaSectionTitle = state.domReferences.settingsPanel.querySelector(`#${CONFIG.SCRIPT_ID_PREFIX}section_visualAids h3`);
                    if (vaSectionTitle) vaSectionTitle.textContent = I18nManager.getString('section_visualAids', { tabName: TabIdentifier.getCurrentTabDisplayNameForVisuals() });

                }
            },
            handleCustomTabIncludeGlobalChange(event) { 
                if (state.currentTabType === CONFIG.UNKNOWN_TAB_TYPE_KEY) {
                    const isChecked = event.target.checked;
                    if (!state.userConfig.customTabSettings[state.currentTabInstanceId]) {
                        state.userConfig.customTabSettings[state.currentTabInstanceId] = { displayName: state.currentTabInstanceId, includeInGlobal: isChecked };
                    } else {
                        state.userConfig.customTabSettings[state.currentTabInstanceId].includeInGlobal = isChecked;
                    }

                    UIManager.updateStatsWindowDisplay();
                }
            },
            _handleOverlayOpacityChangeRaw(event) { 
                const newOpacity = parseInt(event.target.value, 10);
                state.localTabConfig.pageOverlayOpacity = newOpacity;
                PageVisualsManager.updateOverlay();
            },
            handleOverlayOpacityChange(event) { EventHandler.SettingsPanel._handleOverlayOpacityChangeRaw(event); }, 
            debouncedHandleOverlayOpacityChange: Utils.debounce((event) => { 

                Utils.log('Overlay opacity for current tab changed (pending save on panel close). Value:', state.localTabConfig.pageOverlayOpacity);
            }, 300),

            handleIndicatorVisibilityChange(event) { 
                state.localTabConfig.pageIndicatorTextVisible = event.target.checked;

                PageVisualsManager.updateIndicatorText();
            },
            handleLineVisibilityChange(lineKey, isVisible) { 
                state.localTabConfig.statsWindowLineVisibility[lineKey] = isVisible;

                UIManager.updateStatsWindowDisplay();
            },
            handleFontFamilyChange(event) { 
                state.localTabConfig.statsWindowFontFamily = event.target.value;

                StatsWindowManager.applyStyles();
            },
            _handleFontSizeChangeRaw(event) { 
                const newSize = parseInt(event.target.value, 10);
                state.localTabConfig.statsWindowFontSize = Math.max(CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.minStatsWindowFontSizePx, Math.min(newSize, CONFIG.DEFAULT_LOCAL_TAB_CONFIG_VALUES.maxStatsWindowFontSizePx));
                StatsWindowManager.applyStyles();
            },
            handleFontSizeChange(event) { EventHandler.SettingsPanel._handleFontSizeChangeRaw(event); }, 
            debouncedHandleFontSizeChange: Utils.debounce(() => { 
                Utils.log('Font size for current tab changed (pending save on panel close). Value:', state.localTabConfig.statsWindowFontSize);
            }, 300),

            toggleDragMode(event) { 
                 const button = event.target;
                 const currentlyActive = button.dataset.active === 'true'; 
                 UIManager.toggleStatsWindowDragMode(!currentlyActive);
            },
            handleGlobalContribChangeKnown(tabTypeKey, isChecked) { 
                state.userConfig.globalStatsContributionKnown[tabTypeKey] = isChecked;

                UIManager.updateStatsWindowDisplay();
            },
            handleShortcutKeyChange(action, selectedKeyCode) { 
                state.userConfig.keyboardShortcuts[action] = selectedKeyCode;

                KeyboardShortcutManager.attachKeyListeners(); 
            },
            _handleTriggerIntervalChangeRaw(event) { 
                const newInterval = parseInt(event.target.value, 10);
                state.userConfig.triggerMutationDebounceMs = Math.max(CONFIG.MIN_TRIGGER_DEBOUNCE_MS, Math.min(newInterval, CONFIG.MAX_TRIGGER_DEBOUNCE_MS));
                AutoTriggerManager.stopObserver(); 
                AutoTriggerManager.startObserver();
            },
            handleTriggerIntervalChange(event) { EventHandler.SettingsPanel._handleTriggerIntervalChangeRaw(event); }, 
            debouncedHandleTriggerIntervalChange: Utils.debounce(() => { 
                 Utils.log('Trigger interval changed (pending save on panel close). Value:', state.userConfig.triggerMutationDebounceMs);
            }, 400),

            handleLunchChange(event) { 
                state.sessionConfig.selectedLunchIndex = parseInt(event.target.value, 10);

                UIManager.updateStatsWindowDisplay();
            },
            handleResetAllData() { 
                if (confirm(I18nManager.getString('settings_resetAllDataConfirm'))) {
                    StorageManager.performFullReset();
                }
            },
            handleResetWindowPosition() { 
                state.localTabConfig.statsWindowPosition = { ...CONFIG.DEFAULT_STATS_WINDOW_POSITION_VALUES };

                StatsWindowManager.applyPosition();
            },
            handleManualCounterApply(tabKey, inputElementId) { 
                const inputElement = document.getElementById(inputElementId);
                if (inputElement) {
                    const newCount = parseInt(inputElement.value, 10);
                    if (!isNaN(newCount) && newCount >= 0) {
                        state.tabCountersCache[tabKey] = newCount;
                        StorageManager.saveTabCounter(tabKey, newCount); 
                        UIManager.updateStatsWindowDisplay();
                        StorageManager.updateLastActivityTimestamp();
                        Utils.log(`Manual counter set for ${tabKey} to ${newCount}`);

                        SettingsPanelManager.updateGlobalStatsSectionVisibility();
                        SettingsPanelManager.updateOtherCustomTabsDisplay();
                    } else {
                        alert('Invalid count. Please enter a non-negative number.');
                        inputElement.value = state.tabCountersCache[tabKey] || 0; 
                    }
                }
            },
            handleApplyAndClose() { 
                Utils.log("SettingsPanel: Apply & Close action triggered.");

                StorageManager.saveUserConfig();
                StorageManager.saveCurrentTabLocalConfig(); 
                StorageManager.saveSessionConfig();

                state.uiStateFlags.settingsPanelInteractionLock = false; 
                Utils.log("Settings panel closed. Interaction lock DISABLED.");

                const panel = state.domReferences.settingsPanel;
                if(panel) {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        if (panel) panel.style.display = 'none'; 
                        state.uiStateFlags.isSettingsPanelVisible = false; 
                    }, 200);
                } else {
                     state.uiStateFlags.isSettingsPanelVisible = false;
                }

                const dragButtonId = CONFIG.SCRIPT_ID_PREFIX + 'dragStatsWindowButton';
                const dragButton = state.domReferences.settingsPanelControls[dragButtonId];
                if (dragButton && dragButton.dataset.active === 'true') { 
                    UIManager.toggleStatsWindowDragMode(false);
                }

            }
        }
    };

    const MainInitializer = {
        init() {
            const initFlagId = `${CONFIG.SCRIPT_ID_PREFIX}initialized_flag`;
            if (window[initFlagId]) {
                Utils.error(`${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} already initialized.`);
                return;
            }
            Utils.log(`Starting ${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} Initialization...`);

            StorageManager.initStorageDefaults(); 

            StorageManager.loadUserConfig();     
            StorageManager.loadSessionConfig();  

            if (StorageManager.checkAndPerformAutoReset()) {
                return; 
            }

            TabIdentifier.identifyCurrentTab(); 
            StorageManager.loadAllTabCounters(); 

            ShiftManager.determineCurrentShift(false); 

            StorageManager.saveUserConfig();
            StorageManager.saveCurrentTabLocalConfig(); 
            StorageManager.saveSessionConfig(); 

            UIManager.initUI(); 

            KeyboardShortcutManager.attachKeyListeners();
            AutoTriggerManager.startObserver();
            StorageManager.scheduleSync();

            setTimeout(() => StorageManager._performFullSyncRead(), 2000);
           // setTimeout(() => StorageManager._performFullSyncRead(), 5000);
           // setTimeout(() => StorageManager._performFullSyncRead(), 10000);

            window.addEventListener('beforeunload', EventHandler.Global.handleBeforeUnload);
            window.addEventListener('storage', EventHandler.Global.handleStorageChange);
            window.addEventListener('error', EventHandler.Global.handleGlobalError);

            state.initialized = true;
            window[initFlagId] = true;
            Utils.log(`${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} Initialized successfully.`);
        },

        destroy() { 
            const initFlagId = `${CONFIG.SCRIPT_ID_PREFIX}initialized_flag`;
            Utils.log(`Destroying ${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION}...`);

            if (state.syncIntervalId) clearInterval(state.syncIntervalId); state.syncIntervalId = null;
            if (state.uiUpdateIntervalId) clearInterval(state.uiUpdateIntervalId); state.uiUpdateIntervalId = null;
            AutoTriggerManager.stopObserver();
            KeyboardShortcutManager.removeKeyListeners();

            window.removeEventListener('beforeunload', EventHandler.Global.handleBeforeUnload);
            window.removeEventListener('storage', EventHandler.Global.handleStorageChange);
            window.removeEventListener('error', EventHandler.Global.handleGlobalError);

            Object.values(state.domReferences).forEach(elOrMap => {
                if (Array.isArray(elOrMap)) {
                    elOrMap.forEach(el => el && el.remove && el.remove());
                } else if (Utils.isObject(elOrMap)) { 
                    Object.values(elOrMap).forEach(el => el && el.remove && el.remove());
                } else {
                    if (elOrMap && elOrMap.remove) elOrMap.remove();
                }
            });

            state.domReferences = { statsWindow: null, statsWindowLines: [], settingsPanel: null, settingsPanelResizeHandle: null, pageOverlay: null, pageIndicator: null, initialNotification: null, settingsPanelControls: {} };

            state.initialized = false;
            if (window[initFlagId]) delete window[initFlagId];
            Utils.log(`${CONFIG.SCRIPT_NAME} v${CONFIG.SCRIPT_VERSION} Destroyed.`);
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        MainInitializer.init();
    } else {
        document.addEventListener('DOMContentLoaded', MainInitializer.init, { once: true });
    }

})();
