import React from "react";
import Button from "./Button/Button";
import Card from "./Card";
import styles from "./ErrorModal.module.css"
const ErrorModal=(probs)=>{
    return(
        <div>
            <div className={styles.backdrop} onClick={probs.onClick}/>
        <Card className={styles.modal}>
        <header className={styles.header}>
            <h2>{probs.title}</h2>
        </header>
        <div className={styles.content}>
            <p>{probs.message}</p>
        </div>
        <footer className={styles.actions}>
<Button onClick={probs.onClick} className={styles.button}>{probs.solution}</Button>
        </footer>
</Card>
</div>
    )
}
export default ErrorModal;