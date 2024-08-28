import "../Css/Input.css";

const Input = ({label, required=true, type="text", value, ...prop}) => {
  return (
    <div className="form__group field">
      <input type={type} className="form__field" placeholder="Name"  value={value} {...prop}/>
      <label htmlFor="name" className="form__label">
        {label}
      </label>
    </div>
  );
};

export default Input;
