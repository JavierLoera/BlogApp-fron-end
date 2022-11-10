import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Categories from "./components/Admin/Categories";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Authors from "./components/Authors/Authors";
import HomePage from "./components/Home/HomePage";
import NavbarApp from "./components/Navigation/Navbar";
import Page404 from "./components/Page404";
import PostDetails from "./components/Posts/PostDetails";
import PostForm from "./components/Posts/PostForm";
import Posts from "./components/Posts/Posts";
import UpdatePost from "./components/Posts/UpdatePost";
import ChangePassword from "./components/users/Login/ChangePassword";
import Login from "./components/users/Login/Login";
import ResetPassword from "./components/users/Login/ResetPassword";
import Perfil from "./components/users/Perfil/Perfil";
import Token from "./components/users/Perfil/Token";
import Register from "./components/users/Register/Register";
import UpdateUser from "./components/users/UpdateUser.js/UpdateUser";
import { userAuthData } from "./redux/slices/users/userSlices";

function App() {
  const user = localStorage.getItem('userInfo')
  const dispatch = useDispatch();
  const { userAuth } = useSelector(state => state?.users);

  useEffect(() => {
    dispatch(userAuthData)
  }, [dispatch])

  return (
    <BrowserRouter>
      <NavbarApp />
      <Routes>
        {/*rutas publicas*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Perfil />} />
        <Route path='/posts' element={<Posts />} />
        <Route path='/post/details/:id' element={<PostDetails />} />
        <Route path="/forget-password/" element={<ChangePassword />} />

        <Route path="/verify-account/:token" element={<Token />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/*rutas privadas */}
        <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route path="/update/user/:id" element={<UpdateUser />} />
          <Route path="/change-password/:id" element={<ResetPassword />} />
          <Route path="/newpost" element={<PostForm />} />
          <Route path='/update/post/:id' element={<UpdatePost />} />
        </Route>
        <Route path="/authors" element={
          <ProtectedRoute isAllowed={!!user && userAuth?.isAdmin} redirectTo='/posts'>
            <Authors />
          </ProtectedRoute>
        }>
        </Route>
        <Route path='/categories' element={
          <ProtectedRoute isAllowed={!!user && userAuth?.isAdmin} redirectTo='/posts'>
            <Categories />
          </ProtectedRoute>
        }>
        </Route>
        <Route path='*' element={<Page404 />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;