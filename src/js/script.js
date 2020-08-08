class WorkHoursTable {

    constructor(id, wrapId, start, end) {
        this.beginTime = start ? start : '08:00'
        this.endTime = end ? end : '23:00'
        this.timeOut = 350;
        this.tableId = id;
        this.wrapId = document.getElementById(wrapId);
        //Save context for method
        this.changeInterval = this.changeInterval.bind(this);
    }

    createTable(){
        //Create time fields
        this.createInput(this.wrapId, this.beginTime, this.tableId + 'start_interval');
        this.createInput(this.wrapId, this.endTime, this.tableId + 'end_interval');
        const wrap = document.createElement('div');
        wrap.id = this.tableId;
        wrap.classList.add('table__wrap');
        this.wrapId.append(wrap);
        this.redrawTable(wrap, this.beginTime, this.endTime)
    }

    createCell(){
        const cell = document.createElement('div');
        cell.classList.add('table__cell');
        cell.classList.add('active');
        cell.addEventListener("click", this.toggleClass, false);

        return cell;
    }

    createRow(wrap, day, count){
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
        wrap.append(row);
    }

    createInput(wrap, value, id){
        const input = document.createElement('input');
        input.id = id;
        input.type = 'time';
        input.min = '00:00';
        input.max = '23:30';
        input.value = value;
        input.addEventListener("change", this.changeInterval, false);
        wrap.append(input);
    }

    calculateInterval(from, to){
        const starts = from.split(':');
        const ends = to.split(':');

        return Number(ends[0]) - Number(starts[0])
    }

    redrawTable(wrap, start, end){
        const count = this.calculateInterval(start, end);
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        if(count > 0){
            for(let i = 0;i < 7;i++){
                this.createRow(wrap, days[i], count);
            }
        }
    }

    recalculateRows(start, end){
        const table = document.getElementById(this.tableId);
        const rows = table.querySelectorAll('.table__row');
        const count = this.calculateInterval(start, end);

        if(count <= 0){return}

        for(let r = 0; r < rows.length;r++) {
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
                    cell.classList.add('active');
                    cell.addEventListener("click", this.toggleClass, false);
                    rows[r].append(cell);
                }
            }
        }

    }

    clearTable(){
        const table = document.getElementById(this.tableId);
        const rows = table.querySelectorAll('.table__row');
        for(let i = 0; i < rows.length;i++){
            const cells = rows[i].querySelectorAll('.table__cell');
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

