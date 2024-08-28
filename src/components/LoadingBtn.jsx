import "../Css/LoadingBtn.css"
const LoadingBtn = () => {
  return (
    <button
      className="loadingBtn formBtn"
      disabled
    >
        <div className="loader"></div>
    </button>
  );
};

export default LoadingBtn;
