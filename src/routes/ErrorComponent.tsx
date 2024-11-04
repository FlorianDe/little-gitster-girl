import React from 'react';

import { useRouteError } from "react-router-dom";
import * as Sentry from "@sentry/react";

import { useTranslation } from '../i18n';

const ErrorComponent: React.FC = () => {
    const error = useRouteError() as Error;

    React.useEffect(() => {
      Sentry.captureException(error);
    }, [error]);
    
    const {t} = useTranslation();
    return (
        <div style={{
            margin: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
        }}  >
            <h1>{t("somethingWentWrong")}</h1>
            <p>{t("pleaseTryAgainLater")}</p>
        </div>
    );
};

export default ErrorComponent;
