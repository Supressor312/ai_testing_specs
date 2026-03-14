(function(){
    // 1. Setup - Create a floating container that sits on top of everything
    let container = document.getElementById('at-kiosk-menu');
    if (container) container.remove();
    
    container = document.createElement('div');
    container.id = 'at-kiosk-menu';
    Object.assign(container.style, {
        position: 'fixed', top: '10px', right: '10px', width: '350px',
        maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#ffffff',
        border: '3px solid #ff9900', borderRadius: '8px', zIndex: '2147483647',
        padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontFamily: 'sans-serif'
    });

    // 2. Data - Your specific labor codes
    const categories = [
        {title: 'Customer Returns', roles: [{n: 'Team Lead', c: 'LRTN'}, {n: 'Unloader', c: 'CRUNLD'}, {n: 'WS', c: 'CRSDCNTF'}]},
        {title: 'Vendor Returns', roles: [{n: 'Team Lead', c: 'LVRET'}, {n: 'Waterspider', c: 'VRWS'}, {n: 'Donacja', c: 'ICQDMP'}]},
        {title: 'HR/OTHER', roles: [{n: 'ISTOP', c: 'ISTOP'}, {n: 'SEV', c: 'SEV1_2'}, {n: 'Engage', c: 'ENGAGE'}]}
    ];

    // 3. Logic - Function to find the input in ANY frame/iframe
    const fillInput = (code) => {
        const findAndFill = (win) => {
            const input = win.document.querySelector('input#input, input[name="barcode"], .barcode-input');
            if (input) {
                input.value = code;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.focus();
                // Try to auto-submit
                const btn = win.document.querySelector('button#submit, input[type="submit"]');
                if (btn) btn.click();
                return true;
            }
            // Check nested iframes
            for (let i = 0; i < win.frames.length; i++) {
                try { if (findAndFill(win.frames[i])) return true; } catch(e) {}
            }
            return false;
        };
        if (!findAndFill(window)) alert("Could not find barcode input field!");
    };

    // 4. UI Construction
    let html = '<h2 style="margin:0 0 10px 0; color:#232f3e; font-size:18px;">ŁatweTaski Menu</h2>';
    categories.forEach(cat => {
        html += \`<div style="margin-bottom:15px;"><b style="display:block; border-bottom:1px solid #ddd; margin-bottom:5px;">\${cat.title}</b><div style="display:flex; flex-wrap:wrap; gap:5px;">\`;
        cat.roles.forEach(r => {
            html += \`<button class="kiosk-btn" data-code="\${r.c}" style="padding:6px 10px; border:1px solid #ccc; background:#f3f3f3; cursor:pointer; border-radius:4px; font-size:12px; font-weight:bold;">\${r.n}</button>\`;
        });
        html += '</div></div>';
    });
    container.innerHTML = html;
    document.body.appendChild(container);

    // 5. Event Listener
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('kiosk-btn')) {
            fillInput(e.target.getAttribute('data-code'));
        }
    });
})();
