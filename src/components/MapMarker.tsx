interface MapMarkerProps {
    listing: any;
    onClick : () => void;
    isActive: boolean;
}


const MapMarker: React.FC<MapMarkerProps> = ({ isActive, listing, onClick}) => {
  return (
    <div onClick={onClick} className={`transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]  border  px-3 flex flex-row items-center justify-center rounded-full cursor-pointer
        ${isActive ? 'bg-black' : 'bg-white shadow-md border-gray-400'}`}>
            <p className={`text-lg font-semibold ${isActive ? 'text-white': 'text-black'}`}>
            $ {listing.price}
            </p>
        </div>   
  )
}

export default MapMarker
