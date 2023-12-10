import ScrollableFeed from 'react-scrollable-feed'
import { useSelector } from 'react-redux';
import { isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const ScrollableChat = ({ messages }) => {
    const { userInfo } = useSelector((state) => state.userAuth);

  return (
    <ScrollableFeed>
        {messages &&
              messages.map((m, i) => (
                <div style={{display: "flex"}} key={m._id}>
                    <span
                        style={{
                            backgroundColor: `${
                                m.sender._id === userInfo.id ? "#B9F5D0" : "#BEE3F8"
                            }`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, userInfo.id),
                            marginTop: isSameUser(messages, m, i) ? 3 : 10
                        }}
                    >
                          {m.content}
                          <br />
              <small style={{ color: "gray" }}>
                {format(new Date(m.createdAt), "h:mm a")}
              </small>
                    </span>
                </div>
              ))
        }
    </ScrollableFeed>
  )
}

export default ScrollableChat