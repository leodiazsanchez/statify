type LoadingProps = {
  spinnerType: "border" | "grow";
};

function Loading({ spinnerType }: LoadingProps) {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className={`spinner-${spinnerType} spinner-color`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
