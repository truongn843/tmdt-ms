import LoginView from "./views/LoginPage/Login";
import SignupView from "./views/SignupPage/Signup";
import HomePageGuestView from "./views/HomePage/HomePageGuest";
import HomePageUserView from "./views/HomePage/HomePageUser";
import HomePageAdminView from "./views/HomePage/HomePageAdmin";
import PaymentPageView from "./views/PaymentPage/PaymentPage";
import CartPageView from "./views/CartPage/CartPage";
import AddProductPageView from "./views/AddProductPage/AddProductPage";
import UserProfilePageView from "./views/UserProfilePage/UserProfilePage";
import AdminProfilePageView from "./views/UserProfilePage/AdminProfilePage";
import ProductPageView from "./views/ProductPage/ProductPage";
import AdminManagePageView from "./views/AdminManagePage/AdminManagePage";
import Error from "./components/Error/Error";
import OrderPageView from "./views/OrderPage/OrderPage";

const routes = [
  {
    path: "/",
    exact: true,
    component: HomePageGuestView,
  },
  {
    path: "/order-status",
    exact: true,
    component: OrderPageView,
  },
  {
    path: "/user",
    exact: true,
    component: HomePageUserView,
  },
  {
    path: "/admin",
    exact: true,
    component: HomePageAdminView,
  },
  {
    path: "/login",
    exact: true,
    component: LoginView,
  },
  {
    path: "/signup",
    exact: true,
    component: SignupView,
  },
  {
    path: "/payment",
    exact: true,
    component: PaymentPageView,
  },
  {
    path: "/add-product",
    exact: true,
    component: AddProductPageView,
  },
  {
    path: "/cart",
    exact: true,
    component: CartPageView,
  },
  {
    path: "/user-profile",
    exact: true,
    component: UserProfilePageView,
  },
  {
    path: "/admin-profile",
    exact: true,
    component: AdminProfilePageView,
  },
  {
    path: "/admin-manage",
    exact: true,
    component: AdminManagePageView,
  },
  {
    path: "/product-detail",
    exact: true,
    component: ProductPageView,
  },
  { path: "/error", exact: true, component: Error },
];
export default routes;
