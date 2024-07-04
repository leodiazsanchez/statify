function Footer() {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top text-light mx-5 px-5">
        <div className="col-md-4 d-flex align-items-center">
          <a href="/" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1">
            <span className="text-light">Spotify Analytics <i className="bi bi-bar-chart accent"></i></span> 
          </a>
         
        </div>
    
        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3"><a href="#"><i className="bi bi-instagram text-light"></i></a></li>
          <li className="ms-3"><a href="#"><i className="bi bi-facebook text-light"></i></a></li>
          <li className="ms-3"><a href="#"><i className="bi bi-twitter-x text-light"></i></a></li>
        </ul>
      </footer>
    )
}

export default Footer;

