import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const Heros =() => {

const {authState } = useOktaAuth(); 
    return (
<div> 
    <div className='d-none d-lg-block'>
        <div className='row g-0 mt-5'>
        <div className='col-sm-6 col-md-6'>
            <div className='col-image-left'> </div>
        </div>
        
        <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
            <div className='ml-2'>
                <h1>What piece defines your style?</h1>
                <p className='lead'>
                Whether you love timeless elegance or bold modern designs, 
                we help you find the jewelry that speaks to you. 
                Sign up and get access to exclusive collections and offers!
                </p>
                {authState?.isAuthenticated ?
                <Link type='button' className='btn main-color btn-lg text-white'
                to='/search'> Explore top Jewelries</Link> 
                :
                <Link className='btn main-color btn-lg text-white' to='/login'>Sign Up</Link>
            }           
            </div>
        </div>
    </div>
    <div className='row g-0'>
        <div className='col-4 col-md-4 container d-flex 
        justify-content-cnter align-items-center'>
            <div className='ml-2'>
                <h1>Our collection sparkles with change!</h1>
                <p className='lead'>
                New arrivals drop regularly — from elegant classics to trendsetting designs. 
                We work tirelessly to bring you the finest, most dazzling jewelry pieces. 
                Check back often to discover what's new and let your next favorite shine!
                </p>
            </div>
        </div>
        <div className='col-sm-6 col-md-6'>
            <div className='col-image-right'></div>
                </div>
            </div>
        </div>

        {/*Mobile Heros */}
        <div className='d-lg-none'>
            <div className='container'>
                <div className='m-2'>
                    <div className='col-image-left'></div>
                <div className='mt-2'>
                <h1>What piece defines your style?</h1>
                <p className='lead'>
                Whether you love timeless elegance or bold modern designs, 
                we help you find the jewelry that speaks to you. 
                Sign up and get access to exclusive collections and offers!
                </p>
                {authState?.isAuthenticated ?
                <Link type='button' className='btn main-color btn-lg texht-white'
                to='search'>Explore top jewelries</Link>  
                :
                <Link className='btn main-color btn-large text-white' to='/login'>Sign Up</Link>
            }
            </div>
            </div>
            <div className='m-2'>
                <div className='col-image-right'></div>
                <div className='mt-2'>
                <h1>Our collection sparkles with change!</h1>
                <p className='lead'>
                New arrivals drop regularly — from elegant classics to trendsetting designs. 
                We work tirelessly to bring you the finest, most dazzling jewelry pieces. 
                Check back often to discover what's new and let your next favorite shine!
                </p>
                </div>
            </div>
            </div>
        </div>
    </div>
    );
}