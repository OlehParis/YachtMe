

function PriceModal ({yachtData}){
   

     return (
        <>
        <div className="price-modal">
        <h1>Charter price</h1>
       <p> Price 4 Hours: ${yachtData.price4}</p>
       <p> Price 6 Hours: ${yachtData.price6}</p>
       <p> Price 8 Hours: ${yachtData.price8}</p>
        </div>
        </>
     )
}


export default PriceModal;
