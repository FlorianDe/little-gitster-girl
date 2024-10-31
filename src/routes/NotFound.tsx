import { Link } from 'react-router-dom';

import { useTranslation } from '../i18n';

const NotFound = () => {
    const {t} = useTranslation();
    
    return (
        <div>
            <h1>{t("notFound404")}</h1>
            <p>{t("pageNotFoundMessage")}</p>
            <Link to="/">{t("goBackToHome")}</Link>
        </div>
    );
};

export default NotFound;
