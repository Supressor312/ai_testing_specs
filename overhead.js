javascript: (function() {
    if (window.latweWrapperInit) return console.log("Оболочка уже запущена!");
    window.latweWrapperInit = !0;
    const e = document.createElement("style");
    e.innerHTML = "\n        #latwe-launcher { position: fixed; top: 10px; right: 10px; z-index: 999999; background: #3cb0fd; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: 0.3s; }\n        #latwe-launcher:hover { background: #2a8bc8; }\n        body.latwe-split-screen { display: flex !important; flex-flow: row nowrap !important; align-items: center !important; justify-content: space-around !important; }\n        body.latwe-split-screen > *:not(#latwe-external-ui):not(#latwe-launcher) { width: 30% !important; min-width: 300px; transition: 0.3s; }\n        #latwe-external-ui { flex-grow: 1; max-width: 65%; height: 90vh; overflow-y: auto; display: none; padding: 20px; box-sizing: border-box; }\n        body.latwe-split-screen #latwe-external-ui { display: block !important; }\n    ", document.head.appendChild(e);
    const t = document.createElement("button");
    t.id = "latwe-launcher", t.innerText = "⚙️ Загрузить ŁatweTaski", document.body.appendChild(t);
    let n = null;
    window.LatweAPI = {
        submit: function(e) {
            if (!n) return alert("Ошибка: Поле ввода не было захвачено.");
            let t = document.querySelector(n.selector);
            if (t) {
                t.value = e;
                let o = t.closest("form");
                o ? o.submit() : (t.dispatchEvent(new Event("input", {
                    bubbles: !0
                })), t.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "Enter",
                    keyCode: 13,
                    bubbles: !0
                })), t.dispatchEvent(new KeyboardEvent("keyup", {
                    key: "Enter",
                    keyCode: 13,
                    bubbles: !0
                })))
            } else console.error("Не могу найти поле по селектору:", n.selector)
        }
    };
    t.addEventListener("click", (() => {
        const e = Array.from(document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])')).filter((e => e.offsetWidth > 0 && e.offsetHeight > 0));
        if (0 === e.length) return alert("Внимание: На экране не найдено видимых полей ввода. Дождитесь появления поля для таска и нажмите снова.");
        const o = e[0];
        n = {
            selector: o.id ? "#" + o.id : o.name ? 'input[name="' + o.name + '"]' : o.placeholder ? 'input[placeholder="' + o.placeholder + '"]' : "input",
            form: o.closest("form")
        }, console.log("Снимок поля сделан:", n);
        const r = prompt("Снимок поля успешен!\nВставьте прямую ссылку на .js файл с актуальными тасками:");
        if (r) {
            t.innerText = "⏳ Загрузка...", t.disabled = !0;
            const e = document.createElement("div");
            e.id = "latwe-external-ui", document.body.appendChild(e), fetch(r).then((e => e.text())).then((n => {
                (new Function(n))(), t.style.display = "none", i()
            })).catch((e => {
                alert("Ошибка загрузки скрипта. Проверьте ссылку в консоли."), console.error(e), t.innerText = "⚙️ Загрузить ŁatweTaski", t.disabled = !1
            }))
        }
    }));
    const i = () => {
        setInterval((() => {
            if (!n) return;
            const e = document.querySelector(n.selector),
                t = e && e.offsetWidth > 0;
            document.body.classList.toggle("latwe-split-screen", t)
        }), 100)
    }
})();
