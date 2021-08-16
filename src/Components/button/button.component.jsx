import "./button.styles.scss";

const Button = ({ children, isGoogleSignin, inverted, ...other }) => (
  <button
    className={`${inverted ? "inverted" : ""}${
      isGoogleSignin ? "google-sign-in" : ""
    } custom-button`}
    {...other}
  >
    {children}
  </button>
);

export default Button;
