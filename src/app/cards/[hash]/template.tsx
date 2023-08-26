import {FC, ReactNode} from "react";
import styles from './template.module.css'

interface CardsTemplateProps {
    children: ReactNode
}

const CardsTemplate: FC<CardsTemplateProps> = ({children}) => (
    <div className={styles['template']}>
        {children}
    </div>
);

export default CardsTemplate;
