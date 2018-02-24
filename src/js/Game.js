import React from 'react';
import { sample } from 'lodash';

/*

Field:

>0 = uncovered, number of bombs around = number
0 = uncovered, nothing near
-1 = covered, no bomb
-2 = covered, bomb
-3 uncovered, bomb (game over)

*/

export default class Game extends React.Component{
    timeout;
    bombs = ['💣', '💣', '💣', '💣', '💣', '💣', '👊', '💥', '💩', '💔', '🥦'];
    constructor(props, context){
        super(props, constructor);
        this.state = {
            playfield: [],
            bombsPlaced: false,
            locked: false,
            tileSize: 80
        };
    }
    componentDidMount(){
        this.init();
        this.resize();
        window.addEventListener('resize', this.resize);
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.resize);
    }

    resize = ()=>{
        const tileSize = Math.floor(window.innerWidth / this.props.width) - 40;
        this.setState({ tileSize });
    }
    init(props = this.props){
        const playfield = [];
        for(let y = 0; y < props.height; y++){
            const row = [];
            for(let x = 0; x < props.width; x++){
                row.push(-1);
            }
            playfield.push(row);
        }
        this.setState({ playfield, bomb: sample(this.bombs) });
        if(this.props.autoPlay){
            this.setState({ locked: true });
            window.setTimeout(()=>{
                const randY = Math.floor(Math.random()*this.props.height);
                const randX = Math.floor(Math.random()*this.props.width);
                this.state.playfield[randY][randX] = this.countAround(randX,randY).num;
                this.setState({ playfield: this.state.playfield });
                this.placeBombs();
                this.tick();
            }, 200);
        } else {
            this.setState({ locked: false, bombsPlaced: false });
        }
    }
    placeBombs(){
        const playfield = this.state.playfield;
        let bombsPlaced = 0;
        while(bombsPlaced < this.props.bombs){
            const randY = Math.floor(Math.random()*this.props.height);
            const randX = Math.floor(Math.random()*this.props.width);
            if(playfield[randY][randX] == -1){
                playfield[randY][randX]--;
                bombsPlaced++;
            }
        }
        this.setState({ playfield, bombsPlaced });
        this.props.onChange({ state: 'bombs_placed' });
    }
    countAround(x,y, func=(val)=>{ return val <= -2 } ){
        let num = 0;
        let pos = [];
        for(let _x = x-1 >= 0 ? x-1 : 0; _x <= (x+1 < this.props.width ? x+1 : this.props.width-1); _x++){
            for(let _y = y-1 >= 0 ? y-1 : 0; _y <= (y+1 < this.props.height ? y+1 : this.props.height-1); _y++){
                if(func(this.state.playfield[_y][_x])){
                    num++;
                    pos.push([_x,_y]);
                }
            }
        }
        return {num, pos};
    }
    handleFieldClick = (x, y, v)=>{
        if(this.state.locked) return;
        if(!this.state.bombsPlaced){
            this.placeBombs();
        }
        const playfield = this.state.playfield;
        switch(v){
            case -1:
                playfield[y][x] = this.countAround(x,y).num;
                this.props.onChange({ state: 'move', score: playfield[y][x] + 1 });
            break;
            case -2:
                playfield[y][x] = -3;
                this.setState({ locked: true });
                //window.setTimeout(()=> this.setState({ locked: true }), 30);
                this.state.playfield.forEach((row, _y)=>{
                    return row.forEach((col, _x)=>{
                        if(col == -2) playfield[_y][_x] = -3;
                    });
                });
                this.props.onChange({ state: 'dead' });
            break;
        }
        this.setState({ playfield });
        this.tick();
    }
    tick(){
        this.setState({ locked: true });
        this.timeout = window.setTimeout(this._tick, 50);
    }
    _tick = ()=>{
        let uncovers = [];
        let uncovered = 0;
        let bombs = 0;
        this.state.playfield.forEach((row, y)=>{
            return row.forEach((col, x)=>{
                if(col == 0){
                    uncovers = uncovers.concat(this.countAround(x,y, (val)=>{ return val == -1 }).pos);
                }
                if(col >= 0) uncovered++;
                if(col == -3) bombs++;
            });
        });
        if(uncovered + this.props.bombs == this.props.width * this.props.height){
            this.props.onChange({ state: 'win', score: this.props.bombs*25 });
            return;
        }
        if(uncovers.length == 0){
            this.setState({ locked: false });
            return;
        }
        if(bombs > 0) return;
        const playfield = this.state.playfield;
        const pos = uncovers[Math.floor(Math.random()*uncovers.length)];
        playfield[pos[1]][pos[0]] = this.countAround(pos[0],pos[1]).num;
        this.props.onChange({ score: playfield[pos[1]][pos[0]] + 1 });
        this.setState({ playfield });
        this.tick();
    }
    render(){
        if(!this.state.playfield.length) return null;
        const rows = this.state.playfield.map((row, y)=>{
            return <div className="row" key={ 'row-' + y }>{ row.map((col, x)=>{
                const className = ['field'];
                let label = col > 0 ? col : 0;
                if(col == -3) label = this.state.bomb;
                className.push('field-' + col);
                return <div
                        style={{ width: this.state.tileSize, height: this.state.tileSize }}
                        onClick={ this.handleFieldClick.bind(this, x, y, col) }
                        className={ className.join(' ') } key={ 'col-' + x }>
                    <span>{ label }</span>
                </div>;
            }) }</div>
        });
        return <div className="playfield">{ rows }</div>;
    }
}

Game.defaultProps = {
    width: 4,
    height: 4,
    bombs: 4,
    autoPlay: false,
    onChange: (e) => {}
};