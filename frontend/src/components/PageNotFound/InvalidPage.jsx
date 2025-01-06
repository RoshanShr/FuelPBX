import { Link } from "react-router-dom";
import "./PageNotFound.css"; // Add a CSS file for styling


const InvalidPage = () => {
  return (
    <div className="invalid-page">
      <div className="content-wrapper">
        <h1>Sorry, this page isn't available.</h1>
        <p>
          The link you followed may be broken, or the page may have been removed.
          <br />
          <Link to="/">Go back to Home Page.</Link>
        </p>
      </div>
    </div>
  );
};
export default InvalidPage;
  