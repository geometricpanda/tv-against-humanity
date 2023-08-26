import {inspect} from "util";
import styles from './card.module.css';
import {FC} from "react";
import clsx from "clsx";

export interface CardProps {
    text: string,
    flipped?: boolean,
    white?:boolean
}

export const Card: FC<CardProps> = ({text, flipped, white}) => (
    <div className={clsx({
        [styles['card']]: true,
        [styles['card--flipped']]: flipped,
        [styles['card--white']]: white,
    })}>

        <div className={styles['card__inner']}>

            <div className={styles['card__front']}>
                <p className={styles["card__text"]}>
                    {text}
                </p>
                <div className={styles['card__footer']}>
                    <div className={styles['card__logo']}/>
                    <span className={styles['card__logo-text']}>
                    Cards Against Humanity
                </span>
                </div>

            </div>

            <div className={styles['card__back']}>
                <p className={styles['card__back-text']}>
                    Cards Against Humanity
                </p>
            </div>

        </div>

    </div>
)
