import React from 'react';

import { useTranslation } from '../i18n';

const ErrorComponent: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div>
            <h1>{t("somethingWentWrong")}</h1>
            <p>{t("pleaseTryAgainLater")}</p>
        </div>
    );
};

export default ErrorComponent;
