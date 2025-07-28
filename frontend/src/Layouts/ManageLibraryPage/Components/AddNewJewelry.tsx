import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddJewelryRequest from "../../../models/AddJewelryRequest";


export const AddNewJewelry = () => {
    const { authState } = useOktaAuth();

    // New Jewelry
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [stockQuantity, setStockQuantity] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [price, setPrice] = useState('');

    // Display
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryFiels(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            getBase64(file);
        }
    }

    function getBase64(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (typeof reader.result === "string") {
                setSelectedImage(reader.result);
            }
        };
        reader.onerror = function (error) {
            console.log('Error:', error);
        };
    }

    async function submitNewJewelry() {
        const url = `http://localhost:8080/api/admin/secure/add/jewelry`;

        if (
            authState?.isAuthenticated &&
            name !== '' &&
            brand !== '' &&
            category !== 'Category' &&
            description !== '' &&
            stockQuantity >= 0 &&
            price !== ''
        ) {
            const jewelry: AddJewelryRequest = new AddJewelryRequest(
                name,
                brand,
                description,
                stockQuantity,
                category,
                parseFloat(price)
            );
            jewelry.img = selectedImage ?? undefined;


            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jewelry)
            };

            const submitNewJewelryResponse = await fetch(url, requestOptions);
            if (!submitNewJewelryResponse.ok) {
                throw new Error('Something went wrong!');
            }

    
            setName('');
            setBrand('');
            setDescription('');
            setStockQuantity(0);
            setCategory('Category');
            setPrice('');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false); 
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Jewelry added successfully
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new Jewelry
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Name</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='name'
                                    required
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Brand</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name='brand'
                                    required
                                    onChange={e => setBrand(e.target.value)}
                                    value={brand}
                                />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {category}
                                </button>
                                <ul id='addNewJewelryId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryFiels('Set')} className='dropdown-item'>Set</a></li>
                                    <li><a onClick={() => categoryFiels('Necklace')} className='dropdown-item'>Necklace</a></li>
                                    <li><a onClick={() => categoryFiels('Earring')} className='dropdown-item'>Earring</a></li>
                                    <li><a onClick={() => categoryFiels('Bracelet')} className='dropdown-item'>Bracelet</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea
                                className='form-control'
                                rows={3}
                                onChange={e => setDescription(e.target.value)}
                                value={description}
                            ></textarea>
                        </div>

                        <div className='col-md-3 mb-3'>
                    <label className='form-label'>Stock Quantity</label>
                            <input
                            type='text'
                            pattern='[0-9]*'
                            inputMode='numeric'
                            className='form-control'
                            name='StockQuantity'
                            required
                            onChange={e => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                            setStockQuantity(Number(value));
            }
        }}
        value={stockQuantity === 0 ? '' : stockQuantity}
    />
</div>

                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Price</label>
                            <input
                                type='number'
                                className='form-control'
                                name='price'
                                required
                                onChange={e => setPrice(e.target.value)}
                                value={price}
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Image Upload</label>
                            <input
                                type='file'
                                className='form-control'
                                onChange={base64ConversionForImages}
                            />
                        </div>

                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewJewelry}>
                                Add Jewelry
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
