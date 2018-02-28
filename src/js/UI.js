import React from 'react';
import { sample } from 'lodash';
import Game from './Game';
import leftPad from 'left-pad';

class Score extends React.Component{
    interval;
    changeFaceTimeout;
    constructor(props, context){
        super(props, constructor);
        this.state = {
            num: 0
        };
    }
    componentDidMount(){
        this.tick();
    }
    componentWillReceiveProps(props){
        this.tick(props);
    }
    tick = (props=this.props)=>{
        if(props.num != this.state.num){
            window.setTimeout(this.tick, 10);
        }
        if(props.num < this.state.num) this.setState({ num: this.state.num-1 });
        if(props.num > this.state.num) this.setState({ num: this.state.num+1 });
    }
    render(){
        return <div className='score'>
            { leftPad(this.state.num, 8, '0') }
        </div>
    }
}

export default class UI extends React.Component{
    minBombs = 1;
    faces = {
        idle: ['🤔', '😐'],
        move: ['🤗', '😳', '😯', '😏'],
        dead: ['💀', '😱', '😓'],
        win: ['😜', '😎', '🤓']
    }
    constructor(props, context){
        super(props, constructor);
        this.state = {
            level: 0,
            face: sample(this.faces.idle),
            showDead: false,
            showWin: false,
            gameNum: 0,
            score: 0
        };
    }
    handleGameChange = (e)=>{
        if(e.score){
            this.setState({ score: this.state.score + e.score });
        }
        if(e.state){
            if(e.state == 'win'){
                window.setTimeout(()=> this.setState({ showWin: true }), 500);
            }
            if(e.state == 'dead'){
                window.setTimeout(()=> this.setState({ showDead: true }), 500);
            }
            if(this.faces[e.state]){
                this.setState({ face: sample(this.faces[e.state]) });
            }
        }
    }
    handleNextClick = ()=>{
        this.setState({ level: this.state.level+1, face: sample(this.faces.idle), showWin: false });
    }
    handleRetryClick = ()=>{
        this.setState({ level: 0, face: sample(this.faces.idle), showDead: false, score: 0, gameNum: this.state.gameNum+1 });
    }
    render(){
        let message;
        if(this.state.showDead){
            message = <div className="message">
                <div>
                    <h2>GAME<br />OVER</h2>
                    <button onClick={ this.handleRetryClick }>Retry</button>
                </div>
            </div>;
        }
        if(this.state.showWin){
            message = <div className="message">
                <div>
                    <h2>YOU<br />WON!</h2>
                    <button onClick={ this.handleNextClick }>Next</button>
                </div>
            </div>;
        }
        const numBombs = this.state.level + this.minBombs;
        return <div>
            <div className="top">
                <Score num={ this.state.score } />
                <div className="face">{ this.state.face }</div>
                <div className="bombs">💣x{ numBombs }</div>
            </div>
            <Game
            key={ 'game-' + this.state.level + '-' + this.state.gameNum }
            autoPlay={ false }
            width={ 4 }
            height={ 5 }
            bombs={ numBombs }
            onChange={ this.handleGameChange }
            />
            {message}
        </div>
    }
}
