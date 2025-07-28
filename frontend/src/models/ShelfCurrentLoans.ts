import JewelryModel from "./JewelryModel";

class ShelfCurrentLoans {
    jewelry: JewelryModel;
    daysLeft: number;

    constructor(jewelry: JewelryModel, daysLeft: number) {
        this.jewelry = jewelry;
        this.daysLeft = daysLeft;
    }
}

export default ShelfCurrentLoans;