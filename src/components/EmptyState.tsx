import { useNavigate } from "react-router-dom"

// components
import Heading from "./Heading"
import Button from "./Button"

interface EmptyState {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}


const EmptyState: React.FC<EmptyState> = (props) => {
    const {
        title = "No exact matches",
        subtitle = "Try changing or removing some of your filters",
        showReset
    } = props;
    const navigate = useNavigate();
  return (
 <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
      <Heading  center title={title} subtitle={subtitle}/>
      <div className='w-48 mt-4'>
        {showReset && (
            <Button 
                outline
                label="Remove all filters"
                onClick={() => navigate('/')}
            />
        )}
      </div>
    </div>
  )
}

export default EmptyState
