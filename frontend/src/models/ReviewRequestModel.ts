class ReviewRequestModel{
    rating:number;
    jewelryId: number;
    reviewDescription?: string;

    constructor(rating: number, jewelryId: number, reviewDescription: string){
        this.rating = rating;
        this.jewelryId= jewelryId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;