export type Category = {
    _id: string;
    name: string;
    slug: string;
    image:string;
    sortOrder:number;
    description:string;
    status?: 'ACTIVE' | 'INACTIVE';
};