import Message from './Message'

const UserMessage = ({ message }) => {
  return (
    <Message message={message}>
      <div className="user-message-content">
        <div className="message-bubble user-bubble">
          <span className="message-text">{message.content}</span>
        </div>
      </div>
    </Message>
  )
}

export default UserMessage