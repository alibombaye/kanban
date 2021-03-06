import React, { Component } from 'react';
import update from 'react-addons-update';
import KanbanBoard from './KanbanBoard';
import 'babel-polyfill';
import 'whatwg-fetch';

const API_URL='http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'hello'
};

class KanbanBoardContainer extends Component {
    constructor() {
        super(...arguments);
        this.state = {
          cards:[],
        };
    }

    componentDidMount() {
        fetch(`${API_URL}/cards`,{headers:API_HEADERS}
            ).then((response) => response.json()
            ).then((responseData) => {
                this.setState({cards: responseData});
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
        window.state = this.state;
    }

    addTask(cardId, taskName){
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);

        let newTask = {id:Date.now(), name:taskName, done:false};

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask]}
            }
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        }).then((response) => {
            if (response.ok) {
                response.json()
            } else {
                throw new Error("Server response wasn't OK")
            }
        }).then((responseData) => {
            newTask.id=responseData.id
            this.setState({cards:nextState});
        }).catch((error) => {
            console.error("Fetch Error:", error)
            this.setState(prevState);
        });
    }

    deleteTask(cardId, taskId, taskIndex){
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice:[[taskIndex, 1]]}
            }
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{
            method: 'delete',
            headers: API_HEADERS
        }).then((response)=>{
            if (!response.ok) {
                throw new Error("Server response wasn't OK")
            }
        }).catch((error) => {
            console.error("Fetch error:", error)
            this.setState(prevState);
        });
    }

    toggleTask(cardId, taskId, taskIndex){
        console.log("in toggle task", cardId, taskId, taskIndex);
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);

        let newDoneValue;

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: { $apply: (done) => {
                            newDoneValue = !done;
                            return newDoneValue;
                            }
                        }
                    }
                }
            }
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done:newDoneValue})
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Server response wasn't OK")
            }
        }).catch((error) => {
            console.error("Fetch error:", error)
            this.setState(prevState);
        });
    }

    render() {
        return <KanbanBoard cards={this.state.cards}
                            taskCallbacks={{
                              toggle: this.toggleTask.bind(this),
                              delete: this.deleteTask.bind(this),
                              add: this.addTask.bind(this)
                            }} />
    }
}

export default KanbanBoardContainer;