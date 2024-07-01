import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

// components
import Container from '../Container';

interface ListingLoaderProps {
    showButton?: boolean;
    count?: number;
}


const ListingLoader: React.FC<ListingLoaderProps> = ({showButton, count = 1}) => {
  return (
    <Container>
    {showButton &&  <div className='w-full flex flex-col gap-2'>
             <Skeleton width="20%" height="30px" />
             <Skeleton width="10%" />
         </div>}
           <div className={`${showButton ? 'pt-10': 'pt-24'} grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8`}>
                 {Array.from({ length: count }).map((_, index) => (
             <div key={index} className='col-span-1 cursor-pointer group'>
             <div className='flex flex-col gap-2 w-full'>
                 <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                 <Skeleton height="100%" />
                 </div>
                 <Skeleton width="60%" />
                 <Skeleton width="40%" />
                 <Skeleton width="80%" />
                 {showButton && 
                 <>
                 <Skeleton width="20%" />
                 <Skeleton height="30px" width="100%" />
                 </>}
             </div>
             </div>
         ))}
         </div>
     </Container>
  )
}

export default ListingLoader
