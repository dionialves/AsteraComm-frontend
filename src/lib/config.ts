const getApiUrl = () => {
    if (typeof window === 'undefined') {
        return import.meta.env.API_URL_SERVER;
    }
    return import.meta.env.PUBLIC_API_URL_CLIENT;
};

const config = {
    api: {
        baseUrl: getApiUrl()
    }
};

export default config;