// components
import HeartButton from "../HeartButton"
import CloseButton from "../CloseButton"

interface ListingMapMenuProps {
    data: any;
    user: any;
    onClose: () => void;
}

function formatText(label: string, count: number) {
    if (count > 1) {
      return `${count} ${label}s`;
    } else {
      return `${count} ${label}`;
    }
  }


  const ListingMapMenu: React.FC<ListingMapMenuProps> = ({data, user, onClose}) => {
    const room = formatText('room', data?.roomCount);
    const guest = formatText('guest', data?.guestCount);
    const bathroom = formatText('bathroom', data?.bathroomCount)
  return (
<div className="rounded-xl bg-white overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] cursor-pointer ">
    <div className='h-48 xl:h-60 w-full relative overflow-hidden rounded-t-xl'>
    <img alt="Map Listing" src={data.imageSrc} className='object-cover h-full w-full hover:scale-110 transition'/>
    <div className='absolute top-3 right-3 flex flex-row gap-8'>
        <div>
        <HeartButton
                    listingId={data.id}
                    currentUser={user}
                />
        </div>
              <div>
              <CloseButton onClose={onClose}/>
              </div>
            </div>
    </div>
  <div className="px-6 py-4">
    <div className="font-normal text-xl mb-2">{data?.title}</div>
    <p className="text-slate-500 font-light text-base">
      {data.locationValue?.region} {data.locationValue?.label}, {room}, {guest}, and {bathroom}.
    </p>

    <div className='flex flex-row items-center gap-1 mt-2'>
            <div className='text-lg font-normal'>
             $ {data.price}
            </div>
            {!data.reservation && (
                <div className='font-normal text-base'>night</div>
            )}
        </div>
  </div>

</div>
  )
}

export default ListingMapMenu
