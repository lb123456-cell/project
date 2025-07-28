class JewelryModel {
    id: number;
    name: string;
    brand: string;
    description?: string;
    stockQuantity?:number;
    price: number;
    category?:string;
    img?: string;
    stockQuantityAvailable: any;

    constructor (id: number, name:string, brand:string,
            description:string, stockQuantity:number, 
            price:number, category:string, img:string){
                this.id = id;
                this.name = name;
                this.brand = brand;
                this.description = description;
                this.stockQuantity = stockQuantity;
                this.price = price; 
                this.category = category;
                this.img = img;
            

            }
}

export default JewelryModel