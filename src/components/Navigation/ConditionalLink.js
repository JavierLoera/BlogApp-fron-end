import { Link } from "react-router-dom";

const ConditionalLink = ({ to, user, children }) => {
    if (!user) {
        return <Link to={'/'}>{children}</Link>
    }
    return <Link to={to}>{children}</Link>
}

export default ConditionalLink