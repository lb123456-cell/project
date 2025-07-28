import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom'; // ✅ updated import

import { AddNewJewelry } from './Components/AddNewJewelry';
import { AdminMessages } from './Components/AdminMessages';
import { ChangeQuantityOfJewelries } from './Components/ChangeQuantityOfJewelries';

export const ManageJewelryPage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfJewelriesClick, setChangeQuantityOfJewelriesClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addJewelryClickFunction() {
        setChangeQuantityOfJewelriesClick(false); // ✅ fixed typo
        setMessagesClick(false);
    }

    function changeQuantityOfJewelriesClickFunction() {
        setChangeQuantityOfJewelriesClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction() {
        setChangeQuantityOfJewelriesClick(false);
        setMessagesClick(true);
    }

    if (authState?.accessToken?.claims.userType === undefined) {
        return <Navigate to='/home' />; // ✅ updated Redirect
    }

    return (
        <div className='container'>
            <div className='mt-5'>
                <h3>Manage Jewelry Store</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={addJewelryClickFunction} className='nav-link active' id='nav-add-jewelry-tab'
                            data-bs-toggle='tab' data-bs-target='#nav-add-jewelry' type='button' role='tab'
                            aria-controls='nav-add-jewelry' aria-selected='false'>
                            Add Jewelry
                        </button>
                        <button onClick={changeQuantityOfJewelriesClickFunction} className='nav-link' id='nav-quantity-tab'
                            data-bs-toggle='tab' data-bs-target='#nav-quantity' type='button' role='tab'
                            aria-controls='nav-quantity' aria-selected='true'>
                            Change Quantity
                        </button>
                        <button onClick={messagesClickFunction} className='nav-link' id='nav-messages-tab'
                            data-bs-toggle='tab' data-bs-target='#nav-messages' type='button' role='tab'
                            aria-controls='nav-messages' aria-selected='false'>
                            Messages
                        </button>
                    </div>
                </nav>

                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-add-jewelry' role='tabpanel'
                        aria-labelledby='nav-add-jewelry-tab'>
                        <AddNewJewelry />
                    </div>
                    <div className='tab-pane fade' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
                        {changeQuantityOfJewelriesClick ? <ChangeQuantityOfJewelries /> : <></>}
                    </div>
                    <div className='tab-pane fade' id='nav-messages' role='tabpanel' aria-labelledby='nav-messages-tab'>
                        {messagesClick ? <AdminMessages /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
};
