class WorkHoursTable {

    constructor(id, wrapId, start, end) {
        if(!id){
            throw Error('No table ID');
        }
        if(!wrapId){
            throw Error('No table wrap ID');
        }
        this.beginTime = start ? start : '00:00'
        this.endTime = end ? end : '23:00'
        this.timeOut = 350;
        this.tableId = id;
        this.wrapId = document.getElementById(wrapId);
        //Save context for method
        this.changeInterval = this.changeInterval.bind(this);
    }

    createTable(){
        //Create time title
        const timeTitle = document.createElement('span');
        timeTitle.classList.add('table__time-title');
        timeTitle.innerText = 'Задать интервал таблицы';
        //Create time separator
        const separator = document.createElement('span');
        separator.classList.add('table__time-separator');
        //Create time fields
        const inputStart = this.createInput(this.beginTime, this.tableId + 'start_interval');
        const inputEnd = this.createInput(this.endTime, this.tableId + 'end_interval');
        //Create wrapper
        const wrap = document.createElement('div');
        wrap.id = this.tableId;
        wrap.classList.add('table__wrap');
        //Create time-title wrap
        const timeTitleWrap = document.createElement('div');
        timeTitleWrap.classList.add('table__time-title-wrap');
        //Create buttons wrap
        const buttonsWrap = document.createElement('div');
        buttonsWrap.classList.add('table__buttons-wrap');
        const buttonFill = this.createButton('Заполнить автоматически');
        const buttonClear = this.createButton('Очистить');
        buttonClear.addEventListener("click", () => this.fillActiveHours(true), false);
        buttonFill.addEventListener("click", () => this.fillActiveHours(), false);
        //Append blocks
        timeTitleWrap.append(timeTitle);
        timeTitleWrap.append(inputStart);
        timeTitleWrap.append(separator);
        timeTitleWrap.append(inputEnd);
        buttonsWrap.append(buttonFill);
        buttonsWrap.append(buttonClear);
        this.wrapId.append(timeTitleWrap);
        this.wrapId.append(wrap);
        this.wrapId.append(buttonsWrap);
        //Render table
        this.redrawTable(wrap, this.beginTime, this.endTime);
    }

    createCell(){
        const cell = document.createElement('div');
        cell.classList.add('table__cell');
        cell.addEventListener("click", this.toggleClass, false);

        return cell;
    }

    createRow(day, count){
        const row = document.createElement('div');
        row.classList.add('table__row');
        const firstCell = document.createElement('div');
        firstCell.classList.add('table__cell');
        firstCell.classList.add('table__cell--days');
        firstCell.innerHTML = `${day}`;
        row.append(firstCell);
        for(let i = 0;i < count;i++){
            const cell = this.createCell();
            row.append(cell);
        }
        return row;
    }

    createHoursRow(start, count){
        const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        const hoursCircle = hours.concat(...hours);
        const startHour = start.split(':');
        const startPoint = hoursCircle.indexOf(startHour[0]);
        //create row
        const row = document.createElement('div');
        row.classList.add('table__row');
        row.classList.add('table__row--hours');
        //create first cell
        const firstCell = document.createElement('div');
        firstCell.classList.add('table__cell');
        firstCell.classList.add('table__cell--days');
        //append blocks
        row.append(firstCell);
        for(let i = startPoint;i < startPoint + count;i++){
            //create default hour cell
            const cell = document.createElement('div');
            cell.classList.add('table__cell');
            const minutes = document.createElement('span');
            minutes.classList.add('minutes');
            minutes.innerText = '00';
            if(i%2 !== 0){
                cell.innerText = hoursCircle[i];
                cell.append(minutes);
            }
            row.append(cell);
        }
        return row;
    }

    createInput(value, id){
        const input = document.createElement('input');
        input.id = id;
        input.type = 'time';
        input.min = '00:00';
        input.max = '23:30';
        input.value = value;
        input.addEventListener("change", this.changeInterval, false);

        return input;
    }

    createButton(text){
        const button = document.createElement('button');
        button.classList.add('table__button');
        button.type = 'button';
        button.innerText = text;

        return button
    }

    calculateInterval(from, to){
        const starts = from.split(':');
        const ends = to.split(':');
        let startHour = Number(starts[0]);
        let startMinute = Number(starts[1]);
        let endHour = Number(ends[0]);
        let endMinute = Number(ends[1]);

        //Night shifts
        if(endHour < startHour){
            endHour += 24;
        }

        return endHour - startHour
    }

    redrawTable(wrap, start, end){
        const count = this.calculateInterval(start, end);
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const hoursRow = this.createHoursRow(start, count)

        if(count > 0){
            wrap.append(hoursRow);
            for(let i = 0;i < 7;i++){
                const row = this.createRow(days[i], count);
                wrap.append(row);
            }
        }
    }

    recalculateRows(start, end){
        const table = document.getElementById(this.tableId);
        const rows = table.querySelectorAll('.table__row');
        const count = this.calculateInterval(start, end);

        if(count <= 0){return}

        const hoursRow = this.createHoursRow(start, count);
        rows[0].remove();
        table.prepend(hoursRow);

        for(let r = 1; r < rows.length;r++) {
            const cells = rows[r].querySelectorAll('.table__cell');
            if(count < cells.length) {
                for(let i = cells.length - 1; i > count;i--) {
                    cells[i].remove();
                }
            }
            else if(count >= cells.length){
                for(let i = cells.length - 1; i < count;i++) {
                    const cell = document.createElement('div');
                    cell.classList.add('table__cell');
                    cell.addEventListener("click", this.toggleClass, false);
                    rows[r].append(cell);
                }
            }
        }

    }

    clearTableAnimate(){
        const table = document.getElementById(this.tableId);
        const rows = table.querySelectorAll('.table__row');
        for(let i = 0; i < rows.length;i++){
            const cells = rows[i].querySelectorAll('.table__cell');
            //possible animations
            const aliceTumbling = [
                { transform: 'rotate(0) translate3D(-50%, -50%, 0', color: '#000' },
                { color: '#431236', offset: 0.3},
                { transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000' }
            ];
            const aliceTiming = {
                duration: this.timeOut,
                iterations: 1
            }
            cells.forEach(elem => {
                elem.classList.add('hide');
                //elem.animate(aliceTumbling, aliceTiming);
                setTimeout(() => {elem.remove()}, this.timeOut)
            })
        }
    }

    fillActiveHours(clear){
        const table = document.getElementById(this.tableId);
        const rows = table.querySelectorAll('.table__row');
        for(let r = 1; r < rows.length;r++) {
            const cells = rows[r].querySelectorAll('.table__cell');
            if(clear){
                for(let i = 1; i < cells.length;i++) {
                    cells[i].classList.remove('active');
                }
            }
            else {
                for(let i = 1; i < cells.length;i++) {
                    cells[i].classList.add('active');
                }
            }

        }
    }

    toggleClass(e){
        e.target.classList.toggle('active')
    }

    changeInterval(e){
        if(e.target.id === this.tableId + 'start_interval'){
            this.beginTime = e.target.value
        }
        if(e.target.id === this.tableId + 'end_interval'){
            this.endTime = e.target.value
        }
        this.recalculateRows(this.beginTime, this.endTime)
    }

}

const table = new WorkHoursTable('work_hours_table', 'main_wrap');
table.createTable();
//const table2 = new WorkHoursTable('work_hours_table2', 'main_wrap');
//table2.createTable();

