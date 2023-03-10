import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from 'product/types';
import api from 'product/api';
import { convertTypeAcquisitionFromJson } from 'typescript';


interface Props {
  products: Product[];
}

function parseCurrency(value:number):string {
  return value.toLocaleString('es-PE',{
    style: 'currency',
    currency: "PEN",
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {


  const[cart, setCart] = React.useState<Product[]>([]);
  const text = React.useMemo(()=>{
    return cart
    .reduce((message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n `),``,)
    .concat(`\ntotal: ${parseCurrency(cart.reduce((total, product)=> total + product.price,0))}`);
  },[cart]);
  //return <div>{JSON.stringify(products)}</div>;
  return (
    <>
    <div className='container'>
      {products.map((product) => (
        <div className='card' key={product.id}>
          <img className='card-image' src={product.image} alt="" />
          <div className='card-title'>{product.title}</div>
          <div className='card-description'>{product.description}</div>
          <div className='card-price'>{parseCurrency(product.price)}</div>
          <button className='card-button' onClick={()=> setCart ( cart => cart.concat(product) )}>Agregar</button>
        </div>
      ))}
    </div>
    {cart.length &&(
    <a
     className='container-total'
     href={`http://wa.me/51966727663?text=${encodeURIComponent(text)}`}
     target="_blank"
     > Ver carrito({cart.length} productos) 
     </a>) }
    </>
  );
};
//actualiza todo desde el servidor
//export const getServerStaticProsps:
export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();


  return {
    //actualiza la pagina cada 10 segundos
    revalidate: 10,
    props: {
      products,
    },
    
    
  };
};

export default IndexRoute;