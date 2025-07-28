import React from 'react';
import JewelryModel from '../../../models/JewelryModel';
import fallbackImg from '../../../Pictures/1.2.jpg'; 
import { Link } from 'react-router-dom';

export const ReturnJewelry: React.FC<{ jewelry: JewelryModel }> = ({ jewelry }) => {
    if (!jewelry || !jewelry.id) {
        return null;
    }

    const imageUrl = jewelry.img ? jewelry.img : fallbackImg;

    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                <img
                    src={imageUrl}
                    width="151"
                    height="233"
                    alt="Jewelry"
                />
                <h6 className='mt-2'>{jewelry.name}</h6>
                <p>{jewelry.brand}</p>

                <Link
                    className='btn main-color text-white'
                    to={`/checkout/${jewelry.id}`}  
                >
                    Reserve
                </Link>
            </div>
        </div>
    );
};

