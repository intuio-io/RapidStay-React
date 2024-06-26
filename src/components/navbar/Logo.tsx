import { useNavigate } from "react-router-dom"

const Logo = () => {
    const navigate = useNavigate();
  return (
    <img 
        onClick={() => navigate('/')}
        alt="Logo"
        className="hidden md:block cursor-pointer"
        width="100"
        src="/images/logo.png"
    />
  )
}

export default Logo
