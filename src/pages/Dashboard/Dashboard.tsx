import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import AuthService from "../../services/AuthService/Auth.service.ts";
import {Path} from "../../main.tsx";
import {useMutation} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "@selectors/user.selector.ts";
import {setUser, User} from "../../reducer/user.reducer.ts";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: AuthService().status,
    onError: (error) => {
      console.log('nope');
      console.log(error);
      navigate(Path.SIGNIN);
    },
    onSuccess: () => {
      navigate(Path.HOME);
    }
  });


  useEffect(() => {
    mutation.mutate();
    if (!user.id) {
      navigate(Path.SIGNIN);
    }
  }, []);

  const handleLogout = () => {

    AuthService().logout().then(
      () => {
        dispatch(setUser({} as User));
        navigate(Path.SIGNIN);
      }
    );
  }

  return (
    <div>
      Dashboard
      {/*TopBar
        <>
          Notifications
        </>
         empty || important Updates
        <>
          Profile image, dropdown with  settings, logout
        </>
      */}
      {/*
        <p>My net worth<p>
        <NetWorthBalance>
      */}
      {/*
        <p>Checking Account/Accounts<p/>
        // last statistics form one acc our carosel of statistics

        <>
          Name
          Number
        </>
      */}



      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Outlet/>
    </div>
  );
};

export default Dashboard;
