import React, { useState, memo } from "react";
import styles from "./Pagination.module.css";
import next from "../../images/next.png";
import previous from "../../images/previous.png";
import { Link, useLocation } from "react-router-dom";
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  const [currentPageNumber, setCurrentPageNumber] = useState(
    pageNumbers.slice(0, 3)
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page")) || 1
  );
  const clickHandler = (number) => {
    if (number > pageNumbers.length || number <= 0) {
      return;
    }
    setCurrentPage(number);
    paginate(number);
    if (number > 2 && number != pageNumbers.length) {
      setCurrentPageNumber(pageNumbers.slice(number - 3, number + 3));
    } else if (number == 1) {
      setCurrentPageNumber(pageNumbers.slice(number - 1, number + 2));
    } else if (number == 2) {
      setCurrentPageNumber(pageNumbers.slice(number - 2, number + 2));
    } else if (number === pageNumbers.length) {
      setCurrentPageNumber(pageNumbers.slice(number - 3, number));
    }
  };

  return (
    <nav>
      <ul className={styles.pagination}>
        <li className={styles.pageLink}>
          <button
            className={styles.icon}
            onClick={() => clickHandler(currentPage - 1)}
          >
            {" "}
            <img
              src={previous}
              alt="next arrow icon"
              className={styles.icon}
            ></img>{" "}
          </button>
        </li>
        {+currentPage >= 4 && (
          <li
            key={1}
            className={`${1 === currentPage ? styles.activelink : ""}  ${
              styles.pageLink
            }`}
          >
            <Link
              onClick={() => clickHandler(1)}
              className={` `}
              to={`?page=${1}`}
            >
              {1}
            </Link>
          </li>
        )}
        {+currentPage > 5 && (
          <li className={styles.pageLink}>
            <button>...</button>
          </li>
        )}

        {currentPageNumber.map((number) => {
          if (number <= Math.ceil(totalPosts / postsPerPage)) {
            return (
              <li
                key={number}
                className={`${
                  number === currentPage ? styles.activelink : ""
                }  ${styles.pageLink}`}
              >
                <Link
                  onClick={() => clickHandler(number)}
                  className={` `}
                  to={`?page=${number}`}
                  id={number}
                >
                  {number}
                </Link>
              </li>
            );
          }
        })}
        {currentPage + 4 < +pageNumbers.length && (
          <li className={styles.pageLink}>
            <button>...</button>
          </li>
        )}
        {currentPage + 3 <= pageNumbers.length && (
          <li
            key={pageNumbers.length}
            className={`${
              pageNumbers.length === currentPage ? styles.activelink : ""
            }  ${styles.pageLink}`}
          >
            <Link
              onClick={() => clickHandler(pageNumbers.length)}
              className={` `}
              to={`?page=${pageNumbers.length}`}
            >
              {pageNumbers.length}
            </Link>
          </li>
        )}
        <li className={styles.pageLink}>
          <button onClick={() => clickHandler(currentPage + 1)}>
            {" "}
            <img
              src={next}
              alt="next arrow icon"
              className={styles.icon}
            ></img>{" "}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default memo(Pagination);
