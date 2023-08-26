import {inspect} from "util";
import styles from './card.module.css';
import {FC} from "react";

export interface CardProps {
    text: string
}

export const Card: FC<CardProps> = ({text}) => (
    <div className={styles['card']}>

        <div className={styles['card__front']}>
            <div className={styles['card__inner']}>
                <p>{text}</p>
            </div>
        </div>

        <div className={styles['card__back']}>
            <p>Cards against humanity</p>
        </div>

    </div>
)
