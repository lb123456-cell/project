import { Link } from "react-router-dom";
import JewelryModel from "../../../models/JewelryModel";
import fallbackImg from '../../../Pictures/1.1.jpg'; 

export const SearchJewelry: React.FC<{ jewelry: JewelryModel }> = (props) => {
    console.log("Jewelry in SearchJewelry:", props.jewelry); // Debugging

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                    <img
                        src={props.jewelry.img ? props.jewelry.img : fallbackImg}
                        alt="Jewelry"
                        className="img-fluid rounded"
                        style={{ maxWidth: "123px", height: "196px", objectFit: "cover" }}
                    />
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.jewelry.name}</h5>
                        <h6>{props.jewelry.brand}</h6>
                        <p className="card-text">{props.jewelry.description}</p>
                    </div>
                </div>

                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/checkout/${props.jewelry.id}`}>
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
};
