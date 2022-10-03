var calendarToday = document.getElementById("calendar-todays-date");
var today = new Date()
var todayFormat = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
var todayObject = {month:today.getMonth() + 1, date:today.getDate(), year:today.getFullYear()}
//This uses moment.js to display the current time.
function todaysDate() {
  var today = moment().format("ddd MMM DD YYYY");
  calendarToday.textContent = today;
};
todaysDate();


//This sets the calendar elements.
var cal = {
  sMon : true, 
  mName : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 

 //This sets the calendar data.
  data : null, 
  sDay : 0, sMth : 0, sYear : 0, 

  
  hMth : null, hYear : null, 
  hForm : null, hfHead : null, hfDate : null, hfTime: null, hfTxt : null, hfDel : null, 

//This sets the html elements of the calendar.
  init : () => {
    cal.hMth = document.getElementById("cal-mth");
    cal.hYear = document.getElementById("cal-yr");
    cal.hForm = document.getElementById("cal-event");
    cal.hfHead = document.getElementById("evt-head");
    cal.hfDate = document.getElementById("evt-date");
    cal.hfTxt = document.getElementById("evt-details");
    cal.hfTime = document.getElementById("evt-timeblock-details");
    cal.hfDel = document.getElementById("evt-del");
    document.getElementById("evt-close").onclick = cal.close;
    cal.hfDel.onclick = cal.del;
    cal.hForm.onsubmit = cal.save;
//I use this for the current date.
    let now = new Date(),
        nowMth = now.getMonth(),
        nowYear = parseInt(now.getFullYear());
//This appends months to the calendar.
    for (let i=0; i<12; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = cal.mName[i];
      if (i==nowMth) { opt.selected = true; }
      cal.hMth.appendChild(opt);
    }
    cal.hMth.onchange = cal.list;
//This appends years to the calendar.
    for (let i=nowYear-10; i<=nowYear+10; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i==nowYear) { opt.selected = true; }
      cal.hYear.appendChild(opt);
    }
    cal.hYear.onchange = cal.list;
//This draws the calendar.
    cal.list();
  },
//This draws the calendar for the chosen month.
  list : () => {

    cal.sMth = parseInt(cal.hMth.value); 
    cal.sYear = parseInt(cal.hYear.value); 
    let daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(), 
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
        endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(), 
        now = new Date(), 
        nowMth = now.getMonth(), 
        nowYear = parseInt(now.getFullYear()), 
        nowDay = cal.sMth==nowMth && cal.sYear==nowYear ? now.getDate() : null ;
//This loads data from local storage.    
    cal.data = localStorage.getItem(`cal-${cal.sMth}-${cal.sYear}`);
    if (cal.data==null) {
      let calObject = JSON.stringify({eventTime:"", eventTxt:""})
      localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, calObject);
      cal.data = JSON.parse(calObject);
    } else { cal.data = JSON.parse(cal.data); }
//This draws the blank squares used in the calendar.
    let squares = [];
    var blanks = 0;
    if (cal.sMon && startDay != 1) {
      blanks = startDay==0 ? 7 : startDay ;
      for (let i=1; i<blanks; i++) { squares.push("eb"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (let i=0; i<startDay; i++) { squares.push("eb"); }
    }

    for (let i=1; i<=daysInMth; i++) { squares.push(i); }

    if (cal.sMon && endDay != 0) {
      let blanks = endDay==6 ? 1 : 7-endDay;
      for (let i=0; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && endDay != 6) {
      let blanks = endDay==0 ? 6 : 6-endDay;
      for (let i=0; i<blanks; i++) { squares.push("b"); }
    }
//This also draws the calendar in html.
    let container = document.getElementById("cal-container"),
    cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);
//This is the days of the week being drawn.
    let cRow = document.createElement("tr"),
        days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    if (cal.sMon) { days.push(days.shift()); }
    for (let d of days) {
      let cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);
//This is the days of the month being filtered from the blank days.
    let total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");

    var blankDaysArray = squares.filter((square)=>{
      return square == "eb";      
    })
    var offsetDays = blankDaysArray.length;
    console.log(blankDaysArray);
    for (let i=0; i<total; i++) {
      let cCell = document.createElement("td");
      if (squares[i]=="b" || squares[i]=="eb") { cCell.classList.add("blank"); }
      else {
        cCell.onclick = () => { cal.show(cCell); };
        if (parseInt(squares[i]) < parseInt(nowDay)) {
          cCell.classList.add("past");
          cCell.onclick = (event) => { event.preventDefault() };
        } 
        if (parseInt(nowMth) > parseInt(cal.sMth)) {
          cCell.classList.add("past");
          cCell.onclick = (event) => { event.preventDefault() };
        }
        if (parseInt(squares[i]) > parseInt(nowDay)) {
          cCell.classList.add("future");
        }
         if (parseInt(nowMth) < parseInt(cal.sMth)) {
          cCell.classList.add("future");
        }  
        if (parseInt(squares[i]) == parseInt(nowDay)) {
           cCell.classList.add("now");
        }
        
         if (cal.data[i - offsetDays +1]) {
          cCell.classList.add("event");
          console.log("we have data", cal.data[i])
        }
        cCell.innerHTML = `<div class="dd">${squares[i]}</div>`;
        if (cal.data[squares[i]]) {
         
          cCell.innerHTML += `<div class='evt'> ${cal.data[squares[i]].eventTime}, ${cal.data[squares[i]].eventTxt}</div>`;
        }
       
      }
      cRow.appendChild(cCell);
      if (i!=0 && (i+1)%7==0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }
//This removes the add/edit event box.
    cal.close();
  },
//This shows the edit event box for the selected day.
  show : (el) => {
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;
    let isEdit = cal.data[cal.sDay] !== undefined ;

    cal.hfTxt.value = isEdit ? cal.data[cal.sDay].eventTxt : "" ;
    cal.hfTime.value = isEdit ? cal.data[cal.sDay].eventTime : "" ;
    cal.hfHead.innerHTML = isEdit ? "EDIT EVENT" : "ADD EVENT" ;
    cal.hfDate.innerHTML = `${cal.sDay} ${cal.mName[cal.sMth]} ${cal.sYear}`;
    if (isEdit) { cal.hfDel.classList.remove("ninja");}
    else { cal.hfDel.classList.add("ninja"); }
    cal.hForm.classList.remove("ninja");
  },
//This closes the event box by adding "ninja".
  close : () => {
    cal.hForm.classList.add("ninja");
  },
//This saves the event.
  save : () => {
    cal.data[cal.sDay] = {eventTime:cal.hfTime.value, eventTxt:cal.hfTxt.value};
    localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, JSON.stringify(cal.data));
    cal.list();
    return false;
  },
//This deletes the event.
  del : () => { if (confirm("Delete event?")) {
    delete cal.data[cal.sDay];
    localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, JSON.stringify(cal.data));
    cal.list();
  }}
};
window.addEventListener("load", cal.init);
