import { useState } from "react";
import { PostNewMessage } from "./Components/PostNewMessages";
import { Messages } from "./Components/Messages";

export const MessagesPage = () => {
    
    const [messagesClick, setMessagesClick] = useState(false);

    return(
        <div className='container'>
            <div className='mt-3 mb-2'>
                <nav>
                    <div className='nav nav-tab' id='nav-tab' role='tablist'>
                        <button onClick={() => setMessagesClick(false)} className='nav-link active'
                            id='nav-send-message-tab' data-bs-toggle='tab' data-bs-target='#nav-send-message'
                            type='button' role='tab' aria-controls='nav-send-message' aria-selected='true'>
                                Submit Question
                        </button>
                        <button onClick={() => setMessagesClick(true)} className='nav-link'
                            id='nav-message-tab' data-bs-toggle='tab' data-bs-target='#nav-message'
                            type='button' role='tab' aria-controls='nav-message' aria-selected='false'>
                                Q/A Response/Pending
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
  <div className={`tab-pane fade ${!messagesClick ? 'show active' : ''}`} 
       id="nav-send-message" 
       role="tabpanel"
       aria-labelledby="nav-send-message-tab">
    <PostNewMessage/>
  </div>

  <div className={`tab-pane fade ${messagesClick ? 'show active' : ''}`} 
       id="nav-message" 
       role="tabpanel" 
       aria-labelledby="nav-message-tab">
   <Messages/>
  </div>
</div>

            </div>
        </div>
    );
}