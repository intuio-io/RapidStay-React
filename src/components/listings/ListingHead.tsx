// components
import HeartButton from "../HeartButton"
import Heading from "../Heading"

// hooks
import useCountries from "../../hooks/useCountries"

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: any;
}

const ListingHead: React.FC<ListingHeadProps> = ({title, locationValue, imageSrc, id, currentUser}) => {
    const {getByValue} = useCountries();
    const location = getByValue(locationValue);
  return (
    <>
    <Heading 
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
    />
    <div className='w-full h-[60vh] overflow-hidden rounded-xl relative'>
        <img 
            alt="Image"
            src={imageSrc}
            className='object-cover w-full'
        />
        <div className='absolute top-5 right-5'>
            <HeartButton 
                listingId={id}
                currentUser={currentUser}
            />
        </div>
    </div>
    </>
  )
}

export default ListingHead
