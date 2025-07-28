class HistoryModel {
    id: number;
    userEmail: string;
    checkoutDate: string;
    returnDate: string;
    name: string;
    brand: string;
    description: string;
    img: string;

    constructor ( id: number, userEmail: string, checkoutDate: string, returnDate: string,
        name: string, brand: string, description: string, img: string){
            this.id= id;
            this.userEmail= userEmail;
            this.checkoutDate= checkoutDate;
            this.returnDate= returnDate;
            this.name= name;
            this.brand= brand;
            this.description= description;
            this.img= img;
        }
}

export default HistoryModel;