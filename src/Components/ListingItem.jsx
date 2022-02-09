import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

const ListingItem = ({ listing, id, onDelete, onEdit }) => 
{
    return (
      <li className="flex flex-col justify-between items-start sm:items-center sm:flex-row mb-4 relative">
        <Link
          to={`/category/${listing.type}/${id}`}
          className="contents"
        >
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-full sm:w-1/3 h-28 rounded-3xl object-cover lg:h-52"
          />
          <div className="w-full sm:w-2/3 pl-3 mt-4 sm:mt-0 items-center">
            <p className="font-semibold text-xs opacity-80 mb-0">{listing.address}</p>
            <p className="font-semibold text-xl m-0">{listing.name}</p>
            <p className="font-semibold text-lg text-green-500 my-2 flex items-center">
              ${listing.offer 
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                {listing.type === 'rent' && ' / Month'}
            </p>
            <div className="flex justify-between max-w-xs">
                <img src={bedIcon} alt="bed" />
                <p className="font-medium text-sm">
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                </p>
                <img src={bathtubIcon} alt="bath" />
                <p className="font-medium text-sm">
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                </p>
            </div>
          </div>
        </Link>

        <div className="flex flex-row sm:flex-col justify-center w-full sm:w-auto mt-4 sm:mt-0">
          {onDelete && (
              <DeleteIcon 
                  className='cursor-pointer' 
                  fill='rgb(231, 76, 60)' 
                  onClick={() => onDelete(listing, id)} 
              />
          )}
          {onEdit && (
            <EditIcon className='cursor-pointer' onClick={() => onEdit(id)} />
          )}
        </div>
      </li>
    )
}
 
export default ListingItem