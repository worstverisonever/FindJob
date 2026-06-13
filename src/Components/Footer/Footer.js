import React from "react";
import styles from "./Footer.module.css";
import twitter from "../../images/twitterw.png"
import facebook from "../../images/facebook-w.png"
import Instagram from "../../images/instagramw.png"

const Footer=(probs)=>{

    return(
        <div className={`${styles.main} ${probs.className}`}>
        <footer>
        <div className={styles.footerContent}>
            <h3>FindJob.com</h3>
            <p>Find your perfect job with us!</p>
            <ul className={styles.socials}>
                <li><a href="#"><img src={facebook}></img></a></li>
                <li><a href="#"><img src={Instagram}></img></a></li>
                <li><a href="#"><img src={twitter}></img></a></li>
            </ul>
        </div>
        <div className={styles.footerBottom}>
            <p>copyright &copy; <a href="#">FindJob.com</a>  </p>
                    <div className={styles.footerMenu}>
                      <ul>
                        <li><a href="">Search Jobs</a></li>
                      </ul>
                    </div>
        </div>

    </footer></div>
    )
}
export default Footer;