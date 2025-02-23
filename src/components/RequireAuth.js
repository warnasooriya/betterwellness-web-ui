
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const role = useSelector((state) => state.userReducer.role)
    console.log('roles', role)
    return (
        // eslint-disable-next-line react/prop-types
        role?.includes(allowedRoles)
            // eslint-disable-next-line react/react-in-jsx-scope
            ? <Outlet />
            : 
                // eslint-disable-next-line react/react-in-jsx-scope
                <Navigate to="/unauthorized" state={{ from: location }} replace />

    );
}
export default RequireAuth