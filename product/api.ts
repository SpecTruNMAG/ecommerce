import axios from 'axios'
import { Product } from "./types";
import Papa from 'papaparse';

export default{
    list:async():Promise<Product[]>=>{
        return axios
        .get(
            `https://docs.google.com/spreadsheets/d/e/2PACX-1vTu47ojbsG8iJ4rOoR2G4nftE3mTLStBHpz9FhHhkEkxKwnns66-3Im_YkfAv7M1ACQbvE5coiiLdWB/pub?output=csv`
            ,{
            responseType:'blob',
            }
        )
        .then((response)=> {
            return new Promise<Product[]>((resolve,reject)=>{
                Papa.parse(response.data,{
                    header:true,
                    complete: (results) =>{
                        const products =results.data as Product[]
                        return resolve(products.map(product =>({
                            ...product,
                            price:Number(product.price),
                        })))

                    } ,
                    error:(error)=> reject(error.message),
                });
            })
        });
        
    },
};