import { useState } from 'react';
import { StarsReview } from './StarsReview';

export const LeaveAReview: React.FC<{ submitReview: any}> = (props) => {

    const [starInput, setStarInput] = useState(0);
    const [displayInput, setDisplayInput] = useState(false);
    const [reviewDescription, setReviewDescription] = useState('');

    function starValue(value: number){
        setStarInput(value);
        setDisplayInput(true);
    }

    return(
        <div className='dropdown' style={{ cursor: 'pointer' }}>
            <h5 className='dropdown-toggle' id='dropdownMenuButton1' data-bs-toggle='dropdown'>
                Leave a review?
            </h5>
            <ul id='submitReviewRating' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                <li><button onClick={() => starValue(0)} className='dropdown-item'>0 star</button></li>
                <li><button onClick={() => starValue(.5)} className='dropdown-item'>.5 star</button></li>
                <li><button onClick={() => starValue(1)} className='dropdown-item'>1 star</button></li>
                <li><button onClick={() => starValue(1.5)} className='dropdown-item'>1.5 star</button></li>
                <li><button onClick={() => starValue(2)} className='dropdown-item'>2 star</button></li>
                <li><button onClick={() => starValue(2.5)} className='dropdown-item'>2.5 star</button></li>
                <li><button onClick={() => starValue(3)} className='dropdown-item'>3 star</button></li>
                <li><button onClick={() => starValue(3.5)} className='dropdown-item'>3.5 star</button></li>
                <li><button onClick={() => starValue(4)} className='dropdown-item'>4 star</button></li>
                <li><button onClick={() => starValue(4.5)} className='dropdown-item'>4.5 star</button></li>
                <li><button onClick={() => starValue(5)} className='dropdown-item'>5 star</button></li>
            </ul>
            <StarsReview rating={starInput} size={32}/>

            {displayInput &&
                <form method='POST' action='#'>
                    <hr/>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Description
                        </label>
                        <textarea className='form-control' id='submitReviewDescription' placeholder='Optional'
                            rows={3} onChange={e => setReviewDescription(e.target.value)}>
                        </textarea>
                    </div>

                    <div>
                        <button type='button' onClick={() => props.submitReview(starInput, reviewDescription)} className='btn btn-primary mt-3'>Submit Review</button>
                    </div>
                </form>
            }
        </div>
    );
}