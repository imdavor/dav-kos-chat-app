import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
    const adjectives = [
        "Jutarnja", "Večernja", "Prva", "Načelna", "Bijela", "Zelena", "Jesenska", "Skrivena", "Hladna", "Tiha", "Šmrkljava", "Debela", "Paprena", "Bolesna", "Prava", "Konstruktivna"
    ];
    const nouns = [
        "zvijezda", "majka", "baka", "zaova", "kuma", "noga", "rukavica", "granica", "šuma", "cesta", "stijena", "planina", "utvara", "kopriva", "krava", "pizza"
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + " " + noun;
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
    state = {
        messages: [],
        member: {
            username: randomName(),
            color: randomColor(),
        }
    }

    constructor() {
        super();
        this.drone = new window.Scaledrone('1o0bYdyB0eiauW0t', {
            data: this.state.member
        });
        this.drone.on('open', error => {
            if (error) {
                return console.error(error);
            }
            const member = { ...this.state.member };
            member.id = this.drone.clientId;
            this.setState({ member });
        });
        const room = this.drone.subscribe("observable-room");
        room.on('data', (data, member) => {
            const messages = this.state.messages;
            messages.push({ member, text: data });
            this.setState({ messages });
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src="https://haveyouheard.co.za/wp-content/uploads/2019/06/18X24-TONGUES_Page_02_1024x1024-copy.png" alt="" />
                    <h1>Bla Bla Space</h1>
                </div>
                <Messages
                    messages={this.state.messages}
                    currentMember={this.state.member}
                />
                <Input
                    onSendMessage={this.onSendMessage}
                />
            </div>
        );
    }

    onSendMessage = (message) => {
        this.drone.publish({
            room: "observable-room",
            message
        });
    }

}

export default App;