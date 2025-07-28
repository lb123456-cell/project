import vid from '../../../Pictures/vid.mp4';
import { Link } from "react-router-dom";


export const ExploreTopJewelries = () => {
  return (
    <div className="video-header">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="background-video"
    >
      <source src={vid} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  
    <div className="container text-white d-flex justify-content-center align-items-center header-content">
      <div className="text-center ">
        <h1 className="fw-bold">Sparkle Starts Here</h1>
        <p className="fs-4">Discover timeless elegance and modern brilliance in every piece.</p>
        <Link
          type="button"
          className="btn main-color btn-lg text-white"
          to="/search"
        >
          Shop our top collections
        </Link>
      </div>
    </div>
  </div>  
  );
}