class AddJewelryRequest {
    name: string;
    brand: string;
    description: string;
    stockQuantity: number;
    category: string;
    price: number;
    img?: string;

    constructor(
        name: string,
        brand: string,
        description: string,
        stockQuantity: number,
        category: string,
        price: number,
        img?: string
    ) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.stockQuantity = stockQuantity;
        this.category = category;
        this.price = price;
        this.img = img;
    }
}

export default AddJewelryRequest;
