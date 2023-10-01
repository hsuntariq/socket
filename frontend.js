import { useState,useEffect } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');
export default function Chat()  {
    const [message, setMessage] = useState('');
    // const [messages, setMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [recMessages, setRecMessages] = useState([]);
    const [room, setRoom] = useState('');
    const handleRoom = (e) => {
        e.preventDefault();
        if (!room) {
            alert('please enter the room')
        } else {
            socket.emit('join_room',room)
        }
    }   
    const handleClick = (e) => {
        e.preventDefault()
        socket.emit('sent_message', { message,room });
        setSentMessages([...sentMessages, {message:message,id:Date.now(),sent:true}]);
        setMessage('')
    }
    useEffect(() => {
        socket.on('received_message', (data) => {
        setRecMessages([...recMessages, {message:data,id:Date.now(),sent:false}]);
        })
    },[recMessages])
    const messages = [...recMessages, ...sentMessages].sort((a, b)=> {
        return a.id-b.id
    })
    return (
        <>
            <form>
               
                <input type='text' placeholder='room' value={room} onChange={(e) => setRoom(e.target.value)} />
                <button onClick={handleRoom}>
                    Set Room
                </button>
                 <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={handleClick}>
                    Send
                </button><br/>
            </form>
            {messages.map((msg) => {
                return (
                    <>
                        <h6>{msg.message}</h6>
                    </>
                )
            })}
        </>
    )
}
