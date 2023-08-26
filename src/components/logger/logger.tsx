'use client'

import { FC } from "react";

export interface LoggerProps {
    log:any;
}

export const Logger:FC<LoggerProps> = ({ log}) => {
    console.log(log);
    return null;
}