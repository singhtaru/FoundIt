function FileUpload() {
  return (
    <label className="upload-area">
      <input type="file" hidden />
      <div className="upload-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M8 17L12 13M12 13L16 17M12 13V22M20.39 18.39C21.3653 17.8572 22.1359 17.0157 22.58 16C23.0205 14.9797 23.1281 13.8471 22.8875 12.7603C22.6468 11.6734 22.0709 10.6897 21.2393 9.94726C20.4076 9.20482 19.3657 8.73792 18.2559 8.61136C17.7239 6.54889 16.5018 4.73021 14.7835 3.46134C13.0652 2.19246 10.9556 1.55343 8.8223 1.65277C6.68902 1.75211 4.6487 2.58352 3.05555 4.00608C1.4624 5.42864 0.41136 7.36412 0.0799589 9.47408C-0.251442 11.584 0.156072 13.7422 1.2334 15.5856C2.31072 17.4291 3.99137 18.8447 5.99 19.59"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <strong>Drag &amp; drop or click to upload an image</strong>
      <span>JPG, PNG, JPEG, GIF up to 10MB</span>
    </label>
  );
}

export default FileUpload;
