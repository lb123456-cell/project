import { useEffect, useState } from "react";
import JewelryModel from "../../../models/JewelryModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfJewelry: React.FC<{ jewelry: JewelryModel, deleteJewelry: any }> = (props) => {

    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchJewelryInState = () => {
            props.jewelry.stockQuantity ? setQuantity(props.jewelry.stockQuantity) : setQuantity(0);
            props.jewelry.stockQuantityAvailable ? setRemaining(props.jewelry.stockQuantityAvailable) : setRemaining(0);
        };
        fetchJewelryInState();
    }, []); 

    async function increaseQuantity() {
        const url = `http://localhost:8080/api/admin/secure/increase/jewelry/quantity/${props.jewelry.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    async function decreaseQuantity () {
        const url = `http://localhost:8080/api/admin/secure/decrease/jewelry/quantity/${props.jewelry.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    async function deleteJewelry() {
        const url = `http://localhost:8080/api/admin/secure/delete/jewelry/?jewelryId=${props.jewelry?.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);
        if (!updateResponse.ok){
            throw new Error('Something went wrong!');
        }
        props.deleteJewelry();
    }
    

    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.jewelry.img ?
                            <img src={props.jewelry.img} width='123' height='196' alt='Jewelry'/>
                            :
                            <img src={require('./../../../Pictures/1.3.webp')}    
                                width='123' height='196' alt='Jewelry' />
                    }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.jewelry.img ?
                            <img src={props.jewelry.img} width='123' height='196' alt='Jewelry' />
                            :
                            <img src={require('./../../../Pictures/1.3.webp')}    
                                width='123' height='196' alt='Jewelry' />
                        }
                    </div>
                </div>
                        <div className='col-md-6'>
                            <div className='card-body'>
                                <h5 className='card-title'>{props.jewelry.brand}</h5>
                                <h4>{props.jewelry.name}</h4> 
                                <p className='card-text'>{props.jewelry.description}</p>
                            </div>
                        </div>
                        <div className='mt-3 col-md-4'>
                            <div className='d-flex justify-content-center align-items-center'>
                                <p>Total Quantity: <b>{quantity}</b></p>
                            </div>
                            <div className='d-flex justify-content-center aligh-items-center'>
                                <p>Jewelries Remaining: <>{remaining}</></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteJewelry}>Delete</button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );
};
