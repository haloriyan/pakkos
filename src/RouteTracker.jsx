import ReactGA from "react-ga";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function withRouter (Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        )
    }

    return ComponentWithRouterProp
}

const RouteTracker = ({history}) => {
    history.listen((location, action) => {
        ReactGA.set({page: location.pathname});
        ReactGA.pageview(location.pathname);
    })

    return <></>
}

export default withRouter(RouteTracker)