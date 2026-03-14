// ==UserScript==
// @name        ÅatweTaski
// @version      1.2
// @description Adds buttons into labor kiosk
// @author      @dombart
// @match      https://fcmenu-dub-regionalized.corp.amazon.com/lcj4/laborTrackingKiosk*
// @match      https://fcmenu-dub-regionalized.corp.amazon.com/LCJ4/laborTrackingKiosk
// @updateURL    https://drive.corp.amazon.com/view/dombart@/Tampermonkey/%C5%81atweTaski.user.js
// @downloadURL  https://drive.corp.amazon.com/view/dombart@/Tampermonkey/%C5%81atweTaski.user.js
// ==/UserScript==
var css = document.createElement("style");
css.innerHTML += `
* {
    box-sizing: border-box;
}
#body {
    display: flex;
    flex-flow: row nowrap;
    align-content: space-around;
    justify-content: space-around;
}
#body > .login {
    margin: 10 px;
    width: 25%;
    max-width: 300px;
    max-height: 450px;
}
#body > #toolbox {
   
    flex-grow: 9;
    font-size: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-content: Center;
    justify-content: center;
}
#body > #toolbox > .row {
    margin-bottom: 10px;
}
#body > #toolbox > .row > h1 {
    align-content: center;
    padding: 0 8px;
    margin: auto;
    width: 50%;
    padding: 10px;
}
#body > #toolbox > .row > .roles {
    display: flex;
    flex-flow: row nowrap;
    align-content: space-between;
    justify-content: start;
    padding: 0 8px;
    max-width: 100%;

}
#body > #toolbox > .row > .roles > button {
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
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  vertical-align: baseline;
  width: auto;
}

#body > #toolbox > .row > .roles > button:hover {
    background: #3cb0fd;
}
`;
document.querySelector("head").appendChild(css);
function movebox() {
    let waitForIt;
    if (waitForIt = document.querySelector('#body > .login')) {
        waitForIt.style = '';
    } else {
        setTimeout(movebox, 500);
    }
}
movebox();
var codes = [
    {
        title: 'Customer Returns',
        roles: [
            {name: 'Team Lead', code: 'LRTN'},
            {name: 'Unloader', code: 'CRUNLD'},
            {name: 'WS', code: 'CRSDCNTF'},
            {name: 'Instructor', code: 'CRAMB'},
            {name: '5s ', code: 'CR5S'},
            {name: 'Speciality PS', code: 'SPPROJ1'},
            {name: 'Apparel', code: 'SCRET09'},
            {name: 'Speciality', code: 'SCRET03'},
            {name: 'Virtual Remove', code: 'SCRET12'},
            {name: 'Ekspresy', code: 'SCRFB04'},
            {name: 'Unified Grading', code: 'SCRET10'},
            {name: 'Ostre', code: 'SCRET02'},
            {name: 'CRet sort TTS/TTA', code: 'CRSORT'},
            {name: 'Process-guide Cret', code: 'PRGCRET'},
            {name: 'Audyt Cret', code: 'CRAUDIT'},

        ]
    },
      {
        title: 'Vendor Returns',
        roles: [
            {name: 'Team Lead', code: 'LVRET'},
            {name: 'Waterspider', code: 'VRWS'},
            {name: 'Remove' , code: 'VRLQ'},
            {name: 'ProblemSolve' , code: 'TRVPS'},
            {name: 'INSTRUKTOR', code: 'VRAMB'},
            {name: 'Donacja', code: 'ICQDMP'},
        ]
    },

    {
        title: 'Transfer in Dock',
        roles: [
            {name: 'Team Lead', code: 'LRTN'},
            {name: 'Waterspider', code: 'CRSDCNTF'},
            {name: 'Unloader', code: 'CRUNLD'},
            {name: 'Dock Clerk', code: 'RSVDC'},
            {name: 'Pit Operator', code: 'CRBPS'},
        ]
    },
    {
        title: 'Transfer Out Ship',
        roles: [
            {name: 'TeamLeader', code: 'TOTOL'},
            {name: 'ShippingClerk', code: 'SHPCL'},
            {name: 'IndoorMarshal', code: 'OUTCRW'},
            {name: 'Sortacja LikwidatorÃ³w', code: 'VRSORT'},
            {name: 'PIT', code: 'MTTL'},
            {name: 'ErgoPack', code: 'TOPACK'},
            {name: 'SortacjaHazmaty', code: 'PSTOPS'},
        ]
    },
 {
        title: 'WHD',
        roles: [
{name: 'Team Lead', code: 'LPAWD'},
{name: 'WS', code: 'WHDWTSP'},
{name: 'Audyt', code: 'WDQA'},
{name: 'Sort', code: 'WDSORT'},
{name: 'Problem Solve', code: 'WDPS'},
{name: 'Telefony', code: 'WDGRADA'},
{name: 'Rutery', code: 'WDGRADC'},
{name: 'BMVD', code: 'BKGRD'},
{name: 'Memory items', code: 'DSKGRD'},
{name: 'Non Tech Grading', code: 'HLGRD'},
{name: 'TechGrading ID7', code: 'TECHGR'},
{name: 'Memory items DYSKI', code: 'WDREBX'},
{name: 'Drones', code: 'CEGRAD'},
{name: 'Cameras', code: 'CAMGRAD'},
{name: 'Audio', code: 'AUDGRAD'},
{name: 'PC components', code: 'PCACGRAD'},
{name: 'Consoles, Gaming Gear', code: 'GAMGRAD'},
        ]
    },

     {
        title: 'Refurb',
        roles: [
            {name: 'Process Guide ', code: 'PRGCRET'},
            {name: 'Sweeper ', code: 'SCRFB10'},
            {name: 'Water Spider ', code: 'CRSDCNTF'},
            {name: 'Sort Tool (69)', code: 'SCRFB16'},
            {name: 'Manual Sort', code: 'SPPROJI'},
            {name: 'Ostre', code: 'SCRFB02 '},
            {name: 'HeatGun', code: 'SCRFB08'},
            {name: 'ShrinkWrap', code: 'SCRFB01'},
            {name: 'REF', code: 'CRETREF'},
            {name: 'HG&REF', code: 'SCRFB05 '},
            {name: 'Peer Trainer', code: 'SCRFB03'},
            {name: 'Apparells', code: 'SCRFB06'},
            {name: 'Audyty ', code: 'SCRFB09'},

        ]
    },

     {
        title: 'Speciality',
        roles: [
{name: 'Audio ', code: 'SCRFB13'},
{name: 'Rutery ', code: 'SCRFB17'},
{name: 'Telefony ', code: 'SCRFB11'},
{name: 'Kamery', code: 'SCRFB15'},
{name: 'SmartWach / GPS', code: 'SCRFB14'},
{name: 'Konsole ', code: 'SCRFB02'},
{name: 'Technicale', code: 'SCRFB12'},


        ]
    },

     {
        title: 'HR/OTHER',
        roles: [
            {name: 'ISTOP', code: 'ISTOP'},
            {name: 'MSTOP', code: 'MSTOP'},
            {name: 'SEV', code: 'SEV1_2'},
            {name: 'RSG', code: 'STNASCSFTCOM'},
            {name: 'KSR', code: 'STNFSITR'},
            {name: 'ENGAGE', code: 'OPSEMPENG'},
            {name: '1:1', code: 'OPSAAENG'},
            {name: 'Dodatkowa przerwa', code: 'HRACCOM'},
            {name: 'Spotkania z HR', code: 'HRMISC'},
{name: 'Safety Ambassador', code: 'SFTASC'},
{name: 'Over Staffing', code: 'OVERSTA'},
            {name: 'Urodziny', code: 'HRGROUP'},
            {name: 'Engage', code: 'ENGAGE'},
        ]
    },

];
let toolbox = document.createElement('div'), toolboxHTML = '';
toolbox.id = "toolbox";
for (let shift of codes) {
    console.log(shift);
    toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
    for (let role of shift.roles) {
        toolboxHTML += '<button value="' + role.code + '">' + role.name + '</button>';
    }
    toolboxHTML += '</div></div>';
}
toolbox.innerHTML = toolboxHTML
document.querySelector('#body').appendChild(toolbox);
Array.from(document.querySelectorAll('#body > #toolbox > .row > .roles > button')).forEach(function(el){
    el.addEventListener('click', function () {
        document.getElementById('calmCode').value = el.value
        document.forms[0].submit()
    })
})
