import React from "react";
import styles from "./Modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modal__content}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modal__content__closebtn} onClick={onClose}>
          <FontAwesomeIcon
            icon={faClose}
            size="1x"
            color="black"
          ></FontAwesomeIcon>
        </button>
        {children}
      </div>
    </div>
  );
}
