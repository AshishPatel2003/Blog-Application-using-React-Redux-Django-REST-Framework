import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function OnlyAdminPrivateRoute() {
    const { currentUser} = useSelector(state => state.user)
  return currentUser.is_admin ? <Outlet /> : <Navigate to={"/sign-in"} />
}

export default OnlyAdminPrivateRoute