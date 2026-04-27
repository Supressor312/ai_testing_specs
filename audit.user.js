// ==UserScript==
// @name         T-Rex & FCResearch Widget (Protocol v13.0 - Enterprise SPA Edition)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Zero-trust architecture. SPA-aware background rendering & secure IPC.
// @author       Principal Software Engineer
// @match        https://trex-prod-eu.aka.amazon.com/*
// @match        https://fcresearch-eu.aka.amazon.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @constant {Object} CONFIG - Immutable configuration object.
     */
    const CONFIG = Object.freeze({
        WAREHOUSE_ID: 'LCJ4',
        API_TIMEOUT_MS: 15000,
        SCAN_DEBOUNCE_MS: 400,
        LPN_REGEX: /^LPN[A-Z0-9_-]{5,20}$/i,
        WIDGET_DEFAULTS: {
            opacity: 92,
            compact: false,
            pos: { x: 20, y: 20 },
            size: { width: 280, height: 180 }
        },
        IPC_CHANNEL: 'TESAVEK_IPC_PAYLOAD'
    });

    const HOST = window.location.hostname;
    const IS_MASTER = HOST.includes('trex-prod');
    const IS_SLAVE = HOST.includes('fcresearch');

    /**
     * DOM Security utility for preventing XSS via strict sanitization.
     */
    class SecurityContext {
        static escapeHTML(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    }

    // ==================================================================================================
    // 🦖 MASTER CODE (T-REX ARCHITECTURE)
    // ==================================================================================================
    if (IS_MASTER) {

        /**
         * Audio Subsystem (Singleton).
         */
        class AudioEngine {
            constructor() {
                if (AudioEngine.instance) return AudioEngine.instance;
                this.context = null;
                this.initialized = false;
                AudioEngine.instance = this;
            }

            _init() {
                if (this.initialized) return;
                try {
                    this.context = new (window.AudioContext || window.webkitAudioContext)();
                    this.initialized = true;
                } catch (e) {
                    console.warn('[AudioEngine] Initialization failed:', e);
                }
            }

            _beep(freq, duration, delay = 0) {
                if (!this.initialized) this._init();
                if (!this.context || this.context.state === 'suspended') return;

                const osc = this.context.createOscillator();
                const gain = this.context.createGain();

                osc.connect(gain);
                gain.connect(this.context.destination);

                const startTime = this.context.currentTime + delay;
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.start(startTime);
                osc.stop(startTime + duration);
            }

            play(type) {
                if (this.context && this.context.state === 'suspended') {
                    this.context.resume();
                }

                switch (type) {
                    case 'ok':
                        this._beep(800, 0.15);
                        this._beep(1000, 0.2, 0.1);
                        break;
                    case 'bad':
                        this._beep(300, 0.2);
                        this._beep(200, 0.3, 0.15);
                        break;
                    case 'load':
                        this._beep(600, 0.05);
                        break;
                }
            }
        }

        /**
         * Widget UI Controller.
         */
        class WidgetController {
            constructor() {
                this.injectCSS();
                this.buildDOM();
                this.loadState();
                this.bindEvents();
            }

            injectCSS() {
                const css = `
                    @keyframes ts-pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; transform: scale(1.02); } }
                    @keyframes ts-spin { to { transform: rotate(360deg); } }
                    
                    #ts-widget {
                        position: fixed; z-index: 2147483647; background: rgba(255,255,255,0.95);
                        color: #232f3e; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1);
                        font-family: 'Amazon Ember', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        backdrop-filter: blur(8px); transition: opacity 0.3s, transform 0.2s;
                        user-select: none; display: flex; flex-direction: column; overflow: hidden;
                        box-sizing: border-box;
                    }
                    #ts-widget.ts-compact {
                        width: 60px !important; height: 60px !important; border-radius: 50%;
                        cursor: grab; justify-content: center; align-items: center; padding: 0;
                    }
                    #ts-widget.ts-compact .ts-full-only { display: none !important; }
                    #ts-widget:not(.ts-compact) .ts-compact-only { display: none !important; }
                    
                    .ts-head { background: #f2f4f8; padding: 8px 12px; font-size: 11px; font-weight: 700; cursor: grab; display: flex; justify-content: space-between; border-bottom: 1px solid #e1e4e8; flex-shrink: 0; }
                    .ts-head:active { cursor: grabbing; }
                    .ts-controls { display: flex; gap: 4px; }
                    .ts-btn { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; display: flex; justify-content: center; align-items: center; font-size: 14px; background: rgba(0,0,0,0.05); transition: 0.15s; }
                    .ts-btn:hover { background: rgba(0,0,0,0.15); }
                    .ts-btn.ts-close:hover { background: #d9534f; color: #fff; }
                    
                    .ts-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; text-align: center; }
                    .ts-lpn { font-size: 11px; color: #666; letter-spacing: 1px; margin-bottom: 4px; word-break: break-all; }
                    .ts-disp { font-size: 20px; font-weight: 800; }
                    
                    .ts-status-ok { color: #1e7e34; }
                    .ts-status-bad { color: #dc3545; }
                    .ts-status-load { color: #007bff; animation: ts-pulse 1s infinite; }
                    
                    .ts-footer { padding: 8px; font-size: 10px; background: #f2f4f8; border-top: 1px solid #e1e4e8; flex-shrink: 0; }
                    .ts-slider-container { display: flex; align-items: center; gap: 8px; justify-content: center; }
                    .ts-slider { width: 100px; cursor: pointer; }
                    
                    .ts-resize { position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; cursor: nwse-resize; background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%); }
                    
                    .ts-compact-icon { font-size: 28px; transition: 0.2s; }
                    .ts-compact-icon.ts-spin { animation: ts-spin 1s linear infinite; }
                    #ts-widget.ts-compact:hover .ts-expand { opacity: 1; transform: scale(1); }
                    .ts-expand { position: absolute; bottom: -4px; right: -4px; width: 22px; height: 22px; background: #00a8e1; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px; cursor: pointer; opacity: 0; transform: scale(0.5); transition: 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                `;
                GM_addStyle(css);
            }

            buildDOM() {
                this.widget = document.createElement('div');
                this.widget.id = 'ts-widget';
                this.widget.innerHTML = `
                    <div class="ts-head ts-full-only">
                        <span>🦖 SYSTEM CORE v13.0</span>
                        <div class="ts-controls">
                            <div class="ts-btn" id="ts-min" title="Compact Mode">−</div>
                            <div class="ts-btn ts-close" id="ts-close" title="Hide">×</div>
                        </div>
                    </div>
                    <div class="ts-body ts-full-only" id="ts-body-full">
                        <div class="ts-lpn" id="ts-lpn">AWAITING INPUT</div>
                        <div class="ts-disp" id="ts-disp">READY</div>
                    </div>
                    
                    <div class="ts-compact-only" style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                        <div class="ts-compact-icon" id="ts-compact-icon">📦</div>
                        <div class="ts-expand" id="ts-expand" title="Expand">⤢</div>
                    </div>

                    <div class="ts-footer ts-full-only">
                        <div class="ts-slider-container">
                            <span>OPACITY</span>
                            <input type="range" min="30" max="100" class="ts-slider" id="ts-opacity">
                        </div>
                    </div>
                    <div class="ts-resize ts-full-only" id="ts-resize"></div>
                `;
                document.body.appendChild(this.widget);

                this.el = {
                    lpn: document.getElementById('ts-lpn'),
                    disp: document.getElementById('ts-disp'),
                    icon: document.getElementById('ts-compact-icon'),
                    opacity: document.getElementById('ts-opacity'),
                    minBtn: document.getElementById('ts-min'),
                    closeBtn: document.getElementById('ts-close'),
                    expandBtn: document.getElementById('ts-expand'),
                    head: document.querySelector('.ts-head'),
                    resize: document.getElementById('ts-resize')
                };
            }

            loadState() {
                const safeParse = (key, defaultVal) => {
                    try { return JSON.parse(GM_getValue(key)) || defaultVal; } 
                    catch (e) { return defaultVal; }
                };

                const opacity = GM_getValue('ts_opacity', CONFIG.WIDGET_DEFAULTS.opacity);
                const isCompact = GM_getValue('ts_compact', CONFIG.WIDGET_DEFAULTS.compact);
                const pos = safeParse('ts_pos', CONFIG.WIDGET_DEFAULTS.pos);
                const size = safeParse('ts_size', CONFIG.WIDGET_DEFAULTS.size);

                this.setOpacity(opacity);
                this.el.opacity.value = opacity;
                
                this.widget.style.left = `${pos.x}px`;
                this.widget.style.top = `${pos.y}px`;
                this.widget.style.width = `${size.width}px`;
                this.widget.style.height = `${size.height}px`;

                if (isCompact) this.toggleCompact(true);
            }

            bindEvents() {
                this.el.opacity.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value, 10);
                    this.setOpacity(val);
                    GM_setValue('ts_opacity', val);
                });

                this.el.minBtn.addEventListener('click', () => this.toggleCompact(true));
                this.el.expandBtn.addEventListener('click', () => this.toggleCompact(false));
                this.el.closeBtn.addEventListener('click', () => this.widget.style.display = 'none');

                this.initDrag();
                this.initResize();
            }

            setOpacity(val) {
                this.widget.style.opacity = (val / 100).toString();
            }

            toggleCompact(state) {
                this.widget.classList.toggle('ts-compact', state);
                GM_setValue('ts_compact', state);
            }

            update(lpn, text, status) {
                this.widget.style.display = 'flex'; 

                this.el.lpn.textContent = SecurityContext.escapeHTML(lpn);
                this.el.disp.textContent = SecurityContext.escapeHTML(text);
                
                this.el.disp.className = 'ts-disp';
                this.el.icon.className = 'ts-compact-icon';

                if (status === 'load') {
                    this.el.disp.classList.add('ts-status-load');
                    this.el.icon.textContent = '⏳';
                    this.el.icon.classList.add('ts-spin');
                } else if (status === 'ok') {
                    this.el.disp.classList.add('ts-status-ok');
                    this.el.icon.textContent = '✅';
                } else if (status === 'bad') {
                    this.el.disp.classList.add('ts-status-bad');
                    this.el.icon.textContent = '❌';
                }
            }

            initDrag() {
                let isDragging = false;
                let startX, startY, initialLeft, initialTop;

                const startDrag = (e) => {
                    if (e.target.closest('.ts-controls, .ts-slider, .ts-resize, .ts-expand')) return;
                    isDragging = true;
                    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                    startX = clientX;
                    startY = clientY;
                    initialLeft = this.widget.offsetLeft;
                    initialTop = this.widget.offsetTop;
                };

                const doDrag = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                    
                    let newX = initialLeft + (clientX - startX);
                    let newY = initialTop + (clientY - startY);

                    const maxX = window.innerWidth - this.widget.offsetWidth;
                    const maxY = window.innerHeight - this.widget.offsetHeight;
                    newX = Math.max(0, Math.min(newX, maxX));
                    newY = Math.max(0, Math.min(newY, maxY));

                    this.widget.style.left = `${newX}px`;
                    this.widget.style.top = `${newY}px`;
                };

                const endDrag = () => {
                    if (!isDragging) return;
                    isDragging = false;
                    GM_setValue('ts_pos', JSON.stringify({ x: this.widget.offsetLeft, y: this.widget.offsetTop }));
                };

                this.widget.addEventListener('mousedown', (e) => {
                    if (this.widget.classList.contains('ts-compact') || e.target.closest('.ts-head')) {
                        startDrag(e);
                    }
                });
                
                document.addEventListener('mousemove', doDrag);
                document.addEventListener('mouseup', endDrag);
            }

            initResize() {
                let isResizing = false;
                let startWidth, startHeight, startX, startY;

                this.el.resize.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    isResizing = true;
                    startWidth = this.widget.offsetWidth;
                    startHeight = this.widget.offsetHeight;
                    startX = e.clientX;
                    startY = e.clientY;
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isResizing) return;
                    e.preventDefault();
                    const newWidth = Math.max(200, startWidth + (e.clientX - startX));
                    const newHeight = Math.max(120, startHeight + (e.clientY - startY));
                    this.widget.style.width = `${newWidth}px`;
                    this.widget.style.height = `${newHeight}px`;
                });

                document.addEventListener('mouseup', () => {
                    if (!isResizing) return;
                    isResizing = false;
                    GM_setValue('ts_size', JSON.stringify({ width: this.widget.offsetWidth, height: this.widget.offsetHeight }));
                });
            }
        }

        /**
         * Core Application Orchestrator
         */
        class AppEngine {
            constructor() {
                console.log('[System Core] Master Node Initializing...');
                this.ui = new WidgetController();
                this.audio = new AudioEngine();
                this.typingTimer = null;
                this.activeJob = null;
                this.bindInputInterceptor();
                this.bindIPCListener();
            }

            bindInputInterceptor() {
                document.addEventListener('input', (e) => {
                    if (!e.target || !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
                    const val = e.target.value.trim().toUpperCase();
                    
                    if (CONFIG.LPN_REGEX.test(val)) {
                        clearTimeout(this.typingTimer);
                        this.typingTimer = setTimeout(() => {
                            this.dispatchFetchJob(val);
                        }, CONFIG.SCAN_DEBOUNCE_MS);
                    }
                });
            }

            bindIPCListener() {
                // Secure Cross-Origin IPC channel via Tampermonkey
                GM_addValueChangeListener(CONFIG.IPC_CHANNEL, (name, old_value, new_value, remote) => {
                    if (!remote || !new_value) return;

                    // Match incoming response to the active job
                    if (this.activeJob && this.activeJob.lpn === new_value.lpn) {
                        this.resolveJob(new_value.disposition);
                    }
                });
            }

            dispatchFetchJob(lpn) {
                console.log(`[AppEngine] Dispatching job for LPN: ${lpn}`);
                this.ui.update(lpn, 'RENDERING...', 'load');
                this.audio.play('load');

                // Cleanup previous runaway jobs
                if (this.activeJob && this.activeJob.tab) {
                    this.activeJob.tab.close();
                    clearTimeout(this.activeJob.timeout);
                }

                // Inject a query parameter so the slave knows it's an automated background process
                const url = `https://fcresearch-eu.aka.amazon.com/${CONFIG.WAREHOUSE_ID}/results?s=${encodeURIComponent(lpn)}&ts_auto=1`;
                
                const tab = GM_openInTab(url, { active: false, insert: true });

                this.activeJob = {
                    lpn: lpn,
                    tab: tab,
                    timeout: setTimeout(() => this.handleTimeout(lpn), CONFIG.API_TIMEOUT_MS)
                };
            }

            resolveJob(disposition) {
                const lpn = this.activeJob.lpn;
                console.log(`[AppEngine] Job Resolved for ${lpn}: ${disposition}`);
                
                // Cleanup Garbage Collection routine
                clearTimeout(this.activeJob.timeout);
                if (this.activeJob.tab) this.activeJob.tab.close();
                this.activeJob = null;

                const upperDisp = disposition.toUpperCase();
                let statusLevel = 'bad'; 

                if (upperDisp.includes('SELLABLE') && !upperDisp.includes('UNSELLABLE')) {
                    statusLevel = 'ok';
                }

                this.ui.update(lpn, disposition, statusLevel);
                this.audio.play(statusLevel);
            }

            handleTimeout(lpn) {
                console.error(`[AppEngine] Job Timeout for ${lpn}`);
                if (this.activeJob && this.activeJob.tab) {
                    this.activeJob.tab.close();
                }
                this.activeJob = null;
                
                this.ui.update(lpn, 'TIMEOUT', 'bad');
                this.audio.play('bad');
            }
        }

        new AppEngine();
    }

    // ==================================================================================================
    // 🐜 SLAVE CODE (FCRESEARCH ARCHITECTURE)
    // ==================================================================================================
    if (IS_SLAVE) {
        // Execute only if opened by our Master node
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('ts_auto') !== '1') return; 

        const myLpn = urlParams.get('s');
        console.log(`[Slave Node] Online. Tracking LPN: ${myLpn}`);

        class DOMTracker {
            constructor(lpn) {
                this.lpn = lpn;
                this.observer = null;
                this.resolved = false;
                this.initObservation();
            }

            transmitData(disposition) {
                if (this.resolved) return;
                this.resolved = true;
                
                console.log(`[Slave Node] Found disposition: ${disposition}. Transmitting...`);
                
                // Transmit securely via GM_setValue, including timestamp to force change detection
                GM_setValue(CONFIG.IPC_CHANNEL, {
                    lpn: this.lpn,
                    disposition: disposition,
                    ts: Date.now()
                });

                if (this.observer) this.observer.disconnect();
                
                // Give GM storage bridge 50ms to sync before closing
                setTimeout(() => window.close(), 50);
            }

            analyzeDOM() {
                const tables = document.querySelectorAll('table');
                let disposition = null;

                for (let tbl of tables) {
                    const headers = Array.from(tbl.querySelectorAll('th')).map(th => th.textContent.trim().toUpperCase());
                    const dispIdx = headers.findIndex(h => h.includes('DISPOSITION') || h.includes('DYSPOZYCJA') || h.includes('STAN'));

                    if (dispIdx > -1) {
                        const row = tbl.querySelector('tbody tr');
                        if (row) {
                            const cells = row.querySelectorAll('td');
                            if (cells[dispIdx] && cells[dispIdx].textContent.trim().length > 0) {
                                disposition = cells[dispIdx].textContent.trim();
                                break;
                            }
                        }
                    }
                }

                if (!disposition) {
                    const bodyText = document.body.innerText;
                    const fallbacks =['SELLABLE', 'DAMAGED', 'DEFECTIVE', 'CUSTOMER_DAMAGED', 'UNSELLABLE'];
                    for (let status of fallbacks) {
                        if (bodyText.includes(status)) {
                            disposition = status;
                            break;
                        }
                    }
                }

                if (disposition) {
                    this.transmitData(disposition);
                }
            }

            initObservation() {
                // Initial check in case it's already rendered
                this.analyzeDOM();
                if (this.resolved) return;

                // Watch for SPA framework rendering new nodes
                this.observer = new MutationObserver((mutations) => {
                    let shouldAnalyze = false;
                    for (let mut of mutations) {
                        if (mut.addedNodes.length > 0) {
                            shouldAnalyze = true;
                            break;
                        }
                    }
                    if (shouldAnalyze) this.analyzeDOM();
                });

                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        new DOMTracker(myLpn);
    }

})();
