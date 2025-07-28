import { Carousel } from "./Components/Carousel"
import { ExploreTopJewelries } from "./Components/ExploreTopJewelries"
import { Heros } from "./Components/Heros"
import { JewelryServices } from "./Components/JewelryServices"

export const HomePage = () => {
    return (
    <>
        <ExploreTopJewelries/>
        <Carousel/>
        <Heros/>
        <JewelryServices/>
        </>
    ); 
}